// 경기당 평균 소요 시간 설정
const matchDurations = {
    single: 5,
    "3set": 10,
    "5set": 15
};

// 리그전 경기 시간 계산
function calculateLeagueTime(numTeams, matchType, numTables) {
    if (numTeams < 2 || numTables < 1) return { totalTime: 0, totalMatches: 0 };

    let totalMatches = (numTeams * (numTeams - 1)) / 2;
    let timePerMatch = matchDurations[matchType] || 5; // 기본값 5분
    let totalTime = Math.ceil((totalMatches * timePerMatch) / numTables);

    return {
        totalTime,
        totalMatches,
        details: `리그전 경기 수: ${totalMatches}경기`
    };
}



// 토너먼트 경기 시간 계산 (부전승 없이, 회전수 반영)
function calculateTournamentTime(numTeams, matchType, numTables) {
    if (numTeams < 2 || numTables < 1) return { totalTime: 0, totalMatches: 0 };

    let totalMatches = numTeams - 1; // 총 경기 수 = 팀 수 - 1
    let timePerMatch = matchDurations[matchType] || 5; // 경기 유형별 소요 시간
    let totalTime = 0;
    let matchesPerRound = numTeams;
    let roundDetails = "";
    let roundNumber = 1;

    while (matchesPerRound > 1) {
        let actualMatches = Math.floor(matchesPerRound / 2); // 현재 라운드에서 진행할 경기 수
        let roundsNeeded = Math.ceil(actualMatches / numTables); // 해당 라운드 진행 바퀴 수

        let roundTime = roundsNeeded * timePerMatch; // 해당 라운드 소요 시간
        totalTime += roundTime;

        roundDetails += `라운드 ${roundNumber}: 경기 ${actualMatches}개, 바퀴 ${roundsNeeded}회, 예상 시간 ${roundTime}분\n`;

        matchesPerRound = actualMatches; // 다음 라운드 팀 수 업데이트
        roundNumber++;
    }

    return {
        totalTime,
        totalMatches,
        roundDetails
    };
}



// 전체 시간 계산
function calculateTime() {
    let prelimType = document.getElementById("tournamentTypePrelim").value;
    let finalType = document.getElementById("tournamentTypeFinal").value;

    let prelim = prelimType === "league"
        ? calculateLeagueTime(
            parseInt(document.getElementById("numTeamsPrelim").value),
            document.getElementById("matchTypePrelim").value,
            parseInt(document.getElementById("numTablesPrelim").value)
        )
        : calculateTournamentTime(
            parseInt(document.getElementById("numTeamsPrelim").value),
            document.getElementById("matchTypePrelim").value,
            parseInt(document.getElementById("numTablesPrelim").value)
        );

    let final = finalType === "league"
        ? calculateLeagueTime(
            parseInt(document.getElementById("numTeamsFinal").value),
            document.getElementById("matchTypeFinal").value,
            parseInt(document.getElementById("numTablesFinal").value)
        )
        : calculateTournamentTime(
            parseInt(document.getElementById("numTeamsFinal").value),
            document.getElementById("matchTypeFinal").value,
            parseInt(document.getElementById("numTablesFinal").value)
        );

    let totalTime = prelim.totalTime + final.totalTime;
    let hoursTotal = Math.floor(totalTime / 60);
    let minutesTotal = totalTime % 60;

    document.getElementById("result").innerText =
        `예선 예상 소요 시간: ${Math.floor(prelim.totalTime / 60)}시간 ${prelim.totalTime % 60}분\n` +
        `예선 총 경기 수: ${prelim.totalMatches}경기\n` +
        (prelim.roundDetails || prelim.details) +
        `\n\n본선 예상 소요 시간: ${Math.floor(final.totalTime / 60)}시간 ${final.totalTime % 60}분\n` +
        `본선 총 경기 수: ${final.totalMatches}경기\n` +
        (final.roundDetails || final.details) +
        `\n총 예상 소요 시간: ${hoursTotal}시간 ${minutesTotal}분`;
}
