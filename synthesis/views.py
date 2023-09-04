from django.conf import settings
from django.shortcuts import render
import logging

from .forms import InputForm
from .tasks import synthesize_with_celery

from django.http import JsonResponse
from .tasks_utils import check_task_status

def task_status(request):
    logger = logging.getLogger("django")

    session_key = request.POST.get('session_key')
    audio_url = request.POST.get('audio_url')

    if session_key and audio_url:
        logger.info(f"session key {session_key} Sending data to check task status.")

        progress = check_task_status(session_key, audio_url)
        return JsonResponse({'progress': progress})
    
    else:
        logger.error(f"Failed to deliver payload of XMLHttpRequest from updateProgress() to views.py. Session key from cookie: {request.COOKIES.get('sessionid')}.")
        return JsonResponse({'progress': -1})


def show_home(request):
    logger = logging.getLogger("django")
    logger.info(f"Returned maintenance.html for path: {request.path}")
    return render(request, "maintenance.html")
"""


def show_home(request):
    logger = logging.getLogger("django")

    if request.method == "POST":
        form = InputForm(request.POST)
        logger.info(f"Received form.")

        if form.is_valid():
            logger.info(f"Form validated, submitting data for processing.")

            if request.session.session_key is None:
                request.session.save()
            session_key = request.session.session_key

            task = synthesize_with_celery.delay(form.cleaned_data, session_key)
                        
            if task.status == "PENDING" or task.status == "STARTED":
                logger.info(f"Data submitted for processing.")
                audio_url = settings.MEDIA_URL + session_key + "/1-1.npy.wav"
                return render(request, "home.html", {"form": form, "task_queued": True, "session_key": session_key, "audio_url": audio_url})

            logger.error(f"Data couldn't be submitted for processing.")
            return render(request, "home.html", {"form": form, "task_queued": False, "session_key": "_failed"})

        else:
            logger.error(f"Failed validation of form, home.html returned.")
            return render(request, "home.html", {"form": form, "task_queued": False,  "session_key": "_failed"})

    else:
        form = InputForm()
        return render(request, "home.html", {"form": form, "task_queued": False})
"""

"""
# without Celery

from .models import Project

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
                return render(request, "synthesis_success.html", {"form": form, "audio_url": audio_url},)

            else:
                logger.error(f"Failed synthesis, returning synthesis_failed.html.")
                return render(request, "synthesis_failed.html")

        else:
            logger.error(f"Failed validation of form, home.html returned.")
            return render(request, "home.html", {"form": form})

    else:
        form = InputForm()
        return render(request, "home.html", {"form": form})
"""

def show_about(request):
    return render(request, "about.html")


def show_help(request):
    return render(request, "help.html")


def show_404(request, exception):
    logger = logging.getLogger("django")
    logger.warning(f"Regular 404 page returned for path: {request.path}")
    return render(request, "404.html", {}, status=404)


def show_500(request, exception=None):
    logger = logging.getLogger("django")
    logger.warning(f"500 page returned for path: {request.path}.")
    return render(request, "500.html", {}, status=500)


def show_403(request, exception=None):
    logger = logging.getLogger("django")
    logger.warning(f"403 page returned for path: {request.path}.")
    return render(request, "403.html", {}, status=403)


def show_400(request, exception=None):
    logger = logging.getLogger("django")
    logger.warning(f"400 page returned for path: {request.path}.")
    return render(request, "400.html", {}, status=400)
