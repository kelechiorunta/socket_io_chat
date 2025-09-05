// Sidebar.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  InputAdornment,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Skeleton,
  Typography,
  // Divider,
  Box
} from '@mui/material';
import { Search, Sun, Moon } from 'lucide-react';
import Avatar from './Avatar';
import { useTheme } from './ThemeContext';
import { parseTimestamp } from '../helper/helper';
// import AnimateText from './AnimateText/AnimateText';

const Sidebar = ({
  onSelectChat,
  pic,
  loading,
  error,
  selectedClient,
  unreadMap,
  typingUsers,
  contacts,
  onlineUsers,
  authenticatedUser
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(contacts);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef({});
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = itemRefs.current[focusedIndex];
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [focusedIndex]);

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }
    const filtered = filteredUsers.filter((user) =>
      user.username?.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filtered);
  }, [search, filteredUsers]);

  const handleSort = () => {
    setFilteredUsers((prev) =>
      [...prev].sort((a, b) => (b.isOnline === true ? 1 : 0) - (a.isOnline === true ? 1 : 0))
    );
  };

  useEffect(() => {
    const online = contacts.filter((user) => onlineUsers.has(user._id));
    const offline = contacts.filter((user) => !onlineUsers.has(user._id));

    setFilteredUsers([...online, ...offline]);
  }, [contacts, onlineUsers, tab]);

  const handleUserSelect = (user) => {
    onSelectChat(user);
    setSearch('');
    setSearchResults([]);
    const el = itemRefs.current[user._id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isDark ? '#1f1d1d' : '#f7fef2',
        color: isDark ? '#f7fef2' : '#1f1d1d',
        p: 2
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ color: '#00e575', fontWeight: 'bold', paddingLeft: 2 }}>
          JUSTCHAT
        </Typography>
        <Box display="flex" gap={1}>
          <Sun role="button" onClick={isDark ? toggleTheme : undefined} />
          <Moon role="button" onClick={!isDark ? toggleTheme : undefined} />
        </Box>
      </Box>

      {/* Search Bar */}
      <TextField
        inputRef={inputRef}
        size="small"
        fullWidth
        variant="outlined"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setFocusedIndex(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex((prev) => (prev + 1) % searchResults.length);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex((prev) => (prev === 0 ? searchResults.length - 1 : prev - 1));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            const user = searchResults[focusedIndex];
            if (user) handleUserSelect(user);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} />
            </InputAdornment>
          )
        }}
        sx={{
          mb: 2,
          bgcolor: isDark ? 'grey.800' : 'white',
          input: { color: isDark ? 'white' : 'black' }
        }}
      />

      {/* Search Results Dropdown */}
      {search.length > 0 && searchResults.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: inputRef.current?.offsetTop + (inputRef.current?.offsetHeight || 0) + 60,
            left: inputRef.current?.offsetLeft || 0,
            zIndex: 10,
            bgcolor: isDark ? 'grey.900' : 'white',
            minWidth: inputRef.current?.offsetWidth || 300,
            maxHeight: 200,
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderRadius: 1,
            boxShadow: 3
          }}
        >
          {searchResults.map((user, index) => (
            <Box
              key={user._id}
              ref={(el) => (itemRefs.current[user._id] = el)}
              onClick={() => handleUserSelect(user)}
              sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                bgcolor: index === focusedIndex ? 'success.main' : 'transparent',
                color: index === focusedIndex ? 'white' : 'inherit',
                borderBottom: '1px solid #eee'
              }}
            >
              <Avatar src={user.picture || './Darshan.png'} size={30} />
              <Typography ml={1}>{user.username}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Tabs */}
      <Box
        display={{ xs: 'none', sm: 'flex' }} // 👈 hidden on xs (mobile), flex from sm and up
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle1">Messages</Typography>
        <ButtonGroup size="small" variant="outlined">
          <Button variant={tab === 'all' ? 'contained' : 'outlined'} onClick={() => setTab('all')}>
            All Chats
          </Button>
          <Button
            variant={tab === 'groups' ? 'contained' : 'outlined'}
            onClick={() => setTab('groups')}
          >
            Groups
          </Button>
          <Button
            variant={tab === 'contacts' ? 'contained' : 'outlined'}
            onClick={() => {
              setTab('contacts');
              handleSort();
            }}
          >
            Contacts
          </Button>
        </ButtonGroup>
      </Box>

      {/* Contact List */}
      <Box flex={1} overflow="auto" mb={2} minHeight={'100vh'}>
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <Card key={idx} sx={{ mb: 1, bgcolor: isDark ? 'grey.900' : 'grey.100' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box flex={1}>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </Box>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Typography color="error">Error fetching contacts</Typography>
        ) : (
          filteredUsers.map((user) => {
            const unreadData = unreadMap[user?._id];
            const isTyping = typingUsers.has(user?._id);
            const isSelected = selectedClient?._id === user?._id;
            // const time = parseTimestamp(unreadData)?.time;
            // const date = parseTimestamp(unreadData)?.date;

            return (
              <Card
                key={user._id}
                onClick={() => onSelectChat(user)}
                sx={{
                  mb: 1,
                  cursor: 'pointer',
                  bgcolor: isSelected ? 'success.main' : isDark ? 'grey.800' : 'grey.200',
                  color: isSelected ? 'white' : isDark ? 'white' : 'black'
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                    p: 1.5
                  }}
                >
                  {/* Avatar + online dot */}
                  <Box position="relative">
                    <Avatar src={user?.picture || './Darshan.png'} sx={{ width: 40, height: 40 }} />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '70%',
                        left: '75%',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: onlineUsers.has(user._id) ? '#00e575' : 'grey.400'
                      }}
                    />
                  </Box>

                  {/* Middle (username + last message) */}
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden'
                    }}
                  >
                    <Typography fontWeight="bold" noWrap>
                      {user.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={isTyping ? '#00e575' : isDark ? 'grey.400' : 'grey.600'}
                      noWrap
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isTyping ? 'is typing...' : unreadData?.lastMessage || 'No messages'}
                    </Typography>
                  </Box>

                  {/* Right (time + count) */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      minWidth: 50
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        whiteSpace: 'nowrap',
                        mb: 0.5
                      }}
                    >
                      {unreadData?.timeStamp && parseTimestamp(unreadData.timeStamp)?.time}
                    </Typography>
                    {unreadData?.count > 0 && (
                      <Box
                        sx={{
                          bgcolor: 'success.main',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 12
                        }}
                      >
                        {unreadData.count}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>

      {/* Calls Section */}
      {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1">Calls</Typography>
        <Box display="flex" alignItems="center" gap={1} color="text.secondary">
          <Plus size={16} /> <Typography variant="caption">New Meet</Typography>
        </Box>
      </Box>

      <Divider /> */}

      {/* Footer */}
      {/* <Box mt="auto" pt={2}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Avatar src={pic?.picture} size={32} />
          <Typography variant="caption" fontStyle="italic">
            <AnimateText
              textHeight="auto"
              textSize="10px"
              texts={[`Welcome, ${pic.username}`, `Click on the avatar to update profile`]}
            />
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1} color="text.secondary">
          <Settings size={16} /> <Typography variant="caption">Settings</Typography>
        </Box>
      </Box> */}
    </Box>
  );
};

