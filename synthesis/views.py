from django.conf import settings
from django.shortcuts import render
import logging

from .forms import InputForm
from .tasks import synthesize_with_celery

from django.http import JsonResponse
from .tasks_utils import check_task_status


def check_maintenance_status(request):
    """
    Renders maintenance page if MAINTENANCE_MODE in settings.py is set to True.
    """
    if settings.MAINTENANCE_MODE:
        logger = logging.getLogger("django")
        logger.info(f"Returned maintenance.html for path: {request.path}")
        return render(request, "maintenance.html")


def task_status(request) -> JsonResponse:
    """
    Checks the status of the submitted synthesis with its session key and an audio URL.

    Returns a JSON response with the progress percentage in the format: {"progress":
    <progress_percentage>}. <progress_percentage> is a positive number if the task is
    processed and its status parsed correctly, otherwise it equals -1.
    """
    logger = logging.getLogger("django")

    session_key = request.POST.get("session_key")
    if session_key:
        logger.debug(f"session key {session_key} Sending data to check task status.")
        progress = check_task_status(session_key)
        return JsonResponse({"progress": progress})

    else:
        logger.error(
            f"Failed to deliver payload of XMLHttpRequest from updateProgress() to views.py. \
                     Session key from cookie: {request.COOKIES.get('sessionid')}."
        )
        return JsonResponse({"progress": -1})


def show_home(request):
    """
    Renders the home page with a form for submitting synthesis requests if the request method is GET.
    If the request method is POST, it validates the form data and queues it for processing.
    """
    def _handle_form(request, model, form):
        if form.is_valid():
            logger.info(f"Form validated, submitting data for processing.")
            
            if request.session.session_key is None:
                request.session.save()
            session_key = request.session.session_key

            task = synthesize_with_celery.delay(form.cleaned_data, model, session_key)

            if task.status in ["PENDING", "STARTED"]:
                logger.info(f"Data submitted for processing.")
                audio_url = settings.MEDIA_URL + session_key + "/1-1.npy.wav"
                return True, session_key, audio_url
            else:
                logger.error(f"Data couldn't be submitted for processing.")
        else:
            logger.error(f"Failed validation of form: {form.errors}.")
        return False, "_failed", "_null"

    logger = logging.getLogger("django")

    check_maintenance_status(request)

    if request.method == "POST":
        form = InputForm(request.POST)
        logger.info(f"Received form.")
        model = request.POST.get("model-select-field")
        form_valid, session_key, audio_url = _handle_form(request, model, form)
    else:
        form = InputForm()
        form_valid, session_key, audio_url = False, "_null", "_null"

    return render(
        request,
        "home.html",
        {
            "form": form,
            "task_queued": form_valid,
            "session_key": session_key,
            "audio_url": audio_url,
        },
    )


def show_about(request):
    """
    Renders the about page.
    """
    check_maintenance_status(request)
    return render(request, "about.html")


def show_help(request):
    """
    Renders the help page.
    """
    check_maintenance_status(request)
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
