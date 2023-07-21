# Django imports
from django.conf import settings
from django.db import models

# General imports
import logging

# Folder management and command line tools
from pathlib import Path
import shutil
import subprocess


'''
# Tacotron & Waveglow
from argparse import Namespace
from ordered_set import OrderedSet
from tacotron_cli.defaults import DEFAULT_DEVICE, DEFAULT_MAX_DECODER_STEPS
from tacotron_cli.inference import synthesize_ns
from typing import Optional
from waveglow_cli.defaults import DEFAULT_DENOISER_STRENGTH, DEFAULT_SIGMA
from waveglow_cli.inference_v2 import infer_mels

class TacotronObject:
    """
    Creates a Namespace object that is normally created in tacotron by parsing
    command line arguments. It is used for synthesizing lines from a file.
    """
    def __init__(self, checkpoint_path, input_path, separator="", encoding="UTF-8", custom_speaker=None, \
                 custom_lines=OrderedSet(), max_decoder_steps=DEFAULT_MAX_DECODER_STEPS, custom_seed=None, \
                 paragraph_dirs=True, include_stats=True, device=DEFAULT_DEVICE, hparams=None, prepend="", \
                 append="", output_dir=None, overwrite=True):
        self.checkpoint_path: Path = checkpoint_path
        self.input_path: Path = input_path
        self.separator: str = separator
        self.encoding: str = encoding
        self.custom_speaker: Optional[str] = custom_speaker     # Str?
        self.custom_lines: Optional(OrderedSet) = custom_lines
        self.max_decoder_steps: int = max_decoder_steps
        self.custom_seed: Optional[int] = custom_seed
        self.paragraph_dirs: bool = paragraph_dirs
        self.include_stats: bool = include_stats
        self.device: str = device
        self.hparams: Optional[str] = hparams   # Str?
        self.prepend: str = prepend
        self.append: str = append
        self.output_dir: Optional[Path] = output_dir
        self.overwrite: bool = overwrite

    def create_namespace_and_synthesize(self):
        ns = Namespace(
            checkpoint = self.checkpoint_path,
            text = self.input_path,
            sep = self.separator,
            encoding = self.encoding,
            custom_speaker = self.custom_speaker,
            custom_lines = self.custom_lines,
            max_decoder_steps = self.max_decoder_steps,
            custom_seed = self.custom_seed,
            paragraph_directories = self.paragraph_dirs,
            include_stats = self.include_stats,
            device = self.device,
            custom_hparams = self.hparams,
            prepend = self.prepend,
            append = self.append,
            output_directory = self.output_dir,
            overwrite = self.overwrite,
            )
        return synthesize_ns(ns)


class WaveglowObject:
    """
    Creates a Namespace object that is normally created by waveglow by parsing
    command line arguments. It is used for synthesizing mel-spectrograms into an audio signal.
    """
    def __init__(self, checkpoint_path, spectrogram_path, sigma=DEFAULT_SIGMA, \
                 denoiser_strength=DEFAULT_DENOISER_STRENGTH, device=DEFAULT_DEVICE, \
                 hparams=None, custom_seed=None, include_stats=True, output_dir=None, overwrite=True) -> None:
        self.checkpoint: Path = checkpoint_path
        self.folder: Path = spectrogram_path
        self.sigma: float = sigma
        self.denoiser_strength: float = denoiser_strength
        self.device: str = device
        self.custom_hparams: Optional[str] = hparams   # Str?
        self.custom_seed: Optional[int] = custom_seed
        self.include_stats: bool = include_stats
        self.output_directory: Optional[Path] = output_dir
        self.overwrite: bool = overwrite

    def create_namespace_and_synthesize(self):
        ns = Namespace(
        checkpoint = self.checkpoint,
        folder = self.folder,
        sigma = self.sigma,
        denoiser_strength = self.denoiser_strength,
        device = self.device,
        custom_hparams = self.custom_hparams,
        custom_seed = self.custom_seed,
        include_stats = self.include_stats,
        outpur_directory = self.output_directory,
        overwrite = self.overwrite,
        )
        return infer_mels(ns)
'''

class Project:
    """
    Saves all data user provided about the project and provide a method to synthesize it.
    """
    def __init__(self, cleaned_form_input: dict, session_key: str) -> None:
        self.session_key = session_key
        self.name: str = cleaned_form_input["project_name"]
        #self.text_input: str = cleaned_form_input["text_input"]
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


        def _get_project_logger() -> logging.Logger:
            """
            Gets a logger for the project to monitor its progress.
            """
            log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            log_file_path = self.project_dir_path / "project.log"

            logger = logging.getLogger(__name__)
            logger.setLevel(logging.INFO)

            formatter = logging.Formatter(log_format)

            file_handler = logging.FileHandler(log_file_path)
            file_handler.setLevel(logging.INFO)
            file_handler.setFormatter(formatter)

            logger.addHandler(file_handler)

            return logger


        if not _get_project_directory():
            return False

        logger = _get_project_logger()
        if logger is None:
            return False
        logger.info(f"Created directories for a new project instance.")

        try:
            with open(self.input_file_path, "w") as file:
                file.write(self.ipa_input)
        except Exception as e:
            logger.error(f"Error during creating input file for synthesis: {e}")
            return False
        logger.info(f"Created input file for synthesis.")

        # Tacotron with subprocess
        cmd_synthesize_tacotron = f"tacotron-cli synthesize '{self.tacotron_checkpoint_file_path}' '{self.input_file_path}' --custom-seed 1111 --sep '|' -out '{self.project_dir_path}'"
        try:
            subprocess.run(cmd_synthesize_tacotron, shell=True, check=True)
        except Exception as e:
            logger.error(f"Error during Tacotron synthesis: {e}")
            return False
        logger.info(f"Finished processing project with Tacotron.")

        """
        # Tacotron without subprocess
        synthesize_tacotron = TacotronObject(checkpoint_path=tacotron_checkpoint_file_path, input_path=input_file_path, \
                                                    separator="|", custom_seed=1111, output_dir=project_dir_path)
        synthesize_tacotron.create_namespace_and_synthesize()
        """

        # Waveglow with subprocess
        cmd_synthesize_waveglow = f"waveglow-cli synthesize '{self.waveglow_checkpoint_file_path}' '{self.project_dir_path}' -o --custom-seed 1111 --denoiser-strength 0.0005 --sigma 1.0"
        try:
            subprocess.run(cmd_synthesize_waveglow, shell=True, check=True)
        except Exception as e:
            logger.error(f"Error during Waveglow synthesis: {e}")
            return False
        logger.info(f"Finished processing project with Waveglow.")
      
        """
        # Waveglow without subprocess
        # Checkpoint couldn't be loaded!
        synthesize_waveglow = WaveglowObject(checkpoint_path=waveglow_checkpoint_file_path, spectrogram_path=project_dir_path, \
                                                    overwrite=True, custom_seed=1111, denoiser_strength=0.0005, sigma=1.0, \
                                                    output_dir=project_dir_path)
        synthesize_waveglow.create_namespace_and_synthesize()
        """
        
        """
        # Cleaning up resulting folders
        # <index>-<speaker_id>-<sentence_id>
        wav_file_path = project_dir_path / "1-1-1" / "1-1.npy.wav"
        shutil.move(wav_file_path, project_dir_path / "1-1.npy.wav")

        subfolder_path = project_dir_path / "1-1-1"
        if subfolder_path.is_dir():
            shutil.rmtree(subfolder_path)
        """

        logger.info(f"Synthesis done.")
        return True