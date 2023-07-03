from django.conf import settings
from django.db import models
import subprocess

class Project:
    """
    Saves all data user provided about the project and provide a method to synthesize it.
    """
    # def __init__(self, cleaned_form_input: dict, session_key) -> None:
    def __init__(self, cleaned_form_input: dict) -> None:
        #self.session_key = session_key
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
        session_key = "001"
        tools_dir = f"{settings.STATIC_ROOT}/tools"
        project_dir = f"{settings.MEDIA_ROOT}/{session_key}"

        cmd_clear_project_dir = f"rm -rf {project_dir}"
        subprocess.run(cmd_clear_project_dir, shell=True, check=True)

        cmd_create_project_dir = f"mkdir -p {project_dir}"
        subprocess.run(cmd_create_project_dir, shell=True, check=True)
        
        input_file_path = f"{project_dir}/ipa_input.txt"
        with open(input_file_path, "w") as file:
            file.write(self.ipa_input)

        cmd_synthesize_tacotron = f"tacotron-cli synthesize '{tools_dir}/tacotron.pt' '{project_dir}/ipa_input.txt' --custom-seed 1111 --sep '|' -out '{project_dir}'"
        subprocess.run(cmd_synthesize_tacotron, shell=True, check=True)
        
        cmd_synthesize_waveglow = f"waveglow-cli synthesize '{tools_dir}/waveglow.pt' '{project_dir}' -o --custom-seed 1111 --denoiser-strength 0.0005 --sigma 1.0"
        subprocess.run(cmd_synthesize_waveglow, shell=True, check=True)