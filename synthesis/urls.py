from django.urls import path
from . import views

urlpatterns = [
    path("", views.show_home),  # http://numlock.informatik.tu-chemnitz.de/
    path("home/", views.show_home), # http://numlock.informatik.tu-chemnitz.de/synthesis/home/
    path("about/", views.show_about, name='about'),   # http://numlock.informatik.tu-chemnitz.de/synthesis/about/
    path("help/", views.show_help, name='help'), # http://numlock.informatik.tu-chemnitz.de/synthesis/help/
    path("with_celery/", views.with_celery, name='with_celery'), # http://numlock.informatik.tu-chemnitz.de/synthesis/with_celery/
]