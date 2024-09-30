import { secret } from "./secret.js";

async function getAccessToken() {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (btoa(secret.clientID + ':' + secret.clientSecret)),
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching token: ${response.statusText}`);
        }


        return await response.json();

    } catch (error) {
        console.log('Failedto get access token:', error);
    }

}


async function getPlaylist(access_token) {
    let playlistId = '5KFFA9C8g5mVQtNPOZ6tNz?si=6fc426253c024436';
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });

    return await response.json();
} 

function displayPlaylist() {
    getAccessToken().then(response => {
        getPlaylist(response.access_token).then(playlistObj => {
            const playlistTag = document.getElementById('spotify-playlist');
            playlistTag.setAttribute('href', playlistObj.external_urls['spotify'])
            
            const playListImg = document.getElementById('playlist-img');
            playListImg.setAttribute('src', playlistObj.images[0].url)

            const playListName = document.getElementById('playlist-name');
            playListName.textContent = `${playlistObj.name}`
        })
    })
}

displayPlaylist();
