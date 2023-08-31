from django.urls import path
from . import views

urlpatterns = [
    path("", views.show_home),  # http://numlock.informatik.tu-chemnitz.de/
    path("home/", views.show_home), # http://numlock.informatik.tu-chemnitz.de/synthesis/home/
    path("about/", views.show_about, name='about'),   # http://numlock.informatik.tu-chemnitz.de/synthesis/about/
    path("help/", views.show_help, name='help'), # http://numlock.informatik.tu-chemnitz.de/synthesis/help/
    path('check_task_status/', views.check_task_status_view, name='check_task_status'),
]