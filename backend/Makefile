.PHONY: init proto run clean

init:
	python3 -m venv venv
	. venv/bin/activate && pip install -r requirements.txt
	mkdir -p distributed_storage

proto:
	python -m grpc_tools.protoc -I=protos --python_out=src/protos --grpc_python_out=src/protos protos/dfs.proto

run:
	PYTHONPATH=src python3 launcher.py

clean:
	rm -rf distributed_storage
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -delete
