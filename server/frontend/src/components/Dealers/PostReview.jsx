
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const { id } = useParams();

  const dealer_url = `/djangoapp/dealers/${id}`;
  const review_url = `/djangoapp/add_review`;
  const carmodels_url = `/djangoapp/get_cars`;

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
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  };

  const get_cars = async () => {
    try {
      const res = await fetch(carmodels_url);
      const data = await res.json();

      if (res.ok) {
        const cars = Array.isArray(data)
          ? data
          : data.CarModels || [];

        setCarmodels(cars);
      }
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  const postreview = async () => {
    let name =
      sessionStorage.getItem("firstname") + " " +
      sessionStorage.getItem("lastname");

    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    const model_split = model.split(" ");

    const jsoninput = JSON.stringify({
      name: name,
      dealership: Number(id),
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: model_split[0],
      car_model: model_split.slice(1).join(" "),
      car_year: year
    });

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: jsoninput
      });

      const data = await res.json();

      if (res.ok && (data.status === 200 || data.id)) {
        window.location.href = `/dealer/${id}`;
      } else {
        alert("Unable to submit review. Please check the form.");
        console.error("Review submission response:", data);
      }
    } catch (error) {
      console.error("Error posting review:", error);
      alert("Error submitting review.");
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, [id]);

  return (
    <div>
      <Header />

      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>
          {dealer.full_name}
        </h1>

        <textarea
          id="review"
          cols="50"
          rows="7"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here"
        />

        <div className="input_field">
          Purchase Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="input_field">
          Car Make
          <select
            name="cars"
            id="cars"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="" disabled>
              Choose Car Make and Model
            </option>

            {carmodels.map((carmodel, index) => (
              <option
                key={index}
                value={carmodel.CarMake + " " + carmodel.CarModel}
              >
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className="input_field">
          Car Year
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            max={2023}
            min={2015}
          />
        </div>

        <div>
          <button
            className="postreview"
            onClick={postreview}
          >
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