export default Sidebar;

// REACT-BOOTSTRAP COMPONENTS
// import './Sidebar.scss';
// import React, { useState, useEffect, useRef } from 'react';
// import { Form, InputGroup, ButtonGroup, Placeholder, Card } from 'react-bootstrap';
// import { Search, Sun, Moon, Plus, Settings } from 'lucide-react';
// import Avatar from './Avatar';
// import Button from './Button';
// import { useTheme } from './ThemeContext';
// import AnimateText from './AnimateText/AnimateText';

// const Sidebar = ({
//   onSelectChat,
//   pic,
//   loading,
//   error,
//   selectedClient,
//   unreadMap,
//   typingUsers,
//   contacts,
//   onlineUsers,
//   authenticatedUser
// }) => {
//   const { theme, toggleTheme } = useTheme();

//   const isDark = theme === 'dark';

//   const [tab, setTab] = useState('all');
//   const [search, setSearch] = useState('');
//   const [filteredUsers, setFilteredUsers] = useState(contacts);
//   const [focusedIndex, setFocusedIndex] = useState(0);
//   const itemRefs = useRef([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const inputRef = useRef(null); // to size dropdown

//   useEffect(() => {
//     const el = itemRefs.current[focusedIndex];
//     if (el) {
//       el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
//     }
//   }, [focusedIndex]);

