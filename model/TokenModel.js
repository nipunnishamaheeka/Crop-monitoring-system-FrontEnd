export function getCookie(name) {
  const cookieString = document.cookie; // Get all cookies as a string
  const cookies = cookieString.split("; "); // Split string into individual cookies

  for (let cookie of cookies) {
    const [key, value] = cookie.split("="); // Split each cookie into name and value
    if (key === name) {
      return value; // Return value if the name matches
    }
  }

  return null; // Return null if the cookie is not found
}

export function tokenRefresh() {
  const token = getCookie("authToken");
  console.log("Token: in service", token);
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/cropcontroller/api/v1/auth/refresh",
      type: "POST",
      data: {
        refreshToken: token,
      },
      contentType: "application/json",
      success: function (result) {
        console.log(result);
        resolve(result); // resolving with the response result
      },
      error: function (xhr, status, error) {
        reject(error); // rejecting on error
      },
    });
  });
}

export function saveCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}