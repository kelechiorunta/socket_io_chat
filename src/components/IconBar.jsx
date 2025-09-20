// import { Nav, Image, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
// import { Home, Search, Bookmark, Share2, Settings, Moon, Sun, LogOut } from 'lucide-react';
// import { useTheme } from './ThemeContext';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import Profile from './Profile';

// const IconBar = ({ profile, onUpdateProfile, isMobile }) => {
//   const { theme, toggleTheme } = useTheme();
//   const isDark = theme === 'dark';
//   const navigate = useNavigate();
//   const [showProfile, setShowProfile] = useState(false);

//   const handleLogout = async () => {
//     await fetch('/api/logout', { method: 'GET', credentials: 'include' });
//     localStorage.removeItem('currentUser');
//     navigate('/login');
//   };

//   const handleProfileOpen = () => setShowProfile(true);
//   const handleProfileClose = () => setShowProfile(false);

//   const handleProfileUpdate = (newData) => {
//     onUpdateProfile((prev) => ({ ...prev, ...newData }));
//   };

//   const icons = [
//     { icon: Home, label: 'Home' },
//     { icon: Search, label: 'Search' },
//     { icon: Bookmark, label: 'Save' },
//     { icon: Share2, label: 'Share' },
//     { icon: Settings, label: 'Settings' }
//   ];

//   const textColor = isDark ? 'white' : 'black';
//   const bgColor = isDark ? '#1f1d1d' : '#ffffff';
//   const borderColor = isDark ? '#333' : '#ddd';

//   return (
//     <div
//       className="d-flex flex-column justify-content-between align-items-center p-2"
//       style={{
//         height: '100vh',
//         minWidth: '80px',
//         color: textColor,
//         backgroundColor: bgColor,
//         borderRight: `1px solid ${borderColor}`
//       }}
//     >
//       {/* Top icons */}
//       <div className="d-flex flex-column align-items-center gap-3">
//         <Image
//           src={profile?.picture}
//           alt="Profile"
//           roundedCircle
//           style={{ width: 36, height: 36 }}
//         />
//         <Nav className="flex-column text-center">
//           {icons.map(({ icon: Icon, label }) => (
//             <OverlayTrigger
//               key={label}
//               placement="right"
//               overlay={<Tooltip id={`tooltip-${label}`}>{!isMobile && label}</Tooltip>}
//             >
//               <Nav.Link
//                 href="#"
//                 className={`d-flex flex-column align-items-center ${textColor === 'white' ? 'text-white' : 'text-black'}`}
//               >
//                 <Icon size={20} />
//                 <small style={{ fontSize: '0.7rem' }}>{!isMobile && label}</small>
//               </Nav.Link>
//             </OverlayTrigger>
//           ))}
//         </Nav>
//       </div>

//       {/* Bottom actions */}
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
//             onClick={handleLogout}
//           >
//             <LogOut size={18} />
//           </Button>
//         </OverlayTrigger>

//         <OverlayTrigger placement="right" overlay={<Tooltip>Update Profile</Tooltip>}>
//           <Image
//             onClick={handleProfileOpen}
//             src={profile?.picture}
//             roundedCircle
//             style={{ width: 36, height: 36, cursor: 'pointer' }}
//           />
//         </OverlayTrigger>

//         <Profile
//           show={showProfile}
//           handleClose={handleProfileClose}
//           onProfileUpdate={handleProfileUpdate}
//           user={profile}
//         />
//       </div>
//     </div>
//   );
// };

// export default IconBar;

// import { Nav, Image, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
// import { Home, Search, Bookmark, Share2, Settings, Moon, Sun, LogOut } from 'lucide-react';
// import { useTheme } from './ThemeContext';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import Profile from './Profile';
// import { Drawer } from '@mui/material';

// const IconBar = ({ profile, onUpdateProfile, isMobile, isOpen, onClose, isDark }) => {
//   const { toggleTheme } = useTheme();
//   // const isDark = theme === 'dark';
//   const navigate = useNavigate();
//   const [showProfile, setShowProfile] = useState(false);

//   const handleLogout = async () => {
//     await fetch('/api/logout', { method: 'GET', credentials: 'include' });
//     localStorage.removeItem('currentUser');
//     navigate('/login');
//   };

//   const handleProfileOpen = () => setShowProfile(true);
//   const handleProfileClose = () => setShowProfile(false);

//   const handleProfileUpdate = (newData) => {
//     onUpdateProfile((prev) => ({ ...prev, ...newData }));
//   };

//   const icons = [
//     { icon: Home, label: 'Home' },
//     { icon: Search, label: 'Search' },
//     { icon: Bookmark, label: 'Save' },
//     { icon: Share2, label: 'Share' },
//     { icon: Settings, label: 'Settings' }
//   ];

//   const textColor = isDark ? 'white' : 'black';
//   const bgColor = isDark ? '#1f1d1d' : '#ffffff';
//   const borderColor = isDark ? '#333' : '#ddd';

