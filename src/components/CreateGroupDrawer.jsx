import React from 'react';
import { Drawer, Typography, TextField, Box } from '@mui/material';

const CreateGroupDrawer = ({ open, onClose, isDark }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: '80%', maxWidth: 400, p: 2, bgcolor: isDark ? '#1f1d1d' : '#f7fef2' }
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#00e575' }}>
        Create Group
      </Typography>

      {/* Group Name */}
      <TextField fullWidth label="Group Name" variant="outlined" sx={{ mb: 2 }} />

      {/* Group Description */}
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <Box>
        <Typography variant="body2" color="text.secondary">
          (Future: Add member selection here)
        </Typography>
      </Box>
    </Drawer>
  );
};

export default CreateGroupDrawer;
