import { deleteField, getAll, save, update } from "../../model/fieldModel.js";
import { getAllStaff } from "../../model/staffModel.js";

$(document).ready(function () {
  let editingFieldCode = null;
  loadStaffData();
  $("#addFieldPopup").click(function () {
    const addFieldModal = new bootstrap.Modal($("#addFieldModal")[0]);
    addFieldModal.show();
    $("#addFieldForm")[0].reset();
    $("#preview1").hide();
    $("#preview2").hide();
    editingFieldCode = null;
  });

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

  $("#image1").change(function (event) {
    previewImage(event, "preview1");
  });

  $("#f_image2").change(function (event) {
    previewImage(event, "preview2");
  });

  $("#addFieldForm").submit(async function (event) {
    event.preventDefault();

    // const fieldImage1 = $("#image1")[0].files[0];
    // const fieldImage2 = $("#image2")[0].files[0];
    const fieldData = {
      code: $("#fieldCode").val(),
      name: $("#fieldName").val(),
      location: $("#fieldLocation").val(),
      size_of_Field: $("#fieldSize").val(),
      // c_code: $("#crops").val(),
      // staffId: $("#staff").val(),
      // fieldImage1: fieldImage1 ? URL.createObjectURL(fieldImage1) : null,
      // fieldImage2: fieldImage2 ? URL.createObjectURL(fieldImage2) : null,
    };

    try {
      if (editingFieldCode) {
        await update(editingFieldCode, fieldData);
        alert("updated successfully!");
      } else {
        await save(fieldData);
        alert("added successfully!");
      }
      $("#addFieldForm")[0].reset();
      $("#preview1").hide();
      $("#preview2").hide();
      bootstrap.Modal.getInstance($("#addFieldModal")[0]).hide();
      // reloadTable();
    } catch (error) {
      console.error("Error saving or updating :", error);
      alert("Failed to save or update !");
    }
  });

  // Load Field Data for the dropdown
  async function loadStaffData() {
    try {
      const staffs = await getAllStaff();
      const staffSelect = $("#staffCode");
      staffSelect.empty();
      staffSelect.append(`<option value="">Select Staff</option>`);

      staffs.forEach(function (staff) {
        staffSelect.append(
          `<option value="${staff.staff_id}">${staff.fristName}</option>`
        );
      });
      window.StaffData = staffs;
    } catch (error) {
      console.error("Error loading field data:", error);
    }
  }

  async function reloadTable() {
    try {
      const fields = await getAll();
      $("tbody.tableRow").empty();
      fields.forEach((field) => {
        loadTable(field);
      });
    } catch (error) {
      console.error("Error loading :", error);
    }
  }

  function loadTable(fieldData) {
    const rowHtml = `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${fieldData.code}</td>
        <td>${fieldData.name}</td>
        <td>${fieldData.location}</td>
        <td>${fieldData.size_of_Field}</td>
        <td>${fieldData.crops}</td>
        <td>${fieldData.staffId}</td>
         <td><img src="${fieldData.fieldImage1}" class="img-thumbnail" style="max-width: 50px;" /></td>
         <td><img src="${fieldData.fieldImage2}" class="img-thumbnail" style="max-width: 50px;" /></td>
        <td>
          <button class="btn btn-outline-primary btn-sm editBtn" data-id="${fieldData.code}">Edit</button>
          <button class="btn btn-outline-danger btn-sm removeBtn" data-id="${fieldData.code}">Delete</button>
          
        </td>
      </tr>
    `;
    $("tbody.tableRow").append(rowHtml);
  }

  reloadTable();

  $(document).on("click", ".removeBtn", async function () {
    const code = $(this).data("id");
    try {
      await deleteField(code);
      alert("Field Deleted");
      reloadTable();
    } catch (error) {
      console.error("Error deleting :", error);
      alert("Failed to delete !");
    }
  });

  $(document).on("click", ".editBtn", async function () {
    const code = $(this).data("id");
    try {
      const field = await getAll().then((fields) =>
        fields.find((field) => field.code === code)
      );
      if (field) {
        $("#fieldCode").val(field.code);
        $("#fieldName").val(field.name);
        $("#fieldLocation").val(field.location);
        $("#fieldSize").val(field.size_of_Field);
        $("#crops").val(field.crops);
        $("#staff").val(field.staffId);
        $("#preview1").attr("src", field.fieldImage1).show();
        $("#preview2").attr("src", field.fieldImage2).show();
        const addFieldModal = new bootstrap.Modal($("#addFieldModal")[0]);
        addFieldModal.show();
        editingFieldCode = code;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
});