//   return (
//     <Drawer
//       anchor="left"
//       open={!isMobile? true : isOpen}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: 'max-content', //isMobile ? '70%' : 80,
//           maxWidth: '60px',
//           bgcolor: bgColor,
//           color: textColor,
//           borderRight: `1px solid ${borderColor}`,
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           p: 2
//         }
//       }}
//     >
//       {/* Top icons */}
//       <div className="d-flex flex-column align-items-center gap-3">
//         <Image
//           src={profile?.picture}
//           alt="Profile"
//           roundedCircle
//           style={{ width: 36, height: 36 }}
//         />
//         <Nav className="flex-column text-center">
//           {icons.map(({ icon: Icon, label }) => (
//             <OverlayTrigger
//               key={label}
//               placement="right"
//               overlay={<Tooltip id={`tooltip-${label}`}>{!isMobile && label}</Tooltip>}
//             >
//               <Nav.Link
//                 href="#"
//                 className={`d-flex flex-column align-items-center ${
//                   textColor === 'white' ? 'text-white' : 'text-black'
//                 }`}
//               >
//                 <Icon size={20} />
//                 <small style={{ fontSize: '0.7rem' }}>{!isMobile && label}</small>
//               </Nav.Link>
//             </OverlayTrigger>
//           ))}
//         </Nav>
//       </div>

//       {/* Bottom actions */}
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
//             onClick={handleLogout}
//           >
//             <LogOut size={18} />
//           </Button>
//         </OverlayTrigger>

//         <OverlayTrigger placement="right" overlay={<Tooltip>Update Profile</Tooltip>}>
//           <Image
//             onClick={handleProfileOpen}
//             src={profile?.picture}
//             roundedCircle
//             style={{ width: 36, height: 36, cursor: 'pointer' }}
//           />
//         </OverlayTrigger>

//         <Profile
//           show={showProfile}
//           handleClose={handleProfileClose}
//           onProfileUpdate={handleProfileUpdate}
//           user={profile}
//         />
//       </div>
//     </Drawer>
//   );
// };

// export default IconBar;

import { Nav, Image, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Home, Search, Bookmark, Share2, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Profile from './Profile';
import { Drawer } from '@mui/material';

const IconBar = ({ profile, onUpdateProfile, isMobile, isOpen, onClose, isDark }) => {
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'GET', credentials: 'include' });
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleProfileOpen = () => setShowProfile(true);
  const handleProfileClose = () => setShowProfile(false);

  const handleProfileUpdate = (newData) => {
    onUpdateProfile((prev) => ({ ...prev, ...newData }));
  };

  const icons = [
    { icon: Home, label: 'Home' },
    { icon: Search, label: 'Search' },
    { icon: Bookmark, label: 'Save' },
    { icon: Share2, label: 'Share' },
    { icon: Settings, label: 'Settings' }
  ];

  const textColor = isDark ? 'white' : 'black';
  const bgColor = isDark ? '#1f1d1d' : '#ffffff';
  const borderColor = isDark ? '#333' : '#ddd';

  // 🔑 Shared content (top + bottom)
  const content = (
    <div
      className="d-flex flex-column justify-content-between align-items-center p-2"
      style={{
        height: '100vh',
        // minWidth: '60px',
        maxWidth: '70px',
        paddingLeft: 4,
        marginLeft: 4,
        backgroundColor: bgColor,
        color: textColor,
        borderRight: `1px solid ${borderColor}`
      }}
    >
      {/* Top icons */}
      <div className="d-flex flex-column align-items-center gap-3">
        <Image
          src={profile?.picture}
          alt="Profile"
          roundedCircle
          style={{ width: 36, height: 36, margin: 'auto', display: 'block' }}
        />
        <Nav style={{ margin: 'auto', display: 'block' }} className="flex-column text-center">
          {icons.map(({ icon: Icon, label }) => (
            <OverlayTrigger
              key={label}
              placement="right"
              overlay={<Tooltip id={`tooltip-${label}`}>{!isMobile && label}</Tooltip>}
            >
              <Nav.Link
                href="#"
                className={`d-flex flex-column align-items-center ${
                  textColor === 'white' ? 'text-white' : 'text-black'
                }`}
              >
                <Icon size={20} />
                {/* <small style={{ fontSize: '0.7rem' }}>{!isMobile && label}</small> */}
              </Nav.Link>
            </OverlayTrigger>
          ))}
        </Nav>
      </div>

      {/* Bottom actions */}
      <div
        style={{ margin: 'auto', display: 'block' }}
        className="d-flex flex-column align-items-center gap-3"
      >
        <OverlayTrigger placement="right" overlay={<Tooltip>Toggle Theme</Tooltip>}>
          <Button
            variant="outline-secondary"
            className="d-flex justify-content-center align-items-center"
            style={{ width: 36, height: 36, borderRadius: '50%' }}
            onClick={(prev) => toggleTheme(!prev)}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </OverlayTrigger>

        <OverlayTrigger placement="right" overlay={<Tooltip>Logout</Tooltip>}>
          <Button
            variant="outline-secondary"
            className="d-flex justify-content-center align-items-center"
            style={{ width: 36, height: 36, borderRadius: '50%' }}
            onClick={handleLogout}
          >
            <LogOut size={18} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger placement="right" overlay={<Tooltip>Update Profile</Tooltip>}>
          <Image
            onClick={handleProfileOpen}
            src={profile?.picture}
            roundedCircle
            style={{ width: 36, height: 36, cursor: 'pointer' }}
          />
        </OverlayTrigger>

        <Profile
          show={showProfile}
          handleClose={handleProfileClose}
          onProfileUpdate={handleProfileUpdate}
          user={profile}
        />
      </div>
    </div>
  );

  // 🔑 Render Drawer for mobile, static sidebar for desktop
  return isMobile ? (
    <Drawer
      style={{
        maxWidth: 70,
        padding: 2,
        paddingLeft: 4,
        display: 'flex',
        justifyContent: 'center'
      }}
      anchor="left"
      open={isOpen}
      onClose={onClose}
    >
      {content}
    </Drawer>
  ) : (
    content
  );
};

export default IconBar;
