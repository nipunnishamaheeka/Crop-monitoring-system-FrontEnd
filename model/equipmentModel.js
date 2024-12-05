import { getCookie } from "../model/TokenModel.js";
export const save = (equipmentData) => {
  $.ajax({
    url: "http://localhost:5055/cropcontroller/api/v1/equipment",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(equipmentData),
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    success: function (response) {
      console.log(" saved successfully:", response);
      swal({
        icon: "success",
        title: "Success",
        text: "Saved successfully!",
      });
      console.log("model ekath awda bn ");
      console.log(equipmentData);

      $("#addEquipmentForm")[0].reset();
      $("#addEquipmentModal").modal("hide");
    },
    error: function (xhr, status, error) {
      console.error("Error saving :", xhr, status, error);
      swal({
        icon: "error",
        title: "Error",
        text: "Failed to save!",
      });
    },
  });
};

export const getAllEquipments = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/equipment/allEquipments",
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + getCookie("authToken"),
      },
      success: function (equipmentsList) {
        console.log(" retrieved successfully:", equipmentsList);
        resolve(equipmentsList);
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving :", xhr, status, error);
        swal({
          icon: "error",
          title: "Error",
          text: "Failed to retrieve!",
        });
        reject([]);
      },
    });
  });
};

export const update = (equipmentId, updatedEquipmentData) => {
  $.ajax({
    url:
      `http://localhost:5055/cropcontroller/api/v1/equipment/` +
      equipmentId +
      "?staffId=" +
      updatedEquipmentData.staffId +
      "&fieldCode=" +
      updatedEquipmentData.fieldCode,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updatedEquipmentData),
    dataType: "text",
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    success: function (response) {
      console.log("Updated successfully:", response);
      swal({
        icon: "success",
        title: "Success",
        text: "Updated successfully!",
      });
    },
    error: function (xhr, status, error) {
      console.error(
        "Error updating:",
        xhr.responseText || xhr.statusText,
        status,
        error
      );
      swal({
        icon: "error",
        title: "Error",
        text: "Failed to update!",
      });
    },
  });
};

export const deleteEquipment = (equipmentId) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/equipment/` + equipmentId,
    type: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    success: function (response) {
      console.log("deleted successfully:", response);
      swal({
        icon: "success",
        title: "Success",
        text: "Deleted successfully!",
      });
    },
    error: function (xhr, status, error) {
      console.error("Error deleting :", xhr, status, error);
      swal({
        icon: "error",
        title: "Error",
        text: "Failed to delete!",
      });
    },
  });
};
