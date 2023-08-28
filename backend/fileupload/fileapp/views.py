from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UploadedFile, User
from .serializers import UploadedFileSerializer
from rest_framework_jwt.settings import api_settings
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
import json
import jwt
from base64 import b64decode

@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        print(f'email:{email}, password:{password}')

        # Find user based on email in your custom user model
        try:
            user = User.objects.get(email=email)
            print('user found!!!!')
            if not user:
                return JsonResponse({"message": "User not Found"}, status=404)
            # Authenticate user
            if password == user.password:
                try:
                    # print('password found!!!!')
                    jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
                    # print('jwt_payload_handler!!!!')
                    jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
                    # print('jwt_encode_handler!!!!')

                    payload = {
                    'email': user.email,
                    }
                    # print('added payload!!!!')
                    token = jwt_encode_handler(payload)
                    # print('added token!!!!')

                    userDetails = {
                        'name':user.name,
                        'email':user.email,
                        'address':user.address,
                        'phone':user.phone,
                    }
                    print(f'userDetails: {userDetails}')
                    return JsonResponse({"token":token, "message": "Login successful", "userDetails":userDetails}, status=201)
                except Exception as e:
                    print(str(e))
            else:
                return JsonResponse({"message": "Invalid email or password"}, status=400)
        except Exception as e:
            return JsonResponse({"message": str(e)})
    
    return JsonResponse({"message": "Invalid request method."}, status=400)

@csrf_exempt
def upload_file(request):
    print(f'request.method : {request.method}')
    
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        # print(token)
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            # print(decoded_token)
            user_id = decoded_token['email']
            # print(user_id)
            user = User.objects.get(email=user_id)
            
            print(f'Authenticated user: {user}')
            
            file = request.FILES.get('file')
            print(file)
            file_type = file.name.split('.')[-1]
            
            UploadedFile.objects.create(
                user=user, file=file, file_type=file_type
            )
            
            return JsonResponse({"message": "File uploaded successfully."})
        except jwt.ExpiredSignatureError:
            return JsonResponse({"message": "Token has expired."}, status=401)
        except (jwt.DecodeError, jwt.InvalidTokenError):
            return JsonResponse({"message": "Invalid token."}, status=401)
        except ObjectDoesNotExist:
            return JsonResponse({"message": "User not found."}, status=404)
    return JsonResponse({"message": "Invalid request method."}, status=400)

def file_list(request):
    try:
        token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        # print(f"token : {token}")
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        # print(f"decoded_token : {decoded_token}")
        user_email = decoded_token['email'] 
        # print(f"decode user_email : {user_email}")
        user = User.objects.get(email=user_email)
        # print(f'found user!!!: {user.name}')
        files = UploadedFile.objects.filter(user=user)
        # print(f'found files!!!: {files[0].file}')
        serializer = UploadedFileSerializer(files, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)
    except jwt.ExpiredSignatureError:
        return JsonResponse({"message": "Token has expired."}, status=401)
    except jwt.DecodeError:
        return JsonResponse({"message": "Invalid token."}, status=401)
    except ObjectDoesNotExist:
        return JsonResponse({"message": "User not found."}, status=404)

@csrf_exempt
def update_user_profile(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            new_name = data.get('name')
            new_addresses = data.get('addresses[]')
            new_phone_number = data.get('phoneNumber')

            token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
            print(f"token : {token}")
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            print(f"decoded_token : {decoded_token}")
            user_email = decoded_token['email'] 
            print(f"decode user_email : {user_email}")
            user = User.objects.get(email=user_email)
            print(f'found user!!!: {user.name}')
            
            if new_name:
                user.name = new_name
            if new_addresses:
                user.address = new_addresses
            if new_phone_number:
                user.phone = new_phone_number
            
            user.save()
            
            return JsonResponse({"message": "User profile updated successfully."})
        except jwt.ExpiredSignatureError:
            return JsonResponse({"message": "Token has expired."}, status=401)
        except (jwt.DecodeError, jwt.InvalidTokenError):
            return JsonResponse({"message": "Invalid token."}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"message": "User not found."}, status=404)
    else:
        return JsonResponse({"message": "Invalid request method."}, status=400)
