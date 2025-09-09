import React, { useEffect, useRef } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
// import { styled } from '@mui/system';
// import Avatar from './Avatar';
// import { format, isToday, isYesterday } from 'date-fns';
import { useTheme } from './ThemeContext';
import TypingIndicator from './Indicators/TypingIndicator';
import MessageBubble from './MessageBubble';
import ProgressiveImage from './ProgressiveImage';
// import { useQuery } from '@apollo/client';
// import { GET_MESSAGES } from '../graphql/queries'; // your GraphQL query

// const formatDateLabel = (date) => {
//   if (isToday(date)) return 'Today';
//   if (isYesterday(date)) return 'Yesterday';
//   return format(date, 'MMMM d, yyyy');
// };

const ChatBody = ({ messages = [], pic, chat, typingUsers }) => {
  const chatEndRef = useRef(null);
  const { theme } = useTheme();
  // const [imgSrc, setImgSrc] = useState([]);

  // Apollo query
  // const { data, refetch } = useQuery(GET_MESSAGES, {
  //   variables: { chatId },
  //   fetchPolicy: 'network-only' // always fresh data
  // });

  // const chatmessages = data?.messages || [];

  const isDark = theme === 'dark';
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isTyper = typingUsers.has(pic?._id);

  useEffect(scrollToBottom, [messages, isTyper]);

  // useEffect(() => {
  //   messages.forEach((m) => {
  //     if (m.imageUrl) {
  //       const img = new Image();
  //       img.src = `${m.imageUrl}?t=${Date.now()}`; // prefetch
  //       // setImgSrc((prev) => [...prev, `${m.imageUrl}`]);
  //     }
  //   });
  // }, [messages, pic, chat]);

  // // 🔄 Refetch messages when a new upload completes
  // useEffect(() => {
  //   if (newUploadTrigger) {
  //     refetch(); // force get new imageUrl
  //   }
  // }, [newUploadTrigger, refetch]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  // let lastMessageDate = null;

  return (
    <Box
      flexGrow={1}
      px={2}
      py={3}
      sx={{
        overflowY: 'scroll',
        backgroundImage: isDark ? "url('./background.jpg')" : "url('./backgroundII.png')",
        backgroundSize: 'cover',
        backgroundColor: isDark ? '#0d1717' : 'rgba(0,0,0,0.2)',
        color: isDark ? 'white' : 'rgba(0,0,0,0.5)',
        maxHeight: '100%'
        // minHeight: '95vh'
      }}
    >
      {messages.map((msg, index) => {
        // const msgDate = new Date(msg.createdAt);
        // const dateLabel = formatDateLabel(msgDate);

        // const showDateLabel = !lastMessageDate || formatDateLabel(lastMessageDate) !== dateLabel;
        // lastMessageDate = msgDate;

        const isClient = msg?.sender?._id === pic?._id || msg.from === 'client';

        console.log('messages', msg);

        return (
          <React.Fragment key={msg._id || index}>
            {/* Date separator */}
            {/* {showDateLabel && (
              <Box display="flex" alignItems="center" justifyContent="center" my={2}>
                <Divider sx={{ flex: 1 }} />
                <Typography
                  variant="caption"
                  sx={{ mx: 2, color: isDark ? 'grey.300' : 'grey.600' }}
                >
                  {dateLabel}
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>
            )} */}

            {/* Message row */}
            <Box
              display="flex"
              alignItems="flex-end"
              justifyContent={isClient ? 'flex-end' : 'flex-start'}
              gap={1}
              mb={2}
            >
              {/* Avatar for non-client */}
              {!isClient && (
                <Avatar
                  src={msg?.sender?.picture || (chat && chat.picture) || './Darshan.png'}
                  sx={{ width: 32, height: 32 }}
                />
              )}

              {/* Bubble */}
              <MessageBubble elevation={1} isClient={isClient ? 1 : 0}>
                {/* Text */}
                {msg.content && (
                  <Typography variant="body2" sx={{ color: '#fff', wordBreak: 'break-word' }}>
                    {msg.content}
                  </Typography>
                )}

                {/* Image */}
                {/* {msg.imageUrl && (
                  <Box mt={msg.content ? 1 : 0}>
                    <img
                      src={msg.imageUrl} // already cache-busted from backend
                      alt="attachment"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        marginTop: msg.content ? '5px' : 0,
                        display: 'block'
                      }}
                    />
                  </Box>
                )} */}
                {msg.hasImage && (
                  <ProgressiveImage
                    placeholderSrc={msg.placeholderUrl}
                    src={msg.imageUrl}
                    alt="attachment"
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                  />
                )}
                {msg.hasImage && (
                  <img
                    src={msg.placeholderUrl || msg.imageUrl} // show placeholder first
                    data-src={msg.imageUrl} // actual full image
                    alt="attachment"
                    className="lazyload"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      borderRadius: '8px'
                    }}
                  />
                )}
              </MessageBubble>

              {/* Avatar for client */}
              {isClient && (
                <Avatar src={pic?.picture || './Darshan.png'} sx={{ width: 32, height: 32 }} />
              )}
            </Box>
          </React.Fragment>
        );
      })}

      {/* Typing indicator */}
      {[...typingUsers].length > 0 && typingUsers.has(chat._id) && (
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Avatar src={(chat && chat.picture) || './avatar.png'} sx={{ width: 32, height: 32 }} />
          <MessageBubble elevation={1} isClient={0}>
            <Typography variant="body2">
              <TypingIndicator />
            </Typography>
          </MessageBubble>
        </Box>
      )}
      <div ref={chatEndRef} />
    </Box>
  );
};

