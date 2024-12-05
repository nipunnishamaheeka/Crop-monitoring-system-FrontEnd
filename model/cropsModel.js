import { getCookie } from "../model/TokenModel.js";

export const saveCrops = (cropsData) => {
  console.log("Crops data:", cropsData);
  const formData = new FormData();
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
      swal("Success", "Crop Added successfully!", "success");
      $("#addCropsForm")[0].reset();
      $("#addCropsModal").modal("hide");
    },
    error: function (xhr, status, error) {
      console.error("Error saving crops:", xhr, status, error);
      swal("Error", "Failed to save crops!", "error");
    },
  });
};

// export const getAllCrops = () => {
//   return new Promise((resolve, reject) => {
//     $.ajax({
//       url: "http://localhost:5055/cropcontroller/api/v1/crops/allCrops",
//       type: "GET",
//       contentType: "application/json",
//       headers: {
//         Authorization: "Bearer " + getCookie("authToken"),
//       },
//       success: function (cropsList, textStatus, xhr) {
//         if (xhr.status === 200) {
//           console.log("Crops retrieved successfully:", cropsList);
//           resolve(cropsList);
//         } else {
//           console.warn(`Unexpected status code: ${xhr.status}`);
//           swal("Warning", "Unexpected response from server.", "warning");
//           reject([]);
//         }
//       },
//       error: function (xhr, status, error) {
//         console.error("Error retrieving crops:", { xhr, status, error });
//         if (xhr.readyState === 4) {
//           swal(
//             "Error",
//             "Failed to retrieve crops! Server returned an error.",
//             "error"
//           );
//         } else if (xhr.readyState === 0) {
//           swal("Error", "Failed to retrieve crops! Network error.", "error");
//         }
//         reject([]);
//       },
//     });
//   });
// };

export const getAllCrops = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/crops/allCrops",
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${getCookie("authToken")}`,
      },
      success: function (cropsList, textStatus, xhr) {
        if (xhr.status === 200) {
          console.log("Crops retrieved successfully:", cropsList);
          resolve(cropsList);
        } else {
          console.warn(`Unexpected status code: ${xhr.status}`);
          Swal.fire(
            "Warning",
            "Unexpected response from the server.",
            "warning"
          );
          reject(new Error(`Unexpected status code: ${xhr.status}`));
        }
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving crops:", { xhr, status, error });

        let errorMessage = "An error occurred while retrieving crops.";
        if (xhr.readyState === 4) {
          errorMessage = "Failed to retrieve crops! Server returned an error.";
        } else if (xhr.readyState === 0) {
          errorMessage = "Failed to retrieve crops! Network error.";
        }

        Swal.fire("Error", errorMessage, "error");
        reject(new Error(errorMessage));
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
    success: function (response) {
      console.log("Crops updated successfully:", response);
      swal("Success", "Crops updated successfully!", "success");
      $("#updateCropsForm")[0].reset();
      $("#updateCropsModal").modal("hide");
      reloadTable();
    },
    error: function (xhr, status, error) {
      console.error("Error updating crops:", xhr, status, error);
      swal("Error", "Failed to update crops!", "error");
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
    success: function (response) {
      console.log("Crops deleted successfully:", response);
      swal("Success", "Crops deleted successfully!", "success");
    },
    error: function (xhr, status, error) {
      console.error("Error deleting crops:", xhr, status, error);
      swal("Error", "Failed to delete crops!", "error");
    },
  });
};
