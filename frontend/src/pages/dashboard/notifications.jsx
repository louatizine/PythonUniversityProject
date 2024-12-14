import React, { useEffect, useState } from "react";
import axios from "axios";

export function Notifications() {
  const [cars, setCars] = useState([]);


    useEffect(() => {
      fetchCars();
    }, []);
  
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/listcar");
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };



  return (
    <div className="car-list">
      <h1>Available Cars</h1>
      <ul>
        {cars.length > 0 ? (
          cars.map((car) => (
            <li key={car.id}>
              <h3>{car.brand} {car.model}</h3>
              <p>Year: {car.year}</p>
              <p>Price per day: ${car.price_per_day}</p>
              {car.picture && <img src={`http://127.0.0.1:5000/static/${car.picture}`} alt={`${car.brand} ${car.model}`} />}
            </li>
          ))
        ) : (
          <p>No cars available.</p>
        )}
      </ul>
    </div>
  );
}


export default Notifications;
