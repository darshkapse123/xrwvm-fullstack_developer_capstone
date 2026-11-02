import os
import requests
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url',
    default="http://localhost:3030"
)

sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/"
)


def get_request(endpoint, **kwargs):
    try:
        response = requests.get(
            backend_url + endpoint,
            params=kwargs,
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as error:
        print("Backend GET error:", error)
        return None


def analyze_review_sentiments(text):
    try:
        request_url = sentiment_analyzer_url + "analyze/" + text
        response = requests.get(request_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as error:
        print("Sentiment analysis error:", error)
        return None


def post_review(data_dict):
    try:
        response = requests.post(
            backend_url + "/insert_review",
            json=data_dict,
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as error:
        print("Backend POST error:", error)
        return None