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
$("#formRegi")[0].reset();
          showNotification("success", "User registered successfully!");
          setTimeout(() => {
              $("#formRegi")[0].reset();
            // window.location.href = "/pages/signInForm.html";
          }, 2000);
        })
        .catch((error) => {
          console.error("Registration failed:", error);
          showNotification(
            "error",
            "Email already exists or registration failed."
          );
        });
    }
  });
});


/**
 * 
  @param {string} email
  @param {string} password 
  @param {string} role
  @returns {boolean} 
 */
function validateForm(email, password, role) {
  if (!$("#termsCheck").is(":checked")) {
    showNotification("error", "Please accept the terms and conditions.");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    showNotification("error", "Please enter a valid email address.");
    return false;
  }

  if (!password || password.length < 8) {
    showNotification("error", "Password must be at least 8 characters long.");
    return false;
  }

  if (!role || role === "Select Role") {
    showNotification("error", "Please select a role.");
    return false;
  }

  return true;
}

/**
 
  @param {string} type 
  @param {string} message 
 */
function showNotification(type, message) {
  if (type === "error") {
    swal("Error", message, "error");
  } else if (type === "success") {
    swal("Success", message, "success");
  }
}
