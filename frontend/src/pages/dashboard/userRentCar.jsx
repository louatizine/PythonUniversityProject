import React, { useState, useEffect } from "react";
import axios from "axios";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Fetch cars from the backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/listcar")
      .then((response) => setCars(response.data))
      .catch((error) => console.error("Error fetching cars:", error));
  }, []);

  // Rent a car handler
  const handleRentCar = (carId) => {
    if (!rentalDate || !returnDate) {
      alert("Please fill both rental and return dates.");
      return;
    }

    const token = localStorage.getItem("token"); // Retrieve token from local storage
    axios
      .post(
        "http://127.0.0.1:5000/rentals",
        { car_id: carId, rental_date: rentalDate, return_date: returnDate },
        { headers: { Authorization: `Bearer ${token}` } } // Add token in Authorization header
      )
      .then(() => {
        alert("Car rented successfully!");
        setSelectedCar(null);
      })
      .catch((error) => {
        console.error("Error renting car:", error);
        alert(error.response?.data?.error || "Failed to rent car.");
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        Available Cars
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between hover:shadow-2xl transition-transform transform hover:scale-105"
          >
            <img
              src={car.picture}
              alt={`${car.marke} ${car.model}`}
              className="h-40 w-full object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2">
              {car.marke} {car.model} ({car.year})
            </h2>
            <p className="text-gray-600 mb-2">Fuel: {car.fuel_type}</p>
            <p className="text-gray-800 font-bold mb-4">
              ${car.price_per_day} / day
            </p>
            <button
              onClick={() => setSelectedCar(car)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Rent This Car
            </button>
          </div>
        ))}
      </div>

      {selectedCar && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
              Rent {selectedCar.marke} {selectedCar.model}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Rental Date:
                </label>
                <input
                  type="date"
                  value={rentalDate}
                  onChange={(e) => setRentalDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Return Date:
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => handleRentCar(selectedCar.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                >
                  Confirm Rental
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCar(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;
