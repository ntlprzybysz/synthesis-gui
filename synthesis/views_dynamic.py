from django.conf import settings
from django.shortcuts import render
import logging

from .forms import InputFormLJSpeech11
from .tasks import synthesize_with_celery

from django.http import JsonResponse
from .tasks_utils import check_task_status


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
        logger.info(f"session key {session_key} Sending data to check task status.")
        progress = check_task_status(session_key)
        return JsonResponse({"progress": progress})

    else:
        logger.error(
            f"Failed to deliver payload of XMLHttpRequest from updateProgress() to views.py. \
                     Session key from cookie: {request.COOKIES.get('sessionid')}."
        )
        return JsonResponse({"progress": -1})


def get_model_data(request) -> JsonResponse:
    """
    Responds to the AJAX request, retrieves the voices and symbols based on the selected model, 
    and returns the data in JSON format.
    """
    if request.is_ajax() and request.method == 'GET':
        selected_model = request.GET.get('model')

        if selected_model == "LJSPEECH11":
            voices = ["Linda Johnson"]
            symbols = ["!", "\"", "'", "(", ")", ",", "-", ".", ":", ";", "?", "S", "S", "S", "S", "[", "]", "a", "a", "b", "d", "d", "e", "f", "h", "i", "j", "k", "l", "m", "n", "o", "p", "r", "s", "t", "t", "u", "v", "w", "z", "æ", "ð", "ŋ", "ɑ", "ɔ", "ɔ", "ɔ", "ə", "ə", "ɛ", "ɛ", "ɡ", "ɪ", "ɪ", "ʃ", "ʊ", "ʊ", "ʌ", "ʌ", "ʒ", "θ", "—",
                    "-", "0", "1", "2",
                    "-", "ː", "ˑ", "˘"]
        else:
            voices = []
            symbols = []

        data = {
            'voices': voices,
            'symbols': symbols,
        }
        return JsonResponse(data)
    return JsonResponse({'error': 'Invalid request'})


def show_home(request):
    """
    Renders the maintenance page if the MAINTENANCE_MODE is on in settings.py.
    Otherwise, renders the home page with a form for submitting synthesis requests if the request method is GET.
    If the request method is POST, it validates the form data and queues it for processing.
    """
    logger = logging.getLogger("django")

    if settings.MAINTENANCE_MODE:
        logger.info(f"Returned maintenance.html for path: {request.path}")
        return render(request, "maintenance.html")

    if request.method == "POST":
        form = InputFormLJSpeech11(request.POST)
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
                return render(
                    request,
                    "home.html",
                    {
                        "form": form,
                        "task_queued": True,
                        "session_key": session_key,
                        "audio_url": audio_url,
                    },
                )

            logger.error(f"Data couldn't be submitted for processing.")
            return render(
                request,
                "home.html",
                {
                    "form": form,
                    "task_queued": False,
                    "session_key": "_failed",
                    "audio_url": "_null",
                },
            )

        else:
            logger.error(f"Failed validation of form.")
            return render(
                request,
                "home.html",
                {
                    "form": form,
                    "task_queued": False,
                    "session_key": "_failed",
                    "audio_url": "_null",
                },
            )

    else:
        form = InputFormLJSpeech11()
        return render(
            request,
            "home.html",
            {
                "form": form,
                "task_queued": False,
                "session_key": "_null",
                "audio_url": "_null",
            },
        )


def show_about(request):
    """
    Renders the maintenance page if the MAINTENANCE_MODE is on in settings.py.
    Otherwise, renders the about page.
    """
    logger = logging.getLogger("django")

    if settings.MAINTENANCE_MODE:
        logger.info(f"Returned maintenance.html for path: {request.path}")
        return render(request, "maintenance.html")
    
    return render(request, "about.html")


def show_help(request):
    """
    Renders the maintenance page if the MAINTENANCE_MODE is on in settings.py.
    Otherwise, renders the help page.
    """
    logger = logging.getLogger("django")

    if settings.MAINTENANCE_MODE:
        logger.info(f"Returned maintenance.html for path: {request.path}")
        return render(request, "maintenance.html")
    
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
