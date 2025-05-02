from django.contrib.admin import AdminSite
from django.urls import path
from .admin import dashboard_view


class MyAdminSite(AdminSite):
    site_header = 'Trọ Đà Nẵng Admin'
    site_title = 'Trọ Đà Nẵng Admin'
    index_title = 'Trọ Đà Nẵng xin chào!'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_view(dashboard_view), name='dashboard'),
        ]
        return custom_urls + urls


admin_site = MyAdminSite(name='myadmin')