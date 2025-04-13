from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Post, UserBookmarkPost, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # These are claims, you can add custom claims
        token['userid'] = user.userid
        return token


class ChangePasswordSerializer(serializers.Serializer):
    model = User
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        # Remove Django's default password validation
        try:
            validate_password(value)
        except ValidationError as e:
            # Convert error messages to a list
            error_messages = list(e.messages)

            # Filter out specific messages
            filtered_messages = [
                msg for msg in error_messages
                if msg not in [
                    "This password is too common.",
                    "This password is entirely numeric.",
                    "This password is too short. It must contain at least 8 characters."
                ]
            ]

            # Raise only remaining errors
            if filtered_messages:
                raise serializers.ValidationError(filtered_messages)

        return value

class ChangeUserInfoSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)

    def validate_username(self, value):
        """ Check if username is already taken """
        user = self.instance  # Current authenticated user
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        """ Check if email is already in use """
        user = self.instance  # Current authenticated user
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class UserBookmarkPostSerializer(serializers.ModelSerializer):
    post = PostSerializer(source='postid', read_only=True)  # Fetch related post details

    class Meta:
        model = UserBookmarkPost
        fields = ['markid', 'userid', 'post']  # Include `post` instead of just `postid`