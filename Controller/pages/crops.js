import {
  deleteCrops,
  getAllCrops,
  saveCrops,
  updateCrops,
} from "../../model/cropsModel.js";
import { getAll } from "../../model/fieldModel.js";

$(document).ready(function () {
  let editingCropCode = null;
  loadFieldData();

  $("#addCropPopup").click(function () {
    const addCropsModal = new bootstrap.Modal($("#addCropsModal")[0]);
    addCropsModal.show();
    $("#addCropsForm")[0].reset();
    $("#preview1").hide();
    editingCropCode = null;
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

  $("#c_image").change(function (event) {
    previewImage(event, "preview1");
  });

  $("#addCropsForm").submit(async function (event) {
    event.preventDefault();

    const cropData = {
      cropCode: $("#cropCode").val(),
      fieldCode: $("#fieldCode").val(),
      cropType: $("#category").val(),
      cropCommonName: $("#cropsName").val(),
      cropScientificName: $("#scientificName").val(),
      cropSeason: $("#season").val(),
      cropImage: $("#c_image")[0].files[0],
    };

    try {
      if (editingCropCode) {
        await updateCrops(editingCropCode, cropData);
        alert("Crop updated successfully!");
      } else {
        await saveCrops(cropData);
        alert("Crop added successfully!");
      }
      resetForm();
      reloadTable();
    } catch (error) {
      console.error("Error saving or updating crop:", error);
      alert("Failed to save or update crop!");
    }
  });

  function resetForm() {
    $("#addCropsForm")[0].reset();
    $("#preview1").hide();
    bootstrap.Modal.getInstance($("#addCropsModal")[0]).hide();
  }

  async function loadFieldData() {
    try {
      const fields = await getAll();
      const fieldSelect = $("#fieldCode");
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

  async function reloadTable() {
    try {
      const crops = await getAllCrops();
      $("tbody.tableRow").empty();
      crops.forEach((crop) => loadTableRow(crop));
    } catch (error) {
      console.error("Error loading crops:", error);
    }
  }

  function loadTableRow(cropData) {
    const rowHtml = `
      <tr>
        <td><input type="checkbox" /></td>
        <td>${cropData.cropCode}</td>
        <td>${cropData.field ? cropData.field.fieldName : "Unassigned"}</td>
        <td>${cropData.cropCommonName}</td>
        <td>${cropData.cropScientificName}</td>
        <td><img src="${base64ToImageURL(
          cropData.cropImage
        )}" class="img-thumbnail" style="max-width: 50px;" /></td>
        <td>${cropData.category}</td>
        <td>${cropData.cropSeason}</td>
        <td>
          <button class="btn btn-outline-primary btn-sm editBtn" data-id="${
            cropData.cropCode
          }">Edit</button>
          <button class="btn btn-outline-danger btn-sm removeBtn" data-id="${
            cropData.cropCode
          }">Delete</button>
        </td>
      </tr>
    `;
    $("tbody.tableRow").append(rowHtml);
  }

  function base64ToImageURL(base64Data) {
    return `data:image/png;base64,${base64Data}`;
  }

  $(document).on("click", ".removeBtn", async function () {
    const cropCode = $(this).data("id");
    try {
      await deleteCrops(cropCode);
      alert("Crop deleted successfully!");
      reloadTable();
    } catch (error) {
      console.error("Error deleting crop:", error);
      alert("Failed to delete crop!");
    }
  });

  $(document).on("click", ".editBtn", async function () {
    const cropCode = $(this).data("id");
    try {
      const crop = (await getAllCrops()).find(
        (crop) => crop.cropCode === cropCode
      );
      if (crop) {
        populateFormWithCropData(crop);
        const addCropsModal = new bootstrap.Modal($("#addCropsModal")[0]);
        addCropsModal.show();
        editingCropCode = cropCode;
      }
    } catch (error) {
      console.error("Error fetching crop data:", error);
    }
  });

  function populateFormWithCropData(crop) {
    $("#cropCode").val(crop.cropCode);
    $("#fieldCode").val(crop.field ? crop.field.code : "");
    $("#category").val(crop.category);
    $("#cropsName").val(crop.cropCommonName);
    $("#scientificName").val(crop.cropScientificName);
    $("#season").val(crop.cropSeason);
    $("#preview1").attr("src", crop.cropImage).show();
  }
  function searchCrops(query) {
    getAllCrops()
      .then((crops) => {
        const filteredCrops = crops.filter(
          (crop) =>
            crop.cropCode.toLowerCase().includes(query.toLowerCase()) ||
            crop.cropCommonName.toLowerCase().includes(query.toLowerCase())
        );
        $("tbody.tableRow").empty();
        filteredCrops.forEach((crop) => loadTableRow(crop));
      })
      .catch((error) => {
        console.error("Error searching crops:", error);
        alert("Failed to search crops!");
      });
  }
  $("#searchInput").on("input", function () {
    const query = $(this).val().trim();
    query ? searchCrops(query) : reloadTable();
  });

  $("#searchButton").on("click", function () {
    const query = $("#searchInput").val().trim();
    query ? searchCrops(query) : reloadTable();
  });
  reloadTable();
});
