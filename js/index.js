// 페이지가 로드될 때 실행되는 함수
window.onload = function () {
  const welcomeMessage = document.getElementById("welcome");
  const token = localStorage.getItem("token"); // localStorage에서 토큰 가져오기
  const token_type = token ? token.split(" ")[0] : null;
  const name = localStorage.getItem("name");
  welcomeMessage.textContent = `${name}님 환영합니다.`;

  // 토큰이 없으면 로그인 페이지로 이동
  if (!token || token_type !== "Bearer") {
    window.location.href = "login.html"; // 로그인 페이지로 이동
  }
};

// 섹션 전환 함수
function showSection(sectionId) {
  document.querySelectorAll(".content").forEach((section) => {
    section.style.display = "none"; // 모든 섹션 숨기기
  });
  document.getElementById(sectionId).style.display = "block"; // 선택한 섹션만 보임
}

// 로그아웃 처리
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userID");
  window.location.href = "login.html"; // 로그인 페이지로 이동
}
