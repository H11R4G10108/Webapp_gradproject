from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core import api_views
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView, PasswordResetDoneView, PasswordResetCompleteView
from core.api_views import UserProfileView, PostListView, BookmarkListView, ToggleBookmarkView, BookmarkListViewForMark

router = DefaultRouter()
router.register(r'users', api_views.UserViewSet)
router.register(r'post-detail', api_views.PostViewSet)

urlpatterns = [
    path('api/', include((router.urls, 'api'))),
    path('api/token/', api_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/change-password/', api_views.ChangePasswordView.as_view(), name='change_password'),
    path('api/change-user-infor/', api_views.ChangeUserInfoView.as_view(), name='change_user_infor'),
    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('api/posts/', PostListView.as_view(), name='post-list'),
    path('api/bookmarks/', BookmarkListView.as_view(), name='bookmark-list'),
    path('api/bookmark-for-check/', BookmarkListViewForMark.as_view(), name='bookmark-check'),
    path('api/bookmark-toggle/<int:postid>/', ToggleBookmarkView.as_view(), name='toggle-bookmark'),
    path('', api_views.getRoutes),
]
