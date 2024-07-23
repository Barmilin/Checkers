document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('players-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const player1 = document.getElementById('player1').value.trim();
        const player2 = document.getElementById('player2').value.trim();

        
        if (player1 === '' || player2 === '') {
            alert('Please enter both player names.');
            return;
        }
        if (player1 === player2) {
            alert('Player names must be different.');
            return;
        }

        
        localStorage.setItem('player1', player1);
        localStorage.setItem('player2', player2);
        window.location.href = 'local-game.html';
    });
});