import os

class Config:
    BASE_DIR = "distributed_storage"
    MAIN_PORT = 9000
    MAIN_GRPC_PORT = 9100
    NODE_PORTS = [9001, 9002, 9003, 9004, 9005]
    NODE_GRPC_PORTS = [10001, 10002, 10003, 10004, 10005]
    CHUNK_SIZE = 1024 * 1024  # 1MB
    
    @classmethod
    def init_storage(cls):
        os.makedirs(cls.BASE_DIR, exist_ok=True)
        os.makedirs(f"{cls.BASE_DIR}/main_server", exist_ok=True)
        for port in cls.NODE_PORTS:
            os.makedirs(f"{cls.BASE_DIR}/node_{port}", exist_ok=True)