import React, { useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export function Home() {
  const [statistics, setStatistics] = useState({
    total_users: 0,
    total_cars: 0,
    rented_cars: 0,
    unrented_cars: 0,
    monthly_rentals: {},
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/statistics');
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  // Prepare the pie chart data
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthData = months.map((month, index) => statistics.monthly_rentals[index + 1] || 0);

  const chartData = {
    labels: months,
    datasets: [
      {
        data: monthData,
        backgroundColor: monthData.map((_, index) => `hsl(${(index * 30) % 360}, 70%, 60%)`),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-12">
      {/* Statistics Overview Card */}
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
          </div>
        </CardBody>
      </Card>

      {/* Pie chart showing monthly rentals */}
      <Card className="mb-12">
        <CardHeader floated={false} color="blue-gray" className="py-6">
          <Typography variant="h5" color="white">
            Monthly Car Rentals
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center h-72">
            <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Home;
