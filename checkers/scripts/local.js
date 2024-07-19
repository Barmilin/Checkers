const form = document.getElementById('players-form');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;

    if (!player1 || !player2) {
        alert('Both player names are required.');
        return;
    }

    const url = `local-game.html?player1=${encodeURIComponent(player1)}&player2=${encodeURIComponent(player2)}`;
    window.location.href = url;
});