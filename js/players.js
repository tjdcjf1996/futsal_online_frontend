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

    // 모달 관련 요소 가져오기
    const modal = document.getElementById("playerModal");
    const modalPlayerName = document.getElementById("modalPlayerName");
    const modalPlayerStats = document.getElementById("modalPlayerStats");
    const modalPlayerSpeed = document.getElementById("modalPlayerSpeed");
    const modalPlayerFinishing = document.getElementById(
      "modalPlayerFinishing"
    );
    const modalPlayerShootPower = document.getElementById(
      "modalPlayerShootPower"
    );
    const modalPlayerDefense = document.getElementById("modalPlayerDefense");
    const modalPlayerStamina = document.getElementById("modalPlayerStamina");
    const closeModal = document.querySelector(".close");

    // 각 선수에 대해 추가 fetch 요청을 병렬로 실행
    const playerDetailsPromises = fetchData.data.map(async (player) => {
      const playerResponse = await fetch(
        `http://localhost:8282/api/player/${player.playerID}`, // playerID로 상세 정보 가져옴
        {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!playerResponse.ok) throw new Error("선수 상세 정보 불러오기 실패");

      const playerDetails = await playerResponse.json();
      return {
        ...player, // gacha의 player 데이터
        details: playerDetails.data, // player의 상세 정보 추가
      };
    });

    // 모든 fetch가 완료되면 결과를 받아 처리
    const playersWithDetails = await Promise.all(playerDetailsPromises);

    // 선수 목록 생성
    playersWithDetails.forEach((player) => {
      const playerItem = document.createElement("div");
      playerItem.classList.add("player-item");

      playerItem.innerHTML = `
          <h3>${player.playerName}</h3>
          <p>능력치: ${player.powerLevel}</p>
        `;

      // 클릭 시 모달 열기
      playerItem.addEventListener("click", () => {
        modalPlayerName.innerText = player.playerName;
        modalPlayerStats.innerText = `능력치: ${player.powerLevel}`;
        modalPlayerSpeed.innerText = `스피드: ${player.details.speed}`;
        modalPlayerFinishing.innerText = `골 결정력: ${player.details.finishing}`;
        modalPlayerShootPower.innerText = `슛 파워: ${player.details.shootPower}`;
        modalPlayerDefense.innerText = `수비력: ${player.details.defense}`;
        modalPlayerStamina.innerText = `스태미너: ${player.details.stamina}`;
        modal.style.display = "block"; // 모달 표시
      });

      playerList.appendChild(playerItem);
    });

    // 닫기 버튼 클릭 시 모달 닫기
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // 모달 바깥을 클릭 시 모달 닫기
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
});