//   useEffect(() => {
//     if (!search) {
//       setSearchResults([]);
//       return;
//     }

//     const filtered = filteredUsers.filter((user) =>
//       user.username?.toLowerCase().includes(search.toLowerCase())
//     );

//     setSearchResults(filtered);
//   }, [search, filteredUsers]);

//   useEffect(() => {
//     itemRefs.current = {};
//   }, [filteredUsers]);

//   const handleSort = () => {
//     setFilteredUsers((prev) =>
//       [...prev].sort((a, b) => (b.isOnline === true) - (a.isOnline === true))
//     );
//   };

//   useEffect(() => {
//     const online = contacts.filter((user) => onlineUsers.has(user._id));
//     const offline = contacts.filter((user) => !onlineUsers.has(user._id));

//     const sortedUsers = [
//       ...online.sort((a, b) => (b.isOnline === true) - (a.isOnline === true)),
//       ...offline
//     ];

//     setFilteredUsers(sortedUsers);
//   }, [contacts, onlineUsers, tab]);

//   const handleUserSelect = (user) => {
//     onSelectChat(user);
//     setSearch('');
//     setSearchResults([]);

//     // Scroll to user in main list
//     const el = itemRefs.current[user._id];
//     if (el) {
//       el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   };

//   const cardStyle = {
//     backgroundColor: isDark ? ' #2c2f33' : ' #f7fef2',
//     color: !isDark ? 'black' : 'white',
//     border: 'none',
//     marginBottom: '0.5rem',
//     cursor: 'pointer'
//   };
//   return (
//     <div
//       style={{
//         backgroundColor: isDark ? ' #1f1d1d' : ' #f7fef2',
//         color: isDark ? ' #f7fef2' : ' #1f1d1d'
//       }}
//       className={`${isDark ? 'bg-dark text-light' : 'bg-[ #f7fef2] text-[#000]'} p-3 d-flex flex-column`}
//     >
//       {/* Top Icons */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div style={{ color: '#00e575', fontSize: 30 }} className="fw-bold text-purple">
//           {'JUSTCHAT' || authenticatedUser?.username.toUpperCase().slice(0, 2)}
//         </div>
//         <div className="d-flex gap-2">
//           <Sun role="button" onClick={isDark && toggleTheme} />
//           <Moon role="button" onClick={!isDark && toggleTheme} />
//         </div>
//       </div>
//       {/* Search Bar */}
//       <InputGroup
//         style={{
//           border: isDark ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
//           borderRadius: 5
//         }}
//         className="mb-3"
//       >
//         <InputGroup.Text className={`${isDark ? 'bg-secondary' : 'bg-#f7fef2 '} border-0`}>
//           <Search size={16} />
//         </InputGroup.Text>
//         {/* <Form.Control
//           className={`${isDark ? 'bg-secondary' : 'bg-#ffff'} border-0`}
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         /> */}
//         <Form.Control
//           ref={inputRef}
//           className={`${isDark ? 'bg-secondary' : 'bg-white'} border-0`}
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setFocusedIndex(0); // reset focus
//           }}
//           onKeyDown={(e) => {
//             if (e.key === 'ArrowDown') {
//               e.preventDefault();
//               setFocusedIndex((prev) => (prev + 1) % searchResults.length);
//             } else if (e.key === 'ArrowUp') {
//               e.preventDefault();
//               setFocusedIndex((prev) => (prev === 0 ? searchResults.length - 1 : prev - 1));
//             } else if (e.key === 'Enter') {
//               e.preventDefault();
//               const user = searchResults[focusedIndex];
//               if (user) {
//                 onSelectChat(user);
//                 setSearch('');
//                 setSearchResults([]);
//                 handleUserSelect(user);
//               }
//             }
//           }}
//         />
//       </InputGroup>

