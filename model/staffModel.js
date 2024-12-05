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
      swal("Success", "Staff Added successfully!", "success");
      $("#addStaffForm")[0].reset();
      bootstrap.Modal.getInstance($("#addStaffModal")[0]).hide();
    },
    error: function (xhr, status, error) {
      console.error("Error saving:", xhr, status, error);
      swal("Error", "Failed to save!", "error");
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
          swal("Error", "Failed to retrieve!", "error");
        reject([]);
      },
    });
  });
};

export const update = async (staffId, updatedStaffData) => {
  try {
    const authToken = getCookie("authToken");

    if (!authToken) {
       swal(
         "Error",
         "Authorization token is missing. Please log in again.",
         "error"
       );
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
      console.log("Staff updated successfully:", response);
      swal("Success", "Staff updated successfully!", "success");

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
      
      swal("Success", "deleted successfully!", "success");
    },
    error: function (xhr, status, error) {
      console.error("Error deleting :", xhr, status, error);
       swal("Error", "Failed to deleting!", "error");
    },
  });
};
