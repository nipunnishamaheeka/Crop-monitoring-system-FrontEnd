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
      licensePlateNumber: $("#vehiclePlateNumber").val(),
      vehicleCategory: $("#vehicleCategory").val(),
      fuelType: $("#fuelType").val(),
      status: $("#status").val(),
      staffId: $("#staffCode").val(),
      remarks: $("#remarks").val(),
    };

    try {
      if (editingVehicleCode) {
        await update(editingVehicleCode, vehicleData);
        alert("Updated successfully!");
      } else {
        await save(vehicleData);
        alert("Added successfully!");
      }
      $("#addVehicleForm")[0].reset();
      bootstrap.Modal.getInstance($("#addVehicleModal")[0]).hide();
      reloadTable();
    } catch (error) {
      console.error("Error saving or updating vehicle:", error);
      alert("Failed to save or update vehicle!");
    }
  });
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
      console.error("Error loading vehicle data:", error);
      alert("Failed to load vehicle data!");
    }
  }
  function loadTable(vehicleData) {
    const rowHtml = `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${vehicleData.vehicleCode}</td>
        <td>${vehicleData.licensePlateNumber}</td>
        <td>${vehicleData.vehicleCategory}</td>
        <td>${vehicleData.fuelType}</td>
        <td>${vehicleData.status}</td>
        <td>${vehicleData.staff ? vehicleData.staff.firstName : "No"}</td>
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
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle!");
    }
  });
  $(document).on("click", ".editBtn", async function () {
    const vehicleCode = $(this).data("id");
    try {
      const vehicle = await getAll().then((vehicles) =>
        vehicles.find((v) => v.vehicleCode === vehicleCode)
      );
      if (vehicle) {
        $("#vehicleCode").val(vehicle.vehicleCode);
        $("#vehiclePlateNumber").val(vehicle.licensePlateNumber);
        $("#vehicleCategory").val(vehicle.vehicleCategory);
        $("#fuelType").val(vehicle.fuelType);
        $("#status").val(vehicle.status);
        const staffMemberId = vehicle.staff ? vehicle.staff.id : "";
        $("#staffCode").val(staffMemberId);

        $("#remarks").val(vehicle.remarks);
        const addVehicleModal = new bootstrap.Modal($("#addVehicleModal")[0]);
        addVehicleModal.show();
        editingVehicleCode = vehicleCode;
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  });
  function search(query) {
    getAll()
      .then((vehicles) => {
        const filtered = vehicles.filter((vehicle) => {
          const vehicleCode = vehicle.vehicleCode || "";
          const licensePlateNo = vehicle.licensePlateNumber || "";
          return (
            vehicleCode.toLowerCase().includes(query.toLowerCase()) ||
            licensePlateNo.toLowerCase().includes(query.toLowerCase())
          );
        });
        $("tbody.tableRow").empty();
        if (filtered.length > 0) {
          filtered.forEach((vehicle) => loadTable(vehicle));
        } else {
          const noResultsHtml = `<tr><td colspan="9" class="text-center">No vehicles found</td></tr>`;
          $("tbody.tableRow").append(noResultsHtml);
        }
      })
      .catch((error) => {
        console.error("Error searching vehicles:", error);
        alert("Failed to search vehicles!");
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
