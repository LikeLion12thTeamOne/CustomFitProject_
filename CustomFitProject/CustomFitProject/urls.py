"""
URL configuration for CustomFitProject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.urls import path, include, re_path
from frontend.views import ReactAppView

urlpatterns = [
    path('api/admin0804/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/customFit/', include('customFit.urls')),
    path('api/myPage/', include('myPage.urls')),
    re_path(r'^.*$', ReactAppView.as_view()),  # 리액트 앱 경로
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)