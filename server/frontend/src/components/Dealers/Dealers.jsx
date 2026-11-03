
import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);

  const get_dealers = async (state = "") => {
    try {
      const url = state && state !== "All"
        ? `/djangoapp/dealers?state=${encodeURIComponent(state)}`
        : "/djangoapp/dealers";

      // Update browser address bar with selected state
      const pageUrl = state && state !== "All"
        ? `/?state=${encodeURIComponent(state)}`
        : "/";

      window.history.replaceState({}, "", pageUrl);

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        console.error("Unable to load dealerships:", data);
        return;
      }

      setDealersList(data);
      setStates([...new Set(data.map(dealer => dealer.state))]);

    } catch (error) {
      console.error("Dealership fetch error:", error);
    }
  };

  useEffect(() => {
    get_dealers();
  }, []);

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  return (
    <div>
      <Header />

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select
                name="state"
                id="state"
                defaultValue=""
                onChange={(e) => get_dealers(e.target.value)}
              >
                <option value="" disabled>Select State</option>
                <option value="All">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </th>

            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>

        <tbody>
          {dealersList.map(dealer => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td>
                <a href={`/dealer/${dealer.id}`}>
                  {dealer.full_name}
                </a>
              </td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>

              {isLoggedIn && (
                <td>
                  <a href={`/postreview/${dealer.id}`}>
                    <img
                      src={review_icon}
                      className="review_icon"
                      alt="Post Review"
                    />
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;
