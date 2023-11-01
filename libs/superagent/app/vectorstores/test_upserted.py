import requests
import json

KEYSPACE_NAME = "recommender_demo"
COLLECTION_NAME = "superagent_vector_json"
ASTRA_DB_ID = ""
ASTRA_DB_REGION=""
ASTRA_DB_APPLICATION_TOKEN = ""

url = f"https://{ASTRA_DB_ID}-{ASTRA_DB_REGION}.apps.astra.datastax.com/api/json/v1/{KEYSPACE_NAME}/{COLLECTION_NAME}"
headers = { 'x-cassandra-token': ASTRA_DB_APPLICATION_TOKEN,  'Content-Type': 'application/json'}

# Exists
payload = json.dumps({
        "findOne": {
            "filter": {
                "_id": '1'
        }}})

response = requests.request("POST", url, headers=headers, data=payload)
print(json.loads(response.text))
print(json.loads(response.text)['data']['document']['$vector'][0:5])
print(json.loads(response.text)['data']['document']['metadata'])
print(json.loads(response.text)['data']['document']['_id'])
