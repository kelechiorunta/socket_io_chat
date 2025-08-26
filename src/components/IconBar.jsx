// import { Nav, Image, Button } from 'react-bootstrap';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// import { Home, Search, Bookmark, Share2, Settings, Moon, Sun, LogOutIcon } from 'lucide-react';
// import { useTheme } from './ThemeContext';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import Profile from './Profile';

// const IconBar = ({ profile, onUpdateProfile }) => {
//   // const [profile, setProfile] = useState(pic);
//   const { theme, toggleTheme } = useTheme();

//   const isDark = theme === 'dark';

//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await fetch('/api/logout', { method: 'GET', credentials: 'include' });
//     // Clear state, tokens, etc.
//     navigate('/login'); // or home
//     localStorage.removeItem('currentUser');
//   };

//   const [showProfile, setShowProfile] = useState(false);

//   const handleProfileOpen = () => setShowProfile(true);
//   const handleProfileClose = () => setShowProfile(false);

//   const handleProfileUpdate = (newData) => {
//     onUpdateProfile((prev) => ({ ...prev, ...newData }));
//   };

//   // useEffect(() => {
//   //     if (pic) {
//   //         setProfile(pic)
//   //     }
//   // },[pic])

//   return (
//     <div
//       className="d-flex flex-column justify-content-between align-items-center p-2"
//       style={{
//         height: '100vh',
//         minWidth: '80px',
//         color: 'var(--text-color)',
//         backgroundColor: 'var(--bg-color)',
//         borderRight: `1px solid var(--border-color)`
//       }}
//     >
//       <div className="d-flex flex-column align-items-center gap-3">
//         <Image src={profile?.picture} alt="Logo" style={{ width: 30, height: 30 }} rounded />

//         <Nav defaultActiveKey="/home" className="flex-column text-center">
//           {[
//             { icon: Home, label: 'Home' },
//             { icon: Search, label: 'Search' },
//             { icon: Bookmark, label: 'Save' },
//             { icon: Share2, label: 'Share' },
//             { icon: Settings, label: 'Settings' }
//           ].map(({ icon: Icon, label }) => (
//             <OverlayTrigger key={label} placement="right" overlay={<Tooltip>{label}</Tooltip>}>
//               <Nav.Link
//                 href="#"
//                 className={`${isDark ? 'text-white' : 'text-black'} d-flex flex-column align-items-center`}
//               >
//                 <Icon size={20} />
//                 <small style={{ fontSize: '0.7rem' }}>{label}</small>
//               </Nav.Link>
//             </OverlayTrigger>
//           ))}
//         </Nav>
//       </div>

//       <div className="d-flex flex-column align-items-center gap-3">
//         <OverlayTrigger placement="right" overlay={<Tooltip>Toggle Theme</Tooltip>}>
//           <Button
//             variant="outline-secondary"
//             className="d-flex justify-content-center align-items-center"
//             style={{ width: 36, height: 36, borderRadius: '50%' }}
//             onClick={toggleTheme}
//           >
//             {isDark ? <Sun size={18} /> : <Moon size={18} />}
//           </Button>
//         </OverlayTrigger>

//         <OverlayTrigger placement="right" overlay={<Tooltip>Logout</Tooltip>}>
//           <Button
//             variant="outline-secondary"
//             className="d-flex justify-content-center align-items-center"
//             style={{ width: 36, height: 36, borderRadius: '50%' }}
//             onClick={() => handleLogout()}
//           >
//             <LogOutIcon size={18} />
//           </Button>
//         </OverlayTrigger>

//         <>
//           <OverlayTrigger placement="right" overlay={<Tooltip>Update Profile</Tooltip>}>
//             <Image
//               onClick={handleProfileOpen}
//               src={profile && profile.picture}
//               roundedCircle
//               style={{ width: 36, height: 36, cursor: 'pointer' }}
//             />
//           </OverlayTrigger>

//           <Profile
//             show={showProfile}
//             handleClose={handleProfileClose}
//             onProfileUpdate={handleProfileUpdate}
//             user={profile}
//           />
//         </>
//       </div>
//     </div>
//   );
// };

// export default IconBar;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Flex, Box, IconButton, Avatar, Text } from '@radix-ui/themes';
import { Home, Search, Bookmark, Share2, Settings, Moon, Sun, LogOutIcon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Profile from './Profile';

const IconBar = ({ profile, onUpdateProfile }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'GET', credentials: 'include' });
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleProfileUpdate = (newData) => {
    onUpdateProfile((prev) => ({ ...prev, ...newData }));
  };

  return (
    <Flex
      direction="column"
      justify="between"
      align="center"
      p="2"
      style={{
        height: '100vh',
        minWidth: '80px',
        borderRight: '1px solid var(--gray-a5)',
        backgroundColor: isDark ? '#1f1d1d' : 'white'
      }}
    >
      {/* Top icons */}
      <Flex direction="column" align="center" gap="3">
        <Avatar src={profile?.picture} fallback="U" size="2" />

        <Flex direction="column" align="center" gap="4">
          {[
            { icon: Home, label: 'Home' },
            { icon: Search, label: 'Search' },
            { icon: Bookmark, label: 'Save' },
            { icon: Share2, label: 'Share' },
            { icon: Settings, label: 'Settings' }
          ].map(({ icon: Icon, label }) => (
            <Tooltip.Root key={label}>
              <Tooltip.Trigger asChild>
                <Flex direction="column" align="center" style={{ cursor: 'pointer' }}>
                  <Icon size={20} />
                  <Text size="1">{label}</Text>
                </Flex>
              </Tooltip.Trigger>
              <Tooltip.Content side="right">{label}</Tooltip.Content>
            </Tooltip.Root>
          ))}
        </Flex>
      </Flex>

      {/* Bottom actions */}
      <Flex direction="column" align="center" gap="3">
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <IconButton
              size="2"
              variant="soft"
              onClick={toggleTheme}
              style={{ borderRadius: '50%' }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="right">Toggle Theme</Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <IconButton
              size="2"
              variant="soft"
              onClick={handleLogout}
              style={{ borderRadius: '50%' }}
            >
              <LogOutIcon size={18} />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="right">Logout</Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Avatar
              src={profile?.picture}
              fallback="P"
              size="2"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowProfile(true)}
            />
          </Tooltip.Trigger>
          <Tooltip.Content side="right">Update Profile</Tooltip.Content>
        </Tooltip.Root>

        <Profile
          show={showProfile}
          handleClose={() => setShowProfile(false)}
          onProfileUpdate={handleProfileUpdate}
          user={profile}
        />
      </Flex>
    </Flex>
  );
};

export default IconBar;
