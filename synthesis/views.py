from django.conf import settings
from django.shortcuts import render

from .forms import InputForm
from .models import Project

# tests celery
from .tasks import go_to_sleep

def with_celery(request):
    task = go_to_sleep.delay(5)
    form = InputForm()
    return render(request, "home_celery.html", {"form": form, "task_id": task.task_id})
# /tests celery

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
            
            # TODO error page
            return render(request, "home.html", {"form": form})

    else:
        form = InputForm()

    return render(request, "home.html", {"form": form})


def show_about(request):
    return render(request, "about.html")


def show_help(request):
    return render(request, "help.html")


# Custom error pages
def show_404(request, exception):
    return render(request, "404.html", {}, status=404)

def show_500(request, exception=None):
    return render(request, "500.html", {}, status=500)

def show_403(request, exception=None):
    return render(request, "403.html", {}, status=403)

def show_400(request, exception=None):
    return render(request, "400.html", {}, status=400)