import React, { useEffect, useState } from "react";
import axios from "axios";

const UserRentalList = () => {
  const [rentals, setRentals] = useState([]);
  const [error, setError] = useState("");

  // Fetch user rentals on component load
  useEffect(() => {
    const fetchRentals = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not logged in. Please log in to view your rentals.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:5000/list_rentals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRentals(response.data);
      } catch (err) {
        console.error(err.response?.data || "Error fetching rentals");
        setError(err.response?.data?.message || "Failed to fetch rentals");
      }
    };

    fetchRentals();
  }, []);

  return (
    <div>
      {/* Updated Navigation Bar */}
      <nav className="bg-blue-100 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-blue-600">
              Logo
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">

            <a
              href="/userRent"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Available Cars
            </a>
          </div>

          {/* Profile/Logout Links */}
          <div className="flex items-center space-x-4">
            <a
              href="/profile"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Profile
            </a>
            <a
              href="/logout"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Logout
            </a>
          </div>
        </div>
      </nav>

      {/* Rentals Section */}
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
          My Rentals
        </h1>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Empty Rentals List */}
        {!error && rentals.length === 0 && (
          <p className="text-gray-500 text-center">No rentals found.</p>
        )}

        {/* Rentals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="bg-white rounded-lg shadow-lg p-4 hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              {/* Car Image */}
              {rental.car_picture ? (
                <img
                  src={rental.car_picture}
                  alt={`${rental.car_make} ${rental.car_model}`}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-4">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}

              {/* Car Details */}
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {rental.car_make} {rental.car_model}
              </h2>
              <p>
                <span className="font-bold">Rental Date:</span>{" "}
                {new Date(rental.rental_date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-bold">Return Date:</span>{" "}
                {rental.return_date
                  ? new Date(rental.return_date).toLocaleDateString()
                  : "Not returned"}
              </p>
              <p>
                <span className="font-bold">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    rental.status === "pending"
                      ? "text-yellow-500"
                      : rental.status === "approved"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {rental.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRentalList;
