import logging
import time
import re
from os.path import exists
from datetime import datetime, timedelta

from django.conf import settings


def check_task_status(session_key: str) -> int:
    """
    Checks the progress of the synthesis task using log messages and the project's session key.
    Returns a positive value that represents the current state of the task, negative in case of errors.
    """
    def _get_logs_from_file() -> list[str]:
        log_file_content = list()
        try:
            with open(log_file_path, "r") as log_file:
                log_file_content = log_file.readlines()
        except Exception as e:
            logger.error(f"session key {session_key} Couldn't open log file.")
        finally:
            return log_file_content


    def _get_logs_from_last_10_mins(logs: list[str]) -> list[str]:
        current_time = datetime.now()

        logs_from_last_10_mins = list()
        for line in logs:
            log_pattern = r'\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},?\d{0,3} \w+ [^:]+: .+'
            if re.match(log_pattern, line):
                splitted_line = line.split()
                log_timestamp = splitted_line[0] + " " + splitted_line[1]
                try:
                    log_format = "%Y-%m-%d %H:%M:%S,%f"
                    log_datetime = datetime.strptime(log_timestamp, log_format)

                    if current_time - log_datetime <= timedelta(minutes=10):
                        logs_from_last_10_mins.append(line)
                except ValueError:
                    continue
                    
        return logs_from_last_10_mins


    def _check_current_task_status(line: str) -> int:
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
                    f"session key {session_key} Confirmed existence of audio file: {output_file_path}."
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

    '''
    def _check_times_revisited(log_file_content, state: int) -> int:
        """
        Checks how many times the task has been in this state based on logs.
        """
        revisited = 0
        for line in log_file_content:
            if f"{session_key} State: {state}%" in line:
                revisited += 1
        return revisited
    '''

    logger = logging.getLogger("django")

    state = 0
    state_changed = False
    log_file_path = settings.LOGGING_ROOT / "django.log"
    time_in_state = 0

    while (time_in_state < 300) and (state_changed == False):
        log_file_content = _get_logs_from_file()
        if not log_file_content:
            logger.error(f"session key {session_key} No logs available to check status.")
            return -1
   
        log_file_content = _get_logs_from_last_10_mins(log_file_content)
        if not log_file_content:
            logger.error(f"session key {session_key} No logs from last 10 minutes available to check status.")
            return -1

        last_session_log = str()
        for line in log_file_content:
            if session_key in line or "trace:" in line:
                if "tasks:" in line or "models:" in line or "trace:" in line:
                    last_session_log = line

        new_state = _check_current_task_status(last_session_log)
        
        #time_in_state = _check_times_revisited(log_file_content, new_state)

        if new_state < state or new_state > state:
            state = new_state
            state_changed = True
        else:
            state_changed = False

        if new_state >= 0:
            logger.info(
                f"session key {session_key} State: {new_state}%, time in state: {time_in_state}s of allowed 300s."
            )

        time.sleep(1)

    return state
