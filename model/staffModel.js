import { getCookie } from "../model/TokenModel.js";
export const save = (staffData) => {
  console.log("Authorization Token:", getCookie("authToken"));
  console.log("Staff Data:", staffData);

  $.ajax({
    url: "http://localhost:5055/cropcontroller/api/v1/staff",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(staffData),
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    success: function (response) {
      console.log("Saved successfully:", response);
      alert("Saved successfully!");
      $("#addStaffForm")[0].reset();
      bootstrap.Modal.getInstance($("#addStaffModal")[0]).hide();
    },
    error: function (xhr, status, error) {
      console.error("Error saving:", xhr, status, error);
      alert("Failed to save!");
    },
  });
};

export const getAllStaff = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/staff/allStaff",
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + getCookie("authToken"),
      },
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

export const update = async (staffId, updatedStaffData) => {
  try {
    const authToken = getCookie("authToken");

    if (!authToken) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }

    const response = await $.ajax({
      url: `http://localhost:5055/cropcontroller/api/v1/staff/${staffId}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(updatedStaffData),
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response && response.success) {
      // Assuming the response includes a 'success' field for validation
      console.log("Staff updated successfully:", response);
      alert("Staff updated successfully!");

      // Reset the form, hide the modal, and refresh the table
      $("#updateStaffForm")[0].reset();
      $("#updateStaffModal").modal("hide");
      reloadTable();
    } else {
      throw new Error(
        "Update succeeded but the response format is unexpected."
      );
    }
  }
  catch (error) {
    // console.error("Error updating staff:", error);

  }
};



export const deleteStaff = (id) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/staff/` + id,
    type: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
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
