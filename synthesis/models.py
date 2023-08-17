# Django imports
from django.conf import settings
from django.db import models

# General imports
import logging
from typing import Optional, Tuple

# Folder management and command line tools
from pathlib import Path
import shutil
import subprocess


class Project:
    """
    Saves all data user provided about the project and synthesizes it.
    """
    def __init__(self, cleaned_form_input: dict, session_key: str) -> None:
        self.session_key = session_key
        self.name: str = cleaned_form_input["project_name"]
        self.ipa_input: str = cleaned_form_input["ipa_input"]
        self.model: str = cleaned_form_input["model"]
        self.voice: str = cleaned_form_input["voice"]
        self.sentence: int = int(cleaned_form_input["sentence"])

        self.tools_dir_path: Path = Path(settings.STATIC_ROOT) / "tools"
        self.project_dir_path: Path = Path(settings.MEDIA_ROOT) / self.session_key
        self.input_file_path: Path = self.project_dir_path / "ipa_input.txt"
        self.tacotron_checkpoint_file_path: Path = self.tools_dir_path / "tacotron.pt"
        self.waveglow_checkpoint_file_path: Path = self.tools_dir_path / "waveglow.pt"


    def synthesize(self) -> bool:
        """
        Uses user's IPA input and settings to generate an audio file with synthesised speech.
        """      
        def _get_project_directory() -> bool:
            """
            Prepares a new directory for the project.
            """
            try:
                if self.project_dir_path.exists():
                    shutil.rmtree(self.project_dir_path)
                self.project_dir_path.mkdir(parents=True, exist_ok=True)
            except:
                return False
            return True
        

        def _create_file_for_synthesis() -> Tuple[bool, Optional[str]]:
            """
            Creates a file with the user's IPA input that is necessary for the synthesis.

            Returns True if succeeds, otherwise False and the error message.
            """
            try:
                with open(self.input_file_path, "w") as file:
                    file.write(self.ipa_input)
            except Exception as e:
                logger.error(f"Error during creating input file for synthesis: {e}")
                return False, str(e)
            return True, None


        def _create_mel_spectrogram() -> Tuple[bool, Optional[str]]:
            """
            Synthesizes the IPA input into a mel-spectrogram using "tacotron-cli synthesize" command
            with a command-line interface for Tacotron.

            Returns True if succeeds, otherwise False and the error message.
            """
            cmd_synthesize_tacotron = f"tacotron-cli synthesize '{self.tacotron_checkpoint_file_path}' '{self.input_file_path}' --custom-seed 1111 --sep '|' -out '{self.project_dir_path}'"
            try:
                subprocess.run(cmd_synthesize_tacotron, shell=True, check=True, timeout=300)
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
            """
            cmd_synthesize_waveglow = f"waveglow-cli synthesize '{self.waveglow_checkpoint_file_path}' '{self.project_dir_path}' -o --custom-seed 1111 --denoiser-strength 0.0005 --sigma 1.0"
            try:
                subprocess.run(cmd_synthesize_waveglow, shell=True, check=True, timeout=300)
            except subprocess.TimeoutExpired:
                return False, "Subprocess timed out."
            except subprocess.CalledProcessError as e:
                return False, str(e)
            except Exception as e:
                return False, str(e)
            return True, None

        if not _get_project_directory():
            return False

        logger = logging.getLogger('django')
        logger.info(f"with session key {self.session_key}: Created directories for a new project.")

        success, error_message = _create_file_for_synthesis()
        if not success:
            logger.error(f"with session key {self.session_key}: Error during creating input file for synthesis: {error_message}")
            return False
        logger.info(f"with session key {self.session_key}: Created input file for synthesis.")

        success, error_message = _create_mel_spectrogram()
        if not success:
            logger.error(f"with session key {self.session_key}: Error during Tacotron synthesis: {error_message}")
            return False
        logger.info(f"with session key {self.session_key}: Finished processing project with Tacotron.")

        success, error_message = _create_audio_files()
        if not success:
            logger.error(f"with session key {self.session_key}: Error during Waveglow synthesis: {error_message}")
            return False
        logger.info(f"with session key {self.session_key}: Finished processing project with Waveglow.")

        logger.info(f"with session key {self.session_key}: Synthesis done.")
        return True