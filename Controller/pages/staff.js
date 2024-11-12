$(document).ready(function () {
    let editingStaffCode = null;

    $("#addStaffPopup").click(function () {
      const addStaffModal = new bootstrap.Modal($("#addStaffModal")[0]);
      addStaffModal.show();
      $("#addStaffForm")[0].reset();
      editingStaffCode = null;
    });
});