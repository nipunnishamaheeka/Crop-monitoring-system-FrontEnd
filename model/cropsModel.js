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
