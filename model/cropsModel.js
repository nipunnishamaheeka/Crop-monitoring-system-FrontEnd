export const saveCrops = (cropsData) => {
  // Make AJAX request to save crops
  $.ajax({
    url: "http://localhost:5055/cropcontroller/api/v1/crops",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(cropsData),
    success: function (response) {
      console.log("Crops saved successfully:", response);
      alert("Crops saved successfully!");
      $("#addCropsForm")[0].reset(); // Reset the form
      $("#addCropsModal").modal("hide"); // Hide the modal
    },
    error: function (xhr, status, error) {
      console.error("Error saving crops:", xhr, status, error);
      alert("Failed to save crops!");
    },
  });
};

export const getAllCrops = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/crops/allCrops",
      type: "GET",
      contentType: "application/json",
      success: function (cropsList) {
        console.log("Crops retrieved successfully:", cropsList);
        resolve(cropsList); // Resolve the Promise with the crops list
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving crops:", xhr, status, error);
        alert("Failed to retrieve crops!");
        reject([]); // Reject with an empty array in case of an error
      },
    });
  });
};

export const deleteCrops = (cropCode) => {
  // Make AJAX request to delete crops
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/crops?id=${cropCode}`,
    type: "DELETE",
    contentType: "application/json",
    success: function (response) {
      console.log("Crops deleted successfully:", response);
      alert("Crops deleted successfully!");
      // Optionally, refresh the crops list or update the UI
      // For example, you can call getAllCrops() to refresh the crop list
    },
    error: function (xhr, status, error) {
      console.error("Error deleting crops:", xhr, status, error);
      alert("Failed to delete crops!");
    },
  });
};

