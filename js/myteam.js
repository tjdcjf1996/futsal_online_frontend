window.addEventListener("section-myteam", async function () {
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

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

  if (Object.keys(myteamList).length === 0) {
  }
});
