from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

def say_hello(request):
	template = loader.get_template('information.html')
	return HttpResponse(template.render())
