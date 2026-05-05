from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    REDIS_HOST: str = Field("localhost", env="REDIS_HOST")
    REDIS_PORT: int = Field(6379, env="REDIS_PORT")
    DATABASE_URL: str = Field("sqlite:///./db/default.db", env="DATABASE_URL")
    OUTPUT_DIR: str = Field("/app/output", env="OUTPUT_DIR")
    MODEL_UNLOAD_TIMEOUT: int = Field(60, env="MODEL_UNLOAD_TIMEOUT")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()