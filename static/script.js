let songs;
var prevSongs = [];
let p1Score = 0;
let p2Score = 0;
let songIndex = 0;
let access_token = "BQAG_eawW6bfkgf4yC0eUWYWRnxoTjZongemPMTdBak1NeTZcRQyoTKEl4TNkDNY-koJj8X59GJeLDikZnubbNt9t2aQguGcV11NsxTQDq-nQYbe83C2NQ30ESRjX3X29jUFoHEDBUEacktlVXX0bktF-rhghql6wiEk7BP14ZP9SGDugUIVU-UF9Ktx8vEWdsKVJp0DVdNxSOvzVwwb5n-aEoOvq-Cp";
let xhr;
var title;
var artist;
let playerOneTurn = true;
//load youtube api
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//youtbe player variables
var player;
var isWorking = false;
var done = false;

function checkTurn()
{
    if(playerOneTurn)
    {
        return 1;
    }
    return 2;
}
document.addEventListener('DOMContentLoaded', function(){
        fetch("./topHits.json")           
        .then((result) => {
            return result.json()
        }).then((data) => {
            songs = data.items 
            //console.log(data); 
            
    });
    document.querySelector("#form").addEventListener('submit', function(e) {
        let answer = document.querySelector("#songTitle").value;
        let answer2 = document.querySelector("#songArtist").value;
        titleAns = formatString(title);
        artistAns = formatString(artist);
        addScore(answer, titleAns, answer2, artistAns);
        document.querySelector("#answer").innerHTML = "Answer: " + titleAns.trim();
        document.querySelector("#answer2").innerHTML = "Artist: " + artist.trim();
        document.getElementById("submit").style.display = "none";
        nextSong();
        e.preventDefault();
    });
    
    function addScore(title, titleAns, artistAns, artist, playerOneTurn)
    {
       
        if (title.toLowerCase().trim() == titleAns.toLowerCase().trim())
        {
            if(playerOneTurn)
            {
                p1Score++;
            }
            else
            {
                p2Score++;
            }
            if(artistAns.toLowerCase().trim() == artist.toLowerCase().trim())
            {
                if(playerOneTurn)
                {
                    p1Score++;
                }
                else
                {
                    p2Score++;
                }
            }
            let textBox = document.querySelector(".score");
            textBox.innerHTML = "Score : " + score;
            document.getElementById("songTitle").value = ""; 
            document.querySelector("#songArtist").value = "";
        }
    }
});


function formatString(s)
{
    if(s != undefined)
    {
        let parenthesis = s.indexOf("(");
        if (parenthesis != -1)
        {
            s = s.substring(0, parenthesis);
        }
        let dash = s.indexOf("-");
        if (dash != -1)
        {
            s = s.substring(0, dash);
        }
    }
    
    return s;
}
//access_token can expire so be careful
// ok so XMLHTTPRequest only works if you have an onload otherwise you can only call it once
function callApi(str, callback)
{
    str = str.replaceAll(" ", "%20");
    xhr = new XMLHttpRequest();
    xhr.open("GET", 'https://api.spotify.com/v1/search?q=' + str + '&type=track', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xhr.onload = callback;
    xhr.send();
   
}
function checkTitle(answer)
{
    callApi(answer, processRequest);
}

function processRequest() 
{  
    if (xhr.readyState == 4 && xhr.status == 200) 
    {
        var response = JSON.parse(xhr.responseText);
        var result = response["tracks"]["items"][0];
        
        title  = result["name"];
        artist = result["artists"][0]["name"];
    }
    else
    {
        alert("Error replace you access_token");
    }
}
function replay()
{ 
    var videoPlayer = document.querySelector('#video-container');
    videoPlayer.src = videoPlayer.src;
}
function chooseSong()
{
    //console.log(songs.length);
    let index = Math.floor(Math.random() * songs.length); 
    while (prevSongs.includes(index))
    {
        index = Math.floor(Math.random() * songs.length);
        //console.log("While loop song chosen is " + index);
    }
    prevSongs.push(index);
    if (prevSongs.length >= 10)
    {
        // removes first element from the array
        prevSongs.shift();
    }
    return index;
}
let firstTime = true;
function onYouTubeIframeAPIReady() 
{
    isWorking = true;
    //console.log("Youtube iframe works");
    if (firstTime && songs != null)
    { 
        startSongPlayer();
        firstTime = false;
        
    }
    
}
function createPlayer(id)
{
    if (isWorking)
    {
        if (player != undefined)
        {
            player.destroy();
        }
        player = new YT.Player("video-container", {
        height: 300,
        width: 300,
        videoId: id,
        playerVars: {
            'playsinline': 1
            },
            events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
            }
        });
        
    }
    
}
let start;
function startSongPlayer()
{ 
    songIndex = chooseSong();
    checkTitle(songs[songIndex].snippet.title);
    //start is undefined in the beginning for some reason but it still works so ig that's ok
    //0 to length of the song - 20 seconds (so we don't play the end of the song)
    start = Math.floor(Math.random() * (150 - 20 + 1)) + 20;
    createPlayer(songs[songIndex].snippet.resourceId.videoId, start);
}
//set start of clip and play the video
function onPlayerReady(event) 
{  
    player.seekTo(start);
    event.target.playVideo();
}
//if playing make the video disappear
function onPlayerStateChange(event) {
    if(event.data == YT.PlayerState.PLAYING)
    {
       document.querySelector('.wrapper').style.pointerEvents = "none";
       document.querySelector('.wrapper').style.display = "none";
        if (!done)
        {
            setTimeout(stopVideo, 10000);
            done = true;
        }
    }
}
function stopVideo() {
    player.stopVideo();
}
function nextSong()
{
    //start next song
    startSongPlayer();

    //show player turn
    playerOneTurn = !playerOneTurn;
    let turn = checkTurn();
    document.querySelector(".turn").innerHTML = "Player " + turn + " Turn"; 

    //basically do what submit would've done and show the answer
    titleAns = formatString(title);
    document.querySelector("#answer").innerHTML = "Answer: " + titleAns.trim();
    document.querySelector("#answer2").innerHTML = "Artist: " + artist.trim();

    //show submit and video back
    setTimeout(function()
    {
        document.querySelector(".wrapper").style.display = "block"; 
        document.querySelector(".wrapper").style.pointerEvents = "all";
    }, 500);
    setTimeout(function(){
        document.getElementById("submit").style.display = "block";
        
    }, 2000);
    //set the input field to null values
    document.getElementById("songTitle").value = ""; 
    document.getElementById("songArtist").value = "";

    //remove the answer key after 2 seconds
    setTimeout(function(){
        document.querySelector("#answer").innerHTML = "";
        document.querySelector("#answer2").innerHTML = "";
    }, 2000);
    // console.log(songs[songIndex].snippet.title);
}

