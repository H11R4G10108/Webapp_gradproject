from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core import api_views
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', api_views.UserViewSet)

urlpatterns = [
    path('api/', include((router.urls, 'api'))),
    path('api/token/', api_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/change-password/', api_views.ChangePasswordView.as_view(), name='change_password'),
    path('', api_views.getRoutes),
]
