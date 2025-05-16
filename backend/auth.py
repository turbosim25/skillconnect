import firebase_admin
from firebase_admin import auth, credentials

cred = credentials.Certificate("path/to/your/firebase-service-account.json")
firebase_admin.initialize_app(cred)

def verify_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        return None
