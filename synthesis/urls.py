from django.urls import path
from . import views

urlpatterns = [
    path("", views.show_home),
    path("home/", views.show_home),
    path("about/", views.show_about),
    path("help/", views.show_help),
    path("with_celery/", views.with_celery, name='with_celery'),
]