from django.conf import settings
from pathlib import Path
from os.path import exists
from time import sleep
import logging


def check_task_status(session_key: str, audio_url: str) -> int:
    """
    Monitors the progress of the synthesis task using log messages and returns the states accordingly.
    """
    def _check_task_status(line: str) -> int:
        if "tasks" in line and "Created new project" in line:
            logger.info(f"15%")
            return 15

        elif "models" in line and "Created a project directory" in line:
            logger.info(f"30%.")
            return 30

        elif "models" in line and "Created input file for synthesis" in line:
            logger.info(f"45%.")
            return 45

        elif "models" in line and "Finished processing project with Tacotron" in line:
            logger.info(f"60%.")
            return 60

        elif "models" in line and "Finished processing project with Waveglow" in line:
            logger.info(f"75%.")
            return 75

        elif "models" in line and "Synthesis done" in line:
            #logger.info(f"95%.")
            #return 95
            return 100

        elif "trace" in line and "True" in line:
            file_exists = exists(audio_url)
            if file_exists:
                logger.info(f"100%.")
                return 100
            else:
                logger.error(f"Synthesis done but audio file doesn't exist.")
                return -1

        else:
            logger.error(f"Returning task status -1.")
            return -1

    
    logger = logging.getLogger("django")
    logger.info(f"session key {session_key} Started checking task progress.")
    
    time = 0
    state = 0
    state_changed = False
    log_file_path = Path(settings.LOGGING_ROOT) / "django.log"

    while time < 60 and (state >= 0 and state < 100):
        log_file = open(log_file_path, "r")
        log_file_content = log_file.readlines()
        log_file.close()    

        last_session_log = str()
        for line in log_file_content:
            if session_key in line:
                if "Started checking task progress" not in line and "Sending data to check task status" not in line:
                    last_session_log = line

        new_state = _check_task_status(last_session_log)
        
        if new_state != state:
            state_changed = True
            state = new_state

        if state_changed == True:
            time = 0
            state_change = False
        else:
            time += 1

        sleep(1)
    
    return state