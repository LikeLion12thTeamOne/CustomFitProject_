from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from frontend.views import ReactAppView

urlpatterns = [
    path('admin0804/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/customFit/', include('customFit.urls')),
    path('api/myPage/', include('myPage.urls')),
    re_path(r'^.*$', ReactAppView.as_view()),  # 리액트 앱 경로
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)