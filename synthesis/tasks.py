import logging
import shutil
from pathlib import Path

from synthesisgui.celery import app
from celery import shared_task
from django.conf import settings
from synthesis.models import Project

from .tasks_utils import analyse_log_for_problems, mail_report


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

    logger.info(f"Performing scheduled media folder cleaning...")

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
        logger.warning(f"Failed to clear media directory '{media_dir_path}'.")


@app.task
def analyse_log_and_mail_report() -> None:
    logger = logging.getLogger("django")

    if settings.MAIL_REPORTS:
        logger.info(f"Starting scheduled log analysis...")

        success, report = analyse_log_for_problems()
        if not success:
            logger.warning(f"Failed to perform scheduled log analysis.")
        
        if report:
            success = mail_report(report)
            if success:
                logger.info(f"Mailed report.")

        logger.info(f"Scheduled log analysis done.")
        
    else:
        logger.info(f"Didn't perform scheduled log analysis because MAIL_REPORTS is set to False.")