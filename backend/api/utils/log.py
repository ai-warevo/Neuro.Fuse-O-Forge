from backend.shared.log import get_logger

def get_api_logger(name: str):
  return get_logger(f"api:{name}")