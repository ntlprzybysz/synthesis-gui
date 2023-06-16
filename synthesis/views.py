from django.shortcuts import render
from django.http import HttpResponse

def show_home(request):
    return render(request, "home.html")

def show_about(request):
    return render(request, "about.html")

def show_help(request):
    return render(request, "help.html")

