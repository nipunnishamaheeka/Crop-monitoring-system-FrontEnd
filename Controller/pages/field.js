import { deleteField, getAll, save, update } from "../../model/fieldModel.js";
import { getAllStaff } from "../../model/staffModel.js";

$(document).ready(function () {
  let editingFieldCode = null; // Variable to track the field being edited

  // Load staff data into the dropdown
  async function loadStaffData() {
    try {
      const staffs = await getAllStaff();
      const staffSelect = $("#staffCode");
      staffSelect.empty();
      staffSelect.append(`<option value="">Select Staff</option>`);
      staffs.forEach((staff) => {
        staffSelect.append(
          `<option value="${staff.id}">${staff.firstName} ${
            staff.lastName || ""
          }</option>`
        );
      });
      window.staffData = staffs;
    } catch (error) {
      console.error("Error loading staff data:", error);
    }
  }

  // Preview uploaded image
  function previewImage(event, previewId) {
    const reader = new FileReader();
    reader.onload = function () {
      $(`#${previewId}`).attr("src", reader.result).show();
    };
    const file = event.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  // Show the Add Field modal
  $("#addFieldPopup").click(function () {
    const addFieldModal = new bootstrap.Modal($("#addFieldModal")[0]);
    addFieldModal.show();
    $("#addFieldForm")[0].reset();
    $("#preview1").hide();
    $("#preview2").hide();
    editingFieldCode = null;
  });

  // Handle image previews
  $("#image1").change(function (event) {
    previewImage(event, "preview1");
  });
  $("#image2").change(function (event) {
    previewImage(event, "preview2");
  });

  // Submit the Add/Edit Field form
  $("#addFieldForm").submit(async function (event) {
    event.preventDefault();

    const fieldData = {
      fieldCode: $("#fieldCode").val(),
      fieldName: $("#fieldName").val(),
      fieldLocationX: parseFloat($("#fieldLocationX").val()),
      fieldLocationY: parseFloat($("#fieldLocationY").val()),
      fieldSize: parseFloat($("#fieldSize").val()),
      staffIds: $("#staffCode").val(),
      image1: $("#image1")[0].files[0],
      image2: $("#image2")[0].files[0],
    };

    try {
      if (editingFieldCode) {
        // Perform Update
        await update(editingFieldCode, fieldData);
        reloadTable();
        alert("Field updated successfully!");
      } else {
        // Perform Add
        await save(fieldData);
        alert("Field added successfully!");
        reloadTable();
      }
      $("#addFieldForm")[0].reset();
      $("#preview1").hide();
      $("#preview2").hide();
      bootstrap.Modal.getInstance($("#addFieldModal")[0]).hide();
      reloadTable();
    } catch (error) {
      console.error("Error saving or updating field:", error);
      console.log(update);
      alert("Failed to save or update field!");
    }
  });

  // Reload the table with field data
  async function reloadTable() {
    try {
      const fields = await getAll();
      $("tbody.tableRow").empty();
      fields.forEach((field) => {
        loadTable(field);
      });
    } catch (error) {
      console.error("Error loading fields:", error);
    }
  }

  // Load field data into the table
  function loadTable(fieldData) {
    const fieldLocation = `${fieldData.fieldLocation.x}, ${fieldData.fieldLocation.y}`;
    const staffNames =
      fieldData.staff.map((staff) => staff.firstName).join(", ") ||
      "Unassigned";

    const rowHtml = `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${fieldData.code}</td>
        <td>${fieldData.fieldName}</td>
        <td>${fieldLocation}</td>
        <td>${fieldData.fieldSize}</td>
        <td>${
          fieldData.crop && fieldData.crop.length > 0
            ? fieldData.crop.map((crop) => crop.name).join(", ")
            : "Unassigned"
        }</td>
        <td>${staffNames}</td>
        <td><img src="${base64ToImageURL(
          fieldData.image1
        )}" class="img-thumbnail" style="max-width: 50px;" /></td>
        <td><img src="${base64ToImageURL(
          fieldData.image2
        )}" class="img-thumbnail" style="max-width: 50px;" /></td>
        <td>
          <button class="btn btn-outline-primary btn-sm editBtn" data-id="${
            fieldData.code
          }">Edit</button>
          <button class="btn btn-outline-danger btn-sm removeBtn" data-id="${
            fieldData.code
          }">Delete</button>
        </td>
      </tr>
    `;
    $("tbody.tableRow").append(rowHtml);
  }

  // Convert base64 to image URL
  function base64ToImageURL(base64Data) {
    return `data:image/png;base64,${base64Data}`;
  }

  // Handle delete field action
  $(document).on("click", ".removeBtn", async function () {
    const code = $(this).data("id");
    try {
      await deleteField(code);
      alert("Field deleted successfully!");
      reloadTable();
    } catch (error) {
      console.error("Error deleting field:", error);
      alert("Failed to delete field!");
    }
  });

  // Handle edit field action
  $(document).on("click", ".editBtn", async function () {
    const code = $(this).data("id");
    try {
      const field = await getAll().then((fields) =>
        fields.find((field) => field.code === code)
      );
      if (field) {
        $("#fieldCode").val(field.code);
        $("#fieldName").val(field.fieldName);
        $("#fieldLocationX").val(field.fieldLocation.x);
        $("#fieldLocationY").val(field.fieldLocation.y);
        $("#fieldSize").val(field.fieldSize);
        $("#staffCode").val(field.staff.map((s) => s.id)); // Multiple staff IDs can be selected
        $("#preview1").attr("src", base64ToImageURL(field.image1)).show();
        $("#preview2").attr("src", base64ToImageURL(field.image2)).show();
        const addFieldModal = new bootstrap.Modal($("#addFieldModal")[0]);
        addFieldModal.show();
        editingFieldCode = code; // Set the code for updating
      }
    } catch (error) {
      console.error("Error fetching field data:", error);
    }
  });

  // Initial load of staff data and fields
  loadStaffData();
  reloadTable();
});
