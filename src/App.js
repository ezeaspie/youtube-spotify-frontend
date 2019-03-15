import React, { Component } from 'react';
import './App.css';

import queryString from 'query-string';
import PlaylistSelection from './components/PlaylistSelection';
import Home from './components/Home';
import GeneratedPlaylist from './components/GeneratedPlaylist';
import RedirectPage from './components/RedirectPage';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      spotifyData:undefined,
      developmentMode:false,
      currentView:null,
      playListData:undefined,
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
    this.showHomeScreen();
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
      this.setState({spotifyData},()=>{
        this.showSpotifyPlaylists()
      });
    });
  }

  showSpotifyPlaylists = () => {
    this.setState({currentView:
    <PlaylistSelection 
    data={this.state.spotifyData}
    getYoutubeVideos={this.getYoutubeVideos}
    />});
  }

  showHomeScreen = () => {
    this.setState({currentView:<Home url={"http://localhost:8888/login"}/>});
  }

  showGeneratedPlayList = (playlistName) => {
    this.setState({currentView:<GeneratedPlaylist 
      name={playlistName} 
      data={this.state.playListData}
      handleCreatePlaylist={this.handleCreatePlaylist}/>});
  }

  getYoutubeVideos = (e,playlistData,playlistName="My Awesome Playlist") => {
    e.preventDefault();
    let dummyData = [
      {
        videoId:"iU5qp-cAtOU",
        channelId: "UCOlwD0QEW4xzt99rbri-q2w",
        channelTitle: "Sleepless Group",
        description: "JULY TALK – the debut album Available worldwide from September 19th (ex North and South America) France and UK available September 22nd Buy now!",
        liveBroadcastContent: "none",
        publishedAt: "2013-04-02T14:22:30.000Z",
        thumbnails: {
          default: {
            height: 90,
            url: "https://i.ytimg.com/vi/iU5qp-cAtOU/default.jpg",
            width: 120,
          }
        },
        title: "JULY TALK - GUNS + AMMUNITION",
      },
      {
        videoId:"jFwB5ayV0vQ",
        channelId: "UCOlwD0QEW4xzt99rbri-q2w",
        channelTitle: "Sleepless Group",
        description: "JULY TALK – the debut album Available worldwide from September 19th (ex North and South America) France and UK available September 22nd Buy now!",
        liveBroadcastContent: "none",
        publishedAt: "2013-04-02T14:22:30.000Z",
        thumbnails: {
          default: {
            height: 90,
            url: "https://i.ytimg.com/vi/jFwB5ayV0vQ/default.jpg",
            width: 120,
          }
        },
        title: "JULY TALK - PAPER GIRL",
      }
    ]
    if(this.state.developmentMode){
      //FOR DEVELOPMENT PURPOSES ONLY - SEE ELSE STATEMENT FOR ACTUAL FLOW
      this.setState({playListData:dummyData},()=>{
        this.showGeneratedPlayList(playlistName);
      });
    }
    else{
      //On Playlist selection, send AJAX request that returns an array of YT Video Data Objects
    const post = async (url,data) => {
      const params = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      const response = await fetch(url, params);
    
      if (response.status < 200 && response.status >= 300) {
        const res = await response.json();
    
        throw new Error(res);
      }
      return response.json();
    };

    const backendURI = this.getBackendURI();

    post(`${backendURI}/ytcallback`,playlistData)
      .then((res) => {console.log(res);
        //Set the state to show the generated Playlist and store RESPONSE data.
        this.setState({playListData:res},()=>{
          this.showGeneratedPlayList(playlistName);
        })
      })
      .catch(error => {
        console.log(error.message);
    });
    }
  }

  handleCreatePlaylist = (playlistName="My Awesome Playlist") => {
    //Create a POST-fetch function to call /generatePlaylist
    const post = async (url,data) => {
      const params = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      const response = await fetch(url, params);
      if (response.status < 200 && response.status >= 300) {
        const res = await response.json();
        throw new Error(res);
      }
      return response.json();
    };

    //Data to be sent to server
    const videoIds = this.state.playListData.map(videoData=>{
      return videoData.videoId
    })

    let playlistInfo = {playlistName,videoIds}
    const backendURI = this.getBackendURI();

    post(`${backendURI}/generatePlaylist`,playlistInfo)
      .then(res => {
        console.log(res);
        this.showRedirectPage(res.playlistURL);
      })
      .catch(error => {
        console.log(error.message);
    });
  }

  showRedirectPage = (url) => {
    this.setState({currentView: <RedirectPage url={url}/>});
  }

  getBackendURI = () => {
    if(this.state.developmentMode){
      return 'http://localhost:8888';
    }
    return 'https://youtube-spotify-backend.herokuapp.com';
  }

  render() {
    const backendURI = this.getBackendURI();
    const signInURI=`${backendURI}/login`
    return (
      <div className="App">
      <header>
            <h1>Spotify-Youtube Playlists</h1>
              {
                this.state.spotifyData === undefined?
                <div className="user-info">
                  <a href={signInURI} className="button-main">Sign in</a>
                </div>
                :
                <div className="user-info">
                        <img src={this.state.spotifyData.userImage} alt="spotify-profile"></img>
                        <h2>{this.state.spotifyData.userName}</h2>
                </div>
              }
          </header>
      {
        this.state.currentView
      }
      </div>
    );
  }
}

export default App;
