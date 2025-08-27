// import { Video, Phone } from 'lucide-react';
// import { Image } from 'react-bootstrap';
// import { useTheme } from './ThemeContext';

// const ChatHeader = ({
//   username = 'Darshan Zalavadiya',
//   online = true,
//   onlineUsers,
//   pic,
//   selectedUser,
//   typingUserId
// }) => {
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';

//   return (
//     <div
//       style={{
//         backgroundColor: isDark ? ' #1f1d1d' : 'white',
//         color: isDark ? 'white' : 'black'
//       }}
//       className="d-flex align-items-center justify-content-between p-3 border-bottom border-dark"
//     >
//       {/* bg-dark text-white */}
//       <div className="d-flex align-items-center">
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
//       <div className="d-flex gap-3">
//         <Video />
//         <Phone />
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;

import { Video, Phone } from 'lucide-react';
import { Avatar, Flex, Box, Text, IconButton } from '@chakra-ui/react';
import { useTheme } from './ThemeContext';

const ChatHeader = ({ onlineUsers, selectedUser }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isOnline = selectedUser && onlineUsers?.has(selectedUser._id);

  return (
    <Flex
      align="center"
      justify="space-between"
      p={3}
      bg={isDark ? 'gray.900' : 'white'}
      color={isDark ? 'white' : 'black'}
      borderBottom="1px solid rgba(0, 0, 0, 0.4)"
    >
      <Flex align="center" gap={3}>
        <Avatar
          name={selectedUser?.username || 'U'}
          src={selectedUser?.picture || './avatar.png'}
          size="sm"
        />
        <Box>
          <Text fontWeight="medium">{selectedUser?.username}</Text>
          <Text fontSize="sm" color={isOnline ? 'green.400' : 'gray.500'}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </Box>
      </Flex>

      <Flex gap={3} align="center">
        <IconButton
          aria-label="Video Call"
          icon={<Video size={20} />}
          variant="ghost"
          color="gray.500"
          size="sm"
        />
        <IconButton
          aria-label="Voice Call"
          icon={<Phone size={20} />}
          variant="ghost"
          color="gray.500"
          size="sm"
        />
      </Flex>
    </Flex>
  );
};

export default ChatHeader;
