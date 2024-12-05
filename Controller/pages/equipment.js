import {
  deleteEquipment,
  getAllEquipments,
  save,
  update,
} from "../../model/equipmentModel.js";
import { getAll as getAllFields } from "../../model/fieldModel.js";
import { getAllStaff } from "../../model/staffModel.js";

$(document).ready(function () {
  let editingEquipmentCode = null;
  loadFieldData();
  loadStaffData();

  $("#addEquipmentPopup").click(function () {
    const addEquipmentModal = new bootstrap.Modal($("#addEquipmentModal")[0]);
    addEquipmentModal.show();
    $("#addEquipmentForm")[0].reset();
    editingEquipmentCode = null;
  });
  $("#addEquipmentForm").submit(async function (event) {
    event.preventDefault();

    const status = $("#equipmentStatus").prop("checked")
      ? "AVAILABLE"
      : "UNAVAILABLE";

    const equipmentData = {
      equipmentId: $("#equipmentCode").val(),
      equipmentName: $("#equipmentName").val(),
      equipmentType: $("#equipmentType").val(),
      status: status,
      staffId: $("#staffCode").val(),
      fieldCode: $("#fieldCode").val(),
    };

    try {
      if (editingEquipmentCode) {
        reloadTable();
        await update(editingEquipmentCode, equipmentData);
        swal("Success", "Equipment updated successfully!", "success");
      } else {
        await save(equipmentData);
        reloadTable();
        swal("Success", "Equipment added successfully!", "success");
      }
      $("#addEquipmentForm")[0].reset();
      bootstrap.Modal.getInstance($("#addEquipmentModal")[0]).hide();
    } catch (error) {
      console.error("Error saving or updating equipment:", error);
      swal("Error", "Failed to save or update equipment.", "error");
    }
  });

  async function loadFieldData() {
    try {
      const fields = await getAllFields();
      const fieldSelect = $("#fieldCode");
      fieldSelect.empty();
      fieldSelect.append(`<option value="">Select Field</option>`);
      fields.forEach((field) => {
        fieldSelect.append(
          `<option value="${field.code}">${field.fieldName}</option>`
        );
      });
      window.fieldData = fields;
    } catch (error) {
      console.error("Error loading field data:", error);
      swal("Error", "Failed to load field data.", "error");
    }
  }

  async function loadStaffData() {
    try {
      const staffs = await getAllStaff();
      const staffSelect = $("#staffCode");
      staffSelect.empty();
      staffSelect.append(`<option value="">Select Staff</option>`);
      staffs.forEach((staff) => {
        staffSelect.append(
          `<option value="${staff.id}">${staff.firstName}</option>`
        );
      });
      window.staffData = staffs;
    } catch (error) {
      console.error("Error loading staff data:", error);
      swal("Error", "Failed to load staff data.", "error");
    }
  }

  async function reloadTable() {
    try {
      const equipments = await getAllEquipments();
      $("tbody.tableRow").empty();
      equipments.forEach((equipment) => {
        loadTable(equipment);
      });
    } catch (error) {
      console.error("Error loading equipment data:", error);
      swal("Error", "Failed to load equipment data.", "error");
    }
  }

  function loadTable(equipmentData) {
    const rowHtml = `
    <tr>
      <td><input type="checkbox" /></td>
      <td>${equipmentData.equipmentId || "N/A"}</td>
      <td>${equipmentData.equipmentName || "N/A"}</td>
      <td>${equipmentData.equipmentType || "N/A"}</td>
      <td>${equipmentData.status || "N/A"}</td>
      <td>${equipmentData.staff ? equipmentData.staff.firstName : "No"}</td>
      <td>${equipmentData.field ? equipmentData.field.fieldName : "No"}</td>
      <td>
        <button class="btn btn-outline-primary btn-sm editBtn" data-id="${
          equipmentData.equipmentId
        }">Edit</button>
        <button class="btn btn-outline-danger btn-sm removeBtn" data-id="${
          equipmentData.equipmentId
        }">Delete</button>
      </td>
    </tr>
  `;
    $("tbody.tableRow").append(rowHtml);
  }

  reloadTable();

  $(document).on("click", ".removeBtn", async function () {
    const equipmentId = $(this).data("id");
    try {
       reloadTable();
      await deleteEquipment(equipmentId);
      swal("Success", "Equipment deleted successfully!", "success");
     
    } catch (error) {
      console.error("Error deleting equipment:", error);
      swal("Error", "Failed to delete equipment.", "error");
    }
  });

  $(document).on("click", ".editBtn", async function () {
    const equipmentId = $(this).data("id");
    try {
      const equipment = await getAllEquipments().then((equipments) =>
        equipments.find((equipment) => equipment.equipmentId === equipmentId)
      );
      if (equipment) {
        $("#equipmentCode").val(equipment.equipmentId);
        $("#equipmentName").val(equipment.equipmentName);
        $("#equipmentType").val(equipment.equipmentType);
        $("#equipmentStatus").val(equipment.status);

        const staffMemberId = equipment.staff ? equipment.staff.id : "";
        $("#staffCode").val(staffMemberId);

        const fieldName = equipment.field ? equipment.field.code : "";
        $("#fieldCode").val(fieldName);

        const addEquipmentModal = new bootstrap.Modal(
          $("#addEquipmentModal")[0]
        );
        addEquipmentModal.show();
        editingEquipmentCode = equipmentId;
      }
    } catch (error) {
      console.error("Error fetching equipment data:", error);
      swal("Error", "Failed to fetch equipment data.", "error");
    }
  });

  function search(query) {
    getAllEquipments()
      .then((equipments) => {
        const filtered = equipments.filter((equipment) => {
          const equipmentId = equipment.equipmentId || "";
          const name = equipment.name || "";
          return (
            equipmentId.toLowerCase().includes(query.toLowerCase()) ||
            name.toLowerCase().includes(query.toLowerCase())
          );
        });
        $("tbody.tableRow").empty();
        if (filtered.length > 0) {
          filtered.forEach((equipment) => {
            loadTable(equipment);
          });
        } else {
          const noResultsHtml = `<tr><td colspan="9" class="text-center">No equipment found</td></tr>`;
          $("tbody.tableRow").append(noResultsHtml);
        }
      })
      .catch((error) => {
        console.error("Error searching equipment:", error);
        swal("Error", "Failed to search equipment.", "error");
      });
  }

  $("#searchInput").on("input", function () {
    const query = $(this).val().trim();
    if (query) {
      search(query);
    } else {
      reloadTable();
    }
  });

  $("#searchButton").on("click", function () {
    const query = $("#searchInput").val().trim();
    if (query) {
      search(query);
    } else {
      reloadTable();
    }
  });
  
});
