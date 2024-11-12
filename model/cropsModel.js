export const saveCrops = (cropsData) => {
  
  $.ajax({
    url: "http://localhost:5055/cropcontroller/api/v1/crops",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(cropsData),
    success: function (response) {
      console.log("Crops saved successfully:", response);
      alert("Crops saved successfully!");
      console.log("model ekath awda bn ");
      console.log(cropsData);
      
      $("#addCropsForm")[0].reset(); 
      $("#addCropsModal").modal("hide"); 
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
        resolve(cropsList); 
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving crops:", xhr, status, error);
        alert("Failed to retrieve crops!");
        reject([]); 
      },
    });
  });
};

export const updateCrops = (cropCode, updatedCropData) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/crops/` + cropCode,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updatedCropData),
    success: function (response) {
      console.log("Crops updated successfully:", response);
      alert("Crops updated successfully!");
      $("#updateCropsForm")[0].reset();
      $("#updateCropsModal").modal("hide");
      reloadTable();
    },
    error: function (xhr, status, error) {
      console.error("Error updating crops:", xhr, status, error);
      alert("Failed to update crops!");
    },
  });
};

export const deleteCrops = (cropCode) => {
  $.ajax({
    url:
      `http://localhost:5055/cropcontroller/api/v1/crops/`+ cropCode,
    type: "DELETE",
    contentType: "application/json",
    success: function (response) {
      console.log("Crops deleted successfully:", response);
      alert("Crops deleted successfully!");
    },
    error: function (xhr, status, error) {
      console.error("Error deleting crops:", xhr, status, error);
      alert("Failed to delete crops!");
    },
  });
};

