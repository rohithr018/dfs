import os
import io
import json
import grpc
import random
from flask import Flask, request, jsonify, send_file
from protos.dfs_pb2_grpc import ChunkServiceStub
from protos.dfs_pb2 import StoreChunkRequest, RetrieveChunkRequest
from src.shared.config import Config
from src.shared.utils import setup_logger, generate_file_id
from datetime import datetime



class MainServer:
    def __init__(self):
        self.app = Flask(__name__)
        self.logger = setup_logger("MainServer")
        self.metadata_file = f"{Config.BASE_DIR}/main_server/metadata.json"
        os.makedirs(os.path.dirname(self.metadata_file), exist_ok=True)
        self.file_metadata = self.load_metadata()
        self.setup_routes()

    def load_metadata(self):
        try:
            if os.path.exists(self.metadata_file):
                with open(self.metadata_file, 'r') as f:
                    return json.load(f)
        except Exception as e:
            self.logger.error(f"Error loading metadata: {str(e)}")
        return {}

    def save_metadata(self):
        try:
            with open(self.metadata_file, 'w') as f:
                json.dump(self.file_metadata, f, indent=2)
        except Exception as e:
            self.logger.error(f"Error saving metadata: {str(e)}")

    def get_node_client(self, grpc_port):
        channel = grpc.insecure_channel(f'localhost:{grpc_port}')
        return ChunkServiceStub(channel)

    def setup_routes(self):
        @self.app.route('/upload', methods=['POST'])
        def upload():
            file = request.files.get("file")
            if not file:
                return jsonify({"error": "No file provided"}), 400

            filename = file.filename
            content = file.read()
            chunk_size = Config.CHUNK_SIZE
            chunk_count = (len(content) + chunk_size - 1) // chunk_size

            self.logger.info(f"Uploading {filename} in {chunk_count} chunks")

            metadata = {
                "file_name": filename,
                "timestamp": datetime.now().isoformat(),
                "chunks": [],
            }

            for i in range(chunk_count):
                chunk_data = content[i * chunk_size : (i + 1) * chunk_size]
                chunk_id = f"{filename}_chunk_{i}"

                # Randomly assign to node
                node_http = random.choice(Config.NODE_PORTS)
                node_grpc = node_http + 1000
                client = self.get_node_client(node_grpc)

                try:
                    client.StoreChunk(StoreChunkRequest(chunk_id=chunk_id, data=chunk_data))
                    metadata["chunks"].append({
                        "chunk_id": chunk_id,
                        "node_http_port": node_http,
                        "node_grpc_port": node_grpc
                    })
                except Exception as e:
                    self.logger.error(f"Failed to store chunk {chunk_id} to node {node_http}: {e}")
                    return jsonify({"error": f"Failed to store chunk {chunk_id}"}), 500

            self.file_metadata[filename] = metadata
            self.save_metadata()
            return jsonify({"message": f"{filename} uploaded", "chunks": metadata["chunks"]}), 200

        @self.app.route('/files', methods=['GET'])
        def list_files():
            result = []
            for filename, meta in self.file_metadata.items():
                total_size_bytes = 0
                for chunk in meta.get("chunks", []):
                    node_http_port = chunk["node_http_port"]
                    try:
                        # Query the node's /metadata endpoint
                        import requests
                        response = requests.get(f"http://localhost:{node_http_port}/metadata")
                        if response.ok:
                            chunk_info = next(
                                (c for c in response.json().get("chunks", []) if c["chunk_id"] == chunk["chunk_id"]),
                                None
                            )
                            if chunk_info:
                                total_size_bytes += chunk_info["size_bytes"]
                    except Exception as e:
                        self.logger.warning(f"Failed to get size for chunk {chunk['chunk_id']}: {e}")
        
                result.append({
                    "file_name": filename,
                    "size_MB": round(total_size_bytes / (1024 * 1024), 2)
                })
        
            return jsonify(result)
        
        @self.app.route('/file/<filename>', methods=['GET'])
        def get_file_info(filename):
            data = self.file_metadata.get(filename)
            if not data:
                return jsonify({"error": "File not found"}), 404
            return jsonify(data)

        @self.app.route('/download/<filename>', methods=['GET'])
        def download(filename):
            metadata = self.file_metadata.get(filename)
            if not metadata:
                return jsonify({"error": "File not found"}), 404

            file_buffer = io.BytesIO()
            try:
                for chunk in metadata["chunks"]:
                    grpc_port = chunk["node_grpc_port"]
                    chunk_id = chunk["chunk_id"]
                    client = self.get_node_client(grpc_port)
                    response_stream = client.RetrieveChunk(RetrieveChunkRequest(chunk_id=chunk_id))
                    for chunk_data in response_stream:
                        file_buffer.write(chunk_data.data)
            except Exception as e:
                self.logger.error(f"Failed to retrieve chunk during download: {str(e)}")
                return jsonify({"error": "Download failed"}), 500

            file_buffer.seek(0)
            return send_file(file_buffer, as_attachment=True, download_name=filename)

        @self.app.route('/metadata', methods=['GET'])
        def get_metadata():
            return jsonify(self.file_metadata)

        @self.app.route('/health', methods=['GET'])
        def health():
            return jsonify({"status": "Main server healthy"})


def run_main_server():
    print(f"Main server running at http://localhost:{Config.MAIN_PORT}")
    server = MainServer()
    server.app.run(port=Config.MAIN_PORT)
