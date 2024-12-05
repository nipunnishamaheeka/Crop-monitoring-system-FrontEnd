import { getCookie } from "../model/TokenModel.js";
export const save = (fieldData) => {
  console.log("Field data:", fieldData);

  const formData = new FormData();

  formData.append("fieldName", fieldData.fieldName || "");
  formData.append("fieldLocationX", fieldData.fieldLocationX || "");
  formData.append("fieldSize", fieldData.fieldSize || "");
  formData.append("fieldLocationY", fieldData.fieldLocationY || "");
  formData.append("staffId", fieldData.staffId || "");

  if (fieldData.image1) {
    formData.append("image1", fieldData.image1);
  }
  if (fieldData.image2) {
    formData.append("image2", fieldData.image2);
  }

  console.log("FormData initialized successfully");

  $.ajax({
    url: "http://localhost:5055/cropcontroller/api/v1/field",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    success: function (response) {
      console.log("Field saved successfully:", response);
      // alert("Field saved successfully!");
      $("#addFieldForm")[0].reset();
      $("#addFieldModal").modal("hide");
    },
    error: function (xhr, status, error) {
      console.error("Error saving field:", xhr, status, error);
      // alert("Failed to save field!");
    },
  });
};

export const getAll = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/field/allFields",
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + getCookie("authToken"),
      },
      success: function (fieldList) {
        console.log(" retrieved successfully:", fieldList);
        resolve(fieldList);
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving :", xhr, status, error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to retrieve fields. Please try again!",
        });
        reject([]);
      },
    });
  });
};

export const update = (code, updatedData, staffIds) => {
  const formData = new FormData();

  for (const key in updatedData) {
    if (updatedData[key] instanceof File) {
      formData.append(key, updatedData[key]);
    } else {
      formData.append(key, updatedData[key]);
    }
  }

  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/field/${code}?staffIds=${staffIds}`,
    type: "PUT",
    data: formData,
    processData: false,
    contentType: false,
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    success: function (response) {
      console.log("Updated successfully:", response);
      // alert("Field updated successfully!");

      const updateFieldForm = $("#updateFieldForm")[0];
      if (updateFieldForm) {
        updateFieldForm.reset();
      } else {
        console.warn("Form #updateFieldForm not found!");
      }

      $("#updateFieldModal").modal("hide");
      // reloadTable();
    },
    error: function (xhr, status, error) {
      console.error("Error updating:", xhr, status, error);
      //  alert("Failed to update field!");
    },
  });
};

export const deleteField = (code) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/field/` + code,
    type: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + getCookie("authToken"),
    },
    success: function (response) {
      console.log("deleted successfully:", response);
      // alert("deleted successfully!");
    },
    error: function (xhr, status, error) {
      console.error("Error deleting :", xhr, status, error);
      // alert("Failed to delete !");
    },
  });
};
