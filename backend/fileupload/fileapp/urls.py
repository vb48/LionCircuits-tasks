from django.urls import path
from .views import upload_file, file_list, login_api, update_user_profile

urlpatterns = [
    path('login/', login_api, name='login'),
    path('upload/', upload_file, name='upload-file'),
    path('files-list/', file_list, name='file-list'),
    path('user-profile', update_user_profile, name='update-user-profile')
]
