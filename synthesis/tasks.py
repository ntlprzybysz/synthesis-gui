from celery import shared_task
#from celery_progress.backend import ProgressRecorder

import logging
from synthesis.models import Project


@shared_task
def synthesize_with_celery(cleaned_form_input: dict, session_key: str) -> bool:
    logger = logging.getLogger("django")
    project = Project(cleaned_form_input, session_key)
    logger.info(f"Created new project.")

    return project.synthesize()