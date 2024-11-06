import { deleteCrops, getAllCrops, saveCrops } from "../../model/cropsModel.js";

$(document).ready(function () {
  // Show modal for adding crops
  $("#addCropPopup").click(function () {
    const addCropsModal = new bootstrap.Modal($("#addCropsModal")[0]);
    addCropsModal.show();
    // Generate crop ID when the modal opens
  });

  // Preview image function
  function previewImage(event, previewId) {
    const reader = new FileReader();
    reader.onload = function () {
      $(`#${previewId}`).attr("src", reader.result).show();
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  // Event handler for image preview
  $("#c_image").change(function (event) {
    previewImage(event, "preview1");
  });

  // Handle form submission for saving crops
  $("#addCropsForm").submit(async function (event) {
    event.preventDefault();

    // Collect form data
    const cropData = {
      crop_code: $("#cropCode").val(),
      category: $("#category").val(),
      cropCommonName: $("#cropsName").val(),
      cropScientificName: $("#scientificName").val(),
      cropSeason: $("#season").val(),
      c_image: $("#c_image").val(), // Replace with actual image handling if needed
    };

    try {
      await saveCrops(cropData);
      alert("Crop added successfully!");
      $("#addCropsForm")[0].reset();
      $("#preview1").hide();
      bootstrap.Modal.getInstance($("#addCropsModal")[0]).hide();
      reloadTable(); // Refresh table after saving
    } catch (error) {
      console.error("Error saving crop:", error);
      alert("Failed to save crop!");
    }
  });

  // Load data into the table
  async function reloadTable() {
    try {
      const crops = await getAllCrops();
      $("tbody.tableRow").empty(); // Clear previous rows

      crops.forEach((crop) => {
        loadTable(crop);
      });
    } catch (error) {
      console.error("Error loading crops:", error);
    }
  }

  // Function to append crop data to the table
  function loadTable(cropData) {
    const rowHtml = `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${cropData.crop_code}</td>
        <td>${cropData.cropCommonName}</td>
        <td>${cropData.cropScientificName}</td>
        <td><img src="${cropData.c_image}" class="img-thumbnail" style="max-width: 50px;" /></td>
        <td>${cropData.category}</td>
        <td>${cropData.cropSeason}</td>
        <td>
          <button class="btn btn-sm btn-warning" id="editBtn">Edit</button>
          <button class="btn btn-sm btn-danger removeBtn" data-id="${cropData.crop_code}">Delete</button>
        </td>
      </tr>
    `;
    $("tbody.tableRow").append(rowHtml);
  }

  // Initial load of crop data
  reloadTable();

  // Event handler for the remove button click (delete crop)
  $(document).on("click", ".removeBtn", async function () {
    const cropCode = $(this).data("id");

    try {
      await deleteCrops(cropCode);
      alert("Crops Deleted");
      reloadTable(); // Refresh table after deleting
    } catch (error) {
      console.error("Error deleting crop:", error);
      alert("Failed to delete crop!");
    }
  });
});

function loadCropsId(cropsIds) {
  const cropId = $("#cropCode");
  cropId.empty();
  cropId.append(
    '<option value="">Search,Update or Delete Customer</option>'
  );

  cropsIds.forEach(function (id) {
    cropId.append(`<option value="${id}">${id}</option>`);
  });
}