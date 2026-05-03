import os
import torch
import time
import GPUtil

worker_type = os.getenv('FORGE_TYPE', 'UNKNOWN')

print(f"--- [START] Worker Mode: {worker_type} ---")
print(f"--- CUDA Available: {torch.cuda.is_available()} ---")
if torch.cuda.is_available():
    print(f"--- GPU Name: {torch.cuda.get_device_name(0)} ---")
    gpus = GPUtil.getGPUs()
    if gpus:
        print(f"--- VRAM Free: {gpus[0].memoryFree}MB ---")

print(f"Worker {worker_type} is waiting for tasks...")
while True:
    time.sleep(10)
