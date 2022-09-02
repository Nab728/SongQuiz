let songs;
var prevSongs = [];
let p1Score = 0;
let p2Score = 0;
let songIndex = 0;
let xhr;
var title;
var artist;
let playerOneTurn = true;
//load youtube api
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let start;
//youtbe player variables
var player;
var isWorking = false;
var done = false;

//url change to your domain of the website
var redirect_uri = "https://nab728.github.io/SongQuiz/"; //switch to the html page you are 
var client_id;
var client_secret;

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
var access_token = null;
var refresh_token = null;

function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    if ( window.location.search.length > 0 )
    {
        handleRedirect();
    }
    else
    {
        access_token = localStorage.getItem("access_token");
        if ( access_token == null ){
            // we don't have an access token so present token section
            document.getElementById("startPage").style.display = 'flex';  
        }
        else {
            // we have an access token so present device section
            document.getElementById("gamePage").style.display = 'block';
            fetch("./topHits.json")           
            .then((result) => {
                
                return result.json()
            }).then((data) => {
                songs = data.items 
                startSongPlayer() 
            });
        }
       
    }
}
function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect_uri); // remove param from url
}
function fetchAccessToken(code){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}
function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}
function handleAuthorizationResponse(){
    
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log("data is" + data);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}
function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

function requestAuthorization()
{
    let url = AUTHORIZE;
    client_id = document.getElementById("clientId").value;
    client_secret = document.getElementById("clientSecret").value;
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret); // In a real app you should not expose your client_secret to the user
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    window.location.href = url; // Show Spotify's authorization screen
}
function checkTurn()
{
    if(playerOneTurn)
    {
        return 1;
    }
    return 2;
}
document.addEventListener('DOMContentLoaded', function(){
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
    //turns it to what the actual search query is (works for all languages to varying degrees tho)
    str = encodeURIComponent(str);
    xhr = new XMLHttpRequest();
    xhr.open("GET", 'https://api.spotify.com/v1/search?q=' + str + '&type=track', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("access_token")); 
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
    console.log(videoPlayer.src);
    videoPlayer.src = videoPlayer.src + "&start=" + start + "&end=" + (start + 10);
    console.log(videoPlayer.src);
}
function chooseSong()
{
    console.log(songs);
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
        //startSongPlayer();
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
      // document.querySelector('.wrapper').style.display = "none";
       
       setTimeout(stopVideo, 10000);
    
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
    document.querySelector(".score").innerHTML = "Player 1: " + p1Score + "&nbsp&nbsp" + "Player 2: " + p2Score;
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

