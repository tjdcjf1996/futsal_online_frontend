const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

window.addEventListener("section-gameStart", async function () {
  const fetchRankingData = async () => {
    try {
      const response = await fetch("http://localhost:8282/api/user/rank", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("랭킹 데이터를 가져오는 데 실패했습니다.");
      }

      const data = await response.json();
      console.log(data.data);
      const returnData = data.data.slice(0, 10);
      return returnData; // 랭킹 데이터 반환
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const populateRankingTable = async () => {
    const rankingBody = document.getElementById("rankingBody");
    const userID = localStorage.getItem("userID");

    // 기존 행 삭제
    rankingBody.innerHTML = "";

    const rankingData = await fetchRankingData();

    // 데이터가 존재할 경우
    if (rankingData) {
      rankingData.forEach((user, index) => {
        const row = document.createElement("tr");
        // 현재 유저 ID와 동일한 경우 빨간색 테두리 추가
        if (user.userID === +userID) {
          row.classList.add("highlight");
        }
        if (index === 0) row.classList.add("gold");

        if (index === 1) row.classList.add("silver");

        if (index === 2) row.classList.add("bronze");

        row.innerHTML = `
              <td>${index + 1}</td>
              <td>${user.name}</td>
              <td>${user.score}</td>
              <td>${user.win}</td>
              <td>${user.draw}</td>
              <td>${user.loss}</td>
              <td>${user.winRate}</td>
            `;
        rankingBody.appendChild(row);
      });
    }
  };

  document
    .getElementById("startGameBtn")
    .addEventListener("click", async () => {
      const startGameBtn = document.getElementById("startGameBtn");
      const loading = document.getElementById("loading");
      const result = document.getElementById("result");
      const resultMessage = document.getElementById("resultMessage");
      const rankingTable = document.getElementById("rankingDiv");
      const userID = localStorage.getItem("userID");

      // 버튼 숨기고 로딩 애니메이션 표시
      startGameBtn.classList.add("hidden");
      rankingTable.classList.add("hidden");
      loading.classList.remove("hidden");
      resultMessage.innerText = "";

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8282/api/games/randomplay",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          // 성공 시 게임 결과 표시
          await delay(2000);
          loading.classList.add("hidden");
          rankingTable.classList.remove("hidden");

          if (data.resultteam.winner === +userID) {
            resultMessage.style.color = "blue";
            resultMessage.innerText = `${data.resultteam.loser}번 유저님으로부터 이겼습니다.`;
          } else {
            resultMessage.style.color = "red";
            resultMessage.innerText = `${data.resultteam.winner}번 유저님으로부터 졌습니다.`;
          }
          result.classList.remove("hidden");

          // 랭킹표 추가
          await populateRankingTable();
        } else {
          // 오류 처리
          loading.classList.add("hidden");
          resultMessage.innerText = `오류: ${
            data.message || "게임 진행 중 문제가 발생했습니다."
          }`;
          result.classList.remove("hidden");
        }
      } catch (error) {
        loading.classList.add("hidden");
        resultMessage.innerText = "서버 오류 발생";
        result.classList.remove("hidden");
      } finally {
        // 버튼 다시 표시 (게임을 다시 시도할 수 있게)
        startGameBtn.classList.remove("hidden");
      }
    });
});
