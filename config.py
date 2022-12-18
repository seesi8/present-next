
import firebase_admin
import requests
from firebase_admin import firestore
from firebase_admin import credentials

cred = credentials.Certificate(
    "cta-bus-f1ed1-firebase-adminsdk-zztut-ea79d736c5.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client(app)

r = requests.get(
    'http://www.ctabustracker.com/bustime/api/v2/getroutes?key=fy3txRGPR437MrCVLZtpxuFCw&format=json')

routes = r.json()["bustime-response"]["routes"]

for route in routes:
    rt = route["rt"]
    r = requests.get(
        'https://www.ctabustracker.com/bustime/api/v2/getdirections?key=fy3txRGPR437MrCVLZtpxuFCw&format=json&rt='+rt)

    for dir in r.json()["bustime-response"]["directions"]:
        stops = requests.get(
            'http://www.ctabustracker.com/bustime/api/v2/getstops?key=fy3txRGPR437MrCVLZtpxuFCw&format=json&rt='+rt + '&dir='+dir["dir"])
        db.collection(u'stops').document(rt).collection("dir").document(
            dir["dir"]).set({"stops": stops.json()["bustime-response"]["stops"]})

print("done")
