# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = True` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
    sitelink = "http://localhost:5173/"
    token = "{}".format(reset_password_token.key)
    full_link = str(sitelink)+str("password-reset/")+str(token)

    print(token)
    print(full_link)

    context = {
        'full_link': full_link,
        'email_adress': reset_password_token.user.email
    }

    html_message = render_to_string("email.html", context=context)
    plain_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        subject = "Request for resetting password for {title}".format(title=reset_password_token.user.email),
        body=plain_message,
        from_email = "sender@example.com",
        to=[reset_password_token.user.email]
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()

class Post(models.Model):
    postid = models.CharField(
        db_column='postID',
        primary_key=True,
        max_length=32,
        verbose_name="Post ID"
    )
    p_date = models.DateTimeField(verbose_name="Thời gian đăng")
    p_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="URL bài đăng")  # Thêm cột này

    content = models.TextField(blank=True, null=True)

    district = models.CharField(max_length=100, blank=True, null=True, verbose_name="Quận")
    ward = models.CharField(max_length=100, blank=True, null=True, verbose_name="Phường")
    street_address = models.CharField(max_length=255, blank=True, null=True, verbose_name="Đường/Số nhà")

    price = models.IntegerField(blank=True, null=True, verbose_name="Giá cho thuê (VNĐ)")
    area = models.CharField(max_length=50, blank=True, null=True, verbose_name="Kích thước (m²)")
    amenities = models.TextField(blank=True, null=True, verbose_name="Thông tin tiện ích bổ sung")
    contact_info = models.CharField(max_length=255, blank=True, null=True, verbose_name="Thông tin liên hệ")

    def __str__(self):
        return f"Post {self.postid}"

    class Meta:
        db_table = 'post'




class User(AbstractUser):
    userid = models.BigAutoField(db_column='userID', primary_key=True, unique=True)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    first_name = None
    last_name = None
    groups = None
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    class Meta:
        db_table = 'user'
    def __str__(self):
        return self.username


class UserBookmarkPost(models.Model):
    markid = models.BigAutoField(db_column='markID', primary_key=True)  # Field name made lowercase.
    userid = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userID')  # Field name made lowercase.
    postid = models.ForeignKey(Post, on_delete=models.CASCADE)  # Field name made lowercase.
    class Meta:
        db_table = 'userbookmarkpost'

    def __str__(self):
        return f"Bookmark {self.markid}"