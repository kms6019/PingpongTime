function getTimePerGame(matchType) {
    const matchTimes = {
        single: 5,
        "3set": 10,
        "5set": 15
    };
    return matchTimes[matchType] || 5;
}

function calculateLeagueTime(numTeams, matchType, numTables) {
    const totalMatches = (numTeams * (numTeams - 1)) / 2;
    const totalTime = Math.ceil((totalMatches * getTimePerGame(matchType)) / numTables);
    return { totalTime, totalMatches, details: `리그전 경기 수: ${totalMatches}경기` };
}

function calculateTournamentTime(numTeams, matchType, numTables) {
    const baseRounds = [128, 64, 32, 16, 8, 4, 2];
    let totalMatches = 0;
    let roundDetails = "";

    for (let round of baseRounds) {
        if (numTeams >= round) {
            let roundMatches = round / 2;
            let roundTime = numTables >= roundMatches ? 15 : ((round / 2) / numTables) * getTimePerGame(matchType);
            totalMatches += roundMatches;
            roundDetails += `${round}강 - 경기 수: ${roundMatches}, 예상 시간: ${Math.ceil(roundTime)}분\n`;
        }
    }

    const totalTime = Math.ceil(totalMatches * getTimePerGame(matchType) / numTables);
    return { totalTime, totalMatches, roundDetails };
}

function calculateTime() {
    const prelimType = document.getElementById("tournamentTypePrelim").value;
    const finalType = document.getElementById("tournamentTypeFinal").value;

    const prelim = prelimType === "league"
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

    const final = finalType === "league"
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

    const totalTime = prelim.totalTime + final.totalTime;
    const hoursTotal = Math.floor(totalTime / 60);
    const minutesTotal = totalTime % 60;

    document.getElementById("result").innerText =
        `예선 예상 소요 시간: ${Math.floor(prelim.totalTime / 60)}시간 ${prelim.totalTime % 60}분\n` +
        `예선 총 경기 수: ${prelim.totalMatches}경기\n` +
        (prelim.roundDetails || prelim.details) +
        `\n본선 예상 소요 시간: ${Math.floor(final.totalTime / 60)}시간 ${final.totalTime % 60}분\n` +
        `본선 총 경기 수: ${final.totalMatches}경기\n` +
        (final.roundDetails || final.details) +
        `\n총 예상 소요 시간: ${hoursTotal}시간 ${minutesTotal}분`;
}
