"""
URL configuration for synthesisgui project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import (include, path)
from synthesis import views

urlpatterns = [
    path('', views.show_home, name='home'),
    path('admin/', admin.site.urls),
    path('synthesis/', include('synthesis.urls')),
    #path('celery-progress/', include('celery_progress.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Custom error pages
handler404 = "synthesis.views.show_404"
handler500 = "synthesis.views.show_500"
handler403 = "synthesis.views.show_403"
handler400 = "synthesis.views.show_400"