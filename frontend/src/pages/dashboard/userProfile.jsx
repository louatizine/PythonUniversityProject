import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode
  const [updatedUser, setUpdatedUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('User not logged in. Please log in to view your rentals.');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:5000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log(response.data);  // Log the response to check if phone is included
        setUser(response.data);  // Set the user data
        setUpdatedUser({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          phone: response.data.phone,
        });
      } catch (err) {
        setError('Error fetching user information');
      }
    };

    fetchUserInfo();
  }, []);



  
  const handleChange = (e) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not logged in. Please log in to update your information.');
      return;
    }

    try {
      const response = await axios.put(
        'http://127.0.0.1:5000/api/user', // Assume this endpoint handles updating user info
        updatedUser,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUser(updatedUser); // Update the user state with the new data
        setIsEditing(false); // Exit editing mode
      }
    } catch (err) {
      setError('Error updating user information');
    }
  };

  if (error) {
    return <p className="text-red-500 text-center font-semibold">{error}</p>;
  }

  if (!user) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div>
       <nav className="bg-blue-600 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="text-white text-xl font-bold">{user.first_name} {user.last_name}</div>
          <div className="flex space-x-6">
            <a href="/userRent" className="text-white hover:text-gray-200">Home</a>
            <a href="/userRentlist" className="text-white hover:text-gray-200">My Rentals</a>
            <a href="/userprofile" className="text-white hover:text-gray-200">Profile</a>
            <a href="/logout" className="text-white hover:text-gray-200">Logout</a>
          </div>
        </div>
      </nav>
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://media.istockphoto.com/id/905671088/photo/toy-toyota-fj-cruiser-cars-chasing-a-ford-thunderbird-car-at-night-with-fog-background-toy.webp?a=1&b=1&s=612x612&w=0&k=20&c=f7sCLtnARl2ea_FAuh6V2XUfqv3981GzMjJCj-DRXh8=)',
      }}
    >
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md space-y-6 opacity-90">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800">User Information</h2>

        {isEditing ? (
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600" htmlFor="phone">Phone:</label>
              <input
                type="text"
                name="phone"
                value={updatedUser.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter new phone number"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600" htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter new email"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600" htmlFor="first_name">First Name:</label>
              <input
                type="text"
                name="first_name"
                value={updatedUser.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter new first name"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600" htmlFor="last_name">Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={updatedUser.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter new last name"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md"
              >
                Save
              </button>
              <button
                type="button"
                className="mt-4 bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Phone:</p>
              <p className="text-lg text-gray-800">{user.phone}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Email:</p>
              <p className="text-lg text-gray-800">{user.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">First Name:</p>
              <p className="text-lg text-gray-800">{user.first_name}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Last Name:</p>
              <p className="text-lg text-gray-800">{user.last_name}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Account Created On:</p>
              <p className="text-lg text-gray-800">
                {new Date(user.created_at).toLocaleString()}
              </p>
            </div>

            <button
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md"
              onClick={() => setIsEditing(true)}
            >
              Edit Information
            </button>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default UserInfo;
