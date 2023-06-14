from django.urls import path
from . import views

urlpatterns = [
    path("information/", views.say_hello, name="information") 
]