export default ChatBody;
// Last ChatInput with Bootstrap

// <div
//   className="flex-grow-1 px-4 py-3"
//   style={{
//     overflowY: 'scroll',
//     backgroundImage: isDark ? "url('./background.jpg')" : "url('./backgroundII.png')",
//     backgroundSize: 'cover',
//     backgroundColor: isDark ? '#0d1717' : 'rgba(0,0,0,0.2)',
//     color: isDark ? 'white' : 'rgba(0,0,0,0.5)',
//     maxHeight: '100%'
//   }}
// >
//   {messages.map((msg, index) => {
//     const msgDate = new Date(msg.createdAt);
//     const dateLabel = formatDateLabel(msgDate);
//     // const isTyping = typingUsers.has(pic?._id);

//     const showDateLabel = !lastMessageDate || formatDateLabel(lastMessageDate) !== dateLabel;
//     lastMessageDate = msgDate;

//     const isClient = msg?.sender?._id === pic?._id || msg.from === 'client';
//     // const isTyping = typingUsers.has(msg?.sender?._id) || typingUsers.has(msg?.receiver?._id);

//     return (
//       <React.Fragment key={index}>
//         {showDateLabel && (
//           <div className="text-center my-3" style={{ fontSize: '0.8rem' }}>
//             <div
//               style={{
//                 display: 'flex',
//                 justifyContent: 'space-evenly',
//                 width: '100%',
//                 alignItems: 'center'
//               }}
//             >
//               <hr style={{ width: '100%' }} />
//               <p style={{ width: '100%', marginTop: 15 }}>{dateLabel} </p>
//               <hr style={{ width: '100%' }} />
//             </div>
//           </div>
//         )}
//         <div
//           className={`d-flex align-items-center gap-2 mb-2 ${
//             isClient ? 'justify-content-end' : 'justify-content-start'
//           }`}
//         >
//           <Avatar
//             src={
//               msg?.sender?.picture ||
//               (chat && (isClient ? pic.picture : chat.picture)) ||
//               './Darshan.png'
//             }
//             size={32}
//           />
//           <div
//             className="px-3 py-2 rounded-pill"
//             style={{
//               backgroundColor: isClient ? '#005c4b' : '#3a3b3c',
//               color: '#fff',
//               maxWidth: '60%',
//               fontSize: '0.9rem',
//               display: 'flex',
//               alignItems: 'center'
//             }}
//           >
//             {msg.text || msg.content}
//           </div>
//         </div>
//       </React.Fragment>
//     );
//   })}
//   {[...typingUsers].length > 0 && typingUsers.has(chat._id) && (
//     <div className="d-flex align-items-center gap-2 mb-2 justify-content-start">
//       <Avatar src={(chat && chat.picture) || './avatar.png'} size={32} />
//       <div
//         className="px-3 py-2 rounded-pill"
//         style={{
//           backgroundColor: '#3a3b3c',
//           color: '#fff',
//           maxWidth: '60%',
//           fontSize: '0.9rem',
//           display: 'flex',
//           alignItems: 'center'
//         }}
//       >
//         <TypingIndicator />
//       </div>
//     </div>
//   )}

