import { deleteField, getAll, save, update } from "../../model/fieldModel.js";
import { getAllStaff } from "../../model/staffModel.js";

$(document).ready(function () {
  let editingFieldCode = null;

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
      swal("Error", "Failed to load staff data. Please try again.", "error");
    }
  }

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

  $("#addFieldPopup").click(function () {
    const addFieldModal = new bootstrap.Modal($("#addFieldModal")[0]);
    addFieldModal.show();
    $("#addFieldForm")[0].reset();
    $("#preview1, #preview2").hide();
    editingFieldCode = null;
  });

  $("#image1").change((event) => previewImage(event, "preview1"));
  $("#image2").change((event) => previewImage(event, "preview2"));

  $("#addFieldForm").submit(async function (event) {
    event.preventDefault();

    const fieldData = {
      fieldCode: $("#fieldCode").val(),
      fieldName: $("#fieldName").val(),
      fieldLocationX: parseFloat($("#fieldLocationX").val()),
      fieldLocationY: parseFloat($("#fieldLocationY").val()),
      fieldSize: parseFloat($("#fieldSize").val()),
      image1: $("#image1")[0].files[0],
      image2: $("#image2")[0].files[0],
    };

    try {
      if (editingFieldCode) {
        reloadTable();
        await update(editingFieldCode, fieldData, $("#staffCode").val());
        swal("Success", "Field updated successfully!", "success");
      } else {
        reloadTable();
        await save(fieldData);
        swal("Success", "Field saved successfully!", "success");
      }

      $("#addFieldForm")[0].reset();
      $("#preview1, #preview2").hide();
      bootstrap.Modal.getInstance($("#addFieldModal")[0]).hide();
      reloadTable();
    } catch (error) {
      console.error("Error saving or updating field:", error);
      swal(
        "Error",
        "Failed to save or update field. Please try again.",
        "error"
      );
    }
  });

  async function reloadTable() {
    try {
      const fields = await getAll();
      $("tbody.tableRow").empty();
      fields.forEach((field) => loadTable(field));
    } catch (error) {
      console.error("Error loading fields:", error);
      swal("Error", "Failed to load fields. Please try again.", "error");
    }
  }

  function loadTable(fieldData) {
    const fieldLocation =
      fieldData.fieldLocation?.x && fieldData.fieldLocation?.y
        ? `${fieldData.fieldLocation.x}, ${fieldData.fieldLocation.y}`
        : "N/A";
    const staffNames =
      fieldData.staff?.map((staff) => staff.firstName).join(", ") ||
      "Unassigned";

    const rowHtml = `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${fieldData.code}</td>
        <td>${fieldData.fieldName}</td>
        <td>${fieldLocation}</td>
        <td>${fieldData.fieldSize || "N/A"}</td>
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

  function base64ToImageURL(base64Data) {
    return `data:image/png;base64,${base64Data}`;
  }

  $(document).on("click", ".removeBtn", async function () {
    const code = $(this).data("id");
    try {
      const confirmResult = await swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (confirmResult) {
         reloadTable();
        await deleteField(code);
        swal("Deleted", "Field deleted successfully!", "success");
       
      }
    } catch (error) {
      console.error("Error deleting field:", error);
      swal("Error", "Failed to delete field. Please try again.", "error");
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
        $("#fieldName").val(field.fieldName);
        $("#fieldLocationX").val(field.fieldLocation?.x || "");
        $("#fieldLocationY").val(field.fieldLocation?.y || "");
        $("#fieldSize").val(field.fieldSize || "");
        $("#staffCode").val(field.staff?.map((s) => s.id) || "");
        $("#preview1").attr("src", base64ToImageURL(field.image1)).show();
        $("#preview2").attr("src", base64ToImageURL(field.image2)).show();
        const addFieldModal = new bootstrap.Modal($("#addFieldModal")[0]);
        addFieldModal.show();
        editingFieldCode = code;
      }
    } catch (error) {
      console.error("Error fetching field data:", error);
      swal("Error", "Failed to load field data. Please try again.", "error");
    }
  });

  async function searchFields(query) {
    try {
      const fields = await getAll();
      const filteredFields = fields.filter(
        (field) =>
          field.code.toLowerCase().includes(query.toLowerCase()) ||
          field.fieldName.toLowerCase().includes(query.toLowerCase())
      );
      $("tbody.tableRow").empty();
      if (filteredFields.length > 0) {
        filteredFields.forEach((field) => loadTable(field));
      } else {
        swal("No Results", "No fields match your search criteria!", "info");
      }
    } catch (error) {
      console.error("Error searching fields:", error);
      swal("Error", "Failed to search fields. Please try again.", "error");
    }
  }

  $("#searchInput").on("input", function () {
    const query = $(this).val().trim();
    query ? searchFields(query) : reloadTable();
  });

  loadStaffData();
  reloadTable();
});
