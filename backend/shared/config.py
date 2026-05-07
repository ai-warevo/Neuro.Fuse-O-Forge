from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    REDIS_HOST: str = Field("localhost")
    REDIS_PORT: int = Field(6379)
    DATABASE_URL: str = Field("sqlite:///./db/default.db")
    OUTPUT_DIR: str = Field("/app/output")
    MODEL_UNLOAD_TIMEOUT: int = Field(60)

    # Новый способ объявления настроек
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8"
    )

settings = Settings()
