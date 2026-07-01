function openCardDetails(gameId) {
    const game = GAMES_DATA.find(g => g.id === gameId);
    if(!game) return;
    document.getElementById("popupTitle").innerText = game.title;
    document.getElementById("popupBody").innerHTML = `
        <p style="margin-bottom:8px;"><strong>Genre:</strong> ${game.category}</p>
        <p style="margin-bottom:8px;"><strong>Total Downloads:</strong> ${game.downloads}</p>
        <p><strong>Rating:</strong> ⭐ ${game.rating}</p>
    `;
    document.getElementById("globalPopup").style.display = "flex";
}