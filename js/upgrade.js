const fetchEquippedPlayers = async (token) => {
  const response = await fetch("http://localhost:8282/api/auth/myteam", {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  });

  if (!response.ok)
    throw new Error("장착 선수 목록을 불러오는 데 실패했습니다.");
  return response.json();
};

const fetchPlayerDetails = async (playerID, token) => {
  const response = await fetch(`http://localhost:8282/api/player/${playerID}`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  });

  if (!response.ok)
    throw new Error("선수 상세 정보를 불러오는 데 실패했습니다.");
  return response.json();
};

const loadEquippedPlayersWithDetails = async (token) => {
  const myteamList = await fetchEquippedPlayers(token);

  const playerDetailsPromises = myteamList.data.map((player) =>
    fetchPlayerDetails(player.playerID, token).then((details) => ({
      ...player,
      detail: details.data,
    }))
  );

  return Promise.all(playerDetailsPromises);
};

const upgradePlayer = async (playerID, powerLevel, token) => {
  const response = await fetch("http://localhost:8282/api/user/upgrade", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({ playerID: +playerID, powerLevel: +powerLevel }),
  });

  if (!response.ok) {
    const error = await response.json(); // 에러 내용을 JSON 형식으로 파싱
    throw new Error(error.message || "강화에 실패했습니다."); // 에러 메시지가 있으면 사용하고, 없으면 기본 메시지 사용
  }
  return response.json();
};

const populatePlayerSelect = async () => {
  const token = localStorage.getItem("token");

  try {
    const players = await loadEquippedPlayersWithDetails(token);
    const playerSelect = document.getElementById("playerSelect");
    playerSelect.innerHTML = "";
    players.forEach((player) => {
      const option = document.createElement("option");
      option.value = player.playerID;
      option.textContent = `${player.detail.playerName} (레벨: ${player.powerLevel})`;
      playerSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    document.getElementById("message").textContent = error.message;
  }
};

const handleUpgrade = async () => {
  const token = localStorage.getItem("token");
  const playerSelect = document.getElementById("playerSelect");
  const selectedPlayerID = playerSelect.value;
  const selectedPlayer = [...playerSelect.options].find(
    (option) => option.value === selectedPlayerID
  );

  if (!selectedPlayer) {
    alert("선수를 선택해주세요.");
    return;
  }

  const powerLevel = parseInt(
    selectedPlayer.textContent.match(/레벨: (\d+)/)[1]
  );

  try {
    const result = await upgradePlayer(selectedPlayerID, powerLevel, token);
    document.getElementById("message").textContent = result.message;
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    console.error(error);
    document.getElementById("message").textContent = error.message;
  }
};

window.addEventListener("section-upgrade", async () => {
  await populatePlayerSelect();
});

document
  .getElementById("upgradeButton")
  .addEventListener("click", handleUpgrade);
