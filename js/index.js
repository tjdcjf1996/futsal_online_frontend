window.addEventListener("DOMContentLoaded", async function () {
  const welcomeMessage = document.getElementById("welcome");
  const token = localStorage.getItem("token");
  const token_type = token ? token.split(" ")[0] : null;
  const name = localStorage.getItem("name");
  welcomeMessage.textContent = `${name}님 환영합니다.`;

  // 토큰이 없으면 로그인 페이지로 이동
  if (!token || token_type !== "Bearer") {
    window.location.href = "login.html"; // 로그인 페이지로 이동
  }

  // lastSection에서 가져온 값으로 섹션을 보여줍니다
  const lastSection = localStorage.getItem("lastSection") || "players";
  showSection(lastSection);
});

// 섹션 전환 함수
function showSection(sectionId) {
  document.querySelectorAll(".content").forEach((section) => {
    section.style.display = "none"; // 모든 섹션 숨기기
  });
  document.getElementById(sectionId).style.display = "block"; // 선택한 섹션만 보임

  // 선택한 섹션을 localStorage에 저장
  localStorage.setItem("lastSection", sectionId);

  const event = new CustomEvent(`section-${sectionId}`, {
    detail: { sectionId },
  });
  window.dispatchEvent(event); // window나 특정 요소에서 이벤트 발생시킴
}

// 로그아웃 처리
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userID");
  localStorage.removeItem("name");
  localStorage.removeItem("lastSection");
  window.location.href = "login.html"; // 로그인 페이지로 이동
}
