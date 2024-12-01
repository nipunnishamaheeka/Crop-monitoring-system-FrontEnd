import { register } from "../../model/userModel.js";

$(document).ready(() => {
  $("#submitRegisterButton").click(function (event) {
    event.preventDefault();

    // Get input values
    const email = $("#emailInput").val().trim();
    const password = $("#passwordInput").val().trim();
    const role = $("#selectRole").val();
    // console.log(email,password,role);
    // Validate input fields
      if (validateForm(email, password, role)) {
        // console.log(validateForm(email, password, role));
      // Call register function
      register(email, password, role)
        .then((response) => {
          // Save token as cookie
          const token = response.token;
          document.cookie = `authToken=${token}; max-age=3600; path=/; Secure; SameSite=Strict`;
          console.log("Token saved as cookie:", document.cookie);

          // Redirect to sign-in page
          window.location.href = "/pages/signInForm.html";
        })
        .catch(() => {
          alert("Email already exists or registration failed.");
        });
    }
  });
});

// Validation function
function validateForm(email, password, role) {
  if (!$("#termsCheck").is(":checked")) {
    alert("Please accept the terms and conditions.");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (!password || password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return false;
  }

  if (!role || role === "Select Role") {
    alert("Please select a role.");
    return false;
  }

  return true;
}

function showNotification(type, message) {
  if (type === "error") {
    alert(`Error: ${message}`);
  } else if (type === "success") {
    alert(`Success: ${message}`);
  }
}
