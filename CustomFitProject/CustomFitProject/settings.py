import json
import os
from pathlib import Path
from django.core.mail import send_mail #메일인증

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
CSV_PATH = os.path.join(BASE_DIR, 'customFit', 'ProductDB.csv')

# SECERT KEY
secret_file = os.path.join(BASE_DIR, 'secret_key.json')

with open(secret_file) as f:
    secrets = json.loads(f.read())

def get_secret(setting):
    return secrets[setting]

SECRET_KEY = get_secret("SECRET_KEY")


# 디버깅모드 : 배포시에는 False
DEBUG = True


# 허용된 호스트 : 접속을 허용할 호스트들(도메인)을 이 곳에 등록
# 배포 직전 DEBUG = False로 바꾼다면 이곳에 도메인을 등록
ALLOWED_HOSTS = ['*']
# ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',  # 세션 앱
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'rest_framework',

    # 추가한 패키지
    'rest_framework.authtoken',
    'dj_rest_auth',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'dj_rest_auth.registration',

    'django_filters',

    'corsheaders',

    # 생성한 앱 추가
    'accounts',
    'customFit',
    'myPage',
]

AUTH_USER_MODEL = 'accounts.CustomUser'

SITE_ID = 1

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # 추가
    'allauth.account.middleware.AccountMiddleware', 
]

# 추가 
REST_FRAMEWORK = { 
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication', 
        'rest_framework.authentication.SessionAuthentication',
    ],
}

# CORS 설정
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:8000",
]


CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# CSRF 설정
CSRF_COOKIE_NAME = 'csrftoken'
#CSRF_COOKIE_NAME = 'XSRF-TOKEN'
#CSRF_HEADER_NAME = 'X-XSRF-TOKEN'
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:8000']


#SESSION_COOKIE_SECURE=True
#CSRF_COOKIE_SECURE=True

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]


ROOT_URLCONF = 'CustomFitProject.urls'

# 장고 정적 파일 설정
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'frontend', 'build', 'static'),
    os.path.join(BASE_DIR, 'frontend', 'build'),
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'frontend', 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'CustomFitProject.wsgi.application'

# DATABASES 설정
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {   #username과 비밀번호가 유사한지 확인
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {   #비밀번호의 최소 자리수(default)를 지정해준다.
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {   #commmon한 비밀번호(ex. qwer) 1000개의 리스트와 비교함
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {   #전부 숫자인 비밀번호는 사용하지 못하게 한다.
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'ko-kr'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

#메일인증 코드 꼭 추가!
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'smtp.gmail.com'  # Gmail SMTP 서버
EMAIL_PORT = 587  # TLS 포트
EMAIL_USE_TLS = True  # TLS 사용
EMAIL_USE_SSL = False  # SSL 사용 안 함
EMAIL_HOST_USER = get_secret('EMAIL_HOST_USER')  # Gmail 주소
EMAIL_HOST_PASSWORD = get_secret('EMAIL_HOST_PASSWORD')  # Gmail 비밀번호
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER  # 기본 발신자 이메일

#공지에서 이미지 확인 
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
