window.addEventListener("section-myteam", async function () {
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

  // 카드들을 배열로 선언
  const cards = [
    document.getElementById("myteam-1"),
    document.getElementById("myteam-2"),
    document.getElementById("myteam-3"),
  ];

  const myTeamResponse = await fetch(`http://localhost:8282/api/auth/myteam`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  });

  if (!myTeamResponse.ok) {
    throw new Error("네트워크 오류 발생");
  }

  const myteamList = await myTeamResponse.json();
  console.log(myteamList);

  // 각 선수에 대해 추가 fetch 요청을 병렬로 실행
  const myteamDetailsPromises = myteamList.data.map(async (player) => {
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
  const myteamWithDetails = await Promise.all(myteamDetailsPromises);

  // 각 카드에 선수 정보를 업데이트
  myteamWithDetails.forEach((player, index) => {
    const card = cards[index]; // 현재 인덱스에 해당하는 카드
    if (card) {
      // 카드가 존재하는 경우에만 업데이트
      console.log(player);
      card.innerHTML = `
                <br>
                <img src="../assets/player.png" style="border-radius:0px" />
                <h3>${player.details.playerName}</h3>
                <br>
                <p>강화수치: ${player.powerLevel}</p>
            `;
    }
  });

  // 카드 요소가 없을 때 메시지 표시
  cards.forEach((card) => {
    if (!myteamWithDetails.length) {
      card.innerHTML = `
                <p>팀원을 선택해주세요.</p>
            `;
    }
  });
});
