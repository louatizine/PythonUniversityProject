import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // JWT stored after login

  // Fetch all rentals
  const fetchRentals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/rentals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRentals(response.data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update rental status
  const updateRentalStatus = async (rentalId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/admin/rentals/${rentalId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchRentals(); // Refresh rentals after status update
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Rental Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">User</th>
              <th className="border p-2">Car</th>
              <th className="border p-2">Rental Date</th>
              <th className="border p-2">Return Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental.id} className="text-center">
                <td className="border p-2">{rental.username}</td>
                <td className="border p-2">{rental.car}</td>
                <td className="border p-2">{rental.rental_date}</td>
                <td className="border p-2">{rental.return_date || 'N/A'}</td>
                <td className="border p-2">{rental.status}</td>
                <td className="border p-2">
                  {rental.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateRentalStatus(rental.id, 'approved')}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateRentalStatus(rental.id, 'rejected')}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {rental.status !== 'pending' && (
                    <span className="text-gray-500">{rental.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminRentals;
