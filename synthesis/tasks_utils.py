from django.conf import settings
from os.path import exists
import time
import logging


def check_task_status(session_key: str) -> int:
    """
    Monitors the progress of the synthesis task every second using log messages and the project's session key.
    Returns a positive value upon success, negative otherwise.
    """

    def _check_task_status(line: str) -> int:
        if "tasks" in line and "Created new project. Sending for processing" in line:
            return 15

        elif "models" in line and "Created a project directory" in line:
            return 30

        elif "models" in line and "Created input file for synthesis" in line:
            return 45

        elif "models" in line and "Finished processing project with Tacotron" in line:
            return 60

        elif "models" in line and "Finished processing project with Waveglow" in line:
            return 75

        elif "models" in line and "Synthesis done" in line:
            return 95

        elif "trace" in line and "True" in line:
            output_file_path = settings.MEDIA_ROOT / session_key / "1-1.npy.wav"
            file_exists = exists(output_file_path)
            if file_exists:
                logger.info(
                    f"session key {session_key} Confirmed existance of audio file: {output_file_path}."
                )
                return 100
            else:
                logger.error(
                    f"session key {session_key} Synthesis done but audio file {output_file_path} doesn't exist."
                )
                return -1

        else:
            logger.error(
                f"session key {session_key} Returning task status -1 for line: {line}."
            )
            return -1

    logger = logging.getLogger("django")
    logger.info(f"session key {session_key} Started checking task progress.")

    state = 0
    start_time = time.time()
    elapsed_time = 0
    log_file_path = settings.LOGGING_ROOT / "django.log"

    while elapsed_time < 300 and (state >= 0 and state < 100):
        log_file_content = str()
        try:
            with open(log_file_path, "r") as log_file:
                log_file_content = log_file.readlines()
        except Exception as e:
            logger.error(f"session key {session_key} Couldn't open log file.")
            return -1

        last_session_log = str()
        for line in log_file_content:
            if session_key in line or "trace:" in line:
                if "tasks:" in line or "models:" in line or "trace:" in line:
                    last_session_log = line

        new_state = _check_task_status(last_session_log)

        if new_state < state or new_state > state:
            state = new_state
            start_time = time.time()
            elapsed_time = 0
        else:
            elapsed_time = int(time.time() - start_time)

        if new_state >= 0:
            logger.info(
                f"session key {session_key} State: {new_state}%, time in state: {elapsed_time}s of allowed 300s."
            )

        time.sleep(1)

    return state
