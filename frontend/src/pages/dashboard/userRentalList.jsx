import React, { useEffect, useState } from "react";
import axios from "axios";

const UserRentalList = () => {
  const [rentals, setRentals] = useState([]);
  const [error, setError] = useState("");
  const [selectedRental, setSelectedRental] = useState(null);
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [user, setUser] = useState(null);




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
        console.log(response.data);  // Log the API response
        setRentals(response.data);
      } catch (err) {
        setError("Failed to fetch rentals");
      }
    };


    fetchRentals();
  }, []);

  // Handle rental update
  const handleUpdateRental = (rentalId) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `http://127.0.0.1:5000/update_rental/${rentalId}`,
        { rental_date: rentalDate, return_date: returnDate },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Rental updated successfully!");
        setSelectedRental(null);

        // Refresh the rental list
        axios
          .get("http://127.0.0.1:5000/list_rentals", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setRentals(response.data);
          })
          .catch((err) => {
            console.error("Error refreshing rental list:", err);
            alert("Error refreshing rental list.");
          });
      })
      .catch((error) => {
        alert(error.response?.data?.error || "Failed to update rental.");
      });
  };

  // Handle rental deletion
  const handleDeleteRental = (rentalId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://127.0.0.1:5000/delete_rental/${rentalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Rental deleted successfully!");

        // Refresh the rental list after deletion
        axios
          .get("http://127.0.0.1:5000/list_rentals", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setRentals(response.data);
          })
          .catch((err) => {
            alert("Error refreshing rental list.");
          });
      })
      .catch((error) => {
        alert("Failed to delete rental.");
      });
  };



  return (
    <div>
      <nav className="bg-blue-600 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-white text-xl font-bold">CarRental</div>
          <div className="flex space-x-6">
            <a href="/userRent" className="text-white hover:text-gray-200">
              Home
            </a>
            <a href="/userprofile" className="text-white hover:text-gray-200">
              Profile
            </a>
            <a href="/logout" className="text-white hover:text-gray-200">
              Logout
            </a>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
          My Rentals
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative"
            >
              {/* Car Image */}
              {rental.car_picture ? (
                <img
                  src={rental.car_picture}
                  alt={`${rental.car_make} ${rental.car_model}`}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}

              <div className="p-4">
                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800">
                  {rental.car_make} {rental.car_model}
                </h2>

                {/* Rental Details */}
                <p className="text-gray-600 text-sm mt-2">
                  <span className="font-semibold">Rental Date:</span>{" "}
                  {new Date(rental.rental_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Return Date:</span>{" "}
                  {rental.return_date
                    ? new Date(rental.return_date).toLocaleDateString()
                    : "Not returned"}
                </p>

                {/* Price */}
                <p className="text-gray-600 text-sm mt-2">
                  <span className="font-semibold">Price:</span> {rental.total_price && !isNaN(rental.total_price)
                    ? `${rental.total_price.toFixed(2)} Dt`
                    : "Price not available"}
                </p>

                {/* Status Badge */}
                <p className="mt-3">
                  <span
                    className={`px-2 py-1 text-sm font-bold rounded ${
                      rental.status === "active"
                        ? "bg-green-100 text-green-700"
                        : rental.status === "completed"
                        ? "bg-gray-100 text-gray-700"
                        : rental.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {rental.status.toUpperCase()}
                  </span>
                </p>

                {/* Buttons - Vertical Layout */}
                <div className="mt-4 space-y-2">
                  {rental.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedRental(rental);
                          setRentalDate(
                            new Date(rental.rental_date)
                              .toISOString()
                              .slice(0, 10)
                          );
                          setReturnDate(
                            rental.return_date
                              ? new Date(rental.return_date)
                                  .toISOString()
                                  .slice(0, 10)
                              : ""
                          );
                        }}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRental(rental.id)}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Rental Modal */}
      {selectedRental && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
              Edit Rental for {selectedRental.car_make} {selectedRental.car_model}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Rental Date
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
                  Return Date
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
                  onClick={() => handleUpdateRental(selectedRental.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  Confirm Update
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRental(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
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

export default UserRentalList;
