from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from deepface import DeepFace
import tempfile
import base64
import os
import json


@csrf_exempt
def verify_face(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST required"})

    try:

        data = json.loads(request.body)

        image_data = data["image"]

        image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(image_data)

        temp_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".jpg"
        )

        temp_file.write(image_bytes)

        temp_file.close()

        result = DeepFace.verify(
            img1_path=temp_file.name,
            img2_path="face_auth/known_faces/gajanan.jpg",
            enforce_detection=False
        )
        
        print(result)

        os.unlink(temp_file.name)

        return JsonResponse({
            "matched": result["verified"],
            "employee": "Gajanan Bidwai" if result["verified"] else None
        })

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        })