import React from 'react';
import Avatar from './Avatar';

const ChatBody = ({ messages = [], pic, chat }) => {
    return (
        <div
            className="flex-grow-1 px-4 py-3"
            style={{
                overflowY: 'scroll',
                backgroundImage: "url('/whatsapp-bg.png')",
                backgroundSize: 'cover',
                maxheight: '100%',
            }}
        >
            {messages.map((msg, index) => (
               
                <div
                    key={index}
                    className={`d-flex align-items-center gap-2 mb-2 ${ (pic && (msg?.sender?._id === pic?._id)) || msg.from === 'client' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                     {console.log(msg)}
                    {msg.from === 'client'?
                        <Avatar src={pic && pic.picture} size={32} />
                        :
                        <Avatar src={chat && chat.picture} size={32} />
                    }
                    <div
                        className="px-3 py-2 rounded-pill"
                        style={{
                            backgroundColor: msg.from === 'client'? '#005c4b' : '#3a3b3c',
                            color: '#fff',
                            maxWidth: '60%',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center'

                        }}
                    >
                        
                        {msg.text || msg.content}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatBody;
