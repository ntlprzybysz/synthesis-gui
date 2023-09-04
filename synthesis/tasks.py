from celery import shared_task
#from celery_progress.backend import ProgressRecorder

import logging
from synthesis.models import Project


@shared_task
def synthesize_with_celery(cleaned_form_input: dict, session_key: str) -> bool:
    logger = logging.getLogger("django")
    project = Project(cleaned_form_input, session_key)
    
    if project:
        logger.info(f"session key {session_key} Created new project. Sending for processing.")
        return project.synthesize()
    
    logger.error(f"session key {session_key} Failed to create new project.")
    return False