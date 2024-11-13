import { getAllStaff } from "../../model/staffModel.js";
import {
  deleteVehicle,
  getAll,
  save,
  update,
} from "../../model/vehiclesModel.js";

$(document).ready(function () {
  let editingVehicleCode = null;
  loadStaffData();

  $("#addVehiclePopup").click(function () {
    const addVehicleModal = new bootstrap.Modal($("#addVehicleModal")[0]);
    addVehicleModal.show();
    $("#addVehicleForm")[0].reset();
    editingVehicleCode = null;
  });

  $("#addVehicleForm").submit(async function (event) {
    event.preventDefault();

    const vehicleData = {
      v_code: $("#vehicleCode").val(),
      licensePlateNo: $("#vehiclePlateNumber").val(),
      vehicleCategory: $("#vehicleCategory").val(),
      fuelType: $("#fuelType").val(),
      status: $("#status").val(),
      staffId: $("#staffDetails").val(),
      remarks: $("#remarks").val(),
    };

    try {
      if (editingVehicleCode) {
        await update(editingVehicleCode, vehicleData);
        alert("updated successfully!");
      } else {
        await save(vehicleData);
        alert("added successfully!");
      }
      $("#addVehicleForm")[0].reset();
      bootstrap.Modal.getInstance($("#addVehicleModal")[0]).hide();
      reloadTable();
    } catch (error) {
      console.error("Error saving or updating :", error);
      alert("Failed to save or update !");
    }
  });

  // Load Staff Data for the dropdown
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
      const vehicles = await getAll();
      $("tbody.tableRow").empty();
      vehicles.forEach((vehicle) => loadTable(vehicle));
    } catch (error) {
      console.error("Error loading table:", error);
      alert("Failed to load vehicle data!");
    }
  }

  function loadTable(vehicleData) {
    const rowHtml = `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${vehicleData.vehicleCode}</td>
        <td>${vehicleData.licensePlateNo}</td>
        <td>${vehicleData.vehicleCategory}</td>
        <td>${vehicleData.fuelType}</td>
        <td>${vehicleData.status}</td>
        <td>${
          vehicleData.allocatedStaffMember === null
            ? "No"
            : vehicleData.allocatedStaffMember.firstName
        }</td>
        <td>${vehicleData.remarks}</td>
        <td>
          <button class="btn btn-outline-primary btn-sm editBtn" data-id="${
            vehicleData.vehicleCode
          }">Edit</button>
          <button class="btn btn-outline-danger btn-sm removeBtn" data-id="${
            vehicleData.vehicleCode
          }">Delete</button>
          
        </td>
      </tr>
    `;
    $("tbody.tableRow").append(rowHtml);
  }

  reloadTable();

  $(document).on("click", ".removeBtn", async function () {
    const vehicleCode = $(this).data("id");
    try {
      await deleteVehicle(vehicleCode);
      alert("Vehicle Deleted");
      reloadTable();
    } catch (error) {
      console.error("Error deleting :", error);
      alert("Failed to delete !");
    }
  });

  $(document).on("click", ".editBtn", async function () {
    const vehicleCode = $(this).data("id");
    try {
      const vehicle = await getAll().then((vehicles) =>
        vehicles.find((vehicle) => vehicle.vehicleCode === vehicleCode)
      );
      if (vehicle) {
        $("#vehicleCode").val(vehicle.vehicleCode);
        $("#licensePlateNo").val(vehicle.licensePlateNo);
        $("#vehicleCategory").val(vehicle.vehicleCategory);
        $("#fuelType").val(vehicle.fuelType);
        $("#status").val(vehicle.status);
        const staffMemberName = vehicle.allocatedStaffMember.firstName;
        if (
          $("#staffCode option[value='" + staffMemberName + "']").length === 0
        ) {
          $("#staffCode").append(new Option(staffMemberName, staffMemberName));
        }
        $("#staffCode").val(staffMemberName);

        $("#remarks").val(vehicle.remarks);
        const addVehiclesModal = new bootstrap.Modal($("#addVehicleModal")[0]);
        addVehiclesModal.show();
        editingVehicleCode = vehicleCode;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  function search(query) {
    getAll()
      .then((vehicles) => {
        const filtered = vehicles.filter((vehicle) => {
          const vehicleCode = vehicle.vehicleCode || "";
          const licensePlateNo = vehicle.licensePlateNo || "";

          return (
            vehicleCode.toLowerCase().includes(query.toLowerCase()) ||
            licensePlateNo.toLowerCase().includes(query.toLowerCase())
          );
        });
        $("tbody.tableRow").empty();
        if (filtered.length > 0) {
          filtered.forEach((vehicle) => {
            loadTable(vehicle);
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
