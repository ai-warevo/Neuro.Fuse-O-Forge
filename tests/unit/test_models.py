from backend.shared.models import Task, TaskType
import pytest

def test_task_creation():
    task = Task(task_id="1", task_type=TaskType.GENERATION)
    assert task.task_id == "1"
    assert task.task_type == TaskType.GENERATION

def test_task_repr():
    task = Task(task_id="2", task_type=TaskType.SEGMENTATION)
    assert repr(task) == f"Task(task_id='2', task_type={TaskType.SEGMENTATION})"