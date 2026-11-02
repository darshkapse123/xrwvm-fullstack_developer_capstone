import json
import logging

from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

from .restapis import get_request, analyze_review_sentiments, post_review


logger = logging.getLogger(__name__)


# Login user
@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data['userName']
        password = data['password']

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({
                "userName": username,
                "status": "Authenticated"
            })

        return JsonResponse({
            "userName": username,
            "status": "Invalid credentials"
        }, status=401)

    return JsonResponse({"error": "POST method required"}, status=405)


# Logout user
def logout_request(request):
    logout(request)
    return JsonResponse({"userName": ""})


# Register user
@csrf_exempt
def registration(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        username = data.get('userName')
        password = data.get('password')
        first_name = data.get('firstName', '')
        last_name = data.get('lastName', '')
        email = data.get('email', '')

        if not username or not password:
            return JsonResponse({
                "error": "Username and password are required"
            }, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({
                "userName": username,
                "error": "Username already exists"
            }, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

        return JsonResponse({
            "userName": user.username,
            "status": "Registered"
        })

    return JsonResponse({"error": "POST method required"}, status=405)


# Get dealership list
def get_dealerships(request):
    if request.method == 'GET':
        state = request.GET.get('state')
        endpoint = '/fetchDealers'

        if state:
            endpoint = f'/fetchDealers/{state}'

        dealerships = get_request(endpoint)

        if dealerships is None:
            return JsonResponse(
                {"error": "Unable to retrieve dealerships"},
                status=500
            )

        return JsonResponse(dealerships, safe=False)

    return JsonResponse({"error": "GET method required"}, status=405)


# Get reviews for a dealership
def get_dealer_reviews(request, dealer_id):
    if request.method == 'GET':
        reviews = get_request(f'/fetchReviews/dealer/{dealer_id}')

        if reviews is None:
            return JsonResponse(
                {"error": "Unable to retrieve reviews"},
                status=500
            )

        return JsonResponse(reviews, safe=False)

    return JsonResponse({"error": "GET method required"}, status=405)


# Get dealership details
def get_dealer_details(request, dealer_id):
    if request.method == 'GET':
        dealer = get_request(f'/fetchDealer/{dealer_id}')

        if dealer is None:
            return JsonResponse(
                {"error": "Unable to retrieve dealership"},
                status=500
            )

        return JsonResponse(dealer, safe=False)

    return JsonResponse({"error": "GET method required"}, status=405)

# Add a review
@csrf_exempt
def add_review(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        sentiment_result = analyze_review_sentiments(
            data.get('review', '')
        )

        if sentiment_result:
            data['sentiment'] = sentiment_result.get('sentiment')

        result = post_review(data)

        if result is None:
            return JsonResponse(
                {"error": "Unable to submit review"},
                status=500
            )

        return JsonResponse(result, safe=False)

    return JsonResponse(
        {"error": "POST method required"},
        status=405
    )