//       {/* Dropdown list search */}

//       {search.length > 0 && searchResults.length > 0 && (
//         <div
//           style={{
//             position: 'absolute',
//             top: inputRef.current?.offsetTop + inputRef.current?.offsetHeight + 100 || 100,
//             left: inputRef.current?.offsetLeft + 50 || '5%',
//             zIndex: 1000,
//             backgroundColor: isDark ? '#2c2f33' : '#fff',
//             minWidth: inputRef.current?.offsetWidth + 50 || 300,
//             maxWidth: 500,
//             overflowY: 'auto',
//             maxHeight: 200,
//             border: '1px solid #ccc',
//             borderRadius: 8,
//             boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//           }}
//         >
//           {searchResults.map((user, index) => (
//             <div
//               key={user._id}
//               ref={(el) => (itemRefs.current[index] = el)}
//               className={`p-2 d-flex align-items-center ${
//                 index === focusedIndex ? 'bg-success text-white' : ''
//               }`}
//               onClick={() => {
//                 onSelectChat(user);
//                 setSearch('');
//                 setSearchResults([]);
//               }}
//               style={{
//                 cursor: 'pointer',
//                 borderBottom: '1px solid #eee'
//               }}
//             >
//               <Avatar src={user.picture || './Darshan.png'} size={30} className="me-2" />
//               <span>{user.username}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Message Section */}
//       <div
//         style={{ color: isDark ? 'white' : 'rgba(0, 0, 0, 0.9)' }}
//         className="d-flex justify-content-between align-items-center mb-2"
//       >
//         <h5 className="mb-0 d-none d-sm-block">Message</h5>
//         <ButtonGroup
//           className="d-none d-sm-flex"
//           style={{
//             gap: 8,
//             color: isDark ? 'white' : 'rgba(0, 0, 0, 0.9)'
//           }}
//         >
//           <Button
//             style={{
//               border: isDark ? '1px solid white' : '1px solid rgba(0, 0, 0, 0.3)',
//               borderRadius: 10,
//               color: isDark ? 'white' : tab === 'all' ? 'white' : 'rgba(0, 0, 0, 0.9)'
//             }}
//             variant={tab === 'all' ? 'secondary' : 'outline-light'}
//             onClick={() => setTab('all')}
//           >
//             All Chats
//           </Button>
//           <Button
//             style={{
//               border: isDark ? '1px solid white' : '1px solid rgba(0, 0, 0, 0.3)',
//               borderRadius: 10,
//               color: isDark ? 'white' : tab === 'groups' ? 'white' : 'rgba(0, 0, 0, 0.9)'
//             }}
//             variant={tab === 'groups' ? 'secondary' : 'outline-light'}
//             onClick={() => setTab('groups')}
//           >
//             Groups
//           </Button>
//           <Button
//             style={{
//               border: isDark ? '1px solid white' : '1px solid rgba(0, 0, 0, 0.3)',

