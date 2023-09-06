from __future__ import absolute_import, unicode_literals

import os
from logging.config import dictConfig

from celery import Celery
from celery.signals import setup_logging
from django.conf import settings


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "synthesisgui.settings")
#settings.configure()

#SECRET_KEY = settings.SECRET_KEY

app = Celery("synthesisgui")

app.config_from_object("django.conf:settings", namespace="CELERY")


# https://siddharth-pant.medium.com/the-missing-how-to-for-celery-logging-85e21f0231de
@setup_logging.connect
def config_loggers(*args, **kwargs):
    dictConfig(settings.LOGGING)


app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print("Request: {0!r}".format(self.request))
