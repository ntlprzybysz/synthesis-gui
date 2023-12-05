import logging
import os
import shutil
import subprocess
from pathlib import Path
from typing import Optional, Tuple

from django.conf import settings


class Project:
    """
    Saves all data user provided about the project and synthesizes it.
    """
    def __init__(self, cleaned_form_input: dict, model: str, session_key: str) -> None:
        self.model: str = model
        self.session_key = session_key
        self.name: str = cleaned_form_input["project_name"]
        self.ipa_input: str = cleaned_form_input["ipa_input"]
        self._set_voice(cleaned_form_input["voice"])
        self._set_paths()
        self._set_checkpoints()
    
    def _set_voice(self, voice: str) -> None:
        """
        Sets voice according to the given model. If the given model and the voice don't match,
        raises ValueError.
        """
        if self.model == "101000-with-markers" or self.model == "101000-without-markers":
            if voice == "Linda Johnson":
                self.voice = voice
        elif self.model == "1051-IPA-3000" and voice == "1051":
            self.voice = voice
        elif self.model == "6208-IPA-3500" and voice == "6208 (sdp)":
            self.voice = voice
        elif self.model == "103500-with-markers" or self.model == "103500-without-markers":
            if voice in ["A11", "A12", "A13", "A14", "A19", "A2", "A22", "A23", "A32", "A33", "A34", "A35", "A36", "A4", "A5", "A6", "A7", "A8", "A9", "B11", "B12", "B15", "B2", "B21", "B22", "B31", "B32", "B33", "B34", "B4", "B6", "B7", "B8", "C12", "C13", "C14", "C17", "C18", "C19", "C2", "C20", "C21", "C22", "C23", "C31", "C32", "C4", "C6", "C7", "C8", "D11", "D12", "D13", "D21", "D31", "D32", "D4", "D6", "D7", "D8"]:
                self.voice = voice
        elif self.model == "MagK-IPA-6400" and voice == "6446-MagK (sdp)":
            self.voice = voice
        elif self.model == "TZ-IPA-6000" and voice == "6450 (sdp)":
            self.voice = voice
        else:
            logger = logging.getLogger("django")
            logger.error(f"Got unallowed combination of model {self.model} and voice {voice}.")
            raise ValueError(f"Stopped project initialization, please see log for details.")

    def _set_paths(self) -> None:
        """
        Sets paths needed for synthesis.
        """
        self.tools_dir_path: Path = Path(settings.STATIC_ROOT) / "tools"
        self.project_dir_path: Path = Path(settings.MEDIA_ROOT) / self.session_key
        self.input_file_path: Path = self.project_dir_path / "ipa_input.txt"

    def _set_checkpoints(self) -> None:
        """
        Sets checkpoints according to the given model. If the given model doesn't match the known
        models, raises ValueError.
        """
        if self.model == "1051-IPA-3000":
            self.tacotron_checkpoint_file_path: Path = self.tools_dir_path / "tacotron" / "1051-IPA-3000.pt"
        elif self.model == "6208-IPA-3500":
            self.tacotron_checkpoint_file_path: Path = self.tools_dir_path / "tacotron" / "6208-IPA-3500.pt"
        elif self.model == "101000-with-markers":
            self.tacotron_checkpoint_file_path: Path = self.tools_dir_path / "tacotron" / "101000-with-markers.pt"
        elif self.model == "101000-without-markers":
            self.tacotron_checkpoint_file_path: Path = self.tools_dir_path / "tacotron" / "101000-without-markers.pt"
        elif self.model == "103500-with-markers":
            self.tacotron_checkpoint_file_path: Path = self.tools_dir_path / "tacotron" / "103500-with-markers.pt"
        elif self.model == "103500-without-markers":
            self.tacotron_checkpoint_file_path: Path = self.tools_dir_path / "tacotron" / "103500-without-markers.pt"
        elif self.model == "MagK-IPA-6400":
            self.tacotron_checkpoint_file_path: Path = self.tools_dir_path / "tacotron" / "MagK-IPA-6400.pt"
        elif self.model == "TZ-IPA-6000":
            self.tacotron_checkpoint_file_path: Path = self.tools_dir_path / "tacotron" / "TZ-IPA-6000.pt"
        else:
            logger = logging.getLogger("django")
            logger.error(f"Got unknown model {self.model}.")
            raise ValueError(f"Stopped project initialization, please see log for details.")
        
        self.waveglow_checkpoint_file_path: Path = self.tools_dir_path / "waveglow" / "LJS-v3-580000.pt"

    def synthesize(self) -> bool:
        """
        Uses user's IPA input and settings to generate an audio file with synthesised speech.
        """
        def _get_project_directory() -> Tuple[bool, Optional[str]]:
            """
            Prepares a new directory for the project.
            """
            try:
                if self.project_dir_path.exists():
                    shutil.rmtree(self.project_dir_path)
                self.project_dir_path.mkdir(parents=True, exist_ok=True)
            except Exception as e:
                return False, str(e)
            return True, None

        def _create_file_for_synthesis() -> Tuple[bool, Optional[str]]:
            """
            Creates a file with the user's IPA input that is necessary for the synthesis.

            Returns True if succeeds, otherwise False and the error message.
            """
            try:
                with open(self.input_file_path, "w") as file:
                    file.write(self.ipa_input)
            except Exception as e:
                return False, str(e)
            return True, None

        def _create_mel_spectrogram() -> Tuple[bool, Optional[str]]:
            """
            Synthesizes the IPA input into a mel-spectrogram using "tacotron-cli synthesize" command
            with a command-line interface for Tacotron.

            Returns True if succeeds, otherwise False and the error message.

            Note:
            The first "if" makes sure the correct environment is used if the command is meant to run
            as a Celery task when Celery works as a Deamon. For it to work, the file
            /etc/systemd/system/celery.service should include the path variable:
            # Environment=TACOTRON_CLI_PATH=/path/to/virtualenv/bin/tacotron-cli
            """
            tacotron_cli_path = os.environ.get("TACOTRON_CLI_PATH")
            if tacotron_cli_path:
                cmd_synthesize_tacotron = f"{tacotron_cli_path} synthesize '{self.tacotron_checkpoint_file_path}' '{self.input_file_path}' --custom-speaker '{self.voice}' --custom-seed 1111 --sep '|' -out '{self.project_dir_path}'"
            else:
                cmd_synthesize_tacotron = f"tacotron-cli synthesize '{self.tacotron_checkpoint_file_path}' '{self.input_file_path}' --custom-speaker '{self.voice}' --custom-seed 1111 --sep '|' -out '{self.project_dir_path}'"

            try:
                subprocess.run(
                    cmd_synthesize_tacotron, shell=True, check=True, timeout=300
                )
            except subprocess.TimeoutExpired:
                return False, "Subprocess timed out."
            except subprocess.CalledProcessError as e:
                return False, str(e)
            except Exception as e:
                return False, str(e)
            return True, None

        def _create_audio_files() -> Tuple[bool, Optional[str]]:
            """
            Synthesizes the mel-spectrogram into audio files using "waveglow-cli synthesize" command
            with a command-line interface for Waveglow.

            Returns True if succeeds, otherwise False and the error message.

            Note:
            The first "if" makes sure the correct environment is used if the command is meant to run
            as a Celery task when Celery works as a Deamon. For it to work, the file
            /etc/systemd/system/celery.service should include the path variable:
            # Environment=WAVEGLOW_CLI_PATH=/path/to/virtualenv/bin/waveglow-cli
            """
            waveglow_cli_path = os.environ.get("WAVEGLOW_CLI_PATH")
            if waveglow_cli_path:
                cmd_synthesize_waveglow = f"{waveglow_cli_path} synthesize '{self.waveglow_checkpoint_file_path}' '{self.project_dir_path}' -o --custom-seed 1111 --denoiser-strength 0.0005 --sigma 1.0"
            else:
                cmd_synthesize_waveglow = f"waveglow-cli synthesize '{self.waveglow_checkpoint_file_path}' '{self.project_dir_path}' -o --custom-seed 1111 --denoiser-strength 0.0005 --sigma 1.0"

            try:
                subprocess.run(
                    cmd_synthesize_waveglow, shell=True, check=True, timeout=300
                )
            except subprocess.TimeoutExpired:
                return False, "Subprocess timed out."
            except subprocess.CalledProcessError as e:
                return False, str(e)
            except Exception as e:
                return False, str(e)
            return True, None


        logger = logging.getLogger("django")

        success, error_message = _get_project_directory()
        if not success:
            logger.error(
                f"session key {self.session_key} Failed to create a project directory: {error_message}"
            )
            return False
        logger.info(f"session key {self.session_key} Created a project directory.")

        success, error_message = _create_file_for_synthesis()
        if not success:
            logger.error(
                f"session key {self.session_key} Error during creating input file for synthesis: {error_message}"
            )
            return False
        logger.info(f"session key {self.session_key} Created input file for synthesis.")

        success, error_message = _create_mel_spectrogram()
        if not success:
            logger.error(
                f"session key {self.session_key} Error during Tacotron synthesis: {error_message}"
            )
            return False
        logger.info(
            f"session key {self.session_key} Finished processing project with Tacotron."
        )

        success, error_message = _create_audio_files()
        if not success:
            logger.error(
                f"session key {self.session_key} Error during Waveglow synthesis: {error_message}"
            )
            return False
        logger.info(
            f"session key {self.session_key} Finished processing project with Waveglow."
        )

        logger.info(f"session key {self.session_key} Synthesis done.")
        return True
