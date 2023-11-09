import logging
import re
import time
from datetime import datetime, timedelta
from os.path import exists
from typing import Tuple

from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def read_log_from_file() -> list[str]:
    logger = logging.getLogger("django")
    log_file_path = settings.LOGGING_ROOT / "django.log"
    log = list()
    try:
        with open(log_file_path, "r") as log_file:
            log = log_file.readlines()
    except Exception as e:
        logger.error(f"Couldn't read from log file: {e}.")
    except:
        logger.error(f"Couldn't read from log file.")
    finally:
        return log


def check_task_status(session_key: str) -> int:
    """
    Checks progress of a synthesis task using log messages and the project's session key.
    Returns a positive value that represents the current progress of the task in %, 
    negative in case of errors.
    """
    def _get_project_entries(log: list[str]) -> list[str]:
        """
        Returns log entries from the last project started by the user (every user
        has a unique session_key, but the same user can start multiple projects)
        that starts with a date.
        """
        project_entries = list()

        first_entry_index = -1
        expected_content = f"{session_key} Created new project."
        for index, entry in enumerate(log):
            date_pattern = r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}"
            if re.match(date_pattern, entry):
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
        Returns the last relevant log entry from a list of logs. For an entry to be relevant,
        it must contain key words associated with task status description.
        """
        last_relevant_entry = ""
        for entry in log:
            if session_key in entry or "trace:" in entry:
                if "tasks:" in entry or "models:" in entry or "trace:" in entry:
                    last_relevant_entry = entry
        return last_relevant_entry


    def _timed_out(elapsed_time: int, max_time: int) -> bool:
        """
        Returns True if the time spend in the given state is larger than the given max_time.
        """
        if elapsed_time < 0:
            logger.error(
                f"session key {session_key} Invalid elapsed_time. Must be bigger than 0, got: {max_time}."
            )
            return True
        
        if max_time < 0:
            logger.error(
                f"session key {session_key} Invalid max_time. Must be bigger than 0, got: {max_time}."
            )
            return True

        if elapsed_time >= max_time:
            logger.error(f"session key {session_key} Timed out with {max_time}s.")
            return True

        return False


    def _get_time_at_stage(entry: str) -> int:
        """
        Returns how many seconds have elapsed since a major processing stage was entered.
        """
        split_entry = entry.split()
        start_time = split_entry[0] + " " + split_entry[1]
        entry_format = "%Y-%m-%d %H:%M:%S,%f"
        start_time = datetime.strptime(start_time, entry_format)

        current_time = datetime.now()

        elapsed_time = current_time - start_time
        elapsed_time = int(elapsed_time.total_seconds())

        return elapsed_time
    

    def _check_progress(entry: str) -> int:
        """
        Returns the current task progress in % based on an entry from the project log.
        Every "if" represents a major processing stage of a project.
        """
        elapsed_time = 0

        if "tasks" in entry and "Created new project. Sending for processing" in entry:
            progress = 1
            elapsed_time = _get_time_at_stage(entry)
            if _timed_out(elapsed_time, 30):
                return -1
            return progress

        elif "models" in entry and "Created a project directory" in entry:
            progress = 3
            elapsed_time = _get_time_at_stage(entry)
            if _timed_out(elapsed_time, 30):
                return -1
            return progress

        elif "models" in entry and "Created input file for synthesis" in entry:
            elapsed_time = _get_time_at_stage(entry)
            if _timed_out(elapsed_time, 300):
                return -1
            
            if elapsed_time >= 0 and elapsed_time < 5:
                progress = 5
            elif elapsed_time >= 5 and elapsed_time < 10:
                progress = 8
            elif elapsed_time >= 10 and elapsed_time < 15:
                progress = 13
            elif elapsed_time >= 15 and elapsed_time < 20:
                progress = 15
            elif elapsed_time >= 20 and elapsed_time < 25:
                progress = 19
            elif elapsed_time >= 25 and elapsed_time < 50:
                progress = 21
            else:
                progress = 26

        elif "models" in entry and "Finished processing project with Tacotron" in entry:
            elapsed_time = _get_time_at_stage(entry)
            if _timed_out(elapsed_time, 300):
                return -1
            
            if elapsed_time >= 0 and elapsed_time < 5:
                progress = 30
            elif elapsed_time >= 5 and elapsed_time < 15:
                progress = 47
            elif elapsed_time >= 15 and elapsed_time < 30:
                progress = 51
            elif elapsed_time >= 30 and elapsed_time < 45:
                progress = 55
            elif elapsed_time >= 45 and elapsed_time < 60:
                progress = 59
            elif elapsed_time >= 60 and elapsed_time < 85:
                progress = 66
            elif elapsed_time >= 85 and elapsed_time < 100:
                progress = 71
            elif elapsed_time >= 100 and elapsed_time < 125:
                progress = 78
            elif elapsed_time >= 125 and elapsed_time < 150:
                progress = 83
            elif elapsed_time >= 150 and elapsed_time < 200:
                progress = 90
            else:
                progress = 94

        elif "models" in entry and "Finished processing project with Waveglow" in entry:
            elapsed_time = _get_time_at_stage(entry)
            if _timed_out(elapsed_time, 30):
                return -1
            progress = 95

        elif "models" in entry and "Synthesis done" in entry:
            elapsed_time = _get_time_at_stage(entry)
            if _timed_out(elapsed_time, 30):
                return -1
            progress = 97

        elif "trace" in entry and "True" in entry:
            output_file_path = settings.MEDIA_ROOT / session_key / "1-1.npy.wav"
            file_exists = exists(output_file_path)
            if file_exists:
                progress = 100
            else:
                return -1

        else:
            return -1

        logger.debug(
            f"session key {session_key} At {progress}% for {elapsed_time}s."
        )
        return progress

    logger = logging.getLogger("django")

    progress = 0
    progressed = False

    while (progressed == False):
        log = read_log_from_file()
        if not log:
            logger.error(f"session key {session_key} No logs found.")
            return -1

        log = _get_project_entries(log)
        if not log:
            logger.error(f"session key {session_key} No logs found for this project.")
            return -1

        last_entry = _get_last_relevant_entry(log)
        if len(last_entry) == 0:
            logger.error(
                f"session key {session_key} No relevant log entry found for this project."
            )
            return -1

        current_progress = _check_progress(last_entry)
        if current_progress < 0:
            logger.error(
                f"session key {session_key} Couldn't determine current task state or output file doesn't exist."
            )
            return -1

        if progress < current_progress:
            progress = current_progress
            progressed = True
        else:
            progressed = False

        time.sleep(1)

    return progress


def mail_report(mail_body: str) -> bool:
    logger = logging.getLogger("django")

    message = Mail(
        from_email=settings.PROJECT_EMAIL,
        to_emails=settings.PROJECT_EMAIL,
        subject="Report from Speech Synthesis GUI",
        html_content=mail_body,
    )

    if settings.SENDGRID_API_KEY is None:
        logger.error(f"SENDGRID_API_KEY is None")

    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        return True
    except Exception as e:
        logger.error(f"Failed to mail report: {e}")
        return False
    except:
        return False


def analyse_log_for_problems() -> Tuple[bool, str]:
    """
    Analyses log for problems based on a time frame and key words.
    Returns True if log analysis was possible and a string with problems 
    or a message that no problems were found. Otherwise, returns
    False and an empty string.
    """
    def _find_new_entries(log: list[str]) -> list[str]:
        """
        Returns a list of entries from the last day that begin with a date.
        """
        new_entries = list()

        period = timedelta(days=1, hours=0, minutes=0)
        current_time = datetime.now()
        start_time = current_time - period

        entry_format = "%Y-%m-%d %H:%M:%S,%f"

        for entry in log:
            date_pattern = r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}"
            if re.match(date_pattern, entry):
                current_entry = entry.split()
                entry_time = current_entry[0] + " " + current_entry[1]
                entry_time = datetime.strptime(entry_time, entry_format)
                if entry_time >= start_time:
                    new_entries.append(entry)

        return new_entries

    def _format_entry(entry: str) -> str:
        """
        Returns a shortened version of the entry with certain information hidden.
        """
        datestamp, rest_of_entry = re.match(
            r"^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}) (.*)$", entry
        ).groups()
        formatted_rest = re.sub(r"\d", "x", rest_of_entry)
        formatted_entry = f"{datestamp} {formatted_rest}"
        formatted_entry = formatted_entry[:101] + "... <br>"

        return formatted_entry

    logger = logging.getLogger("django")

    report = ""
    fatalities = list()
    errors = list()
    warnings = list()

    log = read_log_from_file()
    if not log:
        logger.error(f"No logs found.")
        return False, report

    log = _find_new_entries(log)
    if not log:
        logger.info(f"No new entries found.")
        return True, report

    for entry in log:
        if "FATAL" in entry:
            fatalities.append(_format_entry(entry))

        if "ERROR" in entry:
            errors.append(_format_entry(entry))

        if "WARNING" in entry:
            warnings.append(_format_entry(entry))

    if fatalities or errors or warnings:
        logger.info(f"Preparing mail report...")
        reports = list()

        if fatalities:
            reports.append(
                "<strong>The following fatalities have been detected:</strong><br>"
            )
            for fatality in fatalities:
                reports.append(fatality)
        reports.append("<br>")

        if errors:
            reports.append(
                "<strong>The following errors have been detected:</strong><br>"
            )
            for error in errors:
                reports.append(error)
        reports.append("<br>")

        if warnings:
            reports.append(
                "<strong>The following warnings have been detected:</strong><br>"
            )
            for warning in warnings:
                reports.append(warning)

        report = "\n".join(reports)
        return True, report

    report = "<strong>No issues were detected in log during time frame.</strong>\n"
    return True, report
