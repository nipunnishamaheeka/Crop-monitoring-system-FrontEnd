import { getCookie } from "../model/TokenModel.js";
export const saveCrops = (cropsData) => {
  console.log("Crops data:", cropsData);
  const formData = new FormData();
  // formData.append("crop_code", cropsData.crop_code);
  formData.append("cropName", cropsData.cropCommonName);
  formData.append("cropType", cropsData.cropType);
  formData.append("cropSeason", cropsData.cropSeason);
  formData.append("cropScientificName", cropsData.cropScientificName);
  formData.append("fieldCode", cropsData.fieldCode);

  if (cropsData.cropImage) {
    formData.append("cropImage", cropsData.cropImage); // Append the file here
  }

  $.ajax({
    url: "http://localhost:5055/cropcontroller/api/v1/crops",
    type: "POST",
    data: formData,
    processData: false, // Tell jQuery not to process the data
    contentType: false, // Tell jQuery not to set contentType
    headers: {
      Authorization: "Bearer " + getCookie("authToken"), // Include token if required
    },
    success: function (response) {
      console.log("Crops saved successfully:", response);
      alert("Crops saved successfully!");
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
      headers: {
        Authorization: "Bearer " + getCookie("authToken"),
      },
      success: function (cropsList, textStatus, xhr) {
        if (xhr.status === 200) {
          console.log("Crops retrieved successfully:", cropsList);
          resolve(cropsList);
        } else {
          console.warn(`Unexpected status code: ${xhr.status}`);
          alert("Unexpected response from server.");
          reject([]);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving crops:", { xhr, status, error });
        if (xhr.readyState === 4) {
          alert("Failed to retrieve crops! Server returned an error.");
        } else if (xhr.readyState === 0) {
          alert("Failed to retrieve crops! Network error.");
        }
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
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    // xhrFields: { withCredentials: true }, // Include cookies
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
    url: `http://localhost:5055/cropcontroller/api/v1/crops/` + cropCode,
    type: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    // xhrFields: { withCredentials: true }, // Include cookies
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
