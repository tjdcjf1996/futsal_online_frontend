document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // 기본 폼 제출 동작을 방지

    const usernameInput = document.getElementById("username").value;
    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;
    const successMessage = document.getElementById("success-message"); // 에러 메시지를 표시할 요소
    const errorMessage = document.getElementById("error-message"); // 에러 메시지를 표시할 요소

    // 서버로 POST 요청 보내기
    fetch("http://localhost:8282/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
        name: usernameInput,
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
        console.log("Success:", data);
        errorMessage.style.display = "none"; // 성공하면 에러 메시지를 숨김
        successMessage.textContent =
          "회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...";
        successMessage.style.display = "block"; // 성공 메시지 표시

        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      })
      .catch((error) => {
        errorMessage.textContent = error.message; // 서버의 실패 메시지를 표시
        errorMessage.style.display = "block"; // 에러 메시지를 보이게 설정
      });
  });
