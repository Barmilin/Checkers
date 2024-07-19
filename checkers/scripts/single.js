const form = document.getElementById('player-form');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const player1 = document.getElementById('player').value;
    

    if (!player1) {
        alert('player names are required.');
        return;
    }

    const url = `game.html?player1=${encodeURIComponent(player1)}`;
    window.location.href = url;
});