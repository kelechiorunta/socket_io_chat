// Bubble styles with pointed edges
// import React from 'react';
import styled from '@emotion/styled';
import { Paper } from '@mui/material';

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isClient'
})(({ theme, isClient }) => ({
  position: 'relative',
  padding: theme.spacing(1.2, 2),
  borderRadius: 16,
  maxWidth: '60%',
  fontSize: '0.9rem',
  color: '#fff',
  backgroundColor: isClient ? '#005c4b' : '#3a3b3c',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    width: 0,
    height: 0,
    border: '8px solid transparent',
    transform: 'translateY(-50%)',
    [isClient ? 'right' : 'left']: -15,
    borderLeftColor: isClient ? '#005c4b' : 'transparent',
    borderRightColor: isClient ? 'transparent' : '#3a3b3c'
  }
}));

export default MessageBubble;
