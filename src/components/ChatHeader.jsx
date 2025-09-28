import React from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import { ArrowLeft, Phone, Video } from 'lucide-react';

const ChatHeader = ({ isDark, showBackButton, onBack, selectedUser, onlineUsers }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={2}
      py={1.5}
      sx={{
        backgroundColor: isDark ? '#1f1d1d' : 'white', //'grey.800' : 'white', //'#1f1d1d', //: 'white',
        color: isDark ? 'white' : 'black',
        borderBottom: '1px solid',
        borderColor: isDark ? 'grey.800' : 'grey.300'
      }}
    >
      {/* Left side: back button + avatar + username */}
      <Box display="flex" alignItems="center">
        {showBackButton && (
          <IconButton
            color={isDark ? 'white' : 'black'}
            size="small"
            onClick={onBack}
            sx={{ display: { xs: 'inline-flex', sm: 'none' }, mr: 1 }}
          >
            <ArrowLeft color={isDark ? 'white' : 'black'} size={20} />
          </IconButton>
        )}

        <Avatar
          src={selectedUser?.picture || './avatar.png'}
          alt="Avatar"
          sx={{ width: 40, height: 40, mr: 1.5 }}
        />

        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'flex-start'}
          flexDirection={'column'}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {selectedUser?.username}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: onlineUsers?.has(selectedUser?._id) ? '#00e676' : isDark ? 'white' : 'grey.500'
            }} //'grey.500'
          >
            🎉 {onlineUsers?.has(selectedUser?._id) ? 'Online' : 'Offline'}
          </Typography>
        </Box>
      </Box>

      {/* Right side: actions */}
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton>
          <Video size={20} />
        </IconButton>
        <IconButton>
          <Phone size={20} />
        </IconButton>
      </Box>
    </Box>
    // </div>
  );
};

export default ChatHeader;

//MODIFIED CODE

// import { Video, Phone, ArrowLeft } from 'lucide-react';
// import { Image, Button } from 'react-bootstrap';
// import { useTheme } from './ThemeContext';

// const ChatHeader = ({
//   username = 'Darshan Zalavadiya',
//   online = true,
//   onlineUsers,
//   pic,
//   selectedUser,
//   typingUserId,
//   showBackButton, // 👈 new prop
//   onBack // 👈 new prop
// }) => {
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';

//   return (
//     <div
//       style={{
//         backgroundColor: isDark ? '#1f1d1d' : 'white',
//         color: isDark ? 'white' : 'black'
//       }}
//       className="d-flex align-items-center justify-content-between p-3 border-bottom border-dark"
//     >
//       {/* Left side: Back button + avatar + username */}
//       <div className="d-flex align-items-center">
//         {showBackButton && (
//           <Button
//             variant="outline-secondary"
//             size="sm"
//             className="me-2" // 👈 only visible on mobile d-sm-none
//             onClick={onBack}
//           >
//             <ArrowLeft size={18} />
//           </Button>
//         )}
//         <Image
//           src={selectedUser ? selectedUser.picture || './avatar.png' : './avatar.png'}
//           alt="Avatar"
//           className="rounded-circle"
//           style={{ width: 40, height: 40, marginRight: 12 }}
//         />
//         <div>
//           <div className="fw-bold">{selectedUser && selectedUser.username}</div>
//           <div style={{ fontSize: '0.8rem', textAlign: 'left', color: '#00e676' }}>
//             {onlineUsers?.has(selectedUser?._id) ? 'Online' : 'Offline'}
//           </div>
//         </div>
//       </div>

//       {/* Right side: action icons */}
//       <div className="d-flex gap-3">
//         <Video />
//         <Phone />
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;

// ORIGINAL CODE

// import { Video, Phone } from 'lucide-react';
// import { Avatar, Flex, Box, Text, IconButton } from '@chakra-ui/react';
// import { useTheme } from './ThemeContext';

// const ChatHeader = ({ onlineUsers, selectedUser }) => {
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';

//   const isOnline = selectedUser && onlineUsers?.has(selectedUser._id);

//   return (
//     <Flex
//       align="center"
//       justify="space-between"
//       p={3}
//       bg={isDark ? 'gray.900' : 'white'}
//       color={isDark ? 'white' : 'black'}
//       borderBottom="1px solid rgba(0, 0, 0, 0.4)"
//     >
//       <Flex align="center" gap={3}>
//         <Avatar
//           name={selectedUser?.username || 'U'}
//           src={selectedUser?.picture || './avatar.png'}
//           size="sm"
//         />
//         <Box>
//           <Text fontWeight="medium">{selectedUser?.username}</Text>
//           <Text fontSize="sm" color={isOnline ? 'green.400' : 'gray.500'}>
//             {isOnline ? 'Online' : 'Offline'}
//           </Text>
//         </Box>
//       </Flex>

//       <Flex gap={3} align="center">
//         <IconButton
//           aria-label="Video Call"
//           icon={<Video size={20} />}
//           variant="ghost"
//           color="gray.500"
//           size="sm"
//         />
//         <IconButton
//           aria-label="Voice Call"
//           icon={<Phone size={20} />}
//           variant="ghost"
//           color="gray.500"
//           size="sm"
//         />
//       </Flex>
//     </Flex>
//   );
// };

// export default ChatHeader;
