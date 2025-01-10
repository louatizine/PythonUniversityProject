import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error
  
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }
  
    try {
      // Send login request to the backend API
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, // Ensure this matches the backend
          password,
        }),
      });
  
      const data = await response.json();
      console.log("Backend Response:", data); // Debugging the full response
  
      if (response.ok) {
        // Store the JWT token in localStorage
        localStorage.setItem("token", data.access_token);
  
        console.log("User Role:", data.role); // Log the role for debugging
  
        // Check user role and navigate
        if (data.role && data.role.toLowerCase() === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/userRent");
        }
      } else {
        // Display error message if login fails
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      // Handle network or unexpected errors
      console.error("Error:", err);
      setError("An error occurred. Please try again later.");
    }
  };
  
  
  

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your email and password to log in.
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state for email
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />

            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update state for password
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
          </div>

          {error && (
            <Typography variant="small" color="red" className="text-center mb-4">
              {error}
            </Typography>
          )}

          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>

      

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Don't have an account?
            <Link to="/signup" className="text-gray-900 ml-1">Sign up</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
