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
  // loadFieldData();
  // loadVehicleData();
  $("#addStaffPopup").click(function () {
    const addStaffModal = new bootstrap.Modal($("#addStaffModal")[0]);
    addStaffModal.show();
    $("#addStaffForm")[0].reset();
    editingStaffCode = null;
  });

  $("#addStaffForm").submit(async function (event) {
    event.preventDefault();

    // const staffData = {
    //   id: "S00",
    //   firstName: $("#fristName").val(),
    //   lastName: $("#lastName").val(),
    //   designation: $("#designation").val(),
    //   gender: $("#gender").val(),
    //   joinedDate: $("#joinedDate").val(),
    //   DOB: $("#dob").val(),
    //   addressLine1: $("#line01").val(),
    //   addressLine2: $("#line02").val(),
    //   addressLine3: $("#line03").val(),
    //   addressLine4: $("#line04").val(),
    //   addressLine5: $("#line05").val(),
    //   contactNo: $("#contactNo").val(),
    //   email: $("#email").val(),
    //   role: $("#role").val(),
    //   // field: $("#fieldCode").val(),
    //   // vehicles: $("#vehicle").val(),
    // };
const staffData = {
  id: editingStaffCode ? editingStaffCode : "S00",
  firstName: $("#fristName").val(),
  lastName: $("#lastName").val(),
  designation: $("#designation").val(),
  gender: $("#gender").val(),
  joinedDate: editingStaffCode ? $("#joinedDate").val() : new Date().toISOString(), // Set current date only for new entries
  DOB: $("#dob").val(),
  addressLine1: $("#line01").val(),
  addressLine2: $("#line02").val(),
  addressLine3: $("#line03").val(),
  addressLine4: $("#line04").val(),
  addressLine5: $("#line05").val(),
  contactNo: $("#contactNo").val(),
  email: $("#email").val(),
  role: $("#role").val(),
};

    try {
      if (editingStaffCode) {
        reloadTable();
        await update(editingStaffCode, staffData);
        swal({
          icon: "success",
          title: "Success",
          text: "Staff updated successfully!",
        });
      } else {
        reloadTable();
        console.log(staffData);
        await save(staffData);
        swal({
          icon: "success",
          title: "Success",
          text: "Staff added successfully!",
        });
      }
      $("#addStaffForm")[0].reset();
      bootstrap.Modal.getInstance($("#addStaffModal")[0]).hide();
      reloadTable();
    } catch (error) {
      console.error("Error saving or updating :", error);
      swal({
        icon: "error",
        title: "Error",
        text: "Failed to save or update staff!",
      });
    }
  });
  async function reloadTable() {
    try {
      const staffs = await getAllStaff();
      $("tbody.tableRow").empty();
      staffs.forEach((staff) => {
        loadTable(staff);
      });
    } catch (error) {
      console.error("Error loading :", error);
      swal({
        icon: "error",
        title: "Error",
        text: "Failed to load staff data!",
      });
    }
  }
  function loadTable(staffData) {
    console.log(staffData);
    const fullAddress = `${staffData.addressLine1}, ${staffData.addressLine2}, ${staffData.addressLine3}, ${staffData.addressLine4}, ${staffData.addressLine5}`;
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
      reloadTable();
      swal({
        icon: "success",
        title: "Success",
        text: "Staff deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting :", error);
      swal({
        icon: "error",
        title: "Error",
        text: "Failed to delete staff!",
      });
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
      swal({
        icon: "error",
        title: "Error",
        text: "Error fetching data!",
      });
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
        swal({
          icon: "error",
          title: "Error",
          text: "Failed to search staff!",
        });
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

// adding name

const roleCounts = {
  MANAGER: 0,
  ADMINISTRATIVE: 0,
  SCIENTIST: 0,
  OTHER: 0,
};

// Add event listener for the designation dropdown
document
  .getElementById("designation")
  .addEventListener("change", function (event) {
    const selectedOption = event.target.selectedOptions[0];
    const selectedRole = selectedOption.getAttribute("data-role");
    const limit = parseInt(selectedOption.getAttribute("data-limit"), 10);

    if (selectedRole) {
      // Check if the count exceeds the limit
      if (roleCounts[selectedRole] >= limit) {
        alert(`The limit for ${selectedRole} (${limit}) has been reached.`);
        event.target.value = ""; // Reset the selection
        document.getElementById("role").value = ""; // Clear the role field
      } else {
        // Autofill the role and increment the count
        document.getElementById("role").value = selectedRole;
        roleCounts[selectedRole]++;
      }
    } else {
      document.getElementById("role").value = ""; // Clear the role field if no selection
    }

    console.log("Current Role Counts:", roleCounts); // Debugging
  });
