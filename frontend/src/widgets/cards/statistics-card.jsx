import React, { useState, useEffect } from "react";

const StatisticsCard = () => {
/*   const [statistics, setStatistics] = useState(null);

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

  return (
    <div className="flex justify-center items-center h-screen gap-1000">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-xs w-full text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Rented Cars</h2>
        <p className="text-gray-600 text-lg">{statistics.rented_cars}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 max-w-xs w-full text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Cars</h2>
        <p className="text-gray-600 text-lg">{statistics.total_cars}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 max-w-xs w-full text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Users</h2>
        <p className="text-gray-600 text-lg">{statistics.total_users}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 max-w-xs w-full text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Unrented Cars</h2>
        <p className="text-gray-600 text-lg">{statistics.unrented_cars}</p>
      </div>
    </div>
  );
}; 
*/
}
export default StatisticsCard;
