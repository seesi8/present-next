
import firebase_admin
import requests
from firebase_admin import firestore
from firebase_admin import credentials

cred = credentials.Certificate(
    "cta-bus-f1ed1-firebase-adminsdk-zztut-ea79d736c5.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client(app)

r = requests.get(
    'https://data.cityofchicago.org/resource/8pix-ypme.json')

print(r.json()[40])

for stop in r.json():
    db.collection(u'stopscta').document(stop['map_id']).collection("dir").document(
        dir["dir"]).set({"stops": stops.json()["bustime-response"]["stops"]})


thing = {'stop_id': '30033', 'direction_id': 'W', 'stop_name': 'Ashland (Harlem-54th/Cermak-bound)', 'station_name': 'Ashland', 'station_descriptive_name': 'Ashland (Green & Pink lines)', 'map_id': '40170', 'ada': True, 'red': False, 'blue': False, 'g': True, 'brn': False, 'p': False, 'pexp': False, 'y': False, 'pnk': True, 'o': False, 'location': {
    'latitude': '41.885269', 'longitude': '-87.666969', 'human_address': '{"address": "", "city": "", "state": "", "zip": ""}'}, ':@computed_region_awaf_s7ux': '41', ':@computed_region_6mkv_f3dw': '14917', ':@computed_region_vrxf_vc4k': '29', ':@computed_region_bdys_3d7i': '579', ':@computed_region_43wa_7qmu': '46'}
