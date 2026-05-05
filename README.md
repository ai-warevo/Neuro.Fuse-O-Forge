# 🛠 Neuro.Fuse-O-Forge
**Neuro.Fuse-O-Forge** — это распределенная мультимодальная AI-станция («кузница»), предназначенная для независимой генерации текста, изображений, звука и интерфейсов. Система построена на базе отказоустойчивой очереди с гарантией доставки (ACK) и модульной структуры воркеров.

## 🏗 Архитектура
Проект реализует паттерн Producer-Consumer через брокер сообщений:

* **Forge-API (FastAPI)**: Управляющий центр. Принимает запросы, управляет очередями в Redis и транслирует процесс генерации пользователю через WebSockets.
* **Universal Workers (Python)**: Вычислительные узлы. Каждый воркер специализируется на одном типе контента, держит модель «горячей» в VRAM и выполняет задачи из своей очереди.
* **Redis Broker**: Обеспечивает надежный транспорт задач (Streams) и стриминг логов в реальном времени (Pub/Sub).
* **Shared Volumes**: Общее хранилище для моментального доступа к результатам и кэширования весов моделей.

## 📂 Структура проекта

```
Neuro.Fuse-O-Forge/
├── backend/
│   ├── api/            # Логика сервера, WebSockets, управление очередью
│   └── worker/         # Универсальный код воркера, скрипты запуска моделей
├── frontend/           # Интерфейс пользователя (SPA с роутингом по цехам)
├── volumes/            # Постоянные данные
│   ├── models/         # [Volume] Кэш весов нейросетей (общий для воркеров)
│   └── output/         # [Volume] Результаты генерации (доступны API и воркерам)
├── Dockerfile          # Единый многоэтапный образ (Multi-stage build)
└── docker-compose.yml  # Оркестрация API, Redis и пула воркеров
```

## 🚀 Основные возможности

* Модульный Роутинг: Раздельные рабочие зоны (экраны) для разных типов генерации:
  * /image — Visual-Forge (SDXL/Flux)
  * /sound — Sonic-Forge (AudioGen)
  * /text — Lexi-Forge (LLM)
  * /ui — Layout-Forge (UI/UX Design)
* Гарантия выполнения (ACK): Использование подтверждений в Redis гарантирует, что если воркер упадет в процессе работы, задача вернется в очередь.
* Hot-Start: Воркеры не выгружают модели из GPU, обеспечивая мгновенное начало генерации после получения задачи.
* Smart Selection: Автоматический выбор оптимальной модели внутри воркера на основе анализа промпта (например, переключение на фотореализм или стилизацию).
* Live-мониторинг: Прямая трансляция состояния «кузницы» (GPU Load, VRAM, температура) и логов генерации через WebSockets.
* Auto-Cleanup: Автоматическая очистка сгенерированного контента по расписанию (Retention Policy — 24 часа).

## 🛠 Технологический стек
* Backend: Python 3.10, FastAPI, Redis (Streams + Pub/Sub).
* ML Core: PyTorch, Diffusers, Transformers, Audiocraft.
* Infrastructure: Docker (NVIDIA Container Toolkit), CUDA 12.1.
* Frontend: Современное SPA на React с поддержкой WebSockets.

## 🔧 Установка и запуск
- Убедитесь, что на хост-машине установлен NVIDIA Container Toolkit.
- Склонируйте репозиторий.
- Запустите всю экосистему:


### Docker compose

```sh
docker compose build --build-arg BUILDKIT_INLINE_CACHE=1 && docker-compose up
```

### .env

```sh
# redis
echo REDIS_HOST=localhost > .env.redis
echo REDIS_PORT=6379 >> .env.redis

# api
echo DATABASE_URL=sqlite+aiosqlite:///./volumes/db/forge.db > .env.api

# worker.base
echo PYTHONUNBUFFERED=1 > .env.worker.base
echo HF_HOME=./volumes/models/huggingface >> .env.worker.base

# worker.#
echo FORGE_TYPE=SOUND > .env.worker.sound
echo FORGE_TYPE=IMAGE > .env.worker.image
echo FORGE_TYPE=UI > .env.worker.ui
echo FORGE_TYPE=TEXT > .env.worker.text
```

### Local Api

```sh
# create venv & install deps
uv venv .venv_api --python 3.12
source ./.venv_api/Scripts/activate
uv pip install -r ./backend/api/requirements.txt
deactivate

# run 
set -a
source ./.venv_api/Scripts/activate
source .env.redis
source .env.api
set +a
uvicorn backend.api.main:app --host 0.0.0.0 --port 8000
```

### Local Worker (FORGE_TYPE=SOUND | IMAGE | UI | TEXT)

```sh
# create venv & install deps
uv venv .venv_worker_sound --python 3.12
source ./.venv_worker_sound/Scripts/activate
uv pip install -r ./backend/worker/requirements.txt
deactivate

# run 
set -a
source ./.venv_worker_sound/Scripts/activate
source .env.redis
source .env.worker.base
source .env.worker.sound
set +a
```

- API будет доступно на порту 8000, интерфейс — на порту 3000.

