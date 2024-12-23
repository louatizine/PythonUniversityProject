// src/components/StatisticsDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  BanknotesIcon,
  UsersIcon,
  UserPlusIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

const StatisticsCard = ({ color, icon, title, value, description }) => {
  return (
    <Card className="mt-6 mx-auto w-11/12">
      <CardHeader className={`relative h-20 flex items-center justify-center ${color}`}>
        <div className="flex items-center gap-4">
          <div>{icon}</div>
          <Typography variant="h5" color="white">
            {title}
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {value}
        </Typography>
        <Typography className="text-sm text-gray-600">
          {description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0 flex justify-center">
        <Button size="sm" color="blue">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function StatisticsDashboard() {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/statistics");
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  if (!statistics) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  const statisticsCardsData = [
    {
      color: "bg-blue-500",
      icon: <BanknotesIcon className="w-8 h-8 text-white" />,
      title: "Total Users",
      value: statistics.total_users,
      description: "The total number of registered users.",
    },
    {
      color: "bg-teal-400",
      icon: <UsersIcon className="w-8 h-8 text-white" />,
      title: "Total Cars",
      value: statistics.total_cars,
      description: "The total number of cars available in the system.",
    },
    {
      color: "bg-yellow-400",
      icon: <UserPlusIcon className="w-8 h-8 text-white" />,
      title: "Rented Cars",
      value: statistics.rented_cars,
      description: "The total number of cars currently rented.",
    },
    {
      color: "bg-purple-500",
      icon: <ChartBarIcon className="w-8 h-8 text-white" />,
      title: "Available Cars",
      value: statistics.unrented_cars,
      description: "The total number of cars available for rent.",
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {statisticsCardsData.map((stat, index) => (
        <StatisticsCard
          key={index}
          color={stat.color}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          description={stat.description}
        />
      ))}
    </div>
  );
}
