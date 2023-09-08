import logging
import shutil
from pathlib import Path

from synthesisgui.celery import app
from celery import shared_task
from django.conf import settings
from synthesis.models import Project

# from celery_progress.backend import ProgressRecorder


@shared_task
def synthesize_with_celery(cleaned_form_input: dict, session_key: str) -> bool:
    logger = logging.getLogger("django")
    project = Project(cleaned_form_input, session_key)

    if project:
        logger.info(
            f"session key {session_key} Created new project. Sending for processing."
        )
        return project.synthesize()

    logger.error(f"session key {session_key} Failed to create new project.")
    return False


@app.task
def clean_media_folder() -> None:
    logger = logging.getLogger("django")

    media_dir_path = Path(settings.MEDIA_ROOT)

    try:
        for item in media_dir_path.glob("*"):
            if item.is_file():
                item.unlink()
            elif item.is_dir():
                shutil.rmtree(item)

        logger.info(f"Media directory '{media_dir_path}' cleared successfully.")

    except Exception as e:
        logger.warning(f"Failed to clear media directory '{media_dir_path}': {str(e)}")

    except:
        logger.warning(f"Failed to clear media directory '{media_dir_path}'")

'''
@app.task
def print_scheduled_task_msg() -> None:
    logger = logging.getLogger("django")
    try:
        logger.info(f"This is a scheduled test message.")

    except Exception as e:
        logger.warning(f"Failed to print a scheduled test message: {str(e)}")
'''