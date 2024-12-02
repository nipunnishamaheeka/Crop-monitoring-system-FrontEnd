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

    // Check the status based on the checkbox
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
        await update(editingEquipmentCode, equipmentData);
        alert("Updated successfully!");
        reloadTable();
      } else {
        await save(equipmentData);
        reloadTable();
        alert("Added successfully!");
      }
      $("#addEquipmentForm")[0].reset();
      bootstrap.Modal.getInstance($("#addEquipmentModal")[0]).hide();
    } catch (error) {
      console.error("Error saving or updating:", error);
      alert("Failed to save or update!");
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
      await deleteEquipment(equipmentId);
      alert("Equipment deleted");
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
      alert("Failed to fetch equipment data!");
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

// Equipment data from the table
let equipmentData = [
  { name: "Plough", count: 8, type: "Agricultural" },
  { name: "Mamotee", count: 35, type: "Agricultural" },
  { name: "Shovel", count: 40, type: "Agricultural" },
  { name: "Irrigation pumps", count: 15, type: "Agricultural" },
  { name: "Wheelbarrow", count: 20, type: "Agricultural" },
  { name: "Sprayer", count: 20, type: "Agricultural" },
  { name: "Axe", count: 10, type: "Agricultural" },
  { name: "Chain saw", count: 5, type: "Mechanical" },
  { name: "Combine harvester", count: 4, type: "Agricultural" },
  { name: "Seeder", count: 20, type: "Agricultural" },
  { name: "Weeder", count: 20, type: "Agricultural" },
  { name: "Wheel wrench", count: 15, type: "Mechanical" },
  { name: "Screw drivers", count: 30, type: "Mechanical" },
];

// Populate Name dropdown
function populateDropdown() {
  const nameDropdown = document.getElementById("equipmentName");
  nameDropdown.innerHTML = ""; // Clear existing options
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Equipment";
  nameDropdown.appendChild(defaultOption);

  equipmentData.forEach((equipment) => {
    if (equipment.count > 0) {
      const option = document.createElement("option");
      option.value = equipment.name;
      option.textContent = `${equipment.name} (${equipment.count})`;
      nameDropdown.appendChild(option);
    }
  });
}

// Auto-fill Type and update count on form submission
document.addEventListener("DOMContentLoaded", () => {
  populateDropdown();

  const nameDropdown = document.getElementById("equipmentName");
  const typeField = document.getElementById("equipmentType");
  const form = document.getElementById("addEquipmentForm");

  // Auto-fill Type field
  nameDropdown.addEventListener("change", (event) => {
    const selectedName = event.target.value;
    const selectedEquipment = equipmentData.find(
      (item) => item.name === selectedName
    );
    if (selectedEquipment) {
      typeField.value = selectedEquipment.type;
    } else {
      typeField.value = "";
    }
  });
});
//  // Update count on form submission
//     form.addEventListener("submit", (event) => {
//       event.preventDefault(); // Prevent form submission
//       const selectedName = nameDropdown.value;

//       if (selectedName) {
//         const selectedEquipment = equipmentData.find((item) => item.name === selectedName);
//         if (selectedEquipment && selectedEquipment.count > 0) {
//           selectedEquipment.count -= 1; // Decrease count by 1
//           alert(`${selectedName} has been added successfully! Remaining count: ${selectedEquipment.count}`);
//           populateDropdown(); // Refresh dropdown
//           form.reset(); // Reset the form
//         } else {
//           alert("Selected equipment is out of stock.");
//         }
//       } else {
//         alert("Please select an equipment.");
//       }
//     });

// togel button

document
  .getElementById("equipmentStatus")
  .addEventListener("change", function () {
    const statusLabel = this.nextElementSibling;
    if (this.checked) {
      statusLabel.textContent = "Available";
    } else {
      statusLabel.textContent = "Unavailable";
    }
  });
