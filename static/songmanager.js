// Load the YouTube IFrame Player API code asynchronously.
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);




// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
let player;
function onYouTubeIframeAPIReady(video_id) {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: video_id ?? 'jfKfPfyJRdk', // 'jfKfPfyJRdk' Replace with the first video ID in your playlist
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'disablekb': 1,
            'enablejsapi': 1,
            'fs': 0,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}




// The API will call this function when the video player is ready.
async function onPlayerReady(event) {
    event.target.playVideo();

    // Raise the count since first song is playing
    listenedCount ++;
    // Get next video id and insert it in next button
    let next_video_id = await returnNextSongID();
    initButton(next_video_id);

    setTimeout(updateTitle(), 50000);
}






// The API will call this function when the player's state changes.
async function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        let next_video_id = await returnNextSongID();

        playNextVideo(next_video_id);

    }


    if (event.data === YT.PlayerState.PLAYING) {
        // Check if the player object exists and if a video is loaded
        if (player && player.getVideoData && player.getVideoUrl()) {
            // Get the video data and update the displayed title
            const videoData = player.getVideoData();
            if (videoData && videoData.title) {
                document.querySelector('#curr_playing').innerText = videoData.title;
            } else {
                console.error('Video data or title is undefined:', videoData);
            }
        } else {
            console.error('Player object or video URL is not available');
        }
    }
}





// Load and play the next video in the playlist
async function playNextVideo(new_video_id) {
    player.loadVideoById(new_video_id);

    // Raise the count since song is finished
    listenedCount ++;
    // Get next video id and insert it in next button
    let next_video_id = await returnNextSongID();
    initButton(next_video_id);
    //console.log('clicked ' + video_id);

    setTimeout(updateTitle(), 50000);
}


function updateTitle() {
    document.querySelector('#curr_playing').innerText = player.getVideoData().title;
    //console.log(player.getVideoData().title);
}


// Init the buttons below the Iframe (Play,Pause,Next).
function initButton(next_video_id) {
   // Event listeners for controlling the player
    document.querySelector('#play').addEventListener('click', function() {
        player.playVideo();
    });

    document.querySelector('#pause').addEventListener('click', function() {
        player.pauseVideo();
    });

    document.querySelector('#next').addEventListener('click', function() {
        playNextVideo(next_video_id);
    }); 
}




// Return the next song id in our playlist.
let listenedCount = 0;
async function returnNextSongID() {
    const response = await fetch('/api/fetch_video_id');
    if (!response.ok) {
        throw new Error('Failed to fetch video ID');
    }

    const songValues = await response.json();

    // If list is finished, restart it.
    if (songValues.length >= listenedCount){
        listenedCount = 0;
    }

    return video_id = songValues.json[listenedCount]['video_id']
}