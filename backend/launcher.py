import threading
from src.shared.config import Config
from src.node_server.server import run_node_server
from src.main_server.server import run_main_server

def main():
    Config.init_storage()

    for http_port, grpc_port in zip(Config.NODE_PORTS, Config.NODE_GRPC_PORTS):
        print(f"[INFO] Starting Node Server at http://localhost:{http_port} with gRPC at {grpc_port}")
        t = threading.Thread(
            target=run_node_server,
            args=(http_port, grpc_port),
            daemon=True
        )
        t.start()
    
    run_main_server()

if __name__ == '__main__':
    main()
