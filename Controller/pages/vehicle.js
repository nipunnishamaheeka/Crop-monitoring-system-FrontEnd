function addVehicle() {
  alert("Add Vehicle functionality coming soon!");
}

function updateData() {
  alert("Update Data functionality coming soon!");
}

function deleteData() {
  alert("Delete Data functionality coming soon!");
}
function showAddVehicleModal() {
  const addVehicleModal = new bootstrap.Modal(
    document.getElementById("addVehicleModal")
  );
  addVehicleModal.show();
}

// show images
function previewImage(event, previewId) {
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById(previewId);
    output.src = reader.result;
    output.style.display = "block";
  };
  reader.readAsDataURL(event.target.files[0]);
}

document
  .getElementById("addVehicleForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Vehicle added successfully!");
    document.getElementById("addVehicleForm").reset();
    document.getElementById("preview1").style.display = "none";
    document.getElementById("preview2").style.display = "none";
    bootstrap.Modal.getInstance(
      document.getElementById("addVehicleModal")
    ).hide();
  });
// filter
document.getElementById("searchInput").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  const rows = document.querySelectorAll("#dataTable tr");

  rows.forEach((row) => {
    const code = row.cells[1].textContent.toLowerCase();
    const name = row.cells[2].textContent.toLowerCase();
    row.style.display =
      code.includes(searchValue) || name.includes(searchValue) ? "" : "none";
  });
});
