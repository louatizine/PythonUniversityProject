import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to view this page.");
      navigate("/login"); // Redirect to login if no token
    }
  }, [navigate]);

  // Fetch cars from the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://127.0.0.1:5000/listcar", {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in header
        })
        .then((response) => setCars(response.data))
        .catch((error) => {
          console.error("Error fetching cars:", error);
          toast.error("Failed to load cars.");
        });
    }
  }, []);

  // Rent a car handler
  const handleRentCar = (carId) => {
    if (!rentalDate || !returnDate) {
      toast.error("Please fill both rental and return dates.");
      return;
    }

    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      toast.error("You must be logged in to rent a car.");
      return;
    }

    axios
      .post(
        "http://127.0.0.1:5000/rentals",
        { car_id: carId, rental_date: rentalDate, return_date: returnDate },
        { headers: { Authorization: `Bearer ${token}` } } // Add token in Authorization header
      )
      .then(() => {
        toast.success("Car rented successfully!");
        setSelectedCar(null);
      })
      .catch((error) => {
        console.error("Error renting car:", error);
        if (error.response?.data?.error === "Car already rented during this period") {
          toast.error("Sorry, the car is already rented during this period.");
        } else {
          toast.error(error.response?.data?.error || "Sorry, the car is already rented during this period.");
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-white text-xl font-bold">CarRental</div>
          <div className="flex space-x-6">
            <a href="/userRent" className="text-white hover:text-gray-200">Home</a>
            <a href="/userRentlist" className="text-white hover:text-gray-200">My Rentals</a>
            <a href="/userprofile" className="text-white hover:text-gray-200">Profile</a>
            <a href="/logout" className="text-white hover:text-gray-200">Logout</a>
          </div>
        </div>
      </nav>

      {/* Car List */}
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Available Cars</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <img
                src={car.picture}
                alt={`${car.marke} ${car.model}`}
                className="h-40 w-full object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {car.marke} {car.model} ({car.year})
              </h2>
              <p className="text-gray-600 mb-2">Fuel: {car.fuel_type}</p>
              <p className="text-gray-800 font-bold mb-4">${car.price_per_day} / day</p>
              <button
                onClick={() => setSelectedCar(car)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                Rent This Car
              </button>
            </div>
          ))}
        </div>

        {selectedCar && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">
                Rent {selectedCar.marke} {selectedCar.model}
              </h2>
              <img
                src={selectedCar.picture}
                alt={`${selectedCar.marke} ${selectedCar.model}`}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Rental Date:</label>
                  <input
                    type="date"
                    value={rentalDate}
                    onChange={(e) => setRentalDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Return Date:</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => handleRentCar(selectedCar.id)}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCar(null)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Toast container for showing toasts */}
      <ToastContainer />
    </div>
  );
};

export default CarList;
