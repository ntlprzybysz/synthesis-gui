from celery import shared_task
import time

@shared_task
def mock_action():
    time.sleep(10)
    return "Hello!"