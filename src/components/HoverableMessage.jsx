import React, { useState } from 'react';
import { Box, Avatar, Typography, Tooltip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ProgressiveImage from './ProgressiveImage';

const HoverableMessage = ({ msg, isClient, pic, chat, onDelete, onEdit }) => {
  const [hovered, setHovered] = useState(false);

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
          bgcolor: isClient ? 'primary.main' : 'grey.700',
          color: 'white',
          borderRadius: 3,
          p: 1.5,
          maxWidth: '70%',
          wordBreak: 'break-word',
          position: 'relative'
        }}
      >
        {msg.content && <Typography variant="body2">{msg.content}</Typography>}

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
              top: -32,
              right: 0,
              display: 'flex',
              gap: 1
            }}
          >
            <Tooltip title="Edit">
              <IconButton size="small" color="info" onClick>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => onDelete(msg._id, pic?._id)}>
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
