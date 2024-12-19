import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear(); 


    navigate("/signin"); 
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging out...</p>
    </div>
  );
};

export default LogoutPage;
