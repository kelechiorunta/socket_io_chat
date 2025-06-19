import React, { useState, useEffect, useRef } from 'react';
import Avatar from './Avatar';

const ChatBody = ({ messages = [], pic, chat, typingUserId }) => {
    const chatEndRef = useRef(null);
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };
    
      useEffect(scrollToBottom, [messages]);
    return (
        <div
            className="flex-grow-1 px-4 py-3"
            style={{
                overflowY: 'scroll',
                backgroundImage: "url('./background.jpg')",
                backgroundSize: 'cover',
                maxheight: '100%',
                backgroundColor:' #0d1717'
            }}
        >
            {messages.map((msg, index) => (
               
                <div
                    key={index}
                    className={`d-flex align-items-center gap-2 mb-2 ${ (pic && (msg?.sender?._id === pic?._id)) || msg.from === 'client' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                     {console.log(msg?.receiver?.picture)}
                    {msg.from === 'client'?
                        <Avatar src={msg?.sender?.picture || (chat && pic.picture)} size={32} /> || <Avatar src={'./Darshan.png'} size={32} />
                        :
                        <Avatar src={msg?.sender?.picture || (chat && chat.picture)} size={32} />
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
            <div ref={chatEndRef} />
        </div>
    );
};

export default ChatBody;
