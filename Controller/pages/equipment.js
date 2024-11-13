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
  console.log("loaded" + window.fieldData);

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
      assignedStaffId: $("#staffCode").val(), // Corrected ID
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
      console.error("Error saving or updating:", error);
      alert("Failed to save or update!");
    }
  });

  // Load Field Data for the dropdown
  async function loadFieldData() {
    try {
      const fields = await getAllFields();
      const fieldSelect = $("#fieldCode");
      fieldSelect.empty();
      fieldSelect.append(`<option value="">Select Field</option>`);
      fields.forEach((field) => {
        fieldSelect.append(
          `<option value="${field.code}">${field.name}</option>`
        );
      });
      window.fieldData = fields;
    } catch (error) {
      console.error("Error loading field data:", error);
    }
  }

  let staffDataMap = {};
  console.log("staffDataMap" + staffDataMap);

  async function loadStaffData() {
    try {
      const staffs = await getAllStaff();
      const staffSelect = $("#staffCode");
      staffSelect.empty();
      staffSelect.append(`<option value="">Select Staff</option>`);

      staffs.forEach(function (staff) {
        // Store each staff's ID and name in the map for easy lookup
        staffDataMap[staff.id] = staff.firstName;
        console.log("staffDataMappahala" + staff.id + staff.firstName);

        staffSelect.append(
          `<option value="${staff.id}">${staff.firstName}</option>`
        );
      });
    } catch (error) {
      console.error("Error loading staff data:", error);
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
    }
  }

  // function loadTable(equipmentData) {
  //   const rowHtml = `
  //     <tr>
  //       <td><input type="checkbox" /></td>
  //       <td>${equipmentData.equipmentId}</td>
  //       <td>${equipmentData.name}</td>
  //       <td>${equipmentData.type}</td>
  //       <td>${equipmentData.status}</td>
  //       <td>${equipmentData.assignedStaffId}</td>
  //       <td>${equipmentData.assignedFieldCode}</td>
  //       <td>
  //         <button class="btn btn-outline-primary btn-sm editBtn" data-id="${equipmentData.equipmentId}">Edit</button>
  //         <button class="btn btn-outline-danger btn-sm removeBtn" data-id="${equipmentData.equipmentId}">Delete</button>
  //       </td>
  //     </tr>
  //   `;
  //   $("tbody.tableRow").append(rowHtml);
  // }
  function loadTable(equipmentData) {
    const assignedStaffName =
      staffDataMap[equipmentData.assignedStaffId] || "Unassigned";
    console.log("assignedStaffName" + assignedStaffName);

    const rowHtml = `
    <tr>
      <td><input type="checkbox" /></td>
      <td>${equipmentData.equipmentId}</td>
      <td>${equipmentData.name}</td>
      <td>${equipmentData.type}</td>
      <td>${equipmentData.status}</td>
      <td>${staffDataMap}</td> <!-- Display staff name instead of ID -->
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
      console.error("Error deleting equipment:", error);
      alert("Failed to delete!");
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
        $("#staffCode").val(equipment.assignedStaffId); // Corrected ID
        $("#fieldCode").val(equipment.assignedFieldCode); // Corrected ID
        const addEquipmentModal = new bootstrap.Modal(
          $("#addEquipmentModal")[0]
        );
        addEquipmentModal.show();
        editingEquipmentCode = equipmentId;
      }
    } catch (error) {
      console.error("Error fetching equipment data:", error);
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
