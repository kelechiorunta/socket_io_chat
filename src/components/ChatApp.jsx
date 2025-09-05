import React, { useState, useEffect, memo } from 'react';
import { io } from 'socket.io-client';
// import { Container, Row, Col, Card, Placeholder } from 'react-bootstrap';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import IconBar from './IconBar';
import { useTheme } from './ThemeContext';
import { AUTH, GET_CONTACTS } from '../graphql/queries';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import { format, isToday, isYesterday } from 'date-fns';
import { MARK_MESSAGES_AS_READ, CLEAR_UNREAD, GET_UNREAD } from '../graphql/queries';
import SocketNotifications from './Notifications/SocketNotifications';
import { Box, Grid, Card, CardContent, Skeleton, Typography } from '@mui/material';
// import { ArrowLeft } from 'lucide-react';

const ChatApp = () => {
  // const client = useApolloClient();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [read, setRead] = useState(null);
  const {
    data: contacts,
    loading: contacts_loading,
    error: contacts_error
  } = useQuery(GET_CONTACTS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      console.log('Contacts updated!');
    }
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isOnline, setIsOnline] = useState(null);
  const [notifiedUser, setNotifiedUser] = useState(null);
  const [clearUnread] = useMutation(CLEAR_UNREAD);
  const [getUnread] = useLazyQuery(GET_UNREAD);
  // const [profileUser, setUpdatedProfileUser] = useState(null);s

  const [markMessagesAsRead] = useMutation(MARK_MESSAGES_AS_READ, {
    update(cache, { data, variables }) {
      const existing = cache.readQuery({ query: GET_CONTACTS });

      if (!existing || !variables?.senderId) return;

      const updatedUsers = existing.users.map((user) => {
        if (user._id === variables.senderId) {
          return {
            ...user,
            unread: [] // ✅ clear unread messages for this user
          };
        }
        return user;
      });

      cache.writeQuery({
        query: GET_CONTACTS,
        data: { users: updatedUsers }
      });
    }
  });

  const [authUser, setAuthUser] = useState(null);
  const { data, loading, error } = useQuery(AUTH, {
    fetchPolicy: 'network-only'
  });
  const user = data?.auth;
  const [signedUser, setSignedUser] = useState(data?.auth);
  const currentContacts = contacts?.users || null;
  const [typingUsers, setTypingUsers] = useState(new Set());

  const [unreadMap, setUnreadMap] = useState({});
  const [notificationMap, setNotificationMap] = useState({});

  useEffect(() => {
    if (!user || !contacts || contacts.length === 0) return;

    const fetchAllUnreadCounts = async () => {
      const unreadMapTemp = {};
      const notificationMapTemp = {};

      const promises = currentContacts.map(async (contact) => {
        try {
          const { data } = await getUnread({
            variables: {
              senderId: contact._id,
              recipientId: user._id
            }
          });

          const { count, lastMessage } = data?.getUnread || {};

          unreadMapTemp[contact._id] = { count: count || 0, lastMessage: lastMessage || '' };
          notificationMapTemp[contact._id] = lastMessage || '';
        } catch (err) {
          console.error(`❌ Failed to fetch unread count for ${contact?._id}`, err);
        }
      });

      await Promise.all(promises);

      setUnreadMap(unreadMapTemp);
      setNotificationMap(notificationMapTemp);
    };

    fetchAllUnreadCounts();
  }, [contacts, currentContacts, getUnread, user]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');

    if (!storedUser && user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setAuthUser(user);
    } else if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
    setSignedUser(user);
  }, [user]);

  useEffect(() => {
    // const host = window.location.hostname;
    const socketServerURL = 'https://socketiochat-production.up.railway.app';
    // : 'https://node-chat-app-ecru.vercel.app';

    const socketInstance = io(socketServerURL, {
      transports: ['websocket'],
      extraHeaders: ['Authorization', 'Content-Type'],
      withCredentials: true
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  //Broadcast message to receiver from sender
  const sendMessage = () => {
    if (socket && input.trim() && selectedChat) {
      const payload = {
        content: input,
        receiverId: selectedChat._id // make sure this matches backend user ID
      };

      socket.emit('sendMessage', payload);
      // setMessages(prev => [...prev, { text: input, from: 'client' }]);
      setInput('');
    }
  };

  const emitTyping = debounce((receiverId) => {
    if (socket && receiverId && user?._id) {
      socket.emit('typing', { receiverId });
    }
  }, 500);

  const handleTyping = (val) => {
    setInput(val);
    emitTyping(selectedChat?._id);
  };

  useEffect(() => {
    if (!socket || !user || !onlineUsers) return;

    onlineUsers.forEach((u) => {
      socket.emit('isOnline', { receiverId: u._id });
    });
  }, [socket, user, onlineUsers]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    // Emit login status and join
    socket.emit('isLoggedIn', { userId: user._id });
    socket.emit('signedIn', { userId: user._id });
    socket.emit('joinChat', { userId: user._id });

    if (selectedChat?._id) {
      socket.emit('isOnline', { receiverId: selectedChat._id, senderId: user._id });
    }

    socket.on('newMessage', (msg) => {
      const isSender = msg.sender?._id === selectedChat?._id;
      const isReceiver = msg.receiver?._id === selectedChat?._id;

      if (isSender || isReceiver) {
        setMessages((prev) => [...prev, msg]);
      } else {
        if (msg.sender?._id !== user?._id) {
          setUnreadMap((prev) => {
            const prevCount = prev[msg.sender?._id]?.count || 0;

            return {
              ...prev,
              [msg.sender?._id]: {
                count: prevCount + 1,
                lastMessage: msg.lastMessage || msg.content,
                timeStamp: formatDateLabel(msg.createdAt)
              }
            };
          });
        }
      }
    });

    socket.on('userOnline', ({ userId, online }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
      setIsOnline(online);
    });

    socket.on('currentlyOnline', ({ userIds, online }) => {
      setOnlineUsers(new Set(userIds));
      setIsOnline(online);
    });

    socket.on('userOffline', ({ userId }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    socket.on('isConnected', ({ currentUser }) => {
      setOnlineUsers((prev) => new Set(prev).add(currentUser));
    });

    socket.on('typing', ({ from }) => {
      setTypingUsers((prev) => new Set(prev).add(from));
      setTimeout(() => {
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(from);
          return updated;
        });
      }, 2000);
    });

    return () => {
      socket.off('newMessage');
      socket.off('userOnline');
      socket.off('userOffline');
      socket.off('isConnected');
      socket.off('typing');
    };
  }, [selectedChat?._id, socket, user?._id, currentContacts, selectedChat]); // ✅ Run only once

  useEffect(() => {
    if (!socket) return;
    socket.on('messagesMarkedAsRead', async ({ senderId }) => {
      const storedUser = localStorage.getItem('currentUser');
      if (senderId || storedUser) {
        await markMessagesAsRead({
          variables: { senderId: storedUser._id || senderId }
        });
        setRead(true);
      }
    });
    return () => {
      socket.off('messagesMarkedAsRead');
    };
  }, [markMessagesAsRead, socket]);

  useEffect(() => {
    if (!socket || !user?._id || selectedChat?._id) return;
    socket.emit('isLoggedIn', { userId: user._id || selectedChat._id });
    socket.emit('joinChat', { userId: user._id || selectedChat._id });
  }, [socket, user?._id, selectedChat?._id]);

  useEffect(() => {
    if (!socket || !selectedChat?._id) return;
    socket.emit('isOnline', { receiverId: selectedChat._id });
  }, [socket, selectedChat?._id]);

  useEffect(() => {
    // Step 1: Get contacts and online users
    const contactIds = currentContacts?.map((contact) => contact._id) || [];
    const onlineIds = Array.from(onlineUsers || new Set());

    // Step 2: Find online users NOT in contacts
    const unknownOnlineUsers = onlineIds.filter((id) => !contactIds.includes(id));

    // Step 3: Handle or set them (example: set the first unknown user)
    if (unknownOnlineUsers.length > 0) {
      const firstUnknownUserId = unknownOnlineUsers[0];
      setCurrentUser(firstUnknownUserId);
    } else {
      setCurrentUser(user);
    }
  }, [currentContacts, onlineUsers, user]);

  const handleSelectChat = async (chatUser) => {
    setSelectedChat(chatUser);
    setUnreadMap((prev) => {
      const updated = { ...prev };
      delete updated[chatUser?._id];
      return updated;
    });

    const storedUser = localStorage.getItem('currentUser');
    const onlineIds = onlineUsers && Array.from(onlineUsers);
    const knownOnlineUserId = onlineIds.find((id) => id === currentUser?._id);
    await clearUnread({
      variables: {
        senderId: chatUser?._id,
        recipientId: storedUser?._id || knownOnlineUserId || currentUser?._id
      }
    });
    if (socket && (storedUser || currentUser) && chatUser) {
      socket.emit('markAsRead', {
        senderId: chatUser?._id,
        receiverId: storedUser?._id || knownOnlineUserId || currentUser?._id
      });

      try {
        const res = await fetch(
          `/api/getChatHistory?userId=${chatUser?._id}&currentUserId=${currentUser?._id}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch chat history');
        }

        const history = await res.json();
        setMessages(history.messages);
        setNotifiedUser(history.notifiedUser);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    }
  };

  const formatDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const [mobileView, setMobileView] = useState('sidebar'); // start on sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // 🔥 Watch window resize and update `isMobile`
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // When chat is selected, switch automatically if on mobile
  const handleChatSelect = (chat) => {
    handleSelectChat(chat);
    if (isMobile) {
      setMobileView('chat');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        bgcolor: isDark ? 'grey.900' : 'grey.100',
        color: isDark ? 'grey.100' : 'grey.900'
      }}
    >
      <SocketNotifications socketInstance={socket} />

      <Grid container sx={{ height: '100%' }}>
        {/* IconBar Column */}
        <Grid
          item
          xs={mobileView === 'sidebar' ? 0 : 2}
          sm={1}
          md={1}
          lg={1}
          sx={{
            position: 'sticky',
            maxWidth: 60,
            borderRight: 1,
            borderColor: 'divider',
            display: mobileView === 'chat' ? 'none' : { xs: 'block', lg: 'block' }
          }}
        >
          <IconBar profile={signedUser} onUpdateProfile={setSignedUser} />
        </Grid>

        {/* Sidebar Column */}
        <Grid
          item
          xs={mobileView === 'sidebar' ? 10 : 0}
          sm={mobileView === 'sidebar' ? 10 : 0}
          md={mobileView === 'sidebar' ? 10 : 0}
          lg={5}
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            height: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
            p: 1,
            display: mobileView === 'sidebar' ? 'block' : { xs: 'none', lg: 'block' }
          }}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <Card key={idx} sx={{ mb: 1 }}>
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
            <Sidebar
              onSelectChat={handleChatSelect}
              pic={data && data.auth}
              authenticatedUser={authUser}
              selectedChat={selectedChat}
              isOnline={isOnline}
              notifiedUser={notifiedUser}
              loading={contacts_loading}
              error={contacts_error}
              isRead={read}
              contacts={contacts?.users || []}
              unreadMap={unreadMap}
              typingUsers={typingUsers}
              notificationMap={notificationMap}
              selectedClient={selectedChat}
              onlineUsers={onlineUsers}
            />
          )}
        </Grid>

        {/* Chat Column */}
        <Grid
          item
          xs={mobileView === 'chat' ? 12 : 0}
          sm={mobileView === 'chat' ? 11 : 0}
          md={mobileView === 'chat' ? 11 : 0}
          lg={6}
          sx={{
            height: '100%',
            display: mobileView === 'chat' ? 'flex' : { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {selectedChat ? (
            <>
              <ChatHeader
                chat={selectedChat}
                pic={data?.auth}
                selectedUser={selectedChat}
                onlineUsers={onlineUsers}
                showBackButton={window.innerWidth < 992}
                onBack={() => setMobileView('sidebar')}
              />
              <ChatBody
                messages={messages}
                chat={selectedChat}
                pic={data?.auth}
                typingUsers={typingUsers}
              />
              <ChatInput
                input={input}
                setInput={handleTyping}
                onSend={sendMessage}
                isMobile={isMobile}
              />
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.secondary'
              }}
            >
              Select a chat to start messaging
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
    // <Container
    //   fluid
    //   className={`${isDark ? 'bg-dark text-light' : 'bg-light text-black'} p-0`}
    //   style={{ height: '100vh', overflow: 'hidden' }}
    // >
    //   <SocketNotifications socketInstance={socket} />

    //   <Row className="h-100">
    //     {/* IconBar Column */}
    //     <Col
    //       xs={mobileView === 'sidebar' ? 0 : 2}
    //       sm={1}
    //       md={1}
    //       lg={1}
    //       style={{ position: 'sticky', maxWidth: 60 }}
    //       className={`p-0 border-end chat-iconbar ${
    //         mobileView === 'chat' ? 'd-none' : 'd-block d-lg-block'
    //       }`} // 👈 added hook
    //     >
    //       <IconBar profile={signedUser} onUpdateProfile={setSignedUser} />
    //     </Col>

    //     {/* Sidebar Column */}
    //     <Col
    //       xs={mobileView === 'sidebar' ? 10 : 0}
    //       sm={mobileView === 'sidebar' ? 10 : 0}
    //       md={mobileView === 'sidebar' ? 10 : 0}
    //       lg={5}
    //       className={`p-0 border-end h-100 chat-sidebar ${
    //         mobileView === 'sidebar' ? 'd-block' : 'd-none d-lg-block'
    //       }`}
    //       style={{
    //         overflowX: 'hidden',
    //         overflowY: 'auto',
    //         padding: 4,
    //         margin: mobileView === 'sidebar' ? 'auto' : 'auto',
    //         // width: '100%',
    //         maxWidth: '100vw'
    //       }}
    //     >
    //       {loading ? (
    //         Array.from({ length: 5 }).map((_, idx) => (
    //           <Card key={idx}>
    //             <Card.Body className="d-flex align-items-center">
    //               <Placeholder className="rounded-circle me-3" style={{ width: 40, height: 40 }} />
    //               <div className="flex-grow-1">
    //                 <Placeholder xs={6} /> <br />
    //                 <Placeholder xs={4} />
    //               </div>
    //             </Card.Body>
    //           </Card>
    //         ))
    //       ) : error ? (
    //         <div className="text-danger">Error fetching contacts</div>
    //       ) : (
    //         <Sidebar
    //           onSelectChat={handleChatSelect}
    //           pic={data && data.auth}
    //           authenticatedUser={authUser}
    //           selectedChat={selectedChat}
    //           isOnline={isOnline}
    //           notifiedUser={notifiedUser}
    //           loading={contacts_loading}
    //           error={contacts_error}
    //           isRead={read}
    //           contacts={contacts?.users || []}
    //           unreadMap={unreadMap}
    //           typingUsers={typingUsers}
    //           notificationMap={notificationMap}
    //           selectedClient={selectedChat}
    //           onlineUsers={onlineUsers}
    //         />
    //       )}
    //     </Col>

    //     {/* Chat Column */}
    //     <Col
    //       xs={mobileView === 'chat' ? 12 : 0}
    //       sm={mobileView === 'chat' ? 11 : 0}
    //       md={mobileView === 'chat' ? 11 : 0}
    //       lg={6}
    //       className={`h-100 flex-column chat-chatcol ${
    //         mobileView === 'chat' ? 'd-flex' : 'd-none d-lg-flex'
    //       }`}
    //       style={{ overflow: 'hidden' }}
    //     >
    //       {selectedChat ? (
    //         <>
    //           <ChatHeader
    //             chat={selectedChat}
    //             pic={data?.auth}
    //             selectedUser={selectedChat}
    //             onlineUsers={onlineUsers}
    //             showBackButton={window.innerWidth < 992}
    //             onBack={() => setMobileView('sidebar')}
    //           />
    //           <ChatBody
    //             messages={messages}
    //             chat={selectedChat}
    //             pic={data?.auth}
    //             typingUsers={typingUsers}
    //           />
    //           <ChatInput
    //             input={input}
    //             setInput={handleTyping}
    //             onSend={sendMessage}
    //             isMobile={isMobile}
    //           />
    //         </>
    //       ) : (
    //         <div className="h-100 d-flex justify-content-center align-items-center text-muted text-white">
    //           Select a chat to start messaging
    //         </div>
    //       )}
    //     </Col>
    //   </Row>
    // </Container>
  );
};

export default memo(ChatApp);

// import React, { memo } from 'react';
// import * as Separator from '@radix-ui/react-separator';
// import { useTheme } from './ThemeContext';
// import Sidebar from './Sidebar';
// import ChatHeader from './ChatHeader';
// import ChatBody from './ChatBody';
// import ChatInput from './ChatInput';
// import IconBar from './IconBar';
// import SocketNotifications from './Notifications/SocketNotifications';
// import { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import { AUTH, GET_CONTACTS } from '../graphql/queries';
// import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
// import debounce from 'lodash.debounce';
// import { format, isToday, isYesterday } from 'date-fns';
// import { MARK_MESSAGES_AS_READ, CLEAR_UNREAD, GET_UNREAD } from '../graphql/queries';

// const ChatApp = () => {
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [socket, setSocket] = useState(null);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState(new Set());
//   const [read, setRead] = useState(null);
//   const {
//     data: contacts,
//     loading: contacts_loading,
//     error: contacts_error
//   } = useQuery(GET_CONTACTS, {
//     fetchPolicy: 'cache-and-network',
//     onCompleted: (data) => {
//       console.log('Contacts updated!');
//     }
//   });
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isOnline, setIsOnline] = useState(null);
//   const [notifiedUser, setNotifiedUser] = useState(null);
//   const [clearUnread] = useMutation(CLEAR_UNREAD);
//   const [getUnread] = useLazyQuery(GET_UNREAD);
//   // const [profileUser, setUpdatedProfileUser] = useState(null);s

//   const [markMessagesAsRead] = useMutation(MARK_MESSAGES_AS_READ, {
//     update(cache, { data, variables }) {
//       const existing = cache.readQuery({ query: GET_CONTACTS });

//       if (!existing || !variables?.senderId) return;

//       const updatedUsers = existing.users.map((user) => {
//         if (user._id === variables.senderId) {
//           return {
//             ...user,
//             unread: [] // ✅ clear unread messages for this user
//           };
//         }
//         return user;
//       });

//       cache.writeQuery({
//         query: GET_CONTACTS,
//         data: { users: updatedUsers }
//       });
//     }
//   });

//   const [authUser, setAuthUser] = useState(null);
//   const { data } = useQuery(AUTH, {
//     fetchPolicy: 'network-only'
//   });
//   const user = data?.auth;
//   const [signedUser, setSignedUser] = useState(data?.auth);
//   const currentContacts = contacts?.users || null;
//   const [typingUsers, setTypingUsers] = useState(new Set());

//   const [unreadMap, setUnreadMap] = useState({});
//   const [notificationMap, setNotificationMap] = useState({});

//   useEffect(() => {
//     if (!user || !contacts || contacts.length === 0) return;

//     const fetchAllUnreadCounts = async () => {
//       const unreadMapTemp = {};
//       const notificationMapTemp = {};

//       const promises = currentContacts.map(async (contact) => {
//         try {
//           const { data } = await getUnread({
//             variables: {
//               senderId: contact._id,
//               recipientId: user._id
//             }
//           });

//           const { count, lastMessage } = data?.getUnread || {};

//           unreadMapTemp[contact._id] = { count: count || 0, lastMessage: lastMessage || '' };
//           notificationMapTemp[contact._id] = lastMessage || '';
//         } catch (err) {
//           console.error(`❌ Failed to fetch unread count for ${contact?._id}`, err);
//         }
//       });

//       await Promise.all(promises);

//       setUnreadMap(unreadMapTemp);
//       setNotificationMap(notificationMapTemp);
//     };

//     fetchAllUnreadCounts();
//   }, [contacts, currentContacts, getUnread, user]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('currentUser');

//     if (!storedUser && user) {
//       localStorage.setItem('currentUser', JSON.stringify(user));
//       setAuthUser(user);
//     } else if (storedUser) {
//       setAuthUser(JSON.parse(storedUser));
//     }
//     setSignedUser(user);
//   }, [user]);

//   useEffect(() => {
//     // const host = window.location.hostname;
//     const socketServerURL = 'https://socketiochat-production.up.railway.app';
//     // : 'https://node-chat-app-ecru.vercel.app';

//     const socketInstance = io(socketServerURL, {
//       transports: ['websocket'],
//       extraHeaders: ['Authorization', 'Content-Type'],
//       withCredentials: true
//     });

//     setSocket(socketInstance);

//     socketInstance.on('connect', () => {
//       console.log('Connected to Socket.IO server');
//     });

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   //Broadcast message to receiver from sender
//   const sendMessage = () => {
//     if (socket && input.trim() && selectedChat) {
//       const payload = {
//         content: input,
//         receiverId: selectedChat._id // make sure this matches backend user ID
//       };

//       socket.emit('sendMessage', payload);
//       // setMessages(prev => [...prev, { text: input, from: 'client' }]);
//       setInput('');
//     }
//   };

//   const emitTyping = debounce((receiverId) => {
//     if (socket && receiverId && user?._id) {
//       socket.emit('typing', { receiverId });
//     }
//   }, 500);

//   const handleTyping = (val) => {
//     setInput(val);
//     emitTyping(selectedChat?._id);
//   };

//   useEffect(() => {
//     if (!socket || !user || !onlineUsers) return;

//     onlineUsers.forEach((u) => {
//       socket.emit('isOnline', { receiverId: u._id });
//     });
//   }, [socket, user, onlineUsers]);

//   useEffect(() => {
//     if (!socket || !user?._id) return;

//     // Emit login status and join
//     socket.emit('isLoggedIn', { userId: user._id });
//     socket.emit('signedIn', { userId: user._id });
//     socket.emit('joinChat', { userId: user._id });

//     if (selectedChat?._id) {
//       socket.emit('isOnline', { receiverId: selectedChat._id, senderId: user._id });
//     }

//     socket.on('newMessage', (msg) => {
//       const isSender = msg.sender?._id === selectedChat?._id;
//       const isReceiver = msg.receiver?._id === selectedChat?._id;

//       if (isSender || isReceiver) {
//         setMessages((prev) => [...prev, msg]);
//       } else {
//         if (msg.sender?._id !== user?._id) {
//           setUnreadMap((prev) => {
//             const prevCount = prev[msg.sender?._id]?.count || 0;

//             return {
//               ...prev,
//               [msg.sender?._id]: {
//                 count: prevCount + 1,
//                 lastMessage: msg.lastMessage || msg.content,
//                 timeStamp: formatDateLabel(msg.createdAt)
//               }
//             };
//           });
//         }
//       }
//     });

//     socket.on('userOnline', ({ userId, online }) => {
//       setOnlineUsers((prev) => new Set(prev).add(userId));
//       setIsOnline(online);
//     });

//     socket.on('currentlyOnline', ({ userIds, online }) => {
//       setOnlineUsers(new Set(userIds));
//       setIsOnline(online);
//     });

//     socket.on('userOffline', ({ userId }) => {
//       setOnlineUsers((prev) => {
//         const updated = new Set(prev);
//         updated.delete(userId);
//         return updated;
//       });
//     });

//     socket.on('isConnected', ({ currentUser }) => {
//       setOnlineUsers((prev) => new Set(prev).add(currentUser));
//     });

//     socket.on('typing', ({ from }) => {
//       setTypingUsers((prev) => new Set(prev).add(from));
//       setTimeout(() => {
//         setTypingUsers((prev) => {
//           const updated = new Set(prev);
//           updated.delete(from);
//           return updated;
//         });
//       }, 2000);
//     });

//     return () => {
//       socket.off('newMessage');
//       socket.off('userOnline');
//       socket.off('userOffline');
//       socket.off('isConnected');
//       socket.off('typing');
//     };
//   }, [selectedChat?._id, socket, user?._id, currentContacts, selectedChat]); // ✅ Run only once

//   useEffect(() => {
//     if (!socket) return;
//     socket.on('messagesMarkedAsRead', async ({ senderId }) => {
//       const storedUser = localStorage.getItem('currentUser');
//       if (senderId || storedUser) {
//         await markMessagesAsRead({
//           variables: { senderId: storedUser._id || senderId }
//         });
//         setRead(true);
//       }
//     });
//     return () => {
//       socket.off('messagesMarkedAsRead');
//     };
//   }, [markMessagesAsRead, socket]);

//   useEffect(() => {
//     if (!socket || !user?._id || selectedChat?._id) return;
//     socket.emit('isLoggedIn', { userId: user._id || selectedChat._id });
//     socket.emit('joinChat', { userId: user._id || selectedChat._id });
//   }, [socket, user?._id, selectedChat?._id]);

//   useEffect(() => {
//     if (!socket || !selectedChat?._id) return;
//     socket.emit('isOnline', { receiverId: selectedChat._id });
//   }, [socket, selectedChat?._id]);

//   useEffect(() => {
//     // Step 1: Get contacts and online users
//     const contactIds = currentContacts?.map((contact) => contact._id) || [];
//     const onlineIds = Array.from(onlineUsers || new Set());

//     // Step 2: Find online users NOT in contacts
//     const unknownOnlineUsers = onlineIds.filter((id) => !contactIds.includes(id));

//     // Step 3: Handle or set them (example: set the first unknown user)
//     if (unknownOnlineUsers.length > 0) {
//       const firstUnknownUserId = unknownOnlineUsers[0];
//       setCurrentUser(firstUnknownUserId);
//     } else {
//       setCurrentUser(user);
//     }
//   }, [currentContacts, onlineUsers, user]);

//   const handleSelectChat = async (chatUser) => {
//     setSelectedChat(chatUser);
//     setUnreadMap((prev) => {
//       const updated = { ...prev };
//       delete updated[chatUser?._id];
//       return updated;
//     });

//     const storedUser = localStorage.getItem('currentUser');
//     const onlineIds = onlineUsers && Array.from(onlineUsers);
//     const knownOnlineUserId = onlineIds.find((id) => id === currentUser?._id);
//     await clearUnread({
//       variables: {
//         senderId: chatUser?._id,
//         recipientId: storedUser?._id || knownOnlineUserId || currentUser?._id
//       }
//     });
//     if (socket && (storedUser || currentUser) && chatUser) {
//       socket.emit('markAsRead', {
//         senderId: chatUser?._id,
//         receiverId: storedUser?._id || knownOnlineUserId || currentUser?._id
//       });

//       try {
//         const res = await fetch(
//           `/api/getChatHistory?userId=${chatUser?._id}&currentUserId=${currentUser?._id}`,
//           {
//             method: 'GET',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         if (!res.ok) {
//           throw new Error('Failed to fetch chat history');
//         }

//         const history = await res.json();
//         setMessages(history.messages);
//         setNotifiedUser(history.notifiedUser);
//       } catch (error) {
//         console.error('Error fetching chat history:', error);
//       }
//     }
//   };

//   const formatDateLabel = (date) => {
//     if (isToday(date)) return 'Today';
//     if (isYesterday(date)) return 'Yesterday';
//     return format(date, 'MMMM d, yyyy');
//   };
//   return (
//     <div className={`chat-app ${isDark ? 'dark' : 'light'}`}>
//       <SocketNotifications socketInstance={socket} />

//       {/* ===== Desktop / Tablet Layout ===== */}
//       <div className="layout-desktop">
//         {/* Left Sidebar */}
//         <div className="iconbar-container">
//           <IconBar profile={signedUser} onUpdateProfile={() => {}} />
//         </div>

//         <div className="sidebar-container">
//           <Sidebar
//             onSelectChat={handleSelectChat}
//             pic={data?.auth}
//             authenticatedUser={authUser}
//             selectedChat={selectedChat}
//             isOnline={isOnline}
//             notifiedUser={notifiedUser}
//             loading={contacts_loading}
//             error={contacts_error}
//             isRead={read}
//             contacts={contacts?.users || []}
//             unreadMap={unreadMap}
//             typingUsers={typingUsers}
//             notificationMap={notificationMap}
//             onlineUsers={onlineUsers}
//           />
//         </div>

//         {/* Chat Area */}
//         <div className="chat-area">
//           {selectedChat ? (
//             <>
//               <ChatHeader
//                 chat={selectedChat}
//                 pic={data?.auth}
//                 selectedUser={selectedChat}
//                 onlineUsers={onlineUsers}
//               />
//               <Separator.Root className="chat-separator" />
//               <ChatBody
//                 messages={messages}
//                 chat={selectedChat}
//                 pic={data?.auth}
//                 typingUsers={typingUsers}
//               />
//               <ChatInput input={input} setInput={handleTyping} onSend={sendMessage} />
//             </>
//           ) : (
//             <div className="chat-placeholder">Select a chat to start messaging</div>
//           )}
//         </div>
//       </div>

//       {/* ===== Mobile Layout ===== */}
//       <div className="layout-mobile">
//         {selectedChat ? (
//           <div className="chat-mobile">
//             <ChatHeader
//               chat={selectedChat}
//               pic={data?.auth}
//               selectedUser={selectedChat}
//               onlineUsers={onlineUsers}
//               onBack={() => handleSelectChat(null)} // 🔙 back to sidebar
//             />
//             <ChatBody
//               messages={messages}
//               chat={selectedChat}
//               pic={data?.auth}
//               typingUsers={typingUsers}
//             />
//             <ChatInput input={input} setInput={handleTyping} onSend={sendMessage} />
//           </div>
//         ) : (
//           <Sidebar
//             onSelectChat={handleSelectChat}
//             pic={data?.auth}
//             authenticatedUser={authUser}
//             selectedChat={selectedChat}
//             isOnline={isOnline}
//             notifiedUser={notifiedUser}
//             loading={contacts_loading}
//             error={contacts_error}
//             isRead={read}
//             contacts={contacts?.users || []}
//             unreadMap={unreadMap}
//             typingUsers={typingUsers}
//             notificationMap={notificationMap}
//             onlineUsers={onlineUsers}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default memo(ChatApp);
