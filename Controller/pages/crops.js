function addCrops() {
  alert("Add Crops functionality coming soon!");
}

function updateData() {
  alert("Update Data functionality coming soon!");
}

function deleteData() {
  alert("Delete Data functionality coming soon!");
}
function showAddCropsModal() {
  const addCropsModal = new bootstrap.Modal(
    document.getElementById("addCropsModal")
  );
  addCropsModal.show();
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
  .getElementById("addCropsForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Crops added successfully!");
    document.getElementById("addCropsForm").reset();
    document.getElementById("preview1").style.display = "none";
    document.getElementById("preview2").style.display = "none";
    bootstrap.Modal.getInstance(
      document.getElementById("addCropsModal")
    ).hide();
  });

