import {
  deleteCrops,
  getAllCrops,
  saveCrops,
  updateCrops,
} from "../../model/cropsModel.js";

$(document).ready(function () {
  let editingCropCode = null;

  $("#addCropPopup").click(function () {
    const addCropsModal = new bootstrap.Modal($("#addCropsModal")[0]);
    addCropsModal.show();
    $("#addCropsForm")[0].reset();
    $("#preview1").hide();
    editingCropCode = null;
  });

  // Preview image
  function previewImage(event, previewId) {
    const reader = new FileReader();
    reader.onload = function () {
      $(`#${previewId}`).attr("src", reader.result).show();
    };
    const file = event.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  $("#c_image").change(function (event) {
    previewImage(event, "preview1");
  });

  $("#addCropsForm").submit(async function (event) {
    event.preventDefault();

    const cropImage = $("#c_image")[0].files[0];

    const cropData = {
      crop_code: $("#cropCode").val(),
      category: $("#category").val(),
      cropCommonName: $("#cropsName").val(),
      cropScientificName: $("#scientificName").val(),
      cropSeason: $("#season").val(),
      cropImage: cropImage ? URL.createObjectURL(cropImage) : null,
    };

    try {
      if (editingCropCode) {
        await updateCrops(editingCropCode, cropData);
        alert("Crop updated successfully!");
      } else {
        await saveCrops(cropData);
        alert("Crop added successfully!");
      }
      $("#addCropsForm")[0].reset();
      $("#preview1").hide();
      bootstrap.Modal.getInstance($("#addCropsModal")[0]).hide();
      reloadTable();
    } catch (error) {
      console.error("Error saving or updating crop:", error);
      alert("Failed to save or update crop!");
    }
  });

  // Load data into the table
  async function reloadTable() {
    try {
      const crops = await getAllCrops();
      $("tbody.tableRow").empty();
      crops.forEach((crop) => {
        loadTable(crop);
      });
    } catch (error) {
      console.error("Error loading crops:", error);
    }
  }
  function loadTable(cropData) {
    const rowHtml = `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${cropData.cropCode}</td>
        <td>${cropData.cropCommonName}</td>
        <td>${cropData.cropScientificName}</td>
        <td><img src="${cropData.cropImage}" class="img-thumbnail" style="max-width: 50px;" /></td>
        <td>${cropData.category}</td>
        <td>${cropData.cropSeason}</td>
        <td>
          <button class="btn btn-sm btn-warning editBtn" data-id="${cropData.cropCode}">Edit</button>
          <button class="btn btn-sm btn-danger removeBtn" data-id="${cropData.cropCode}">Delete</button>
        </td>
      </tr>
    `;
    $("tbody.tableRow").append(rowHtml);
  }
  reloadTable();
  $(document).on("click", ".removeBtn", async function () {
    const cropCode = $(this).data("id");

    try {
      await deleteCrops(cropCode);
      alert("Crops Deleted");
      reloadTable();
    } catch (error) {
      console.error("Error deleting crop:", error);
      alert("Failed to delete crop!");
    }
  });
  $(document).on("click", ".editBtn", async function () {
    const cropCode = $(this).data("id");
    try {
      const crop = await getAllCrops().then((crops) =>
        crops.find((crop) => crop.cropCode === cropCode)
      );
      if (crop) {
        $("#cropCode").val(crop.cropCode);
        $("#category").val(crop.category);
        $("#cropsName").val(crop.cropCommonName);
        $("#scientificName").val(crop.cropScientificName);
        $("#season").val(crop.cropSeason);
        $("#preview1").attr("src", crop.cropImage).show();
        const addCropsModal = new bootstrap.Modal($("#addCropsModal")[0]);
        addCropsModal.show();
        editingCropCode = cropCode;
      }
    } catch (error) {
      console.error("Error fetching crop data:", error);
    }
  });
});
