// import React, { useState } from 'react';
// import { Box, Avatar, Typography, Tooltip, IconButton } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import ProgressiveImage from './ProgressiveImage';

// const HoverableMessage = ({ msg, isClient, pic, chat, onDelete, onEdit }) => {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <Box
//       display="flex"
//       alignItems="flex-end"
//       justifyContent={isClient ? 'flex-end' : 'flex-start'}
//       gap={1}
//       mb={2}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       sx={{ position: 'relative' }}
//     >
//       {/* Avatar for non-client */}
//       {!isClient && (
//         <Avatar
//           src={msg?.sender?.picture || (chat && chat.picture) || './Darshan.png'}
//           sx={{ width: 32, height: 32 }}
//         />
//       )}

//       {/* Bubble */}
//       <Box
//         component="div"
//         sx={{
//           bgcolor: isClient ? 'primary.main' : 'grey.700',
//           color: 'white',
//           borderRadius: 3,
//           p: 1.5,
//           maxWidth: '70%',
//           wordBreak: 'break-word',
//           position: 'relative'
//         }}
//       >
//         {msg.content && <Typography variant="body2">{msg.content}</Typography>}

//         {msg.hasImage && (
//           <ProgressiveImage
//             placeholderSrc={msg.placeholderUrl}
//             src={msg.imageUrl}
//             alt="attachment"
//             style={{
//               maxWidth: '200px',
//               maxHeight: '200px',
//               borderRadius: '8px',
//               marginTop: '4px'
//             }}
//           />
//         )}

//         {/* Hover action buttons */}
//         {hovered && isClient && (
//           <Box
//             sx={{
//               position: 'absolute',
//               top: -32,
//               right: 0,
//               display: 'flex',
//               gap: 1
//             }}
//           >
//             <Tooltip title="Edit">
//               <IconButton size="small" color="info" onClick>
//                 <EditIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>

//             <Tooltip title="Delete">
//               <IconButton size="small" color="error" onClick={() => onDelete(msg._id, pic?._id)}>
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         )}
//       </Box>

//       {/* Avatar for client */}
//       {isClient && <Avatar src={pic?.picture || './Darshan.png'} sx={{ width: 32, height: 32 }} />}
//     </Box>
//   );
// };

// export default HoverableMessage;

import React, { useState } from 'react';
import { Box, Avatar, Typography, Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ProgressiveImage from './ProgressiveImage';

const HoverableMessage = ({ msg, isClient, pic, chat, onDelete, onEdit }) => {
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();

  // bubble colors
  const clientColor = theme.palette.primary.main;
  const otherColor = theme.palette.grey[700];

  return (
    <Box
      display="flex"
      alignItems="flex-end"
      justifyContent={isClient ? 'flex-end' : 'flex-start'}
      gap={1}
      mb={2}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{ position: 'relative' }}
    >
      {/* Avatar for non-client */}
      {!isClient && (
        <Avatar
          src={msg?.sender?.picture || (chat && chat.picture) || './Darshan.png'}
          sx={{ width: 32, height: 32 }}
        />
      )}

      {/* Bubble */}
      <Box
        component="div"
        sx={{
          bgcolor: isClient ? clientColor : otherColor,
          color: 'white',
          borderRadius: 3,
          p: 1.5,
          maxWidth: '70%',
          wordBreak: 'break-word',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 4, // slight overlap inside
            width: 0,
            height: 0,
            borderStyle: 'solid',
            ...(isClient
              ? {
                  right: -8,
                  borderWidth: '8px 0 8px 10px',
                  borderColor: `transparent transparent transparent ${clientColor}`
                }
              : {
                  left: -8,
                  borderWidth: '8px 10px 8px 0',
                  borderColor: `transparent ${otherColor} transparent transparent`
                })
          }
        }}
      >
        {/* Text */}
        {msg.content && <Typography variant="body2">{msg.content}</Typography>}

        {/* Image */}
        {msg.hasImage && (
          <ProgressiveImage
            placeholderSrc={msg.placeholderUrl}
            src={msg.imageUrl}
            alt="attachment"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              borderRadius: '8px',
              marginTop: '4px'
            }}
          />
        )}

        {/* Hover action buttons */}
        {hovered && isClient && (
          <Box
            sx={{
              position: 'absolute',
              bottom: -28, // align near bottom like WhatsApp
              right: 4,
              display: 'flex',
              gap: 0.5,
              bgcolor: 'rgba(0,0,0,0.4)',
              borderRadius: 2,
              p: 0.3
            }}
          >
            <Tooltip title="Edit">
              <IconButton size="small" color="info" onClick={() => onEdit?.(msg)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => onDelete?.(msg._id, pic?._id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Avatar for client */}
      {isClient && <Avatar src={pic?.picture || './Darshan.png'} sx={{ width: 32, height: 32 }} />}
    </Box>
  );
};

export default HoverableMessage;
