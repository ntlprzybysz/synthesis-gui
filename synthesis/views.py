from django.shortcuts import render
#from django.http import HttpResponse

from .forms import InputForm


def show_home(request):
    if request.method == "POST":
        form = InputForm(request.POST)
        if form.is_valid(): # required fields filled in properly
            project = start_project(form.cleaned_data)
    else:
        form = InputForm()

    return render(request, "home.html", {"form": form})


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


def start_project(cleaned_form_input: dict) -> "Project":
    """
    Creates a Project object from the data sent via the form.
    """
    project = Project()
    project.name = cleaned_form_input["project_name"]
    project.text_input = cleaned_form_input["text_input"]
    project.ipa_input = cleaned_form_input["ipa_input"]
    project.settings.model = cleaned_form_input["model"]
    project.settings.voice = cleaned_form_input["voice"]
    project.settings.sentence = int(cleaned_form_input["sentence"])

    return project


def synthesise(ipa_input: str, settings: "Settings"):  # -> audio_file:
    """
    Uses user's IPA input and settings to generate an audio file with synthesised sentence.
    """
    pass