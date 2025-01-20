import React, { useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { Pie, Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  BarElement, 
  CategoryScale, 
  LinearScale 
} from "chart.js";

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

export function Home() {
  const [statistics, setStatistics] = useState({
    total_users: 0,
    total_cars: 0,
    rented_cars: 0,
    unrented_cars: 0,
    total_revenue: 0,
    monthly_rentals: {},
    monthly_revenue: {},
    most_rented_car: null,
    best_client: null, // New field for best client
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/statistics");
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRentals = months.map((_, index) => statistics.monthly_rentals[index + 1] || 0);
  const monthlyRevenue = months.map((_, index) => statistics.monthly_revenue[index + 1] || 0);

  const rentalChartData = {
    labels: months,
    datasets: [
      {
        data: monthlyRentals,
        backgroundColor: months.map((_, index) => `hsl(${(index * 30) % 360}, 70%, 60%)`),
      },
    ],
  };

  const revenueChartData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenue,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="mt-12">
      <Card className="mb-12">
        <CardHeader floated={false} color="blue-gray" className="py-6">
          <Typography variant="h5" color="white">
            Statistics Overview
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <Typography variant="h6" className="font-semibold text-gray-600">Total Users</Typography>
              <Typography className="text-2xl font-bold">{statistics.total_users}</Typography>
            </Card>
            <Card className="p-4">
              <Typography variant="h6" className="font-semibold text-gray-600">Total Cars</Typography>
              <Typography className="text-2xl font-bold">{statistics.total_cars}</Typography>
            </Card>
            <Card className="p-4">
              <Typography variant="h6" className="font-semibold text-gray-600">Rented Cars</Typography>
              <Typography className="text-2xl font-bold">{statistics.rented_cars}</Typography>
            </Card>
            <Card className="p-4">
              <Typography variant="h6" className="font-semibold text-gray-600">Unrented Cars</Typography>
              <Typography className="text-2xl font-bold">{statistics.unrented_cars}</Typography>
            </Card>
            <Card className="p-4">
              <Typography variant="h6" className="font-semibold text-gray-600">Total Revenue</Typography>
              <Typography className="text-2xl font-bold">{statistics.total_revenue.toFixed(2)}DT</Typography>
            </Card>
            <Card className="p-4">
              <Typography variant="h6" className="font-semibold text-gray-600">Most Rented Car</Typography>
              <Typography className="text-xl font-bold">
                {statistics.most_rented_car
                  ? `${statistics.most_rented_car.marke} ${statistics.most_rented_car.model}`
                  : "N/A"}
              </Typography>
            </Card>
            
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="mb-12">
          <CardHeader floated={false} color="blue-gray" className="py-6">
            <Typography variant="h5" color="white">
              Monthly Rentals
            </Typography>
          </CardHeader>
          <CardBody>
            <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
              <Pie data={rentalChartData} options={pieChartOptions} />
            </div>
          </CardBody>
        </Card>

        <Card className="mb-12">
          <CardHeader floated={false} color="blue-gray" className="py-6">
            <Typography variant="h5" color="white">
              Monthly Revenue
            </Typography>
          </CardHeader>
          <CardBody>
            <Bar data={revenueChartData} options={barChartOptions} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
