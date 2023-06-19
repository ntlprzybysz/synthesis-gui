from django.shortcuts import render
from django.http import HttpResponse


def show_home(request):
    return render(request, "home.html")


def show_about(request):
    return render(request, "about.html")


def show_help(request):
    return render(request, "help.html")


class Settings:
    """
    Saves an object with all user settings needed for synthesis.
    """

    def __init__(self):
        self.model: str = "LJSpeech 1.1"
        self.voice: str = "Linda Johnson"
        self.sentence: int = 0


class Project:
    """
    Saves all data user provided about the poject.
    """

    def __init__(self):
        self.name = "Example project"
        self.text_input: str = ""
        self.ipa_input: str = ""
        self.settings: "Settings" = Settings()


def insert_character_to_ipa_field(button_value):
    """
    Inserts a character selected from the chart into the IPA text field on the cursor position.
    """
    pass


def synthesise(ipa_input: str, settings: "Settings"):  # -> audio_file:
    """
    Uses user's IPA input and settings to generate an audio file with synthesised sentence.
    """
    pass


def save_text(self, text_input: str):  # -> project_file:
    """
    Saves user's text input to a project file.
    """
    project = Project()
    # validate, strip
    project.text_input = text_input
    # save to file, output file


def save_ipa(self, ipa_input: str):  # -> project_file:
    """
    Saves user's IPA input to a project file.
    """
    project = Project()
    # validate, strip
    project.ipa_input = ipa_input
    # save to file, output file


def save_project(self, text_input: str, ipa_input: str, settings: 'Settings'):  # -> project_file:
    """
    Saves user's information about their project to a project file.
    """
    project = Project()
    # validate, strip
    project.text_input = text_input
    project.ipa_input = ipa_input
    project.settings = settings


def load_project(self, project_file) -> 'Project':
    """
    Loads user's previously saved information about their project from a project file.
    """
    pass


"""
Output files as json dictionary:
project_settings = {
		model : "LJSpeech 1.1",
		voice : “Linda Johnson”,
		sentence : 1
}

project_information = {
	text_input : “”,
	ipa_input : “”,
	settings : project_settings
}
"""
