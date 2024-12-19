import React, { useEffect, useState } from "react";
import axios from "axios";

export function Notifications() {
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null); // State to track the car being edited
  const [formData, setFormData] = useState({
    marke: "",
    model: "",
    year: "",
    price_per_day: "",
    fuel_type: "",
    picture: "",
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/listcar");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const deleteCar = async (carId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/cars/${carId}`);
      setCars(cars.filter((car) => car.id !== carId)); // Update state after deletion
      alert("Car deleted successfully.");
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Error deleting the car.");
    }
  };

  const handleEditClick = (car) => {
    setEditingCar(car.id); // Set the car to be edited
    setFormData(car); // Pre-fill the form with the car's current data
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateCar = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/cars/${editingCar}`, formData);
      setCars(cars.map((car) => (car.id === editingCar ? { ...formData } : car)));
      setEditingCar(null); // Reset editing state
      alert("Car updated successfully.");
    } catch (error) {
      console.error("Error updating car:", error);
      alert("Error updating the car.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Available Cars</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.length > 0 ? (
          cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300"
            >
              {car.picture && (
                <img
                  src={`http://127.0.0.1:5000/static/${car.picture}`}
                  alt={`${car.marke} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {car.marke} {car.model}
                </h3>
                <p className="text-gray-600">
                  <span className="font-medium">Year:</span> {car.year}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Fuel Type:</span> {car.fuel_type}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Price per Day:</span> ${car.price_per_day.toFixed(2)}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditClick(car)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                  >
                    Update Car
                  </button>
                  <button
                    onClick={() => deleteCar(car.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    Delete Car
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No cars available.</p>
        )}
      </div>

      {/* Edit Form Modal */}
      {editingCar && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Car</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Marke</label>
                <input
                  type="text"
                  name="marke"
                  value={formData.marke}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price per Day</label>
                <input
                  type="number"
                  name="price_per_day"
                  step="0.01"
                  value={formData.price_per_day}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Fuel Type</label>
                <input
                  type="text"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingCar(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={updateCar}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
