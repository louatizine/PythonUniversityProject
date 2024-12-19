import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  ArrowRightOnRectangleIcon, // This is the logout icon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/auth";
import AdminRentals from "./pages/dashboard/adminRentals";
import { useNavigate } from "react-router-dom"; // For redirecting after logout
import LogoutPage from "./pages/dashboard/logout";

const icon = {
  className: "w-5 h-5 text-inherit",
};

const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Addcar",
        path: "/Addcar",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "userList",
        path: "/userList",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "carList",
        path: "/carList",
        element: <Notifications />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "list",
        path: "/list",
        element: <AdminRentals />,
      },
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />, // Logout icon
        name: "logout",
        path: "/logout",
        element: <LogoutPage />,
      },
    ],
  },
];


export default routes;
