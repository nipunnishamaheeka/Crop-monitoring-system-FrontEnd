// In LoginService.js
export function register(email, password, role) {
  const raw = {
    email: email,
    password: password,
    role: role,
  };
  console.log(raw);
  // return new Promise((resolve, reject) => {
  $.ajax({
    url: "http://localhost:5055/cropcontroller/api/v1/auth/signup",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(raw),
    success: function (result) {
      console.log(result);
      resolve(result); // resolving with the response result
    },
    error: function (xhr, status, error) {
      console.error("Error saving :", xhr, status, error);
      swal("Error", "Failed to save!", "error");
    },
  });
  // });
}

export function login(email, password) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/auth/signin",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: function (result) {
        console.log("Login successful:", result);
        resolve(result);
      },
      error: function (xhr, status, error) {
        console.error("Error during login:", xhr, status, error);
        reject(error);
      },
    });
  });
}
