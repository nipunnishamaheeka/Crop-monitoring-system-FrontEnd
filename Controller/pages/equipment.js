import {
  deleteEquipment,
  getAllEquipments,
  save,
  update,
} from "../../model/equipmentModel.js";
import { getAll } from "../../model/fieldModel.js";
 

$(document).ready(function () {
  let editingEquipmentCode = null;
  loadFieldData();
  
  $("#addEquipmentPopup").click(function () {
    const addEquipmentModal = new bootstrap.Modal($("#addEquipmentModal")[0]);
    addEquipmentModal.show();
    $("#addEquipmentForm")[0].reset();
    editingEquipmentCode = null;
  });

  $("#addEquipmentForm").submit(async function (event) {
    event.preventDefault();

    const equipmentData = {
      equipmentId: $("#equipmentCode").val(),
      name: $("#equipmentName").val(),
      type: $("#equipmentType").val(),
      status: $("#equipmentStatus").val(),
      assignedStaffId: $("#staffDetails").val(),
      assignedFieldCode: $("#fieldCode").val(),
    };

    try {
      if (editingEquipmentCode) {
        await update(editingEquipmentCode, equipmentData);
        alert("updated successfully!");
      } else {
        await save(equipmentData);
        alert("added successfully!");
      }
      $("#addEquipmentForm")[0].reset();
      bootstrap.Modal.getInstance($("#addEquipmentModal")[0]).hide();
      reloadTable();
    } catch (error) {
      console.error("Error saving or updating :", error);
      alert("Failed to save or update !");
    }
  });

  // Load Field Data for the dropdown
  async function loadFieldData() {
    try {
      const fields = await getAll();
      const fieldSelect = $("#fieldCode");
      fieldSelect.empty();
      fieldSelect.append(`<option value="">Select Field</option>`);

      fields.forEach(function (field) {
        fieldSelect.append(
          `<option value="${field.code}">${field.name}</option>`
        );
      });
      window.fieldData = fields;
    } catch (error) {
      console.error("Error loading field data:", error);
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
      console.error("Error loading :", error);
    }
  }

  function loadTable(equipmentData) {
    const rowHtml = `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${equipmentData.equipmentId}</td>
        <td>${equipmentData.name}</td>
        <td>${equipmentData.type}</td>
        <td>${equipmentData.status}</td>
        <td>${equipmentData.assignedStaffId}</td>
        <td>${equipmentData.assignedFieldCode}</td>
        <td>
          <button class="btn btn-outline-primary btn-sm editBtn" data-id="${equipmentData.equipmentId}">Edit</button>
          <button class="btn btn-outline-danger btn-sm removeBtn" data-id="${equipmentData.equipmentId}">Delete</button>
          
        </td>
      </tr>
    `;
    $("tbody.tableRow").append(rowHtml);
  }

  reloadTable();

  $(document).on("click", ".removeBtn", async function () {
    const equipmentId = $(this).data("id");
    try {
      await deleteEquipment(equipmentId);
      alert("Equipment Deleted");
      reloadTable();
    } catch (error) {
      console.error("Error deleting :", error);
      alert("Failed to delete !");
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
        $("#equipmentName").val(equipment.name);
        $("#equipmentType").val(equipment.type);
        $("#equipmentStatus").val(equipment.status);
        $("#staffDetails").val(equipment.assignedStaffId);
        $("#fieldDetails").val(equipment.assignedFieldCode);
        const addEquipmentModal = new bootstrap.Modal(
          $("#addEquipmentModal")[0]
        );
        addEquipmentModal.show();
        editingEquipmentCode = equipmentId;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  function search(query) {
    getAll()
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
          const noResultsHtml = `<tr><td colspan="9" class="text-center">No vehicles found</td></tr>`;
          $("tbody.tableRow").append(noResultsHtml);
        }
      })
      .catch((error) => {
        console.error("Error searching:", error);
        alert("Failed to search!");
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
