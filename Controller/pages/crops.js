import { saveCrops } from "../../model/cropsModel.js";

$(document).ready(function () {
  // Show modal for adding crops
  $("#addCropPopup").click(function () {
    const addCropsModal = new bootstrap.Modal($("#addCropsModal")[0]);
    addCropsModal.show();
  });

  // Preview image function
  function previewImage(event, previewId) {
    const reader = new FileReader();
    reader.onload = function () {
      $(`#${previewId}`).attr("src", reader.result).show();
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  // Event delegation for previewing image on file input change
  $("#c_image").change(function (event) {
    previewImage(event, "preview1");
  });

  // Handle form submission
  $("#addCropsForm").submit(async function (event) {
    event.preventDefault();

    // Collect form data
    const cropData = {
      crop_code: $("#cropCode").val(),
      category: $("#category").val(),
      cropCommonName: $("#cropsName").val(),
      cropScientificName: $("#scientificName").val(),
      cropSeason: $("#season").val(),
      c_image: $("#c_image").val(), // Adjust this to handle image file if necessary
    };



    try {
      const result = await saveCrops(cropData);
      console.log("Save result:", result);
      alert("Crops added successfully!");
      $("#addCropsForm")[0].reset();
      $("#preview1").hide();
      bootstrap.Modal.getInstance($("#addCropsModal")[0]).hide();
    } catch (error) {
      console.error("Error saving crops:", error);
    }
  });
});
