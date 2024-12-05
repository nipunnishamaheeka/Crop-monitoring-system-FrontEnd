import { register } from "../../model/userModel.js";

$(document).ready(() => {
  $("#submitRegisterButton").click(function (event) {
    event.preventDefault();

    const email = $("#emailInput").val().trim();
    const password = $("#passwordInput").val().trim();
    const role = $("#selectRole").val();

    if (validateForm(email, password, role)) {
      register(email, password, role)
        .then((response) => {
          const token = response.token;
          document.cookie = `authToken=${token}; max-age=3600; path=/; Secure; SameSite=Strict`;
          console.log("Token saved as cookie:", document.cookie);

          window.location.href = "/pages/signInForm.html";
        })
        .catch(() => {
          swal("Error", "Email already exists or registration failed.", "error");
        });
    }
  });
});
function validateForm(email, password, role) {
  if (!$("#termsCheck").is(":checked")) {
    swal("Error", "Please accept the terms and conditions.", "error");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    swal("Error", "Please enter a valid email address.", "error");
    return false;
  }

  if (!password || password.length < 8) {
    swal("Error", "Password must be at least 8 characters long.", "error");
    return false;
  }

  if (!role || role === "Select Role") {
    swal("Error", "Please select a role.", "error");
    return false;
  }

  return true;
}

function showNotification(type, message) {
  if (type === "error") {
    swal("Error", message, "error");
  } else if (type === "success") {
    // alert(`Success: ${message}`);
    swal("Success", message, "success");
  }
}
