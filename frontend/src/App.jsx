import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn, SignUp } from "./auth";
import { Notifications, Profile } from "./pages/dashboard";
import CarList from "./pages/dashboard/userRentCar";
import UserRentalList from "./pages/dashboard/userRentalList";
import AdminRentals from "./pages/dashboard/adminRentals";
import UserProfile from "./pages/dashboard/userProfile";

function App() {
  return (
    <Routes>
      <Route path="userprofile" element={<UserProfile />} />
      <Route path="userRent" element={<CarList />} />
      <Route path="userRentlist" element={<UserRentalList />} />
      <Route path="profile" element={<Profile />} />
      <Route path="notification" element={<Notifications />} />
      <Route path="list" element={<AdminRentals />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="signin" replace />} />
      
    </Routes>
  );
}

export default App;