//               borderRadius: 10,
//               color: isDark ? 'white' : tab === 'contacts' ? 'white' : 'rgba(0, 0, 0, 0.9)'
//             }}
//             variant={tab === 'contacts' ? 'secondary' : 'outline-light'}
//             onClick={() => {
//               setTab('contacts');
//               handleSort();
//             }}
//           >
//             Contacts
//           </Button>
//         </ButtonGroup>
//       </div>
//       <div className="overflow-scroll mb-3" style={{ maxHeight: '50vh' }}>
//         {loading ? (
//           Array.from({ length: 5 }).map((_, idx) => (
//             <Card key={idx} style={cardStyle}>
//               <Card.Body className="d-flex align-items-center">
//                 <Placeholder className="rounded-circle me-3" style={{ width: 40, height: 40 }} />
//                 <div className="flex-grow-1">
//                   <Placeholder xs={6} /> <br />
//                   <Placeholder xs={4} />
//                 </div>
//               </Card.Body>
//             </Card>
//           ))
//         ) : error ? (
//           <div className="text-danger">Error fetching contacts</div>
//         ) : (
//           filteredUsers.map((user, index) => {
//             const unreadData = unreadMap[user?._id];

//             const isTyping = typingUsers.has(user?._id);

//             return (
//               <div
//                 key={user?._id}
//                 ref={(el) => (itemRefs.current[user._id] = el)}
//                 onClick={() => onSelectChat(user)}
//                 className={`d-flex align-items-center justify-content-between rounded-3 mb-2 p-2 px-3
//                   ${isDark ? 'bg-secondary chat-dark' : 'bg-[rgba(0,0,0,0.8)] chat-light'}
//                   ${selectedClient?._id === user?._id ? 'bg-[ #00e575]' : 'bg-[rgba(0,0,0,0.8)]'}
//                 `}
//                 style={{
//                   cursor: 'pointer',
//                   backgroundColor: !isDark
//                     ? selectedClient?._id === user?._id && 'rgba(0, 0, 0, 0.5)'
//                     : selectedClient?._id === user?._id && 'rgba(255, 255, 255, 0.8)', //: !isDark && 'bg-secondary', //' rgba(252,198,104,0.9)' ,//' #00e575',
//                   color:
//                     selectedClient?._id === user?._id
//                       ? 'white'
//                       : isDark
//                         ? 'white'
//                         : 'rgba(0, 0, 0, 0.7)',
//                   border: '1px solid rgba(0, 0, 0, 0.7)',
//                   boxShadow: isDark ? '2px 2px 2px white' : '2px 2px -1px rgba(0, 0, 0, 0.3)'
//                 }}
//               >
//                 {/* Avatar & Status Dot */}
//                 <div className="d-flex align-items-center">
//                   <div className="position-relative me-3">
//                     <Avatar src={user?.picture || './Darshan.png'} size={40} />
//                     <div
//                       style={{
//                         position: 'absolute',
//                         top: '70%',
//                         left: '80%',
//                         borderRadius: '50%',
//                         width: 10,
//                         height: 10,
//                         backgroundColor: onlineUsers?.has(user._id) ? '#00e575' : 'white'
//                       }}
//                     ></div>
//                   </div>

//                   {/* Edit the display of unread Msg and timeStamp */}
//                   {/* Username & Message */}
//                   <div
//                     style={{
//                       display: 'flex',
//                       width: '100%',
//                       justifyContent: 'space-between',
//                       alignItems: 'flex-start',
//                       maxWidth: '500px'
//                     }}
//                   >
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <div
//                         style={{
//                           textAlign: 'left',
//                           display: 'flex',
//                           alignItems: 'flex-end',
//                           gap: 4
//                         }}
//                         className="fw-bold "
//                       >
//                         {user.username}
//                       </div>
//                       <div
//                         style={{
//                           color: !isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
//                           whiteSpace: 'nowrap',
//                           marginRight: -2,
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           textAlign: 'left',
//                           minWidth: 100,
//                           maxWidth: '100%'
//                         }}
//                         className={`small`}
//                       >
//                         {isTyping ? (
//                           <span style={{ color: isDark ? ' #00e575' : ' #00e575' }}>
//                             is typing...
//                           </span>
//                         ) : (
//                           <span
//                             style={
//                               {
//                                 // display: 'flex',
//                                 // justifyContent: 'space-between',
//                                 // alignItems: 'center',
//                                 // minWidth: 200,
//                                 // width: '100%'
//                               }
//                             }
//                           >
//                             {unreadData?.lastMessage ? unreadData?.lastMessage : 'No messages'}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <p style={{ width: 'auto', margin: 'auto' }}>
//                       {unreadData?.timeStamp && unreadData?.timeStamp}
//                     </p>
//                   </div>

