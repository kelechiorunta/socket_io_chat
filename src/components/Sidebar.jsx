import './Sidebar.scss';
import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, ButtonGroup, Placeholder, Card } from 'react-bootstrap';
import { Search, Plus, Sun, Moon, Settings } from 'lucide-react';
import Avatar from './Avatar';
import Button from './Button';
import { useTheme } from './ThemeContext';

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
  const itemRefs = useRef([]);
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null); // to size dropdown

  useEffect(() => {
    const el = itemRefs.current[focusedIndex];
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
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

  useEffect(() => {
    itemRefs.current = {};
  }, [filteredUsers]);

  const handleSort = () => {
    setFilteredUsers((prev) =>
      [...prev].sort((a, b) => (b.isOnline === true) - (a.isOnline === true))
    );
  };

  useEffect(() => {
    const online = contacts.filter((user) => onlineUsers.has(user._id));
    const offline = contacts.filter((user) => !onlineUsers.has(user._id));

    const sortedUsers = [
      ...online.sort((a, b) => (b.isOnline === true) - (a.isOnline === true)),
      ...offline
    ];

    setFilteredUsers(sortedUsers);
  }, [contacts, onlineUsers, tab]);

  const handleUserSelect = (user) => {
    onSelectChat(user);
    setSearch('');
    setSearchResults([]);

    // Scroll to user in main list
    const el = itemRefs.current[user._id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // useEffect(() => {
  //   // Separate users by online status
  //   const online = contacts.filter((user) => onlineUsers.has(user._id));
  //   const offline = contacts.filter((user) => !onlineUsers.has(user._id));

  //   // Merge online first, then offline
  //   const allOnlineUsers = [...online];

  //   // Sort users based on their online activity
  //   const allUsers = [
  //     ...allOnlineUsers.sort((a, b) => {
  //       return (b.isOnline === true) - (a.isOnline === true);
  //     }),
  //     ...offline
  //   ];

  //   // Filter by search term
  //   const result = allUsers.filter((user) =>
  //     user.username?.toLowerCase().includes(search.toLowerCase())
  //   );

  //   setFilteredUsers(result);
  // }, [contacts, search, onlineUsers]);

  const cardStyle = {
    backgroundColor: isDark ? ' #2c2f33' : ' #f7fef2',
    color: !isDark ? 'black' : 'white',
    border: 'none',
    marginBottom: '0.5rem',
    cursor: 'pointer'
  };
  return (
    <div
      style={{
        backgroundColor: isDark ? ' #1f1d1d' : ' #f7fef2',
        color: isDark ? ' #f7fef2' : ' #1f1d1d'
      }}
      className={`${isDark ? 'bg-dark text-light' : 'bg-[ #f7fef2] text-[#000]'} p-3 d-flex flex-column`}
    >
      {/* Top Icons */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div style={{ color: '#00e575', fontSize: 30 }} className="fw-bold text-purple">
          {'JUSTCHAT' || authenticatedUser?.username.toUpperCase().slice(0, 2)}
        </div>
        <div className="d-flex gap-2">
          <Sun role="button" onClick={isDark && toggleTheme} />
          <Moon role="button" onClick={!isDark && toggleTheme} />
        </div>
      </div>
      {/* Search Bar */}
      <InputGroup
        style={{
          border: isDark ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: 5
        }}
        className="mb-3"
      >
        <InputGroup.Text className={`${isDark ? 'bg-secondary' : 'bg-#f7fef2 '} border-0`}>
          <Search size={16} />
        </InputGroup.Text>
        {/* <Form.Control
          className={`${isDark ? 'bg-secondary' : 'bg-#ffff'} border-0`}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}
        <Form.Control
          ref={inputRef}
          className={`${isDark ? 'bg-secondary' : 'bg-white'} border-0`}
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setFocusedIndex(0); // reset focus
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
              if (user) {
                onSelectChat(user);
                setSearch('');
                setSearchResults([]);
                handleUserSelect(user);
              }
            }
          }}
        />
      </InputGroup>

      {/* Dropdown list search */}

      {search.length > 0 && searchResults.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: inputRef.current?.offsetTop + inputRef.current?.offsetHeight + 100 || 100,
            left: inputRef.current?.offsetLeft + 50 || '5%',
            zIndex: 1000,
            backgroundColor: isDark ? '#2c2f33' : '#fff',
            minWidth: inputRef.current?.offsetWidth + 50 || 300,
            maxWidth: 500,
            overflowY: 'auto',
            maxHeight: 200,
            border: '1px solid #ccc',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {searchResults.map((user, index) => (
            <div
              key={user._id}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`p-2 d-flex align-items-center ${
                index === focusedIndex ? 'bg-success text-white' : ''
              }`}
              onClick={() => {
                onSelectChat(user);
                setSearch('');
                setSearchResults([]);
              }}
              style={{
                cursor: 'pointer',
                borderBottom: '1px solid #eee'
              }}
            >
              <Avatar src={user.picture || './Darshan.png'} size={30} className="me-2" />
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      )}

      {/* Message Section */}
      <div
        style={{ color: isDark ? 'white' : 'rgba(0, 0, 0, 0.9)' }}
        className="d-flex justify-content-between align-items-center mb-2"
      >
        <h5 className="mb-0 d-none d-sm-block">Message</h5>
        <ButtonGroup
          className="d-none d-sm-flex"
          style={{
            gap: 8,
            color: isDark ? 'white' : 'rgba(0, 0, 0, 0.9)'
          }}
        >
          <Button
            style={{
              border: isDark ? '1px solid white' : '1px solid rgba(0, 0, 0, 0.3)',
              borderRadius: 10,
              color: isDark ? 'white' : tab === 'all' ? 'white' : 'rgba(0, 0, 0, 0.9)'
            }}
            variant={tab === 'all' ? 'secondary' : 'outline-light'}
            onClick={() => setTab('all')}
          >
            All Chats
          </Button>
          <Button
            style={{
              border: isDark ? '1px solid white' : '1px solid rgba(0, 0, 0, 0.3)',
              borderRadius: 10,
              color: isDark ? 'white' : tab === 'groups' ? 'white' : 'rgba(0, 0, 0, 0.9)'
            }}
            variant={tab === 'groups' ? 'secondary' : 'outline-light'}
            onClick={() => setTab('groups')}
          >
            Groups
          </Button>
          <Button
            style={{
              border: isDark ? '1px solid white' : '1px solid rgba(0, 0, 0, 0.3)',
              borderRadius: 10,
              color: isDark ? 'white' : tab === 'contacts' ? 'white' : 'rgba(0, 0, 0, 0.9)'
            }}
            variant={tab === 'contacts' ? 'secondary' : 'outline-light'}
            onClick={() => {
              setTab('contacts');
              handleSort();
            }}
          >
            Contacts
          </Button>
        </ButtonGroup>
      </div>
      <div className="overflow-scroll mb-3" style={{ maxHeight: '50vh' }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <Card key={idx} style={cardStyle}>
              <Card.Body className="d-flex align-items-center">
                <Placeholder className="rounded-circle me-3" style={{ width: 40, height: 40 }} />
                <div className="flex-grow-1">
                  <Placeholder xs={6} /> <br />
                  <Placeholder xs={4} />
                </div>
              </Card.Body>
            </Card>
          ))
        ) : error ? (
          <div className="text-danger">Error fetching contacts</div>
        ) : (
          filteredUsers.map((user, index) => {
            const unreadData = unreadMap[user?._id];

            const isTyping = typingUsers.has(user?._id);

            return (
              <div
                key={user?._id}
                ref={(el) => (itemRefs.current[user._id] = el)}
                onClick={() => onSelectChat(user)}
                className={`d-flex align-items-center justify-content-between rounded-3 mb-2 p-2 px-3
                  ${isDark ? 'bg-secondary chat-dark' : 'bg-[rgba(0,0,0,0.8)] chat-light'}
                  ${selectedClient?._id === user?._id ? 'bg-[ #00e575]' : 'bg-[rgba(0,0,0,0.8)]'}
                `}
                style={{
                  cursor: 'pointer',
                  backgroundColor: !isDark
                    ? selectedClient?._id === user?._id && 'rgba(0, 0, 0, 0.5)'
                    : selectedClient?._id === user?._id && 'rgba(255, 255, 255, 0.8)', //: !isDark && 'bg-secondary', //' rgba(252,198,104,0.9)' ,//' #00e575',
                  color:
                    selectedClient?._id === user?._id
                      ? 'white'
                      : isDark
                        ? 'white'
                        : 'rgba(0, 0, 0, 0.7)',
                  border: '1px solid rgba(0, 0, 0, 0.7)'
                }}
              >
                {/* Avatar & Status Dot */}
                <div className="d-flex align-items-center">
                  <div className="position-relative me-3">
                    <Avatar src={user?.picture || './Darshan.png'} size={40} />
                    <div
                      style={{
                        position: 'absolute',
                        top: '70%',
                        left: '80%',
                        borderRadius: '50%',
                        width: 10,
                        height: 10,
                        backgroundColor: onlineUsers?.has(user._id) ? '#00e575' : 'white'
                      }}
                    ></div>
                  </div>

                  {/* Username & Message */}
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div
                        style={{
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'flex-end',
                          gap: 4
                        }}
                        className="fw-bold "
                      >
                        {user.username}
                      </div>
                      <div
                        style={{
                          color: !isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                          whiteSpace: 'nowrap',
                          marginRight: -2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textAlign: 'left',
                          minWidth: 100,
                          maxWidth: '100%'
                        }}
                        className={`small`}
                      >
                        {isTyping ? (
                          <span style={{ color: isDark ? ' #00e575' : ' #00e575' }}>
                            is typing...
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              minWidth: 200,
                              width: '100%'
                            }}
                          >
                            <p>
                              {unreadData?.lastMessage ? unreadData?.lastMessage : 'No messages'}
                            </p>
                            <p>{unreadData?.timeStamp && unreadData?.timeStamp}</p>
                          </span>
                        )}
                      </div>

                      {/* <p style={{ textAlign: 'left' }}>{onlineUsers?.has(user?._id) && isOnline ? 'Online' : 'Offline'}</p> */}
                    </div>
                  </div>

                  {/* /{unreadMap[user._id] > 0 && ( */}
                  {/* <span className="badge bg-danger">{unreadMap[user._id]}</span> */}
                  {/* )} */}
                  {/* Unread Count Badge */}
                  {unreadData?.count > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        position: 'relative',
                        marginTop: -20
                      }}
                    >
                      <span
                        className="badge rounded-circle bg-success"
                        style={{
                          // display: 'inline-block',
                          borderRadius: '100%',
                          width: 30,
                          height: 25,
                          fontSize: 14,
                          left: -20,
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {unreadData.count}
                      </span>
                      <div style={{ position: 'absolute', top: -10, left: 17 }}>
                        <Avatar src={'./pin.png'} size={20} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Calls Section */}
      <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
        <h5 className="mb-0">Calls</h5>
        <div className="d-flex align-items-center gap-1 text-muted">
          <Plus size={16} /> <small>New Meet</small>
        </div>
      </div>

      {/* <div className="overflow-auto" style={{ maxHeight: '30vh' }}> */}
      {/* {filteredUsers.map((user) => (
          <Card key={`call-${user._id}`} style={cardStyle}>
            <Card.Body className="d-flex align-items-center">
              <Avatar src={user.picture} size={40} className="me-3" />
              <div className="flex-grow-1">
                <div className="fw-bold">{user.username}</div>
                <div className="text-success small">
                  {user.isTalking ? `${user.username} is talking...` : user.lastSeen || 'Offline'}
                </div>
              </div>
              <div className="d-flex gap-2 text-muted">
                <Video size={16} />
                <Phone size={16} />
                <Plus size={16} />
              </div>
            </Card.Body>
          </Card>
        ))}
      </div> 

      {/* Footer/Profile */}
      <div className="mt-auto pt-3 border-top border-secondary">
        <div className="d-flex align-items-center gap-2 mb-2">
          <Avatar src={pic && pic.picture} size={32} />
          <span>Your Profile</span>
        </div>
        <div className="d-flex align-items-center gap-2 text-muted cursor-pointer">
          <Settings size={16} /> <small>Settings</small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
