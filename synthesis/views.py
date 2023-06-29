from django.shortcuts import render

from .forms import InputForm
from .models import Project


def show_home(request):
    if request.method == "POST":
        form = InputForm(request.POST)
        if form.is_valid(): # required fields filled in properly
            project = Project(form.cleaned_data)
            #assert project.name == "Example synthesis"
            #assert project.text_input == ""
            #return render(request, "test.html")
    else:
        form = InputForm()

    return render(request, "home.html", {"form": form})


def show_about(request):
    return render(request, "about.html")


def show_help(request):
    return render(request, "help.html")