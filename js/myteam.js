// 전역 변수
let playersList = [];
let equippedPlayers = [];

// DOM 요소
const registerTeamBtn = document.getElementById("registerTeamBtn");
const deleteTeamBtn = document.getElementById("deleteTeam");
const popupOverlay = document.getElementById("popup-overlay");
const teamPopup = document.getElementById("team-popup");
const teamList = document.getElementById("team-list");
const closePopupBtn = document.getElementById("closePopup");
const myteamCards = [
  document.getElementById("myteam-1"),
  document.getElementById("myteam-2"),
  document.getElementById("myteam-3"),
];

// 이벤트 리스너
registerTeamBtn.addEventListener("click", openAddPopup);
deleteTeamBtn.addEventListener("click", openDeletePopup);
closePopupBtn.addEventListener("click", closePopup);

// 내 팀 보기 초기화
async function initializeMyTeam() {
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

  try {
    const myTeamResponse = await fetch(
      `http://localhost:8282/api/auth/myteam`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (!myTeamResponse.ok) {
      throw new Error("네트워크 오류 발생");
    }

    const myteamList = await myTeamResponse.json();
    console.log(myteamList);

    // 각 선수에 대해 추가 fetch 요청을 병렬로 실행
    const myteamDetailsPromises = myteamList.data.map(async (player) => {
      const playerResponse = await fetch(
        `http://localhost:8282/api/player/${player.playerID}`,
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
        ...player,
        details: playerDetails.data,
      };
    });

    const myteamWithDetails = await Promise.all(myteamDetailsPromises);

    // 각 카드에 선수 정보를 업데이트
    myteamCards.forEach((card, index) => {
      if (myteamWithDetails[index]) {
        const player = myteamWithDetails[index];
        card.innerHTML = `
          <br>
          <img src="../assets/player.png" style="border-radius:0px" />
          <h3>${player.details.playerName}</h3>
          <br>
          <p>강화수치: ${player.powerLevel}</p>
        `;
      } else {
        card.innerHTML = `<p>팀원을 선택해주세요.</p>`;
      }
    });

    equippedPlayers = myteamWithDetails;
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// 선수 목록 가져오기
async function fetchPlayers() {
  try {
    const userID = localStorage.getItem("userID");
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8282/api/gacha/${userID}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("선수 목록을 가져오는데 실패했습니다.");
    }

    const data = await response.json();
    playersList = data.data;
    renderPlayerList();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// 선수 목록 렌더링 (추가용)
function renderPlayerList() {
  teamList.innerHTML = "";
  playersList.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = `${player.playerName} (강화 수치: ${player.powerLevel})`;
    li.addEventListener("click", () => addPlayerToTeam(player));
    teamList.appendChild(li);
  });
}

// 장착된 선수 목록 렌더링 (삭제용)
function renderEquippedPlayerList() {
  teamList.innerHTML = "";
  equippedPlayers.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = `${player.details.playerName} (강화 수치: ${player.powerLevel})`;
    li.addEventListener("click", () => deletePlayerFromTeam(player));
    teamList.appendChild(li);
  });
}

// 팀에 선수 추가
async function addPlayerToTeam(player) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8282/api/auth/createTeam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        playerID: player.playerID,
        powerLevel: player.powerLevel,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errorMessage || "선수 추가에 실패했습니다.");
    }

    alert("선수가 성공적으로 추가되었습니다!");
    closePopup();
    initializeMyTeam();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// 팀에서 선수 삭제
async function deletePlayerFromTeam(player) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8282/api/auth/deleteTeam", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        playerID: player.playerID,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errorMessage || "선수 삭제에 실패했습니다.");
    }

    alert("선수가 성공적으로 삭제되었습니다!");
    closePopup();
    initializeMyTeam();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// 추가 팝업 열기 함수
function openAddPopup() {
  popupOverlay.style.display = "block";
  teamPopup.style.display = "block";
  document.getElementById("selectedTeam").textContent = "선택된 팀: 추가";
  fetchPlayers();
}

// 삭제 팝업 열기 함수
function openDeletePopup() {
  popupOverlay.style.display = "block";
  teamPopup.style.display = "block";
  document.getElementById("selectedTeam").textContent = "선택된 팀: 삭제";
  renderEquippedPlayerList();
}

// 팝업 닫기 함수
function closePopup() {
  popupOverlay.style.display = "none";
  teamPopup.style.display = "none";
}
// 모달 바깥을 클릭 시 모달 닫기
window.addEventListener("click", (event) => {
  if (event.target === popupOverlay) {
    popupOverlay.style.display = "none";
    teamPopup.style.display = "none";
  }
});

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  initializeMyTeam();
});

// 섹션 변경 이벤트 리스너
window.addEventListener("section-myteam", initializeMyTeam);
