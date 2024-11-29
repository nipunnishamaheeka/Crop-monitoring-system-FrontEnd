import {
  deleteStaff,
  getAllStaff,
  save,
  update,
} from "../../model/staffModel.js";
import { getAll as getAllFields } from "../../model/fieldModel.js";
import { getAll } from "../../model/vehiclesModel.js";

$(document).ready(function () {
  let editingStaffCode = null;
  loadFieldData();
  loadVehicleData();
  $("#addStaffPopup").click(function () {
    const addStaffModal = new bootstrap.Modal($("#addStaffModal")[0]);
    addStaffModal.show();
    $("#addStaffForm")[0].reset();
    editingStaffCode = null;
  });

  $("#addStaffForm").submit(async function (event) {
    event.preventDefault();

    const staffData = {
      id: $("#staffCode").val(),
      firstName: $("#fristName").val(),
      lastName: $("#lastName").val(),
      designation: $("#designation").val(),
      gender: $("#gender").val(),
      joinedDate: $("#joinedDate").val(),
      dob: $("#dob").val(),
      addressLine1: $("#line01").val(),
      addressLine2: $("#line02").val(),
      addressLine3: $("#line03").val(),
      addressLine4: $("#line04").val(),
      addressLine5: $("#line05").val(),
      contactNo: $("#contactNo").val(),
      email: $("#email").val(),
      role: $("#role").val(),
      field: $("#fieldCode").val(),
      vehicles: $("#vehicle").val(),
    };

    try {
      if (editingStaffCode) {
        await update(editingStaffCode, staffData);
        alert("updated successfully!");
      } else {
        await save(staffData);
        alert("added successfully!");
      }
      $("#addStaffForm")[0].reset();
      bootstrap.Modal.getInstance($("#addStaffModal")[0]).hide();
      reloadTable();
    } catch (error) {
      console.error("Error saving or updating :", error);
      alert("Failed to save or update !");
    }
  });
  async function loadVehicleData() {
    try {
      const vehicles = await getAll();
      const vehicleSelect = $("#vehicle");
      vehicleSelect.empty();
      vehicleSelect.append(`<option value="">Select Field</option>`);
      vehicles.forEach((vehicle) => {
        vehicleSelect.append(
          `<option value="${vehicle.v_code}">${vehicle.licensePlateNumber}</option>`
        );
      });
      window.vehicleData = vehicles;
    } catch (error) {
      console.error("Error loading vehicle data:", error);
    }
  }
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
  async function reloadTable() {
    try {
      const staffs = await getAllStaff();
      $("tbody.tableRow").empty();
      staffs.forEach((staff) => {
        loadTable(staff);
      });
    } catch (error) {
      console.error("Error loading :", error);
    }
  }
  // function loadTable(staffData) {
  //   console.log(staffData);
  //   const fields = staffData.field || [];
  //   const vehicles = staffData.vehicles || [];
  //   const fieldName = fields.length > 0 ? fields[0].fieldName : "Unassigned";
  //   const vehicleCode =
  //     vehicles.length > 0 ? vehicles[0].vehicleCode : "Unassigned";
  //   const rowHtml = `
  //   <tr>
  //     <td><input type="checkbox" /></td>
  //     <td>${staffData.id}</td>
  //     <td>${staffData.firstName}</td>
  //     <td>${staffData.designation}</td>
  //     <td>${staffData.dob}</td>
  //     <td>${staffData.contactNo}</td>
  //     <td>${staffData.email}</td>
  //     <td>${staffData.role}</td>
  //     <td>${fieldName}</td>
  //     <td>${vehicleCode}</td>
  //     <td>
  //       <button class="btn btn-outline-primary btn-sm editBtn" data-id="${staffData.id}">Edit</button>
  //       <button class="btn btn-outline-danger btn-sm removeBtn" data-id="${staffData.id}">Delete</button>
  //       <button class="btn btn-outline-primary btn-sm editBtn" data-id="${staffData.id}">Show</button>
  //     </td>
  //   </tr>
  // `;
  //   $("tbody.tableRow").append(rowHtml);
  // }
  function loadTable(staffData) {
    console.log(staffData);
    const fullAddress = `${staffData.addressLine1}, ${staffData.addressLine2}, ${staffData.addressLine3}, ${staffData.addressLine4}, ${staffData.addressLine5}`;
    const fields = staffData.field || [];
    const vehicles = staffData.vehicles || [];
    const fieldName = fields.length > 0 ? fields[0].fieldName : "Unassigned";
    const vehicleCode =
      vehicles.length > 0 ? vehicles[0].vehicleCode : "Unassigned";
    const rowHtml = `
    <tr>
      <td><input type="checkbox" /></td>
      <td>${staffData.id}</td>
      <td>${staffData.firstName} ${staffData.lastName}</td>
      <td>${staffData.designation}</td>
      <td>${staffData.joinedDate}</td>
      <td>${staffData.dob}</td>
      <td>${fullAddress}</td>
      <td>${staffData.contactNo}</td>
      <td>${staffData.email}</td>
      <td>${staffData.role}</td>
      <td>${fieldName}</td>
      <td>${vehicleCode}</td>
      <td>${staffData.gender}</td>
      <td>
        <button class="btn btn-outline-primary btn-sm editBtn" data-id="${staffData.id}">Edit</button>
        <button class="btn btn-outline-danger btn-sm removeBtn" data-id="${staffData.id}">Delete</button>
      </td>
    </tr>
  `;
    $("tbody.tableRow").append(rowHtml);
  }

  reloadTable();

  $(document).on("click", ".removeBtn", async function () {
    const id = $(this).data("id");
    try {
      await deleteStaff(id);
      alert("Staff Deleted");
      reloadTable();
    } catch (error) {
      console.error("Error deleting :", error);
      alert("Failed to delete !");
    }
  });

  $(document).on("click", ".editBtn", async function () {
    const id = $(this).data("id");
    try {
      const staff = await getAllStaff().then((staffs) =>
        staffs.find((staff) => staff.id === id)
      );
      if (staff) {
        $("#staffCode").val(staff.id);
        $("#fristName").val(staff.firstName);
        $("#lastName").val(staff.lastName);
        $("#designation").val(staff.designation);
        $("#gender").val(staff.gender);
        $("#joinedDate").val(staff.joinedDate);
        $("#dob").val(staff.dob);
        $("#line01").val(staff.addressLine1);
        $("#line02").val(staff.addressLine2);
        $("#line03").val(staff.addressLine3);
        $("#line04").val(staff.addressLine4);
        $("#line05").val(staff.addressLine5);
        $("#contactNo").val(staff.contactNo);
        $("#email").val(staff.email);
        $("#role").val(staff.role);
        $("#field").val(staff.field);
        $("#vehicle").val(staff.vehicles);
        const addStaffModal = new bootstrap.Modal($("#addStaffModal")[0]);
        addStaffModal.show();
        editingStaffCode = id;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  function search(query) {
    getAll()
      .then((staffs) => {
        const filtered = staffs.filter((staff) => {
          const id = staff.id || "";
          const firstName = staff.firstName || "";

          return (
            id.toLowerCase().includes(query.toLowerCase()) ||
            firstName.toLowerCase().includes(query.toLowerCase())
          );
        });
        $("tbody.tableRow").empty();
        if (filtered.length > 0) {
          filtered.forEach((staff) => {
            loadTable(staff);
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
