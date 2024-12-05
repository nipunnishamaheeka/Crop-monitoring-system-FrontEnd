import { getCookie } from "../model/TokenModel.js";
export const save = (vehicleData) => {
  $.ajax({
    url: "http://localhost:5055/cropcontroller/api/v1/vehicle",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(vehicleData),
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    success: function (response) {
      console.log(" saved successfully:", response);
      console.log(vehicleData);
      swal("Success", "Crop Added successfully!", "success");
      $("#addVehicleForm")[0].reset();
      $("#addVehicleModal").modal("hide");
    },
    error: function (xhr, status, error) {
      console.error("Error saving :", xhr, status, error);
      swal("Error", "Failed to save!", "error");
    },
  });
};

export const getAll = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/vehicle/allVehicles",
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + getCookie("authToken"),
      },
      success: function (vehiclesList) {
        console.log(" retrieved successfully:", vehiclesList);
        resolve(vehiclesList);
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving :", xhr, status, error);
        swal("Error", "Failed to retrieve!", "error");
        reject([]);
      },
    });
  });
};
export const update = (vehicleCode, updatedVehicleData) => {
  $.ajax({
    url:
      `http://localhost:5055/cropcontroller/api/v1/vehicle/` +
      vehicleCode +
      "?staffId=" +
      updatedVehicleData.staffId,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updatedVehicleData),
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    success: function (response) {
      console.log("Updated successfully:", response);
      swal("Success", "Vehicle updated successfully!", "success");
      // $("#updateVehicleForm")[0].reset();
      $("#updateVehicleModal").modal("hide");
      // reloadTable();
    },
    error: function (xhr, status, error) {
      console.error("Error updating:", xhr, status, error);
      swal("Error", "Failed to update!", "error");
    },
  });
};

export const deleteVehicle = (vehicleCode) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/vehicle/` + vehicleCode,
    type: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    success: function (response) {
      console.log("deleted successfully:", response);
      swal("Success", "Vehicle deleted successfully!", "success");
    },
    error: function (xhr, status, error) {
      console.error("Error deleting :", xhr, status, error);
      swal("Error", "Failed to delete!", "error");
    },
  });
};
