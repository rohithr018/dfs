import os
import grpc
from concurrent import futures
from flask import Flask, jsonify
from protos.dfs_pb2_grpc import ChunkServiceServicer, add_ChunkServiceServicer_to_server
from protos.dfs_pb2 import (
    StoreChunkResponse, ChunkData, DeleteChunkResponse, HealthResponse
)
from src.shared.config import Config
from src.shared.utils import setup_logger
from datetime import datetime


class NodeGRPCServer(ChunkServiceServicer):
    def __init__(self, port):
        self.port = port
        self.storage_path = f"{Config.BASE_DIR}/node_{port}"
        self.logger = setup_logger(f"NodeGRPC-{port}")

    def StoreChunk(self, request, context):
        try:
            chunk_path = f"{self.storage_path}/{request.chunk_id}"
            with open(chunk_path, "wb") as f:
                f.write(request.data)
            self.logger.info(f"Stored chunk {request.chunk_id}")
            return StoreChunkResponse(status="STORED", chunk_id=request.chunk_id)
        except Exception as e:
            self.logger.error(f"StoreChunk error: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return StoreChunkResponse(status="ERROR")

    def RetrieveChunk(self, request, context):
        try:
            chunk_path = f"{self.storage_path}/{request.chunk_id}"
            with open(chunk_path, "rb") as f:
                while True:
                    data = f.read(Config.CHUNK_SIZE)
                    if not data:
                        break
                    yield ChunkData(data=data)
        except FileNotFoundError:
            context.set_code(grpc.StatusCode.NOT_FOUND)
        except Exception as e:
            self.logger.error(f"RetrieveChunk error: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))

    # Optional: DeleteChunk, HealthCheck can be implemented similarly


class NodeHTTPServer:
    def __init__(self, port):
        self.port = port
        self.app = Flask(__name__)
        self.storage_path = f"{Config.BASE_DIR}/node_{port}"
        self.setup_routes()

    def setup_routes(self):
        @self.app.route('/health')
        def health():
            return jsonify({"status": "healthy"})

        @self.app.route('/metadata')
        def metadata():
            try:
                chunks = []
                total_size = 0

                for filename in os.listdir(self.storage_path):
                    file_path = os.path.join(self.storage_path, filename)
                    if os.path.isfile(file_path):
                        size = os.path.getsize(file_path)
                        total_size += size
                        chunks.append({
                            "chunk_id": filename,
                            "size_bytes": size
                        })

                return jsonify({
                    "node_port": self.port,
                    "total_chunks": len(chunks),
                    "total_size_bytes": total_size,
                    "chunks": chunks
                })

            except Exception as e:
                return jsonify({"error": str(e)}), 500


def run_node_server(http_port, grpc_port):
    # Start gRPC server in a separate thread
    grpc_server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    add_ChunkServiceServicer_to_server(NodeGRPCServer(http_port), grpc_server)
    grpc_server.add_insecure_port(f'[::]:{grpc_port}')
    grpc_server.start()

    # Start Flask HTTP server
    http_server = NodeHTTPServer(http_port)
    http_server.app.run(port=http_port, use_reloader=False)

    grpc_server.wait_for_termination()
