import React from 'react';

const PlaylistSelection = (props) => {
    let spotifyData = props.data;
    return(
        <div>
          <ul className="playlists">
            {
              spotifyData.playlists.map(playlist=>{
                return(
                  <li className="playlist" key={playlist.image}>
                    <div className="playlist-image-container">
                      <img src={playlist.image} alt={playlist.name + "playlist"}></img>
                    </div>
                    <div className="playlist-info">
                      <div className="playlist-title">
                        <p>{playlist.numberOfTracks} Songs</p>
                        <h3>{playlist.name}</h3>
                      </div>
                      <form onSubmit={(e)=>props.getYoutubeVideos(e,playlist,playlist.name)}>
                        <input type="submit" className="button-main" value="Select"></input>
                      </form>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
    )
}

export default PlaylistSelection;