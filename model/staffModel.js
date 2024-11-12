export const save = (staffData) => {
  $.ajax({
    url: "http://localhost:5055/cropcontroller/api/v1/staff",
    type: "POST",
    ContentType: "application/json",
    data: JSON.stringify(staffData),
    success: function (response) {
      console.log(" saved successfully:", response);
      alert(" saved successfully!");
      $("#addStaffForm")[0].reset();
      $("#addStaffModal").modal("hide");
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
      url: "http://localhost:5055/cropcontroller/api/v1/staff/allStaff",
      type: "GET",
      contentType: "application/json",
      success: function (staffList) {
        console.log(" retrieved successfully:", staffList);
        resolve(staffList);
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving :", xhr, status, error);
        alert("Failed to retrieve !");
        reject([]);
      },
    });
  });
};

export const update = (staffId, updatedStaffData) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/staff/` + staffId,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updatedStaffData),
    success: function (response) {
      console.log("updated successfully:", response);
      alert("updated successfully!");
      $("#updateStaffForm")[0].reset();
      $("#updateStaffModal").modal("hide");
      reloadTable();
    },
    error: function (xhr, status, error) {
      console.error("Error updating :", xhr, status, error);
      alert("Failed to update !");
    },
  });
};

export const deleteStaff = (id) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/staff/` + id,
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
