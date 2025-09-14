import React from 'react';
import { Drawer, Typography, TextField, Box, IconButton, Button } from '@mui/material';
import { Close } from '@mui/icons-material';

const CreateGroupDrawer = ({ open, onClose, isDark }) => {
  const handleCreate = () => {
    console.log('Group created!'); // hook up your mutation here
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '80%',
          maxWidth: 400,
          p: 2,
          bgcolor: isDark ? '#1f1d1d' : '#f7fef2',
          color: isDark ? '#ffffff' : '#1f1d1d',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: isDark ? '#ffffffcc' : '#1f1d1dcc',
          '&:hover': { color: '#00e575' }
        }}
      >
        <Close />
      </IconButton>

      {/* Title */}
      <Typography variant="h6" sx={{ mb: 2, color: '#00e575' }}>
        Create Group
      </Typography>

      {/* Group Name */}
      <TextField
        fullWidth
        label="Group Name"
        variant="outlined"
        sx={{
          mb: 2,
          input: { color: isDark ? '#ffffff' : '#1f1d1d' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: isDark ? '#ffffff99' : '#1f1d1d99'
            },
            '&:hover fieldset': {
              borderColor: '#00e575'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00e575'
            }
          },
          '& .MuiInputLabel-root': {
            color: isDark ? '#ffffffcc' : '#1f1d1dcc'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#00e575'
          }
        }}
      />

      {/* Group Description */}
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        variant="outlined"
        sx={{
          mb: 2,
          input: { color: isDark ? '#ffffff' : '#1f1d1d' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: isDark ? '#ffffff99' : '#1f1d1d99'
            },
            '&:hover fieldset': {
              borderColor: '#00e575'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00e575'
            }
          },
          '& .MuiInputLabel-root': {
            color: isDark ? '#ffffffcc' : '#1f1d1dcc'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#00e575'
          }
        }}
      />

      <Box flex={1}>
        <Typography variant="body2" sx={{ color: isDark ? '#ffffff99' : 'text.secondary' }}>
          (Future: Add member selection here)
        </Typography>
      </Box>

      {/* ✅ Bottom Action Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 2,
          pt: 1,
          borderTop: `1px solid ${isDark ? '#ffffff33' : '#00000022'}`
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            color: isDark ? '#ffffff' : '#1f1d1d',
            borderColor: isDark ? '#ffffff99' : '#1f1d1d99',
            '&:hover': { borderColor: '#00e575', color: '#00e575' }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          sx={{
            bgcolor: '#00e575',
            color: '#fff',
            '&:hover': { bgcolor: '#00c863' }
          }}
        >
          Create
        </Button>
      </Box>
    </Drawer>
  );
};

export default CreateGroupDrawer;