//   <div ref={chatEndRef} />
// </div>

//BOOTSTRAP

// import React, { useEffect, useRef } from 'react';
// import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
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
//     <Box
//       px={4}
//       py={3}
//       overflowY="auto"
//       flexGrow={1}
//       bg={isDark ? '#0d1717' : 'rgba(0,0,0,0.2)'}
//       maxHeight="100%"
//       color={isDark ? 'white' : 'rgba(0,0,0,0.5)'}
//       backgroundImage={isDark ? "url('./background.jpg')" : "url('./backgroundII.png')"}
//       backgroundSize="cover"
//     >
//       {messages.map((msg, index) => {
//         const msgDate = new Date(msg.createdAt);
//         const dateLabel = formatDateLabel(msgDate);

//         const showDateLabel = !lastMessageDate || formatDateLabel(lastMessageDate) !== dateLabel;
//         lastMessageDate = msgDate;

//         const isClient = msg?.sender?._id === pic?._id || msg.from === 'client';

//         return (
//           <React.Fragment key={index}>
//             {showDateLabel && (
//               <Flex direction="column" align="center" my={3}>
//                 <Flex align="center" justify="center" gap={2} w="full">
//                   <Box flexGrow={1} borderBottom="1px solid rgba(0,0,0,0.4)" />
//                   <Text fontSize="sm" color="gray.400">
//                     {dateLabel}
//                   </Text>
//                   <Box flexGrow={1} borderBottom="1px solid rgba(0,0,0,0.4)" />
//                 </Flex>
//               </Flex>
//             )}
//             <Flex align="center" gap={2} mb={2} justify={isClient ? 'flex-end' : 'flex-start'}>
//               <Avatar
//                 name={msg?.sender?.name || 'A'}
//                 src={
//                   msg?.sender?.picture ||
//                   (chat && (isClient ? pic.picture : chat.picture)) ||
//                   './Darshan.png'
//                 }
//                 size="sm"
//               />
//               <Box
//                 px={3}
//                 py={2}
//                 maxW="60%"
//                 borderRadius="16px"
//                 bg={isClient ? '#005c4b' : '#3a3b3c'}
//                 color="white"
//                 fontSize="0.9rem"
//               >
//                 {msg.text || msg.content}
//               </Box>
//             </Flex>
//           </React.Fragment>
//         );
//       })}

//       {[...typingUsers].length > 0 && (
//         <Flex align="center" gap={2} mb={2} justify="flex-start">
//           <Avatar
//             name={chat?.name || 'U'}
//             src={(chat && chat.picture) || './avatar.png'}
//             size="sm"
//           />
//           <Box
//             px={3}
//             py={2}
//             maxW="60%"
//             borderRadius="16px"
//             bg="#3a3b3c"
//             color="white"
//             fontSize="0.9rem"
//           >
//             <TypingIndicator />
//           </Box>
//         </Flex>
//       )}

//       <div ref={chatEndRef} />
//     </Box>
//   );
// };

// export default ChatBody;
