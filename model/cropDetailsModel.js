import { getCookie } from "../model/TokenModel.js";

export const saveLogs = async (formData, reloadTable) => {
  try {
    const response = await $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/cropDetails",
      type: "POST",
      processData: false,
      contentType: false,
      data: formData,
      headers: {
        Authorization: "Bearer " + getCookie("authToken"),
      },
    });
    console.log("Log saved successfully:", response);
    alert("Log saved successfully!");
    reloadTable(); // Call reloadTable after saving
  } catch (xhr) {
    console.error("Error saving log:", xhr);
    alert("Failed to save log!");
  }
};

export const getAllLogs = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/cropDetails",
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + getCookie("authToken"),
      },
      success: function (logsList, textStatus, xhr) {
        if (xhr.status === 200) {
          console.log("Logs retrieved successfully:", logsList);
          resolve(logsList);
        } else {
          console.warn(`Unexpected status code: ${xhr.status}`);
          alert("Unexpected response from server.");
          reject([]);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving logs:", { xhr, status, error });
        if (xhr.readyState === 4) {
          alert("Failed to retrieve logs! Server returned an error.");
        } else if (xhr.readyState === 0) {
          alert("Failed to retrieve logs! Network error.");
        }
        reject([]);
      },
    });
  });
};

export const getOneLog = (logCode) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `http://localhost:5055/cropcontroller/api/v1/cropDetails/${logCode}`, // Replace `CD001` with `logCode`
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + getCookie("authToken"), // Retrieve the token from your cookie
      },
      success: function (response) {
        console.log("Log retrieved successfully:", response);
        resolve(response); // Resolve with the retrieved log
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving log:", { xhr, status, error });
        if (xhr.readyState === 4) {
          alert("Failed to retrieve log! Server returned an error.");
        } else if (xhr.readyState === 0) {
          alert("Failed to retrieve log! Network error.");
        }
        reject(error); // Reject with the error
      },
    });
  });
};


export const updateLogs = async (logCode, formData, reloadTable) => {
  try {
    const response = await $.ajax({
      url: `http://localhost:5055/cropcontroller/api/v1/cropDetails/${logCode}`,
      type: "PATCH",
      processData: false,
      contentType: false,
      data: formData,
      headers: {
        Authorization: "Bearer " + getCookie("authToken"),
      },
    });
    console.log("Log updated successfully:", response);
    alert("Log updated successfully!");
    reloadTable(); // Call reloadTable after updating
  } catch (error) {
    console.error("Error updating log:", error);
    alert("Failed to update log!");
  }
};

export const deleteLog = async (logCode, reloadTable) => {
  try {
    await $.ajax({
      url: `http://localhost:5055/cropcontroller/api/v1/cropDetails/${logCode}`,
      type: "DELETE",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + getCookie("authToken"),
      },
    });
    console.log("Log deleted successfully!");
    alert("Log deleted successfully!");
    reloadTable(); // Call reloadTable after deleting
  } catch (xhr) {
    console.error("Error deleting log:", xhr);
    alert("Failed to delete log!");
  }
};
