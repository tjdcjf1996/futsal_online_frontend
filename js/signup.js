document.addEventListener("DOMContentLoaded", function () {
  const playerSelect = document.getElementById("playerSelect");
  const upgradeGauge = document.getElementById("upgradeGauge");
  const upgradeButton = document.getElementById("upgradeButton");
  const upgradeResult = document.getElementById("upgradeResult");

  let selectedPlayer = null;
  let upgradeLevel = 0;

  // 선수 목록을 가져오는 함수
  function fetchPlayers() {
    // 실제 구현에서는 서버에서 데이터를 가져와야 합니다.
    // 여기서는 예시 데이터를 사용합니다.
    const players = [
      { id: 1, name: "홍길동", level: 1, stats: 85 },
      { id: 2, name: "김철수", level: 1, stats: 82 },
      { id: 3, name: "이영희", level: 1, stats: 80 },
    ];

    players.forEach((player) => {
      const option = document.createElement("option");
      option.value = player.id;
      option.textContent = `${player.name} (${player.stats})`;
      playerSelect.appendChild(option);
    });
  }

  // 선수 선택 이벤트 핸들러
  playerSelect.addEventListener("change", function (event) {
    selectedPlayer = event.target.value;
    resetUpgrade();
  });

  // 강화 버튼 클릭 이벤트 핸들러
  upgradeButton.addEventListener("click", function () {
    if (!selectedPlayer) {
      alert("선수를 선택해주세요.");
      return;
    }

    if (upgradeLevel < 100) {
      increaseUpgrade();
    } else {
      performUpgrade();
    }
  });

  // 강화 게이지 증가 함수
  function increaseUpgrade() {
    upgradeLevel += 10;
    upgradeGauge.style.width = `${upgradeLevel}%`;
    upgradeButton.textContent =
      upgradeLevel === 100 ? "강화 완료!" : `강화중... ${upgradeLevel}%`;
  }

  // 강화 실행 함수
  function performUpgrade() {
    // 실제 구현에서는 서버로 강화 요청을 보내야 합니다.
    fetch("http://localhost:8282/api/player/upgrade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"), // 토큰이 필요한 경우
      },
      body: JSON.stringify({
        playerId: selectedPlayer,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("강화 실패");
        }
        return response.json();
      })
      .then((data) => {
        upgradeResult.textContent = "강화 성공!";
        upgradeResult.style.color = "#48bb78";
        // 선수 정보 업데이트
        fetchPlayers();
      })
      .catch((error) => {
        upgradeResult.textContent = "강화 실패...";
        upgradeResult.style.color = "#f56565";
      })
      .finally(() => {
        resetUpgrade();
      });
  }

  // 강화 게이지 리셋 함수
  function resetUpgrade() {
    upgradeLevel = 0;
    upgradeGauge.style.width = "0%";
    upgradeButton.textContent = "강화하기";
    upgradeResult.textContent = "";
  }

  // 초기화
  fetchPlayers();
});
