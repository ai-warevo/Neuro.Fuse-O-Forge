# 🧠 API (Control Plane)
API служит единственной точкой входа для пользователей. Его задачи: прием запросов, валидация параметров, управление очередью в Redis и трансляция процесса генерации в реальном времени через WebSockets.

## 🛠 Стек технологий

* Framework: FastAPI (Asynchronous).
* Server: Uvicorn.
* Broker Client: redis.asyncio.
* Task Scheduling: APScheduler (для очистки файлов).
* Monitoring: GPUtil (локально) + Redis Reader (для воркеров).
* Database: SQLite + SQLAlchemy (Async) — для постоянного хранения истории задач.

## 🗄 Хранение истории (Database Layer)

Все задачи логируются в SQLite. Это позволяет пользователю видеть историю своих генераций после перезагрузки страницы.


| Поле | Тип | Описание |
|:---|:---|:---|
| **id** | UUID (PK) | Уникальный ID задачи (task_id). |
| **type** | String | Тип цеха (IMAGE, SOUND, TEXT, UI). |
| **prompt** | Text | Исходный запрос. |
| **params** | JSON | Использованные настройки. |
| **status** | Enum | pending, processing, success, error. |
| **result_url** | String | Путь к файлу (заполняется при успехе). |
| **created_at** | DateTime | Время постановки в очередь. |


## 🧹 Работа с файлами

* Static Serving: Доступ к /app/output должен быть настроен через app.mount("/files", ...).
* Cleanup Job: Раз в сутки (настраивается в config.yaml) скрипт должен удалять файлы старше N часов, чтобы не переполнять Volume.

## 🤖 Конфигурация (config.yaml)
В файле должны быть описаны:

* Лимиты параметров (max steps, max duration).
* Маппинг «умного выбора» моделей для режима auto.
* Настройки очистки (время запуска, срок хранения).

---

## 📡 Эндпоинты API
### Генерация (HTTP POST)
POST /api/generate

* Payload: Объект с type, prompt и опциональными params.
* Логика:
1. Проверка лимитов (Sanitization).
   2. Создание записи в SQLite со статусом "pending".
   3. Генерация task_id.
   4. Запись в Redis Stream forge:tasks:{type} через XADD.
* Response: 202 Accepted + task_id.

### Мониторинг (HTTP GET)
GET /api/stats

* Логика: Сбор ключей worker_health:* из Redis.
* Response: Список активных воркеров, их статус (Idle/Busy) и нагрузка на GPU.

### История задач (HTTP GET)
GET /api/history

* Параметры: limit (default 20), offset.
* Логика: Получение списка последних задач из SQLite.
* Response: JSON-массив объектов задач.

### Детали задачи (HTTP GET)
GET /api/tasks/{task_id}

* Логика: Получение полной информации о конкретной задаче из БД.


### Реальное время (WebSocket)
WS /api/ws/task/{task_id}

* Логика:
  1. Подписка через Pub/Sub на канал logs:{task_id}.
  2. Трансляция JSON-сообщений от воркера клиенту.
  3. Типы сообщений: log (текст), progress (0-100), success (URL файла), error (текст ошибки).
  4. При получении финальных статусов (success/error) — обновление соответствующей записи в SQLite.
  5. Авто-закрытие сокета при финальных статусах.

------------------------------

## 📑 Объект задачи (Task Model)
Это полный JSON-объект, который API помещает в Redis Stream, а воркер считывает.

| Поле | Тип | Обязательно | Описание |
|---|---|---|---|
| task_id | string (UUID) | Да | Уникальный идентификатор задачи для отслеживания. |
| type | string | Да | Тип цеха: IMAGE, SOUND, TEXT или UI. |
| model_name | string | Да | auto (для умного выбора) или конкретный алиас из конфига. |
| prompt | string | Да | Текстовое описание того, что нужно создать. |
| params | object | Да | Словарь специфических настроек (см. раздел ниже). |
| created_at | float | Да | Unix timestamp времени создания задачи. |

------------------------------
## ⚙️ Спецификация параметров (params) по типам задач
### IMAGE (Визуальный цех)
Для работы с моделями типа Stable Diffusion XL или Flux.

* width (int): Ширина картинки в пикселях. Кратно 8. (Default: 1024, Range: 256-2048).
* height (int): Высота картинки в пикселях. Кратно 8. (Default: 1024, Range: 256-2048).
* steps (int): Количество шагов отрисовки. (Default: 30, Range: 1-100).
* guidance_scale (float): Насколько строго следовать промпту. (Default: 7.5, Range: 1-20).
* seed (int): Зерно для генерации. -1 для полной случайности. (Default: -1).
* negative_prompt (string): Описание того, чего не должно быть в кадре. (Default: "").

### SOUND (Звуковой цех)
Для работы с AudioGen / MusicGen.

* duration (int): Длительность звука в секундах. (Default: 5, Range: 1-30).
* sample_rate (int): Частота дискретизации. (Options: 16000, 32000, 44100). (Default: 32000).
* overlap (float): Плавность перехода при склейке фрагментов. (Default: 0.5, Range: 0-1).
* format (string): Формат выходного файла. (Options: wav, mp3). (Default: wav).

### TEXT (Лексический цех)
Для работы с LLM (Llama 3, Mistral).

* max_tokens (int): Максимальная длина ответа. (Default: 512, Range: 1-4096).
* temperature (float): Степень "творчества". Чем выше, тем непредсказуемей ответ. (Default: 0.7, Range: 0-2).
* top_p (float): Вероятностная выборка слов. (Default: 0.9, Range: 0-1).
* system_prompt (string): Инструкция "личности" ИИ. Например: "Ты эксперт-копирайтер". (Default: "").

### UI (Цех макетов)
Специфическая обертка над Image-моделью для генерации веб-дизайна.

* device (string): Форм-фактор. (Options: desktop, mobile, tablet). (Default: desktop).
* style_preset (string): Набор стилистических токенов. (Options: minimalism, brutalism, modern_clean). (Default: minimalism).
* include_copy (boolean): Генерировать ли осмысленный текст для блоков через LLM перед рисованием. (Default: true).

------------------------------
## Пример полной модели задачи (JSON)
Это то, что пролетает через Redis от API к Воркеру:

```json
{
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "IMAGE",
  "model_name": "auto",
  "prompt": "Portrait of a cyberpunk girl with neon lights, highly detailed, 8k",
  "params": {
    "width": 1024,
    "height": 1024,
    "steps": 50,
    "guidance_scale": 9.0,
    "seed": 123456,
    "negative_prompt": "blurry, low quality, deformed hands"
  },
  "created_at": 1714756200.45
}
```

