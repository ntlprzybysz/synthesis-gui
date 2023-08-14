from django.conf import settings
from django.shortcuts import render

from .forms import InputForm
from .models import Project

from .tasks import mock_action

def with_celery(request):
    res = mock_action.delay()
    form = InputForm()
    return render(request, "home.html", {"form": form})

def show_home(request):
    if request.method == "POST":
        form = InputForm(request.POST)
        if form.is_valid(): # required fields filled in properly
            request.session.save()  # force session key generation
            session_key = request.session.session_key
            project = Project(form.cleaned_data, session_key)

            if project.synthesize():
                audio_url = settings.MEDIA_URL + session_key + "/1-1.npy.wav"
                return render(request, "synthesized.html", {"form": form, "audio_url": audio_url})
            return render(request, "home.html", {"form": form})

    else:
        form = InputForm()

    return render(request, "home.html", {"form": form})


def show_about(request):
    return render(request, "about.html")


def show_help(request):
    return render(request, "help.html")