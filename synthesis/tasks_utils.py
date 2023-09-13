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
    def _read_log_from_file() -> list[str]:
        log = list()
        try:
            with open(log_file_path, "r") as log_file:
                log = log_file.readlines()
        except Exception as e:
            logger.error(f"session key {session_key} Couldn't open log file.")
        finally:
            return log


    def _get_logs_last_10_mins(log: list[str]) -> list[str]:
        """
        Returns log entries from the last 10 minutes based on their timestamps.
        """
        current_time = datetime.now()

        entries_last_10_mins = list()
        for entry in log:
            log_pattern = r'\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},?\d{0,3} \w+ [^:]+: .+'
            if re.match(log_pattern, entry):
                splitted_line = entry.split()
                log_timestamp = splitted_line[0] + " " + splitted_line[1]
                try:
                    log_format = "%Y-%m-%d %H:%M:%S,%f"
                    log_datetime = datetime.strptime(log_timestamp, log_format)

                    if current_time - log_datetime <= timedelta(minutes=10):
                        entries_last_10_mins.append(entry)
                except ValueError:
                    continue
                    
        return entries_last_10_mins


    def _get_last_relevant_entry(log: list[str]) -> str:
        """
        Returns the last relevant log entry from a list of logs. For an entry to be relavant,
        it must contain key words associated with task status description.
        """
        last_relevant_entry = ""
        for entry in log:
            if session_key in entry or "trace:" in entry:
                if "tasks:" in entry or "models:" in entry or "trace:" in entry:
                    last_relevant_entry = entry
        return last_relevant_entry
                    

    def _get_current_task_status(entry: str) -> int:
        if "tasks" in entry and "Created new project. Sending for processing" in entry:
            return 15

        elif "models" in entry and "Created a project directory" in entry:
            return 30

        elif "models" in entry and "Created input file for synthesis" in entry:
            return 45

        elif "models" in entry and "Finished processing project with Tacotron" in entry:
            return 60

        elif "models" in entry and "Finished processing project with Waveglow" in entry:
            return 75

        elif "models" in entry and "Synthesis done" in entry:
            return 95

        elif "trace" in entry and "True" in entry:
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
                f"session key {session_key} Returning task status -1 for line: {entry}."
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
        log = _read_log_from_file()
        if not log:
            logger.error(f"session key {session_key} No logs available to check status.")
            return -1
   
        log = _get_logs_last_10_mins(log)
        if not log:
            logger.error(f"session key {session_key} No logs from last 10 minutes available to check status.")
            return -1
       
        last_entry = _get_last_relevant_entry(log)
        if len(last_entry) == 0:
            logger.error(f"session key {session_key} No relevant log line from last 10 minutes available to check status.")
            return -1

        current_state = _get_current_task_status(last_entry)
        
        #time_in_state = _check_times_revisited(logs, new_state)

        if current_state < state or current_state > state:
            state = current_state
            state_changed = True
        else:
            state_changed = False

        if current_state >= 0:
            logger.info(
                f"session key {session_key} State: {current_state}%, time in state: {time_in_state}s of allowed 300s."
            )

        time.sleep(1)

    return state
