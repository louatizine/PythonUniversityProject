import React, { useState } from "react";
import axios from "axios";

export function Profile() { 
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    picture: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      picture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("access_token");
    if (!token) {
      setMessage("You must be logged in to add a car.");
      return;
    }
  
    const carData = new FormData();
    carData.append("marke", formData.brand);
    carData.append("model", formData.model);
    carData.append("year", formData.year);
    carData.append("price_per_day", formData.price);
    if (formData.picture) carData.append("picture", formData.picture);
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/cars", carData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Car added successfully!");
      setFormData({
        brand: "",
        model: "",
        year: "",
        price: "",
        picture: null,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Failed to add car.");
      } else {
        setMessage("An error occurred while adding the car.");
      }
    }
  };
  
  return (
    <div className="add-car-form">
      <h1>Add a New Car</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Brand:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Model:</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Year:</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price per day:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Picture:</label>
          <input type="file" name="picture" onChange={handleFileChange} />
        </div>
        <button type="submit">Add Car</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;
















{/* <div className="px-4 pb-4">
<Typography variant="h6" color="blue-gray" className="mb-2">
  Projects
</Typography>
<Typography
  variant="small"
  className="font-normal text-blue-gray-500"
>
  Architects design houses
</Typography>
<div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
  {projectsData.map(
    ({ img, title, description, tag, route, members }) => (
      <Card key={title} color="transparent" shadow={false}>
        <CardHeader
          floated={false}
          color="gray"
          className="mx-0 mt-0 mb-4 h-64 xl:h-40"
        >
          <img
            src={img}
            alt={title}
            className="h-full w-full object-cover"
          />
        </CardHeader>
        <CardBody className="py-0 px-1">
          <Typography
            variant="small"
            className="font-normal text-blue-gray-500"
          >
            {tag}
          </Typography>
          <Typography
            variant="h5"
            color="blue-gray"
            className="mt-1 mb-2"
          >
            {title}
          </Typography>
          <Typography
            variant="small"
            className="font-normal text-blue-gray-500"
          >
            {description}
          </Typography>
        </CardBody>
        <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
          <Link to={route}>
            <Button variant="outlined" size="sm">
              view project
            </Button>
          </Link>
          <div>
            {members.map(({ img, name }, key) => (
              <Tooltip key={name} content={name}>
                <Avatar
                  src={img}
                  alt={name}
                  size="xs"
                  variant="circular"
                  className={`cursor-pointer border-2 border-white ${
                    key === 0 ? "" : "-ml-2.5"
                  }`}
                />
              </Tooltip>
            ))}
          </div>
        </CardFooter>
      </Card>
    )
  )}
</div>
</div> */}