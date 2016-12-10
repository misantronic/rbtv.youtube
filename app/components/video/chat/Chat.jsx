import React from 'react';

module.exports = function Chat(props) {
    return (
        <div className="component-chat">
            <iframe frameBorder={0} src={'https://www.youtube.com/live_chat?v='+ props.id +'&embed_domain='+ location.hostname} width="100%" height="100%"></iframe>
        </div>
    );
};
