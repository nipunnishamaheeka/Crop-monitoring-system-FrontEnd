import { getCookie, saveCookie } from "../../model/TokenModel.js";
import { login } from "../../model/userModel.js";

$(document).ready(function () {
  // Toggle password visibility
  $(".toggle-password").click(function () {
    const passwordInput = $("#passwordInput");
    const eyeIcon = $(this).find("i");

    if (passwordInput.attr("type") === "password") {
      passwordInput.attr("type", "text");
      eyeIcon.removeClass("bi-eye").addClass("bi-eye-slash");
    } else {
      passwordInput.attr("type", "password");
      eyeIcon.removeClass("bi-eye-slash").addClass("bi-eye");
    }
  });

  // Handle sign-in button click
  $("#signInForm").on("submit", function (event) {
    event.preventDefault(); // Prevent the form from reloading the page

    const email = $("#emailInput").val();
    const password = $("#passwordInput").val();
    const termsChecked = $("#termsCheck").prop("checked");

    if (!termsChecked) {
      swal("Error", "Please accept the terms and conditions.", "error");
      return;
    }

    // Perform login
    login(email, password)
      .then((response) => {
        const token = response.token;
        saveCookie("authToken", token, 1); // Save the token for 1 day
        console.log("Token saved as cookie:", getCookie("authToken"));
        window.location.href = "/index.html"; // Redirect to the dashboard
      })
      .catch((error) => {
        console.error("Login failed:", error);
        swal("Error", "Invalid email or password.", "error");
      });
  }); 
});
