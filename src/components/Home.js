import React from 'react';

const Home = (props) => {
    let signInURI = props.url;
    return(
        <div>
          <div className="main-landing">
            <p className="bigger">Export your favorite Spotify Playlists to Youtube quickly and easily.</p>
            <p className="big">Sign in to Spotify to get started.</p>
            <a href={signInURI} className="button-main sign-in-main"><img src="./spotify.png" alt="spotify-logo"></img>Sign in</a>
          </div>
        </div>
    )
}

export default Home;


