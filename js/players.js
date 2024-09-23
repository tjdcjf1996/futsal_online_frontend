// 모달 표시 함수
function showPlayerDetails(player) {
  document.getElementById("modal-title").textContent = player.playerName;
  document.getElementById("modal-position").textContent =
    player.position || "포지션 정보 없음"; // 포지션 정보 처리
  document.getElementById("modal-stats").textContent = player.powerLevel;

  const modal = document.getElementById("modal");
  modal.style.display = "block";
}

// 모달 닫기 함수
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// 모달 닫기 이벤트 등록
document.querySelector(".close").onclick = closeModal;

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    closeModal(); // 모달 숨기기
  }
};

// 페이지 로드 시 선수 목록을 가져오기
window.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

  try {
    const response = await fetch(`http://localhost:8282/api/gacha/${userID}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });
    if (!response.ok) throw new Error("네트워크 오류 발생");

    const fetchData = await response.json();
    const playerList = document.querySelector(".player-list");
    playerList.innerHTML = ""; // 기존 내용 제거

    // 선수 목록 생성
    fetchData.data.forEach((player) => {
      const playerItem = document.createElement("div");
      playerItem.classList.add("player-item");
      playerItem.setAttribute("data-name", player.playerName);
      playerItem.setAttribute("data-stats", player.powerLevel);
      playerItem.innerHTML = `
        <h3>${player.playerName}</h3>
        <p>능력치: ${player.powerLevel}</p>
      `;

      // 클릭 시 상세 정보 표시
      playerItem.addEventListener("click", () => showPlayerDetails(player));

      playerList.appendChild(playerItem);
    });
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
});
