
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";

import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);

  const { id } = useParams();

  const root_url = `${window.location.protocol}//${window.location.host}/`;

  const dealer_url = `${root_url}djangoapp/dealers/${id}`;
  const reviews_url = `${root_url}djangoapp/reviews/${id}`;
  const post_review = `${root_url}postreview/${id}`;

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url);
      const data = await res.json();

      if (res.ok) {
        const dealerData = Array.isArray(data)
          ? data[0]
          : data.dealer?.[0] || data.dealer || data;

        if (dealerData) {
          setDealer(dealerData);
        }
      } else {
        console.error("Dealer API error:", data);
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  };

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url);
      const data = await res.json();

      if (res.ok) {
        const reviewsData = Array.isArray(data)
          ? data
          : data.reviews || [];

        setReviews(reviewsData);
        setUnreviewed(reviewsData.length === 0);
      } else {
        console.error("Reviews API error:", data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const senti_icon = (sentiment) => {
    if (sentiment === "positive") {
      return positive_icon;
    }

    if (sentiment === "negative") {
      return negative_icon;
    }

    return neutral_icon;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
  }, [id]);

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  return (
    <div style={{ margin: "20px" }}>
      <Header />

      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}

          {isLoggedIn && (
  <a
    href={post_review}
    style={{
      display: "inline-block",
      marginLeft: "15px",
      padding: "10px 18px",
      backgroundColor: "#007bff",
      color: "white",
      borderRadius: "6px",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: "bold"
    }}
  >
    ✍ Post Review
  </a>
)}
        </h1>

        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>

      <p style={{ color: "red", fontSize: "20px" }}>
  TEST - POST REVIEW
</p>

<p style={{ color: "green", fontSize: "20px" }}>
  Login status: {String(isLoggedIn)}
</p>

      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed ? (
          <p>Loading Reviews....</p>
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review) => (
            <div className="review_panel" key={review.id}>
              <img
                src={senti_icon(review.sentiment)}
                className="emotion_icon"
                alt={review.sentiment}
              />

              <div className="review">
                {review.review}
              </div>

              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
