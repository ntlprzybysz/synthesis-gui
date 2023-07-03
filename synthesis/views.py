from django.shortcuts import render
from django.contrib.sessions.backends.db import SessionStore

from .forms import InputForm
from .models import Project


def show_home(request):
    if request.method == "POST":
        form = InputForm(request.POST)
        if form.is_valid(): # required fields filled in properly
            #project = Project(form.cleaned_data, request.session.session_key)
            project = Project(form.cleaned_data)
            project.synthesize()
            return render(request, "test.html")
    else:
        form = InputForm()

    return render(request, "home.html", {"form": form})


def show_about(request):
    return render(request, "about.html")


def show_help(request):
    return render(request, "help.html")