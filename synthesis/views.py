from django.conf import settings
from django.shortcuts import render
import logging

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
    logger = logging.getLogger("django")

    if request.method == "POST":
        form = InputForm(request.POST)
        logger.info(f"Received form.")

        if form.is_valid():
            logger.info(f"Form validated, submitting for processing.")

            request.session.save()  # force session key generation
            session_key = request.session.session_key
            project = Project(form.cleaned_data, session_key)
            logger.info(f"Created new project.")

            if project.synthesize():
                logger.info(f"Returning download page.")
                audio_url = settings.MEDIA_URL + session_key + "/1-1.npy.wav"
                return render(
                    request,
                    "synthesis_success.html",
                    {"form": form, "audio_url": audio_url},
                )

            else:
                logger.error(f"Failed synthesis, returning synthesis_failed.html.")
                return render(request, "synthesis_failed.html")

        else:
            logger.error(f"Failed validation of form, home.html returned.")
            return render(request, "home.html", {"form": form})

    else:
        form = InputForm()
        return render(request, "home.html", {"form": form})


def show_about(request):
    return render(request, "about.html")


def show_help(request):
    return render(request, "help.html")


def show_404(request, exception):
    logger = logging.getLogger("django")
    logger.warning(f"404 page returned.")
    return render(request, "404.html", {}, status=404)


def show_500(request, exception=None):
    logger = logging.getLogger("django")
    logger.warning(f"500 page returned.")
    return render(request, "500.html", {}, status=500)


def show_403(request, exception=None):
    logger = logging.getLogger("django")
    logger.warning(f"403 page returned.")
    return render(request, "403.html", {}, status=403)


def show_400(request, exception=None):
    logger = logging.getLogger("django")
    logger.warning(f"400 page returned.")
    return render(request, "400.html", {}, status=400)
