from celery import shared_task
from celery_progress.backend import ProgressRecorder
from time import sleep

@shared_task(bind=True)
def go_to_sleep(self, duration: int):
    progress_recorder = ProgressRecorder(self)
    for i in range(5):    
        sleep(duration)
        progress_recorder.set_progress(i + 1, 5, f"On iteration {i}")
    return "Done"