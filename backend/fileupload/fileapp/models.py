from django.db import models

# Create your models here.
from django.db import models

class User(models.Model):
    name =  models.CharField(max_length=20, null=True, blank=True)
    email = models.CharField(max_length=50, null=True, blank=True)
    password =  models.CharField(max_length=20, null=True, blank=True)
    address =  models.CharField(max_length=100, null=True, blank=True)
    phone =  models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f'{self.name}'


class UploadedFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/')
    upload_date = models.DateTimeField(auto_now_add=True)
    file_type = models.CharField(max_length=50)

    def __str__(self):
        return f'{User.name} - {self.file}'
