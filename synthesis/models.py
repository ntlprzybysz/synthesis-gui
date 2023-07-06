# Django imports
from django.conf import settings
from django.db import models

# Folder management and command line tools
import shutil
import subprocess

# Tacotron & Waveglow
from argparse import Namespace
from ordered_set import OrderedSet
from pathlib import Path
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
        return infer_mels(ns)


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
        return synthesize_ns(ns)
    
class CustomNamespace:
    """
    Creates a Namespace object that is normally created within the tool from command line arguments.
    """
    def __init__(self, checkpoint_path, input_path, separator="", encoding="UTF-8", custom_speaker=None, \
                 custom_lines=OrderedSet(), max_decoder_steps=DEFAULT_MAX_DECODER_STEPS, custom_seed=None, \
                 paragraph_dirs=True, include_stats=True, device=DEFAULT_DEVICE, hparams=None, prepend="", append="", \
                 output_dir=None, overwrite=True):
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

    def create_namespace(self):
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

class Project:
    """
    Saves all data user provided about the project and provide a method to synthesize it.
    """
    def __init__(self, cleaned_form_input: dict, session_key) -> None:
        self.session_key = session_key
        self.name: str = cleaned_form_input["project_name"]
        self.text_input: str = cleaned_form_input["text_input"]
        self.ipa_input: str = cleaned_form_input["ipa_input"]
        self.model: str = cleaned_form_input["model"]
        self.voice: str = cleaned_form_input["voice"]
        self.sentence: int = int(cleaned_form_input["sentence"])


    def synthesize(self):  # -> audio_file:
        """
        Uses user's IPA input and settings to generate an audio file with synthesised sentence.
        """
        # First version without subprocess
        tools_dir = f"{settings.STATIC_ROOT}/tools"
        project_dir = f"{settings.MEDIA_ROOT}/{self.session_key}"
        project_dir = Path(project_dir)
        input_file_path = f"{project_dir}/ipa_input.txt"
        input_file_path = Path(input_file_path)
        checkpoint_path = f"{tools_dir}/tacotron.pt"
        checkpoint_path = Path(checkpoint_path)
        input_path = f"{project_dir}/ipa_input.txt"
        input_path = Path(input_path)
        output_dir = f"{project_dir}"
        output_dir = Path(output_dir)

        cmd_clear_project_dir = f"rm -rf {project_dir}"
        subprocess.run(cmd_clear_project_dir, shell=True, check=True)
        if project_dir.exists():
            shutil.rmtree(project_dir)
        project_dir.mkdir(parents=True, exist_ok=True)

        cmd_create_project_dir = f"mkdir -p {project_dir}"
        subprocess.run(cmd_create_project_dir, shell=True, check=True)

        input_file_path = f"{project_dir}/ipa_input.txt"
        with open(input_file_path, "w") as file:
            file.write(self.ipa_input)

        synthesize_tacotron = CustomNamespace(checkpoint_path=checkpoint_path, input_path=input_path, \
                                              separator="|", custom_seed=1111, output_dir=output_dir)
        synthesize_tacotron.create_namespace()

        cmd_synthesize_waveglow = f"waveglow-cli synthesize '{tools_dir}/waveglow.pt' '{project_dir}' -o --custom-seed 1111 --denoiser-strength 0.0005 --sigma 1.0"
        subprocess.run(cmd_synthesize_waveglow, shell=True, check=True)

        """
        tools_dir_path = Path(settings.STATIC_ROOT) / "tools"
        project_dir_path = Path(settings.MEDIA_ROOT) / self.session_key
        input_file_path = project_dir_path / "ipa_input.txt"
        tacotron_checkpoint_file_path = tools_dir_path / "tacotron.pt"
        waveglow_checkpoint_file_path = tools_dir_path / "waveglow.pt"

        if project_dir_path.exists():
            shutil.rmtree(project_dir_path)
        project_dir_path.mkdir(parents=True, exist_ok=True)

        with open(input_file_path, "w") as file:
            file.write(self.ipa_input)
        """

        """
        # Tacotron with subprocess
        cmd_synthesize_tacotron = f"tacotron-cli synthesize '{tacotron_checkpoint_file_path}' '{input_file_path}' --custom-seed 1111 --sep '|' -out '{project_dir_path}'"
        subprocess.run(cmd_synthesize_tacotron, shell=True, check=True)
        """

        """
        # Tacotron without subprocess
        synthesize_tacotron = TacotronObject(checkpoint_path=tacotron_checkpoint_file_path, input_path=input_file_path, \
                                                    separator="|", custom_seed=1111, output_dir=project_dir_path)
        synthesize_tacotron.create_namespace_and_synthesize()
        """

        """
        # Waveglow with subprocess
        cmd_synthesize_waveglow = f"waveglow-cli synthesize '{waveglow_checkpoint_file_path}' '{project_dir_path}' -o --custom-seed 1111 --denoiser-strength 0.0005 --sigma 1.0"
        subprocess.run(cmd_synthesize_waveglow, shell=True, check=True)
        """
      
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