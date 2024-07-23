document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('player-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        
        const playerName = document.getElementById('player').value;

        
        fetch('/start-single-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ player: playerName }),
        })
        .then(response => response.json())
        .then(data => {
            
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                
                console.error('Redirect URL not found in response.');
            }
        })
        .catch(error => {
            
            console.error('Error:', error);
        });
    });
});
