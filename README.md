# SongQuiz

### To start go to https://developer.spotify.com/ and sign in to your spotify account
### Next go to the dashboard and create an app (name and description doesn't matter)
### Finally copy the Client ID and Client Secret to access the game

## Features
- Uses the Spotify Web Api to access their library in order to search for the correct song title (though it occasionally doesn't work)
- Uses the Youtube Data V3 Api to make the topHits json file that consists of 200 songs
- Uses Html, CSS, BootStrap, and Vanilla Javascript

## FAQ
Q: Why did you not make the youtube videos autoplay by itself rather than us having to click to start the video? a <br />
A: Youtube TOS says you can't autoplay with sound on and only with sound off when on websites.
- Why did you use the Spotify Web Api?
This is because Youtube Music Videos don't follow the same format (i.e Artist Name - Title Of Song (Official Music Video)) in order to access more accurate titles and artist.
- Why didn't you just use the Spotify Web Api to play songs?
 Not all songs in the Spotify Web Api have a preview url and also to play songs on the web you need a premium account 
- Why do I need to login with my Spotify Criendentals and do all the stuff in the beginning?
I would make it so I would use my own and so you don't need the client-id/secret stuff but I can't hide it from users which could be dangerous.
- I can adjust what part of the video in the beginning. Is that a feature?
I hope you don't.
- I found a bug/It doesn't work?
Try refreshing the page and if the bug still occurs multiple times then uhhh Idk ig I'll try to work on it.
