import {
  deleteLog,
  getAllLogs,
  getOneLog,
  saveLogs,
  updateLogs,
} from "../../model/cropDetailsModel.js";
import { getAllCrops } from "../../model/cropsModel.js";
import { getAll } from "../../model/fieldModel.js";
import { getAllStaff } from "../../model/staffModel.js";

$(document).ready(function () {
  let editingLogCode = null;
  loadFieldData();
  loadStaffData();
  loadCropData();

  $("#addLogPopup").click(function () {
    const addLogsModal = new bootstrap.Modal($("#addLogsModal")[0]);
    addLogsModal.show();
    $("#addLogsForm")[0].reset();
    $("#preview1").hide();
    editingLogCode = null;
  });

  function previewImage(event, previewId) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        $(`#${previewId}`).attr("src", reader.result).show();
      };
      reader.readAsDataURL(file);
    }
  }

  $("#o_image").change(function (event) {
    previewImage(event, "preview1");
  });

  $("#addLogsForm").submit(async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("logCode", $("#logCode").val());
    formData.append("logDetails", $("#logDetails").val());
    formData.append("logDate", $("#logDate").val());
    formData.append("fieldCode", $("#field").val());
    formData.append("cropCode", $("#crop").val());
    formData.append("staffId", $("#staffCode").val());

    const observedImg = $("#o_image")[0].files[0];
    if (observedImg) {
      formData.append("observedImg", observedImg);
    }

    try {
      if (editingLogCode) {
        await updateLogs(editingLogCode, formData);
        reloadTable();
        swal("Success", "Log updated successfully!", "success");
      } else {
        await saveLogs(formData);
        reloadTable();
        swal("Success", "Log added successfully!", "success");
      }
      resetForm();
      reloadTable();
    } catch (error) {
      console.error("Error saving or updating log:", error);
      swal("Error", "Failed to save or update log!", "error");
    }
  });

  function resetForm() {
    $("#addLogsForm")[0].reset();
    $("#preview1").hide();
    bootstrap.Modal.getInstance($("#addLogsModal")[0]).hide();
  }

  async function loadFieldData() {
    try {
      const fields = await getAll();
      const fieldSelect = $("#field");
      fieldSelect.empty().append(`<option value="">Select Field</option>`);
      fields.forEach((field) =>
        fieldSelect.append(
          `<option value="${field.code}">${field.fieldName}</option>`
        )
      );
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
          `<option value="${staff.id}">${staff.firstName} ${
            staff.lastName || ""
          }</option>`
        );
      });
      window.staffData = staffs;
    } catch (error) {
      console.error("Error loading staff data:", error);
    }
  }
  async function loadCropData() {
    try {
      const crops = await getAllCrops();
      const cropSelect = $("#crop");
      cropSelect.empty();
      cropSelect.append(`<option value="">Select Crops</option>`);
      crops.forEach((crop) => {
        cropSelect.append(
          `<option value="${crop.cropCode}">${crop.cropCommonName}
            </option>`
        );
      });
      window.cropData = crops;
    } catch (error) {
      console.error("Error loading crop data:", error);
    }
  }

  function reloadTable() {
    getAllLogs()
      .then((logs) => {
        $("tbody.tableRow").empty();
        logs.forEach((log) => loadTableRow(log));
      })
      .catch((error) => {
        console.error("Error reloading table:", error);
        swal("Error", "Failed to reload table!", "error");
      });
  }
  // <td>${logData.field ? logData.field.fieldName : "Unassigned"}</td>
  //     <td>${logData.crop ? logData.crop.cropCommonName : "Unassigned"}</td>
  //     <td>${logData.staff ? logData.staff.staffId : "Unassigned"}</td>
  function loadTableRow(logData) {
    const rowHtml = `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${logData.logCode}</td>
        <td>${logData.logDate}</td>
        <td>${logData.logDetails}</td>
                <td><img src="${base64ToImageURL(
                  logData.observedImage
                )}" class="img-thumbnail" style="max-width: 50px;" /></td>       
        <td>
          <button class="btn btn-outline-primary btn-sm editBtn" data-id="${
            logData.logCode
          }">Edit</button>
          <button class="btn btn-outline-danger btn-sm removeBtn" data-id="${
            logData.logCode
          }">Delete</button>
          <button class="btn btn-outline-danger btn-sm viewBtn" data-id="${
            logData.logCode
          }">View</button>
        </td>
      </tr>
    `;
    $("tbody.tableRow").append(rowHtml);
  }

  function base64ToImageURL(base64Data) {
    return `data:image/png;base64,${base64Data}`;
  }

  $(document).on("click", ".removeBtn", async function () {
    const logCode = $(this).data("id");
    try {
      await deleteLog(logCode);
      reloadTable();
      swal("Success", "Log deleted successfully!", "success");
      reloadTable();
    } catch (error) {
      console.error("Error deleting log:", error);
      swal("Error", "Failed to delete log!", "error");
    }
  });

  // $(document).on("click", ".editBtn", async function () {
  //   const logCode = $(this).data("id");
  //   try {
  //     const allLogs = await getAllLogs(); // Assuming `getAllLogs` fetches all logs from the backend
  //     const log = allLogs.find((log) => log.logCode === logCode);

  //     if (log) {
  //       populateFormWithLogData(log); // Fill the form with the log data
  //       const addLogsModal = new bootstrap.Modal($("#addLogsModal")[0]);
  //       addLogsModal.show();
  //       editingLogCode = logCode;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching log data:", error);
  //   }
  // });

  $(document).on("click", ".editBtn", async function () {
    const logCode = $(this).data("id"); // Assume the log code is retrieved from the button's `data-id`
    try {
      const log = await getOneLog(logCode);
      populateFormWithLogData(log); // Populate the form with the retrieved log data
      const addLogsModal = new bootstrap.Modal($("#addLogsModal")[0]);
      addLogsModal.show();
    } catch (error) {
      console.error("Error fetching log data:", error);
      swal("Error", "Failed to fetch log data!", "error");
    }
  });

    // $(document).on("click", ".editBtn", async function () {
    //  const logCode = $(this).data("id");
    //   try {
    //     const log = await getAllLogs().then((logs) =>
    //       logs.find((log) => log.logCode === logCode)
    //     );
    //     if (log) {
    //       $("#logCode").val(log.logCode);
    //       $("#logDetails").val(log.logDetails || "");
    //        $("#logDate").val(log.logDate || "");
    //       $("#preview1").attr("src", base64ToImageURL(log.observedImg)).show();
    //       const addFieldModal = new bootstrap.Modal($("#addFieldModal")[0]);
    //       addFieldModal.show();
    //       editingFieldCode = code;
    //     }
    //   } catch (error) {
    //     console.error("Error fetching field data:", error);
    //     swal("Error", "Failed to load field data. Please try again.", "error");
    //   }
    // });
  // In the document ready function, added click event for the 'View' button
  $(document).on("click", ".viewBtn", async function () {
    const logCode = $(this).data("id");
    try {
      const log = await getOneLog(logCode); // Fetch log details by logCode
      populateViewModalWithLogData(log); // Populate the "View Log" modal with log details
      const viewLogsModal = new bootstrap.Modal($("#viewLogsModal")[0]);
      viewLogsModal.show(); // Show the modal
    } catch (error) {
      console.error("Error fetching log data:", error);
      swal("Error", "Failed to fetch log data!", "error");
    }
  });

  function populateFormWithLogData(log) {
    $("#logCode").val(log.logCode);
    $("#logDetails").val(log.logDetails || "");
    $("#logDate").val(log.logDate || "");
    $("#field").val(log.field?.code || "");
    $("#crop").val(log.crop?.cropCode || "");
    $("#staffCode").val(log.staff?.staffId || "");
 $("#image1").attr("src", base64ToImageURL(log.observedImg)).show();
    // if (log.observedImg) {
    //   $("#image1").attr("src", log.observedImg).show(); // Assuming there's an image preview element
    // } else {
    //   $("#image1").hide();
    // }
  }
  // Function to populate the "View Log" modal with log data
  function populateViewModalWithLogData(log) {
    $("#viewLogCode").text(log.logCode);
    $("#viewLogDetails").text(log.logDetails || "No details available");
    $("#viewLogDate").text(log.logDate || "No date available");
    $("#viewField").text(log.field ? log.field.code : "No field assigned");
    $("#viewCrop").text(
      log.crop ? log.crop.cropCommonName : "No crop assigned"
    );
    $("#viewStaff").text(
      log.staff
        ? `${log.staff.firstName} ${log.staff.lastName}`
        : "No staff assigned"
    );

    if (log.observedImg) {
      $("#viewObservedImg").attr("src", log.observedImg).show();
    } else {
      $("#viewObservedImg").hide();
    }
  }

  function searchLogs(query) {
    getAllLogs()
      .then((logs) => {
        const filteredLogs = logs.filter(
          (log) =>
            log.logCode.toLowerCase().includes(query.toLowerCase()) ||
            (log.logDetails &&
              log.logDetails.toLowerCase().includes(query.toLowerCase()))
        );

        $("tbody.tableRow").empty(); // Assuming rows are appended to a `tbody` element with class `tableRow`
        filteredLogs.forEach((log) => loadTableRow(log)); // Assuming `loadTableRow` is a function to populate table rows
      })
      .catch((error) => {
        console.error("Error searching logs:", error);
        swal("Error", "Failed to search logs!", "error");
      });
  }

  $("#searchInput").on("input", function () {
    const query = $(this).val().trim();
    query ? searchLogs(query) : reloadTable();
  });

  $("#searchButton").on("click", function () {
    const query = $("#searchInput").val().trim();
    query ? searchLogs(query) : reloadTable();
  });
  reloadTable();
});
