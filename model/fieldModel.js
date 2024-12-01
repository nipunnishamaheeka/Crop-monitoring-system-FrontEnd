// export const save = (fieldData) => {
//   $.ajax({
//     url: "http://localhost:5055/cropcontroller/api/v1/field",
//     type: "POST",
//     contentType: "application/json",
//     data: JSON.stringify(fieldData),
//     success: function (response) {
//       console.log(" saved successfully:", response);
//       alert(" saved successfully!");
//       $("#addFieldForm")[0].reset();
//       $("#addFieldModal").modal("hide");
//     },
//     error: function (xhr, status, error) {
//       console.error("Error saving :", xhr, status, error);
//       alert("Failed to save !");
//     },
//   });
// };
export const save = (fieldData) => {
  console.log("Field data:", fieldData);

  // Create a FormData object
  const formData = new FormData();

  // Append field details to FormData
  formData.append("fieldName", fieldData.fieldName || "");
  formData.append("fieldLocationX", fieldData.fieldLocationX || "");
  formData.append("fieldSize", fieldData.fieldSize || "");
  formData.append("fieldLocationY", fieldData.fieldLocationY || "");
  formData.append("staffId", fieldData.staffId || "");

  // Check for images and append them
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
    processData: false, // Tell jQuery not to process the data
    contentType: false, // Tell jQuery not to set contentType
    success: function (response) {
      console.log("Field saved successfully:", response);
      alert("Field saved successfully!");
      $("#addFieldForm")[0].reset();
      $("#addFieldModal").modal("hide");
    },
    error: function (xhr, status, error) {
      console.error("Error saving field:", xhr, status, error);
      alert("Failed to save field!");
    },
  });
};

export const getAll = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/field/allFields",
      type: "GET",
      contentType: "application/json",
      success: function (fieldList) {
        console.log(" retrieved successfully:", fieldList);
        resolve(fieldList);
      },
      error: function (xhr, status, error) {
        console.error("Error retrieving :", xhr, status, error);
        alert("Failed to retrieve !");
        reject([]);
      },
    });
  });
};

export const update = (code, updatedData) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/field/` + code,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updatedData),
    success: function (response) {
      console.log("updated successfully:", response);
      alert("updated successfully!");
      $("#updateFieldForm")[0].reset();
      $("#updateFieldModal").modal("hide");
      reloadTable();
    },
    error: function (xhr, status, error) {
      console.error("Error updating :", xhr, status, error);
      alert("Failed to update !");
    },
  });
};

export const deleteField = (code) => {
  $.ajax({
    url: `http://localhost:5055/cropcontroller/api/v1/field/` + code,
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
