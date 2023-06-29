from django.db import models

class Project:
    """
    Saves all data user provided about the project and provide a method to synthesize it.
    """
    def __init__(self, cleaned_form_input: dict) -> None:
        self.name: str = cleaned_form_input["project_name"]
        self.text_input: str = cleaned_form_input["text_input"]
        self.ipa_input: str = cleaned_form_input["ipa_input"]
        self.model: str = cleaned_form_input["model"]
        self.voice: str = cleaned_form_input["voice"]
        self.sentence: int = int(cleaned_form_input["sentence"])

    def synthesise(self):  # -> audio_file:
        """
        Uses user's IPA input and settings to generate an audio file with synthesised sentence.
        """
        pass
