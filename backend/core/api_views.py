from .models import Post, Comment, UserBookmarkPost, User
from .serializers import UserSerializer, MyTokenObtainPairSerializer, ChangePasswordSerializer, PostSerializer, CommentSerializer, UserBookmarkPostSerializer, ChangeUserInfoSerializer
from django.http import JsonResponse
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import UpdateAPIView, get_object_or_404
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_200_OK
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from rest_framework import filters

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
    '/api/token/',
    '/api/token/refresh/',
    '/api/users',
    '/api/change-password/',
    '/api/change-user-infor/',
        '/api/user/profile/'
]
    return Response(routes)
class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)
    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }
            return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangeUserInfoView(UpdateAPIView):
    serializer_class = ChangeUserInfoSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(instance=user, data=request.data, partial=True)

        if serializer.is_valid():
            # Change username and email if provided
            if "username" in serializer.validated_data:
                user.username = serializer.validated_data["username"]
            if "email" in serializer.validated_data:
                user.email = serializer.validated_data["email"]

            user.save()

            return Response({
                "status": "success",
                "message": "User information updated successfully"
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = LimitOffsetPagination

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ['content']
    filter_backends = (filters.SearchFilter,)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email
        })

# Define pagination class
class PostPagination(PageNumberPagination):
    page_size = 6  # 8 posts per page
    page_size_query_param = 'page_size'
    max_page_size = 20  # Optional: Limit max page size

# Create the API view
class PostListView(ListAPIView):
    queryset = Post.objects.all().order_by('-p_date')  # Order by most recent
    serializer_class = PostSerializer
    pagination_class = PostPagination


class BookmarkListView(ListAPIView):
    serializer_class = UserBookmarkPostSerializer
    pagination_class = PostPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.query_params.get('userid')
        sort_order = self.request.query_params.get('sort', 'desc')  # Default: newest first
        queryset = UserBookmarkPost.objects.filter(userid=user_id)
        return queryset.order_by('-postid__p_date' if sort_order == 'desc' else 'postid__p_date')

class BookmarkListViewForMark(ListAPIView):
    serializer_class = UserBookmarkPostSerializer
    permission_classes = []
    def get_queryset(self):
        user_id = self.request.query_params.get('userid')
        queryset = UserBookmarkPost.objects.filter(userid=user_id)
        return queryset

# Add/Remove Bookmark API
class ToggleBookmarkView(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        post_id = self.kwargs.get("postid")
        post = get_object_or_404(Post, postid=post_id)
        bookmark, created = UserBookmarkPost.objects.get_or_create(userid=user, postid=post)

        if not created:
            bookmark.delete()
            return Response({"message": "Bookmark removed"}, status=status.HTTP_204_NO_CONTENT)

        return Response({"message": "Bookmark added"}, status=status.HTTP_201_CREATED)