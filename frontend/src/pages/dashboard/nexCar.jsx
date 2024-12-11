import { useState } from "react";

function AddCarForm() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newCar = {
      make,
      model,
      year,
      color,
      price_per_day: pricePerDay,
    };

    try {
      const response = await fetch("http://localhost:5000/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer <your_jwt_token>`,
        },
        body: JSON.stringify(newCar),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Car added successfully");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Make"
        value={make}
        onChange={(e) => setMake(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price per Day"
        value={pricePerDay}
        onChange={(e) => setPricePerDay(e.target.value)}
        required
      />
      <button type="submit">Add Car</button>
    </form>
  );
}
