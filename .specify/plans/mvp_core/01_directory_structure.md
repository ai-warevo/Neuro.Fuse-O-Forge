### 1. Directory & File Structure
#### Backend Shared Directory (`/backend/shared/`)

```plaintext
/backend/shared/
├── config.py            # Config singleton
├── constants.py         # Shared constants and configuration
├── pydantic_models.py   # Pydantic schemas (Task, Params)
└── utils.py             # Shared utility functions

```

#### Backend API Directory (`/backend/api/`)

```plaintext
/backend/api/
├── main.py              # FastAPI application entry point
├── models/
│   └── task.py          # SQLAlchemy model for tasks
├── schemas/
│   ├── config.py        # Pydantic schema for configuration
│   └── tasks.py         # Pydantic schema for tasks
├── services/
│   ├── database.py      # Database connection setup and migration
│   └── redis.py         # Redis producer
└── routes/
    └── tasks.py         # Task-related routes
```

#### Backend Worker Directory (`/backend/worker/`)

```plaintext
/backend/worker/
├── main.py              # Universal worker entry point
├── pipelines/
│   ├── audio.py         # Audio generation pipeline (Audiocraft)
│   ├── image.py         # Image generation pipeline (Diffusers)
│   └── text.py          # Text generation pipeline (Transformers)
└── utils/
    └── config_loader.py # Config loader
```

#### Frontend Directory (`/frontend/`)

```plaintext
/frontend/
├── app/
│   ├── api.js           # API calls for frontend
│   └── page.js          # Main page
├── styles/
│   └── globals.css      # Global styles
├── public/
│   └── favicon.ico
└── Dockerfile           # Docker build file
```

#### Volumes Directory (`/volumes/`)

```plaintext
/volumes/
├── models               # Model weights and checkpoints
├── output               # Generated outputs (images, audio, text)
├── redis                # Redis data persistence
└── db                   # SQLite database files
```