import React, { useState } from "react";
import axios from "axios";

export function Profile() {
  const [formData, setFormData] = useState({
    marke: "",
    model: "",
    year: "",
    price_per_day: "",
    fuel_type: "",
    picture: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/cars", formData);
      setMessage(response.data.message);
      setFormData({
        marke: "",
        model: "",
        year: "",
        price_per_day: "",
        fuel_type: "",
        picture: "",
      });
    } catch (error) {
      setMessage("Error: Could not add the car.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add a New Car
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Marke */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Marke:</label>
          <input
            type="text"
            name="marke"
            value={formData.marke}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Model */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Model:</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Year */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Year:</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Price per Day */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Price per Day:
          </label>
          <input
            type="number"
            step="0.01"
            name="price_per_day"
            value={formData.price_per_day}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Fuel Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Fuel Type:
          </label>
          <input
            type="text"
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Picture */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Picture URL:
          </label>
          <input
            type="text"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Add Car
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Profile;