//                   {/* /{unreadMap[user._id] > 0 && ( */}
//                   {/* <span className="badge bg-danger">{unreadMap[user._id]}</span> */}
//                   {/* )} */}
//                   {/* Unread Count Badge */}
//                   {unreadData?.count > 0 && (
//                     <div
//                       style={{
//                         display: 'flex',
//                         gap: 2,
//                         alignItems: 'center',
//                         position: 'relative',
//                         marginTop: -20
//                       }}
//                     >
//                       <span
//                         className="badge rounded-circle bg-success"
//                         style={{
//                           // display: 'inline-block',
//                           borderRadius: '100%',
//                           width: 30,
//                           height: 25,
//                           fontSize: 14,
//                           left: -20,
//                           textAlign: 'center',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center'
//                         }}
//                       >
//                         {unreadData.count}
//                       </span>
//                       <div style={{ position: 'absolute', top: -10, left: 17 }}>
//                         <Avatar src={'./pin.png'} size={20} />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Calls Section */}
//       <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
//         <h5 className="mb-0">Calls</h5>
//         <div className="d-flex align-items-center gap-1 text-muted">
//           <Plus size={16} /> <small>New Meet</small>
//         </div>
//       </div>

//       {/* Footer/Profile */}
//       <div className="mt-auto pt-3 border-top border-secondary">
//         <div className="d-flex align-items-center gap-2 mb-2">
//           <Avatar src={pic && pic.picture} size={32} />
//           {/* <span>{pic.username}</span> */}
//           <p style={{ fontStyle: 'italic', fontSize: 9 }}>
//             <AnimateText
//               textHeight="auto"
//               textSize="10px"
//               texts={[`Welcome, ${pic.username}`, `Click on the avatar to update profile`]}
//             />
//           </p>
//         </div>
//         <div className="d-flex align-items-center gap-2 text-muted cursor-pointer">
//           <Settings size={16} /> <small>Settings</small>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// CHAKRA UI REACT
// import React, { useState, useEffect } from 'react';
// import { Flex, Box, Text, Avatar, IconButton, Input, VStack } from '@chakra-ui/react';
// import { Moon, Sun, Search, Plus, Settings } from 'lucide-react';
// import { useTheme } from './ThemeContext';

// const Sidebar = ({
//   onSelectChat,
//   pic,
//   loading,
//   error,
//   selectedClient,
//   unreadMap,
//   typingUsers,
//   contacts,
//   onlineUsers
// }) => {
//   const { theme, toggleTheme } = useTheme();
//   const isDark = theme === 'dark';

//   const [search, setSearch] = useState('');
//   const [filteredUsers, setFilteredUsers] = useState(contacts || []);

//   useEffect(() => {
//     if (!search) return setFilteredUsers(contacts);
//     setFilteredUsers(
//       contacts.filter((u) => u.username?.toLowerCase().includes(search.toLowerCase()))
//     );
//   }, [search, contacts]);

//   return (
//     <Flex
//       direction="column"
//       p={3}
//       bg={isDark ? 'gray.900' : 'gray.50'}
//       color={isDark ? 'white' : 'black'}
//       h="100vh"
//     >
//       {/* Header */}
//       <Flex justify="space-between" align="center" mb={3}>
//         <Text fontWeight="bold" fontSize="lg" color="green.400">
//           JUSTCHAT
//         </Text>
//         <IconButton
//           icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
//           aria-label="Toggle Theme"
//           onClick={toggleTheme}
//           variant="ghost"
//           size="sm"
//         />
//       </Flex>

