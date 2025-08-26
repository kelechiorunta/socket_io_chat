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
import { Avatar, Flex, Box, Text, IconButton } from '@radix-ui/themes';
import { useTheme } from './ThemeContext';

const ChatHeader = ({
  username = 'Darshan Zalavadiya',
  online = true,
  onlineUsers,
  pic,
  selectedUser,
  typingUserId
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Flex
      align="center"
      justify="between"
      p="3"
      style={{
        backgroundColor: isDark ? '#1f1d1d' : 'white',
        color: isDark ? 'white' : 'black',
        borderBottom: '1px solid rgba(0, 0, 0, 0.4)'
      }}
    >
      <Flex align="center" gap="3">
        <Avatar
          fallback={selectedUser?.username ? selectedUser.username[0] : 'U'}
          src={selectedUser ? selectedUser.picture || './avatar.png' : './avatar.png'}
          radius="full"
          size="3"
        />
        <Box>
          <Text weight="medium">{selectedUser && selectedUser.username}</Text>
          <Text size="1" color={onlineUsers?.has(selectedUser?._id) ? 'green' : 'gray'}>
            {onlineUsers?.has(selectedUser?._id) ? 'Online' : 'Offline'}
          </Text>
        </Box>
      </Flex>

      <Flex gap="3" align="center">
        <IconButton variant="ghost" color="gray" size="3">
          <Video size={20} />
        </IconButton>
        <IconButton variant="ghost" color="gray" size="3">
          <Phone size={20} />
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default ChatHeader;
