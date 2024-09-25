document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // 기본 폼 제출 동작을 방지

    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;
    const successMessage = document.getElementById("success-message"); // 에러 메시지를 표시할 요소
    const errorMessage = document.getElementById("error-message"); // 에러 메시지를 표시할 요소

    // 서버로 POST 요청 보내기
    fetch("http://localhost:8282/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.errorMessage); // 서버로부터 받은 에러 메시지
          });
        }
        return response.json();
      })
      .then((data) => {
        const setLocalStorageTimer = (key, value, time) => {
          let now = new Date();
          let item = {
            value: value,
            expireTime: now.getTime() + time,
          };

          localStorage.setItem(key, JSON.stringify(item));
        };

        // setLocalStorageTimer("token", data.token, 30000);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userID", data.userID);
        localStorage.setItem("name", data.name);
        window.location.href = "index.html";
      })
      .catch((error) => {
        errorMessage.textContent = error.message; // 서버의 실패 메시지를 표시
        errorMessage.style.display = "block"; // 에러 메시지를 보이게 설정
      });
  });
