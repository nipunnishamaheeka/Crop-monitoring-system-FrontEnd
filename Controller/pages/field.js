function addField() {
  alert("Add Field functionality coming soon!");
}

function updateData() {
  alert("Update Data functionality coming soon!");
}

function deleteData() {
  alert("Delete Data functionality coming soon!");
}
function showAddFieldModal() {
  const addFieldModal = new bootstrap.Modal(
    document.getElementById("addFieldModal")
  );
  addFieldModal.show();
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
  .getElementById("addFieldForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Field added successfully!");
    document.getElementById("addFieldForm").reset();
    document.getElementById("preview1").style.display = "none";
    document.getElementById("preview2").style.display = "none";
    bootstrap.Modal.getInstance(
      document.getElementById("addFieldModal")
    ).hide();
  });
// filter
document.getElementById("searchInput").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  const rows = document.querySelectorAll("#dataTable tr");

  rows.forEach((row) => {
    const name = row.cells[1].textContent.toLowerCase();
    const email = row.cells[2].textContent.toLowerCase();
    row.style.display =
      name.includes(searchValue) || email.includes(searchValue) ? "" : "none";
  });
});
