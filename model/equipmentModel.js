export const save = (equipmentData) => {
  $.ajax({
    url: "http://localhost:5055/cropcontroller/api/v1/equipment",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(equipmentData),
    success: function (response) {
      ReloadTable();
      console.log(" saved successfully:", response);
      alert(" saved successfully!");
      console.log("model ekath awda bn ");
      console.log(equipmentData);

      $("#addEquipmentForm")[0].reset();
      $("#addEquipmentModal").modal("hide");
    },
    error: function (xhr, status, error) {
      console.error("Error saving :", xhr, status, error);
      alert("Failed to save !");
    },
  });
};

export const getAllEquipments = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/equipment/allEquipments",
      type: "GET",
      contentType: "application/json",
      success: function (equipmentsList) {
        console.log(" retrieved successfully:", equipmentsList);
        resolve(equipmentsList);
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving :", xhr, status, error);
        alert("Failed to retrieve !");
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
    success: function (response) {
      ReloadTable();
      console.log("Updated successfully:", response);
      alert("Updated successfully!");
    },
    error: function (xhr, status, error) {
      console.error(
        "Error updating:",
        xhr.responseText || xhr.statusText,
        status,
        error
      );
      alert("Failed to update!");
    },
  });
};

export const deleteEquipment = (equipmentId) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/equipment/` + equipmentId,
    type: "DELETE",
    contentType: "application/json",
    success: function (response) {
      console.log("deleted successfully:", response);
      alert("deleted successfully!");
    },
    error: function (xhr, status, error) {
      console.error("Error deleting :", xhr, status, error);
      alert("Failed to delete !");
    },
  });
};