//       {/* Search */}
//       <Flex mb={3}>
//         <Search size={16} style={{ marginRight: 8 }} />
//         <Input
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           bg={isDark ? 'gray.800' : 'white'}
//           color={isDark ? 'white' : 'black'}
//           size="sm"
//         />
//       </Flex>

//       {/* Replace Divider */}
//       <Box h="1px" w="full" bg={isDark ? 'gray.700' : 'gray.300'} mb={3} />

//       {/* Contacts */}
//       <VStack spacing={2} overflowY="auto" flex={1}>
//         {loading ? (
//           Array.from({ length: 5 }).map((_, i) => (
//             <Box key={i} h="6" w="full" bg={isDark ? 'gray.700' : 'gray.300'} rounded="md" />
//           ))
//         ) : error ? (
//           <Text color="red.500">Error fetching contacts</Text>
//         ) : (
//           filteredUsers.map((user) => {
//             const unread = unreadMap[user._id];
//             const isTyping = typingUsers.has(user._id);
//             const isSelected = selectedClient?._id === user._id;

//             return (
//               <Flex
//                 key={user._id}
//                 align="center"
//                 justify="space-between"
//                 p={2}
//                 w="full"
//                 rounded="md"
//                 bg={isSelected ? 'green.400' : isDark ? 'gray.800' : 'gray.100'}
//                 color={isSelected ? 'white' : 'inherit'}
//                 cursor="pointer"
//                 onClick={() => onSelectChat(user)}
//               >
//                 <Flex align="center" gap={3}>
//                   <Box position="relative">
//                     <Avatar src={user.picture} name={user.username} size="sm" />
//                     <Box
//                       position="absolute"
//                       top="70%"
//                       left="75%"
//                       w={2.5}
//                       h={2.5}
//                       borderRadius="full"
//                       border="1px solid white"
//                       bg={onlineUsers.has(user._id) ? 'green.400' : 'gray.400'}
//                     />
//                   </Box>
//                   <Box>
//                     <Text fontWeight="bold">{user.username}</Text>
//                     <Text fontSize="xs" color="gray.400">
//                       {isTyping ? 'is typing...' : unread?.lastMessage || 'No messages'}
//                     </Text>
//                   </Box>
//                 </Flex>
//                 {unread?.count > 0 && (
//                   <Flex
//                     align="center"
//                     justify="center"
//                     w={5}
//                     h={5}
//                     borderRadius="full"
//                     bg="green.400"
//                     color="white"
//                     fontSize="xs"
//                   >
//                     {unread.count}
//                   </Flex>
//                 )}
//               </Flex>
//             );
//           })
//         )}
//       </VStack>

//       {/* Replace Divider */}
//       <Box h="1px" w="full" bg={isDark ? 'gray.700' : 'gray.300'} my={3} />

//       {/* Calls Section */}
//       <Flex justify="space-between" align="center" mb={2}>
//         <Text fontWeight="medium">Calls</Text>
//         <Flex align="center" gap={1} color="gray.400">
//           <Plus size={16} /> <Text fontSize="xs">New Meet</Text>
//         </Flex>
//       </Flex>

//       {/* Replace Divider */}
//       <Box h="1px" w="full" bg={isDark ? 'gray.700' : 'gray.300'} mb={3} />

//       {/* Profile */}
//       <Flex align="center" gap={2} mb={2}>
//         <Avatar src={pic?.picture} name="User" size="sm" />
//         <Text fontSize="sm">Your Profile</Text>
//       </Flex>

//       {/* Settings */}
//       <Flex align="center" gap={2} cursor="pointer" color="gray.400">
//         <Settings size={16} /> <Text fontSize="xs">Settings</Text>
//       </Flex>
//     </Flex>
//   );
// };

// export default Sidebar;
