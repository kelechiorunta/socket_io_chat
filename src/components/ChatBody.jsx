// import React, { useState, useEffect, useRef } from 'react';
// import Avatar from './Avatar';

// const ChatBody = ({ messages = [], pic, chat, typingUserId }) => {
//     const chatEndRef = useRef(null);
//     const scrollToBottom = () => {
//         chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//       };
    
//       useEffect(scrollToBottom, [messages]);
//     return (
//         <div
//             className="flex-grow-1 px-4 py-3"
//             style={{
//                 overflowY: 'scroll',
//                 backgroundImage: "url('./background.jpg')",
//                 backgroundSize: 'cover',
//                 maxheight: '100%',
//                 backgroundColor:' #0d1717'
//             }}
//         >
//             {messages.map((msg, index) => (
               
//                 <div
//                     key={index}
//                     className={`d-flex align-items-center gap-2 mb-2 ${ (pic && (msg?.sender?._id === pic?._id)) || msg.from === 'client' ? 'justify-content-end' : 'justify-content-start'}`}
//                 >
//                      {console.log(msg?.receiver?.picture)}
//                     {msg.from === 'client'?
//                         <Avatar src={msg?.sender?.picture || (chat && pic.picture)} size={32} /> || <Avatar src={'./Darshan.png'} size={32} />
//                         :
//                         <Avatar src={msg?.sender?.picture || (chat && chat.picture)} size={32} />
//                     }
//                     <div
//                         className="px-3 py-2 rounded-pill"
//                         style={{
//                             backgroundColor: msg.from === 'client'? '#005c4b' : '#3a3b3c',
//                             color: '#fff',
//                             maxWidth: '60%',
//                             fontSize: '0.9rem',
//                             display: 'flex',
//                             alignItems: 'center'

//                         }}
//                     >
                        
//                         {msg.text || msg.content}
//                     </div>
//                 </div>
//             ))}
//             <div ref={chatEndRef} />
//         </div>
//     );
// };

// export default ChatBody;

import React, { useEffect, useRef } from 'react';
import Avatar from './Avatar';
import { format, isToday, isYesterday } from 'date-fns';
import { useTheme } from './ThemeContext';

const formatDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
};

const ChatBody = ({ messages = [], pic, chat, typingUserId }) => {
    const chatEndRef = useRef(null);
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === 'dark';
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    let lastMessageDate = null;

    return (
        <div
            className="flex-grow-1 px-4 py-3"
            style={{
                overflowY: 'scroll',
                backgroundImage: isDark? "url('./background.jpg')" : "url('./backgroundII.png')",
                backgroundSize: 'cover',
                backgroundColor: isDark? '#0d1717' : 'rgba(0,0,0,0.2)',
                color: isDark? 'white' : 'rgba(0,0,0,0.5)',
                maxHeight: '100%',
            }}
        >
            {messages.map((msg, index) => {
                const msgDate = new Date(msg.createdAt);
                const dateLabel = formatDateLabel(msgDate);

                const showDateLabel =
                    !lastMessageDate || formatDateLabel(lastMessageDate) !== dateLabel;
                lastMessageDate = msgDate;

                const isClient = (msg?.sender?._id === pic?._id) || msg.from === 'client';

                return (
                    <React.Fragment key={index}>
                        {showDateLabel && (
                            <div className="text-center my-3" style={{ fontSize: '0.8rem' }}>
                                <div style={{ display: 'flex', justifyContent:'space-evenly', width: '100%', alignItems: 'center' }}>
                                    <hr style={{ width: '100%' }} />
                                    <p style={{ width: '100%', marginTop: 15 }}>{dateLabel} </p>
                                    <hr style={{ width: '100%' }} />
                                </div>
                            </div>
                        )}
                        <div
                            className={`d-flex align-items-center gap-2 mb-2 ${
                                isClient ? 'justify-content-end' : 'justify-content-start'
                            }`}
                        >
                            <Avatar
                                src={
                                    msg?.sender?.picture ||
                                    (chat && (isClient ? pic.picture : chat.picture)) ||
                                    './Darshan.png'
                                }
                                size={32}
                            />
                            <div
                                className="px-3 py-2 rounded-pill"
                                style={{
                                    backgroundColor: isClient ? '#005c4b' : '#3a3b3c',
                                    color: '#fff',
                                    maxWidth: '60%',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {msg.text || msg.content}
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
            <div ref={chatEndRef} />
        </div>
    );
};

export default ChatBody;
