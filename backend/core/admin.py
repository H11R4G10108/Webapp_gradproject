from django.contrib import admin
from .models import Comment, User, Post, Status, UserBookmarkPost

admin.site.register(Comment)
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Status)
admin.site.register(UserBookmarkPost)
