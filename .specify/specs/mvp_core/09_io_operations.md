### I/O Operations
Specific paths for saving files: `/app/output/{task_type}/{date}/{task_id}.ext`.

```python
import datetime
import os

def save(audio_output, task_id, task_type):
    """
    Saves output to the correct path with date-based directory structure.
    Path format: /app/output/{task_type}/{date}/{task_id}.wav
    """
    date_str = datetime.datetime.now().strftime('%Y-%m-%d')
    output_dir = f"/app/output/{task_type}/{date_str}"
    os.makedirs(output_dir, exist_ok=True)
    file_path = f"{output_dir}/{task_id}.wav"
    audio_output.save(file_path)
    return file_path

def get_output_path(task_id, task_type, date_str=None):
    """
    Generates the expected output path for a task.
    Used for idempotency checks.
    """
    if date_str is None:
        date_str = datetime.datetime.now().strftime('%Y-%m-%d')
    return f"/app/output/{task_type}/{date_str}/{task_id}.wav"

def is_task_successfully_completed(task_id, task_type, date_str=None):
    """
    Checks if the output file already exists (idempotency check).
    Returns True if file exists, False otherwise.
    """
    file_path = get_output_path(task_id, task_type, date_str)
    return os.path.exists(file_path)

```