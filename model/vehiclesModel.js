export const save = (vehicleData) => {
  $.ajax({
    url: "http://localhost:5055/cropcontroller/api/v1/vehicle",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(vehicleData),
    success: function (response) {
      console.log(" saved successfully:", response);
      console.log(vehicleData);
      alert(" saved successfully!");
      $("#addVehicleForm")[0].reset();
      $("#addVehicleModal").modal("hide");
    },
    error: function (xhr, status, error) {
      console.error("Error saving :", xhr, status, error);
      alert("Failed to save !");
    },
  });
};

export const getAll = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/vehicle/allVehicles",
      type: "GET",
      contentType: "application/json",
      success: function (vehiclesList) {
        console.log(" retrieved successfully:", vehiclesList);
        resolve(vehiclesList);
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving :", xhr, status, error);
        alert("Failed to retrieve !");
        reject([]);
      },
    });
  });
};
export const update = (vehicleCode, updatedVehicleData, id) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/vehicle/${vehicleCode}?staffId=${id}`,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updatedVehicleData),
    success: function (response) {
      console.log("Updated successfully:", response);
      alert("Updated successfully!");
      $("#updateVehicleForm")[0].reset();
      $("#updateVehicleModal").modal("hide");
      reloadTable();
    },
    error: function (xhr, status, error) {
      console.error("Error updating:", xhr, status, error);
      alert("Failed to update!");
    },
  });
};

export const deleteVehicle = (vehicleCode) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/vehicle/` + vehicleCode,
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
