const PlayerUpgrade = (async () => {
  const playerSelect = document.getElementById("playerSelect");
  const upgradeGauge = document.getElementById("upgradeGauge");
  const upgradeButton = document.getElementById("upgradeButton");
  const upgradeResult = document.getElementById("upgradeResult");
  const userID = localStorage.getItem("userID");
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:8282/api/gacha/${userID}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });

    if (!response.ok) throw new Error("네트워크 오류 발생");

    let players = await response.json();
    let selectedPlayer = null;
    let upgradeLevel = 0;

    const renderPlayers = () => {
      playerSelect.innerHTML = '<option value="">선수를 선택하세요</option>';
      players.data.forEach((player) => {
        const option = document.createElement("option");
        option.value = player.opID;
        option.textContent = `${player.playerName} (${player.powerLevel})`;
        playerSelect.appendChild(option);
      });
    };

    const resetUpgrade = () => {
      upgradeLevel = 0;
      upgradeGauge.style.width = "0%";
      upgradeButton.textContent = "강화하기";
    };

    const increaseUpgrade = () => {
      if (upgradeLevel < 100) {
        upgradeLevel += 10;
        upgradeGauge.style.width = `${upgradeLevel}%`;
        upgradeButton.textContent =
          upgradeLevel === 100 ? "강화 완료!" : `강화중... ${upgradeLevel}%`;
      }
    };

    const performUpgrade = () => {
      if (selectedPlayer && upgradeLevel === 100) {
        const success = Math.random() < 0.7; // 70% 성공 확률
        if (success) {
          selectedPlayer.level++;
          selectedPlayer.stats += Math.floor(Math.random() * 5) + 1;
          upgradeResult.textContent = "강화 성공!";
          upgradeResult.style.color = "#48bb78";
        } else {
          upgradeResult.textContent = "강화 실패...";
          upgradeResult.style.color = "#f56565";
        }
        renderPlayers();
        resetUpgrade();
      }
    };

    const init = () => {
      renderPlayers();

      playerSelect.addEventListener("change", (e) => {
        selectedPlayer = players.data.find(
          (p) => p.opID === parseInt(e.target.value)
        );
        resetUpgrade();
      });

      upgradeButton.addEventListener("click", () => {
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
    };

    return { init };
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
})();

window.onload = function () {
  PlayerUpgrade.then((upgrade) => upgrade.init()); // Promise가 완료된 후 init 호출
};
