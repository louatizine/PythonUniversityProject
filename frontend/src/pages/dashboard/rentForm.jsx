import React, { useState } from "react";
import axios from "axios";
function RentForm({ car, userId, onClose }) {
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rentalDate || !returnDate) {
      setMessage("Both rental and return dates are required!");
      return;
    }

    try {
      const response = await api.post("/rentals", {
        car_id: car.id,
        user_id: userId,
        rental_date: rentalDate,
        return_date: returnDate,
      });

      setMessage(response.data.message);
      setTimeout(() => {
        onClose(); // Close modal after successful submission
      }, 1000);
    } catch (error) {
      console.error("Error renting car:", error);
      setMessage("Error: Could not complete rental.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Rent {car.marke} {car.model}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Rental Date</label>
            <input
              type="date"
              value={rentalDate}
              onChange={(e) => setRentalDate(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block">Return Date</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit Rental
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </form>
        {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
      </div>
    </div>
  );
}

export default RentForm;
