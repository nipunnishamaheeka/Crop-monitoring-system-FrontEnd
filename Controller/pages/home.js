import { getAllCrops } from "../../model/cropsModel.js";
import { getAllStaff } from "../../model/staffModel.js";

import { getAll } from "../../model/vehiclesModel.js";

const updateCropSessionsChart = async () => {
  try {
    const cropsList = await getAllCrops();

    const seasons = ["Winter", "Spring", "Summer", "Autumn"];
    const cropDataBySeason = {
      Winter: 0,
      Spring: 0,
      Summer: 0,
      Autumn: 0,
    };

    cropsList.forEach((crop) => {
      const season = crop.cropSeason;
      if (cropDataBySeason[season] !== undefined) {
        cropDataBySeason[season]++;
      }
    });

    const data = seasons.map((season) => cropDataBySeason[season]);

    cropSessionsChart.data.labels = seasons;
    cropSessionsChart.data.datasets[0].data = data;
    cropSessionsChart.update();
  } catch (error) {
    console.error("Error updating the crop sessions chart:", error);
    Swal.fire("Error", "Failed to load crop data for sessions.", "error");
  }
};

const cropSessionsCtx = document
  .getElementById("cropSessionsChart")
  .getContext("2d");
const cropSessionsChart = new Chart(cropSessionsCtx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Crop Sessions",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
updateCropSessionsChart();

const updateVehicleAnalysisChart = async () => {
  try {
    const vehiclesList = await getAll();

    const vehicleCategories = [
      "Car",
      "Van",
      "Motorbike",
      "Tractors Land Masters",
      "Tractors 4WD",
      "Tankers Truck",
      "Land Vehicles",
      "Lorry",
    ];

    const vehicleCategoryCount = {
      Car: 0,
      Van: 0,
      Motorbike: 0,
      "Tractors Land Masters": 0,
      "Tractors 4WD": 0,
      "Tankers Truck": 0,
      "Land Vehicles": 0,
      Lorry: 0,
    };

    vehiclesList.forEach((vehicle) => {
      const category = vehicle.vehicleCategory;
      if (vehicleCategoryCount[category] !== undefined) {
        vehicleCategoryCount[category]++;
      }
    });

    const categories = vehicleCategories;
    const data = categories.map((category) => vehicleCategoryCount[category]);

    vehicleAnalysisChart.data.labels = categories;
    vehicleAnalysisChart.data.datasets[0].data = data;
    vehicleAnalysisChart.update();
  } catch (error) {
    console.error("Error updating vehicle analysis chart:", error);
    Swal.fire("Error", "Failed to load vehicle data for analysis.", "error");
  }
};

const cropAnalysisCtx = document
  .getElementById("cropAnalysisChart")
  .getContext("2d");
const vehicleAnalysisChart = new Chart(cropAnalysisCtx, {
  type: "doughnut",
  data: {
    labels: [],
    datasets: [
      {
        label: "Vehicle Analysis",
        data: [],
        backgroundColor: [
          "rgba(100, 149, 237, 0.5)", // Cornflower Blue
          "rgba(60, 179, 113, 0.5)", // Medium Sea Green
          "rgba(240, 230, 140, 0.5)", // Khaki
          "rgba(255, 182, 193, 0.5)", // Light Pink
          "rgba(216, 191, 216, 0.5)", // Thistle
          "rgba(176, 224, 230, 0.5)", // Powder Blue
          "rgba(255, 218, 185, 0.5)", // Peach Puff
          "rgba(144, 238, 144, 0.5)", // Light Green
        ],
        borderColor: [
          "rgba(100, 149, 237, 1)", // Cornflower Blue
          "rgba(60, 179, 113, 1)", // Medium Sea Green
          "rgba(240, 230, 140, 1)", // Khaki
          "rgba(255, 182, 193, 1)", // Light Pink
          "rgba(216, 191, 216, 1)", // Thistle
          "rgba(176, 224, 230, 1)", // Powder Blue
          "rgba(255, 218, 185, 1)", // Peach Puff
          "rgba(144, 238, 144, 1)", // Light Green
        ],

        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
  },
});

updateVehicleAnalysisChart();

// Function to update placeholder details
const updatePlaceholderDetails = () => {
  getAllCrops()
    .then((cropsList) => {
      const totalCrops = cropsList.length;
      document.getElementById("totalCrops").textContent = totalCrops;
    })
    .catch((error) => {
      console.error("Error fetching crops:", error);
      document.getElementById("totalCrops").textContent = 0;
    });

  getAllStaff()
    .then((staffList) => {
      const totalStaff = staffList.length;
      document.getElementById("totalStaff").textContent = totalStaff;
      const activeStaff = staffList.filter(
        (staff) => staff.status === "Active"
      ).length;
      document.getElementById("activeStaff").textContent = activeStaff;
    })
    .catch((error) => {
      console.error("Error fetching staff:", error);
      document.getElementById("totalStaff").textContent = 0;
      document.getElementById("activeStaff").textContent = 0;
    });

  getAll()
    .then((vehiclesList) => {
      const totalVehicles = vehiclesList.length;
      document.getElementById("totalVehicles").textContent = totalVehicles;
      const availableVehicles = vehiclesList.filter(
        (vehicle) => vehicle.status === "Available"
      ).length;
      document.getElementById("availableVehicles").textContent =
        availableVehicles;
    })
    .catch((error) => {
      console.error("Error fetching vehicles:", error);
      document.getElementById("totalVehicles").textContent = 0;
      document.getElementById("availableVehicles").textContent = 0;
    });
};

updatePlaceholderDetails();
