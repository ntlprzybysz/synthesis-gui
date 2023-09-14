import logging
import time
from datetime import datetime
from os.path import exists

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


    def _get_project_entries(log: list[str]) -> list[str]:
        """
        Returns log entries from the last project started by the user (every user
        has a unique session_key, but the same user can start multiple projects).
        """
        project_entries = list()

        first_entry_index = -1
        expected_content = f"{session_key} Created new project."
        for index, entry in enumerate(log):
            if expected_content in entry:
                first_entry_index = index

        if first_entry_index < 0:
            return project_entries

        for index, entry in enumerate(log):
            if index >= first_entry_index:
                project_entries.append(entry)

        return project_entries


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
        """
        Returns the current task status as an integer code based on the given entry from the log.
        """
        if "tasks" in entry and "Created new project. Sending for processing" in entry:
            return 15

        elif "models" in entry and "Created a project directory" in entry:
            return 30

        elif "models" in entry and "Created input file for synthesis" in entry:
            return 45

        elif "models" in entry and "Finished processing project with Tacotron" in entry:
            return 50

        elif "models" in entry and "Finished processing project with Waveglow" in entry:
            return 75

        elif "models" in entry and "Synthesis done" in entry:
            return 95

        elif "trace" in entry and "True" in entry:
            output_file_path = settings.MEDIA_ROOT / session_key / "1-1.npy.wav"
            file_exists = exists(output_file_path)
            if file_exists:
                return 100
            else:
                return -1

        else:
            return -1


    def _get_time_in_state(log, state: int) -> int:
        """
        Returns how many seconds have elapsed since the state was visited
        for the first time in this project.
        """
        first_entry = log[0]
        if len(first_entry) == 0:
            return -1

        first_entry = first_entry.split()
        start_time = first_entry[0] + " " + first_entry[1]
        entry_format = "%Y-%m-%d %H:%M:%S,%f"
        start_time = datetime.strptime(start_time, entry_format)

        current_time = datetime.now()

        elapsed_time = current_time - start_time
        elapsed_time = int(elapsed_time.total_seconds())

        return elapsed_time


    logger = logging.getLogger("django")

    state = 0
    state_changed = False
    log_file_path = settings.LOGGING_ROOT / "django.log"
    time_in_state = 0

    while (time_in_state < 300) and (state_changed == False):
        log = _read_log_from_file()
        if not log:
            logger.error(
                f"session key {session_key} No logs found."
            )
            return -1

        log = _get_project_entries(log)
        if not log:
            logger.error(
                f"session key {session_key} No logs found for this project."
            )
            return -1

        last_entry = _get_last_relevant_entry(log)
        if len(last_entry) == 0:
            logger.error(
                f"session key {session_key} No relevant log entry found for this project."
            )
            return -1

        current_state = _get_current_task_status(last_entry)
        if current_state < 0:
            logger.error(
                f"session key {session_key} Couldn't determine current task state or output file doesn't exist."
            )
            return -1

        elapsed_time = _get_time_in_state(log, current_state)
        if elapsed_time < 0:
            logger.error(
                f"session key {session_key} Couldn't calculate elapsed time at {current_state}%."
            )
            return -1
        
        if elapsed_time > 300:
            logger.error(f"session key {session_key} Timed out at {current_state}%.")
            return -1

        if current_state < state or current_state > state:
            state = current_state
            state_changed = True
        else:
            state_changed = False

        if current_state >= 0:
            logger.info(
                f"session key {session_key} State: {current_state}%, time in state: {elapsed_time}s/300s."
            )

        time.sleep(1)

    return state
