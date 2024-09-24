const token = localStorage.getItem("token");
const buyPlayerPack = document.getElementById("buyPlayerPack");
let chargeWindow = null;

window.addEventListener("section-shop", async function () {
  const cashBalance = document.getElementById("cashBalance");
  const cashFetch = await fetch(`http://localhost:8282/api/user/cash`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  });
  if (!cashFetch.ok) throw new Error("캐시조회 오류 발생");

  const cashData = await cashFetch.json();
  const cash = cashData.data.balance;
  console.log(cash);
  cashBalance.textContent = `캐쉬 잔액: ${cash}`;
});

// 캐시 충전 함수
function openChargeWindow() {
  // 창이 이미 열려 있는지 확인
  if (chargeWindow && !chargeWindow.closed) {
    chargeWindow.focus(); // 창을 활성화
    return;
  }

  chargeWindow = window.open("", "충전", "width=400,height=300");
  if (!chargeWindow) {
    alert("충전 창을 열 수 없습니다. 팝업 차단을 해제하세요.");
    return;
  }

  chargeWindow.document.write("<h1>캐시 충전 창</h1>");
  chargeWindow.document.write("<p>여기에 충전 정보를 입력하세요.</p>");
  chargeWindow.document.write(`
    <select id="amount">
        <option value="1000">1,000원</option>
        <option value="5000">5,000원</option>
        <option value="10000">10,000원</option>
        <option value="50000">50,000원</option>
    </select>
`);
  chargeWindow.document.write('<button id="confirmCharge">충전하기</button>');

  // 충전하기 버튼 클릭 시 창을 닫고 성공 메시지
  chargeWindow.document.getElementById("confirmCharge").onclick =
    async function () {
      const amount = chargeWindow.document.getElementById("amount").value;

      try {
        const response = await fetch(
          `http://localhost:8282/api/user/cash/${amount}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (!response) throw new Error("캐시 충전 오류");
        alert(`캐시 ${amount}원이 충전되었습니다!`);
        chargeWindow.close(); // 창 닫기
        setTimeout(() => {
          location.reload();
        }, 1000);
      } catch (error) {
        console.error(error);
        throw new Error("네트워크 오류 발생");
      }
    };
}

async function openPlayerCard() {
  const playerCardModal = document.getElementById("playerCardModal");
  const playerCardName = document.getElementById("playerCardName");
  const closeModal = document.querySelector(".close");

  const response = await fetch(`http://localhost:8282/api/gacha`, {
    method: "POST",
    headers: {
      Authorization: `${token}`,
    },
  });
  if (!response) throw new Error("카드뽑기 오류");
  const playerCard = await response.json();
  console.log(playerCard);
  playerCardName.innerText = `${playerCard.data.playerName}`;
  playerCardModal.style.display = "block"; // 모달 표시

  // 닫기 버튼 클릭 시 모달 닫기
  closeModal.addEventListener("click", () => {
    playerCardModal.style.display = "none";
    location.reload();
  });

  // 모달 바깥을 클릭 시 모달 닫기
  window.addEventListener("click", (event) => {
    if (event.target === playerCardModal) {
      playerCardModal.style.display = "none";
      location.reload();
    }
  });
}

// 버튼 클릭
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("chargeButton").onclick = openChargeWindow;
  document.getElementById("buyPlayerPack").onclick = openPlayerCard;
});
