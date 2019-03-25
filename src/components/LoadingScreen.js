import React, {Component} from 'react';

class LoadingScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentVideo : 0,
        }
    }

    componentDidMount(){
        
        let changeVideoInterval = setInterval(()=>{
            if(this.state.currentVideo+1 < this.props.videoData.length){
                this.setState({currentVideo: this.state.currentVideo+ 1});
            }
            else{
                cancelInterval();
            }
        },3000);

        const cancelInterval = ()=> {
            clearInterval(changeVideoInterval);
        }
    }

    render(){
        let video = this.props.videoData[this.state.currentVideo];
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <li className="youtube-video">
                    <img className="thumbnail" src={video.thumbnails.default.url} alt={video.title}></img>
                    <div>
                    <h2 className="loader-progress">Adding: {video.title}...</h2>
                    </div>
                </li>
            </div>
            
            //Progress indicator - rely on state... change every 3000 ms
            //THUMBNAIL
            //Adding : SONG NAME by ARTIST...
        )
    }
}

export default LoadingScreen;