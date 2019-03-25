import React,{Component} from 'react';

class GeneratedPlaylist extends Component{
    constructor(props){
        super(props);
        this.state = {
            playlistName:this.props.name
        }
    }
    render(){
    return(
        <div>
            <input className="playlist-title-input" type="text" value={this.state.playlistName} onChange={(e)=>this.setState({playlistName:e.target.value})}/>
            <button onClick={()=>this.props.handleCreatePlaylist(this.state.playlistName)} className="button-main create">Create Playlist</button>
            <ul className="youtube-playlist">
                {
                    this.props.data.map((video,i)=>{
                        return(
                            <li className="youtube-video" key={i}>
                                <img className="thumbnail" src={video.thumbnails.medium.url} alt={video.title}></img>
                                <div>
                                    <p className="channel">{video.channelTitle}</p>
                                    <h3 className="title">{video.title}</h3>
                                    <p className="description">{video.description}</p>
                                </div>
                            </li>
                        )
                    })
                }

            </ul>
        </div>
    )
    }
}

export default GeneratedPlaylist;