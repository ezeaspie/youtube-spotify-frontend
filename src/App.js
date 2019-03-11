import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import queryString from 'query-string';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      spotifyData:undefined,
    }
  }

  createSpotifyData = (userData,playlistData) => {
    let playlists = playlistData.map((playlist)=>{
      const image = playlist.images.length < 2?playlist.images[0].url:playlist.images[1].url;
      const name = playlist.name;
      const numberOfTracks = playlist.trackDatas.length;
      const tracks = playlist.trackDatas.map((trackObject)=>{
        const track = trackObject.track
        return {
          name:track.name,
          artists:track.artists.map(artist => artist.name),
          album:track.album.name,
          duration:track.duration_ms,
        }
      })

    return {image,name,numberOfTracks,tracks}
    })
    let completeObject = {
      userName: userData.display_name,
      userImage:userData.images[0].url,
      playlists: playlists,
    }
    return completeObject;
  }
  componentDidMount(){
    const parsed = queryString.parse(window.location.search);
    const accessToken = parsed.access_token;
    console.log(accessToken);

    let userData = undefined;
    
    fetch('https://api.spotify.com/v1/me',{
       headers:{'Authorization': 'Bearer ' + accessToken}
    })
    .then((response)=>response.json())
    .then((json)=>userData=json);

    //Get Playlists Object from the current user
    fetch('https://api.spotify.com/v1/me/playlists',{
      headers:{'Authorization': 'Bearer ' + accessToken}
    })
    .then((response)=>response.json())
    .then(
      //Call fetch on playlist track href to get the track listing of the playlists.
      (playlistDataObject)=>{
        const playlistData = playlistDataObject.items;
        //Get URL of each Playlist
        const trackDataPromises = playlistData.map((playList)=>{
          const trackListingUrl = playList.tracks.href;
          console.log(trackListingUrl);
          //call fetch and store returned promise
          const responsePromise = fetch(trackListingUrl,{headers:{'Authorization': 'Bearer ' + accessToken}})
          
          const trackDataPromise = responsePromise.then(response => response.json())

          return trackDataPromise
        })
        const allTrackDataPromises = Promise.all(trackDataPromises);
        let playlistsPromise = allTrackDataPromises.then(trackDatas => {
          trackDatas.forEach((trackData,i)=>{
            playlistData[i].trackDatas = trackData.items;
          })
          return playlistData;
        })
        return playlistsPromise;
      }
    )
    .then((response)=>{
      console.log(response);
      const spotifyData = this.createSpotifyData(userData,response);
      this.setState({spotifyData});
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
