// import React from 'react';
// import { Drawer, Typography, TextField, Box, IconButton, Button } from '@mui/material';
// import { Close } from '@mui/icons-material';

// const CreateGroupDrawer = ({ open, onClose, isDark, users }) => {
//   const handleCreate = () => {
//     console.log('Group created!'); // hook up your mutation here
//     onClose();
//   };

//   return (
//     <Drawer
//       anchor="left"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: '80%',
//           maxWidth: 400,
//           p: 2,
//           bgcolor: isDark ? '#1f1d1d' : '#f7fef2',
//           color: isDark ? '#ffffff' : '#1f1d1d',
//           position: 'relative',
//           display: 'flex',
//           flexDirection: 'column',
//           height: '100%'
//         }
//       }}
//     >
//       {/* Close Button */}
//       <IconButton
//         onClick={onClose}
//         sx={{
//           position: 'absolute',
//           top: 8,
//           right: 8,
//           color: isDark ? '#ffffffcc' : '#1f1d1dcc',
//           '&:hover': { color: '#00e575' }
//         }}
//       >
//         <Close />
//       </IconButton>

//       {/* Title */}
//       <Typography variant="h6" sx={{ mb: 2, color: '#00e575' }}>
//         Create Group
//       </Typography>

//       {/* Group Name */}
//       <TextField
//         fullWidth
//         label="Group Name"
//         variant="outlined"
//         sx={{
//           mb: 2,
//           input: { color: isDark ? '#ffffff' : '#1f1d1d' },
//           '& .MuiOutlinedInput-root': {
//             '& fieldset': {
//               borderColor: isDark ? '#ffffff99' : '#1f1d1d99'
//             },
//             '&:hover fieldset': {
//               borderColor: '#00e575'
//             },
//             '&.Mui-focused fieldset': {
//               borderColor: '#00e575'
//             }
//           },
//           '& .MuiInputLabel-root': {
//             color: isDark ? '#ffffffcc' : '#1f1d1dcc'
//           },
//           '& .MuiInputLabel-root.Mui-focused': {
//             color: '#00e575'
//           }
//         }}
//       />

//       {/* Group Description */}
//       <TextField
//         fullWidth
//         label="Description"
//         multiline
//         rows={3}
//         variant="outlined"
//         sx={{
//           mb: 2,
//           input: { color: isDark ? '#ffffff' : '#1f1d1d' },
//           '& .MuiOutlinedInput-root': {
//             '& fieldset': {
//               borderColor: isDark ? '#ffffff99' : '#1f1d1d99'
//             },
//             '&:hover fieldset': {
//               borderColor: '#00e575'
//             },
//             '&.Mui-focused fieldset': {
//               borderColor: '#00e575'
//             }
//           },
//           '& .MuiInputLabel-root': {
//             color: isDark ? '#ffffffcc' : '#1f1d1dcc'
//           },
//           '& .MuiInputLabel-root.Mui-focused': {
//             color: '#00e575'
//           }
//         }}
//       />

//       <Box flex={1}>
//         <Typography variant="body2" sx={{ color: isDark ? '#ffffff99' : 'text.secondary' }}>
//           (Future: Add member selection here)
//         </Typography>
//       </Box>

//       {/* ✅ Bottom Action Row */}
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           mt: 2,
//           pt: 1,
//           borderTop: `1px solid ${isDark ? '#ffffff33' : '#00000022'}`
//         }}
//       >
//         <Button
//           variant="outlined"
//           onClick={onClose}
//           sx={{
//             color: isDark ? '#ffffff' : '#1f1d1d',
//             borderColor: isDark ? '#ffffff99' : '#1f1d1d99',
//             '&:hover': { borderColor: '#00e575', color: '#00e575' }
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleCreate}
//           sx={{
//             bgcolor: '#00e575',
//             color: '#fff',
//             '&:hover': { bgcolor: '#00c863' }
//           }}
//         >
//           Create
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default CreateGroupDrawer;

import React, { useState } from 'react';
import {
  Drawer,
  Typography,
  TextField,
  Box,
  IconButton,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox
} from '@mui/material';
import { Close, CameraAlt } from '@mui/icons-material';

const CreateGroupDrawer = ({ open, onClose, isDark, users }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupLogo, setGroupLogo] = useState(null);

  const handleToggleUser = (id) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]));
  };

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      setGroupLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCreate = () => {
    console.log('Group created!', { selectedUsers, groupLogo });
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

      {/* Group Logo */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 2,
          position: 'relative'
        }}
      >
        <Avatar
          src={groupLogo}
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#00e575',
            fontSize: 28
          }}
        >
          {groupLogo ? '' : 'G'}
        </Avatar>
        <IconButton
          component="label"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 'calc(50% - 40px)',
            bgcolor: isDark ? '#333' : '#fff',
            boxShadow: 2,
            '&:hover': { bgcolor: '#00e575', color: '#fff' }
          }}
        >
          <CameraAlt fontSize="small" />
          <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
        </IconButton>
      </Box>

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
              borderColor: isDark ? '#ffffff' : '#1f1d1d66'
            },
            '&:hover fieldset': {
              borderColor: '#00e575'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00e575'
            }
          },
          '& .MuiInputLabel-root': {
            color: isDark ? '#ffffff' : '#1f1d1d99'
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
              borderColor: isDark ? '#ffffff' : '#1f1d1d66'
            },
            '&:hover fieldset': {
              borderColor: '#00e575'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00e575'
            }
          },
          '& .MuiInputLabel-root': {
            color: isDark ? '#ffffff' : '#1f1d1d99'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#00e575'
          }
        }}
      />

      {/* User Selection */}
      <Typography variant="subtitle2" sx={{ mb: 1, color: '#00e575' }}>
        Add Members
      </Typography>
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
        <List dense>
          {users.map((user) => (
            <ListItem
              key={user?._id}
              button
              onClick={() => handleToggleUser(user?._id)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                bgcolor: selectedUsers.includes(user?._id)
                  ? isDark
                    ? '#2b2b2b'
                    : '#e6f9f0'
                  : 'transparent',
                '&:hover': {
                  bgcolor: isDark ? '#2b2b2b55' : '#e6f9f055'
                }
              }}
            >
              <ListItemAvatar>
                <Avatar src={user?.picture}>{user?.username[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user?.username}
                secondary={user?.subtitle}
                primaryTypographyProps={{
                  style: { color: isDark ? '#fff' : '#1f1d1d' }
                }}
                secondaryTypographyProps={{
                  style: { color: isDark ? '#ffffff99' : '#666' }
                }}
              />
              <Checkbox
                edge="end"
                checked={selectedUsers.includes(user?._id)}
                tabIndex={-1}
                disableRipple
                sx={{
                  color: '#00e575',
                  '&.Mui-checked': { color: '#00e575' }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Action Row */}
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
