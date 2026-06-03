from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    groq_api_key: str = ""
    gemini_api_key: str = ""
    environment: str = "development"
    log_level: str = "INFO"
    allowed_origins: str = "http://localhost:3000"

    # Scheduler intervals (seconds)
    ingest_interval: int = 600       # 10 min
    analyze_interval: int = 120      # 2 min
    aggregate_interval: int = 300    # 5 min
    summarize_interval: int = 900    # 15 min

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
