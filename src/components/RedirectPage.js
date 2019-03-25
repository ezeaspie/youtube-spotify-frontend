import React from 'react';

const RedirectPage = (props) => {

    return(
        <div className="redirect-page">
            <h2>Your playlist was created!</h2>
            <h3>Thank you for using this tool!</h3>
            <a className="button-main" rel="noopener noreferrer" target="_blank" href={props.url}>Click here to go to your playlist!</a>
        </div>
    )
}

export default RedirectPage;