// import React, { useEffect, useRef } from 'react';
// import Avatar from './Avatar';
// import { format, isToday, isYesterday } from 'date-fns';
// import { useTheme } from './ThemeContext';
// import TypingIndicator from './Indicators/TypingIndicator';

// const formatDateLabel = (date) => {
//   if (isToday(date)) return 'Today';
//   if (isYesterday(date)) return 'Yesterday';
//   return format(date, 'MMMM d, yyyy');
// };

// const ChatBody = ({ messages = [], pic, chat, typingUsers }) => {
//   const chatEndRef = useRef(null);
//   const { theme } = useTheme();

//   const isDark = theme === 'dark';
//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(scrollToBottom, [messages]);

//   let lastMessageDate = null;

//   return (
//     <div
//       className="flex-grow-1 px-4 py-3"
//       style={{
//         overflowY: 'scroll',
//         backgroundImage: isDark ? "url('./background.jpg')" : "url('./backgroundII.png')",
//         backgroundSize: 'cover',
//         backgroundColor: isDark ? '#0d1717' : 'rgba(0,0,0,0.2)',
//         color: isDark ? 'white' : 'rgba(0,0,0,0.5)',
//         maxHeight: '100%'
//       }}
//     >
//       {messages.map((msg, index) => {
//         const msgDate = new Date(msg.createdAt);
//         const dateLabel = formatDateLabel(msgDate);

//         const showDateLabel = !lastMessageDate || formatDateLabel(lastMessageDate) !== dateLabel;
//         lastMessageDate = msgDate;

//         const isClient = msg?.sender?._id === pic?._id || msg.from === 'client';
//         // const isTyping = typingUsers.has(msg?.sender?._id) || typingUsers.has(msg?.receiver?._id);

//         return (
//           <React.Fragment key={index}>
//             {showDateLabel && (
//               <div className="text-center my-3" style={{ fontSize: '0.8rem' }}>
//                 <div
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'space-evenly',
//                     width: '100%',
//                     alignItems: 'center'
//                   }}
//                 >
//                   <hr style={{ width: '100%' }} />
//                   <p style={{ width: '100%', marginTop: 15 }}>{dateLabel} </p>
//                   <hr style={{ width: '100%' }} />
//                 </div>
//               </div>
//             )}
//             <div
//               className={`d-flex align-items-center gap-2 mb-2 ${
//                 isClient ? 'justify-content-end' : 'justify-content-start'
//               }`}
//             >
//               <Avatar
//                 src={
//                   msg?.sender?.picture ||
//                   (chat && (isClient ? pic.picture : chat.picture)) ||
//                   './Darshan.png'
//                 }
//                 size={32}
//               />
//               <div
//                 className="px-3 py-2 rounded-pill"
//                 style={{
//                   backgroundColor: isClient ? '#005c4b' : '#3a3b3c',
//                   color: '#fff',
//                   maxWidth: '60%',
//                   fontSize: '0.9rem',
//                   display: 'flex',
//                   alignItems: 'center'
//                 }}
//               >
//                 {msg.text || msg.content}
//               </div>
//             </div>
//           </React.Fragment>
//         );
//       })}
//       {[...typingUsers].length > 0 && (
//         <div className="d-flex align-items-center gap-2 mb-2 justify-content-start">
//           <Avatar src={(chat && chat.picture) || './avatar.png'} size={32} />
//           <div
//             className="px-3 py-2 rounded-pill"
//             style={{
//               backgroundColor: '#3a3b3c',
//               color: '#fff',
//               maxWidth: '60%',
//               fontSize: '0.9rem',
//               display: 'flex',
//               alignItems: 'center'
//             }}
//           >
//             <TypingIndicator />
//           </div>
//         </div>
//       )}

//       <div ref={chatEndRef} />
//     </div>
//   );
// };

// export default ChatBody;

import React, { useEffect, useRef } from 'react';
import { Avatar, Box, Flex, Text } from '@radix-ui/themes';
import { format, isToday, isYesterday } from 'date-fns';
import { useTheme } from './ThemeContext';
import TypingIndicator from './Indicators/TypingIndicator';

const formatDateLabel = (date) => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');
};

const ChatBody = ({ messages = [], pic, chat, typingUsers }) => {
  const chatEndRef = useRef(null);
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  let lastMessageDate = null;

  return (
    <Box
      className="flex-grow"
      px="4"
      py="3"
      style={{
        overflowY: 'auto',
        backgroundImage: isDark ? "url('./background.jpg')" : "url('./backgroundII.png')",
        backgroundSize: 'cover',
        backgroundColor: isDark ? '#0d1717' : 'rgba(0,0,0,0.2)',
        color: isDark ? 'white' : 'rgba(0,0,0,0.5)',
        maxHeight: '100%'
      }}
    >
      {messages.map((msg, index) => {
        const msgDate = new Date(msg.createdAt);
        const dateLabel = formatDateLabel(msgDate);

        const showDateLabel = !lastMessageDate || formatDateLabel(lastMessageDate) !== dateLabel;
        lastMessageDate = msgDate;

        const isClient = msg?.sender?._id === pic?._id || msg.from === 'client';

        return (
          <React.Fragment key={index}>
            {showDateLabel && (
              <Flex direction="column" align="center" my="3">
                <Flex align="center" justify="center" gap="2" style={{ width: '100%' }}>
                  <Box flexGrow="1" style={{ borderBottom: '1px solid rgba(0,0,0,0.4)' }} />
                  <Text size="1" color="gray">
                    {dateLabel}
                  </Text>
                  <Box flexGrow="1" style={{ borderBottom: '1px solid rgba(0,0,0,0.4)' }} />
                </Flex>
              </Flex>
            )}
            <Flex align="center" gap="2" mb="2" justify={isClient ? 'end' : 'start'}>
              <Avatar
                fallback={msg?.sender?.name ? msg.sender.name[0] : 'A'}
                src={
                  msg?.sender?.picture ||
                  (chat && (isClient ? pic.picture : chat.picture)) ||
                  './Darshan.png'
                }
                radius="full"
                size="2"
              />
              <Box
                px="3"
                py="2"
                style={{
                  backgroundColor: isClient ? '#005c4b' : '#3a3b3c',
                  color: '#fff',
                  maxWidth: '60%',
                  fontSize: '0.9rem',
                  borderRadius: '9999px'
                }}
              >
                {msg.text || msg.content}
              </Box>
            </Flex>
          </React.Fragment>
        );
      })}

      {[...typingUsers].length > 0 && (
        <Flex align="center" gap="2" mb="2" justify="start">
          <Avatar
            fallback={chat?.name ? chat.name[0] : 'U'}
            src={(chat && chat.picture) || './avatar.png'}
            radius="full"
            size="2"
          />
          <Box
            px="3"
            py="2"
            style={{
              backgroundColor: '#3a3b3c',
              color: '#fff',
              maxWidth: '60%',
              fontSize: '0.9rem',
              borderRadius: '9999px'
            }}
          >
            <TypingIndicator />
          </Box>
        </Flex>
      )}

      <div ref={chatEndRef} />
    </Box>
  );
};

export default ChatBody;
