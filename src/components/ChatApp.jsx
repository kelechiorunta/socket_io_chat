import React, { useState, useEffect, memo } from 'react';
import { io } from 'socket.io-client';
import { Container, Row, Col, Card, Placeholder } from 'react-bootstrap';
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
import LoginNotification from './Notifications/LoginNotification';
import LogoutNotification from './Notifications/LogoutNotification';

const ChatApp = () => {
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
      console.log('Contacts updated!', data);
    }
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isOnline, setIsOnline] = useState(null);
  const [notifiedUser, setNotifiedUser] = useState(null);
  const [clearUnread] = useMutation(CLEAR_UNREAD);
  const [getUnread] = useLazyQuery(GET_UNREAD);

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
      console.log(`storedUser is ${JSON.parse(storedUser)}`);
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
      console.log('✅ Connected to Socket.IO server');
    });

    // socketInstance.on('LoggingIn', ({ status, loggedInUser }) => {
    //   alert(`Welcome, ${loggedInUser?.username}`);
    // });

    return () => {
      // socketInstance.off('LoggingIn');
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
      console.log('Emitted typing to', receiverId);
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
      socket.off('LoggingIn');
      socket.off('LoggingOut');
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

  // Then use separate effects for `user` or `selectedChat` dependent emissions:
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
      setCurrentUser(firstUnknownUserId); // or fetch details from server if needed
    } else {
      setCurrentUser(user); // fallback
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

  return (
    <Container
      fluid
      className={`${isDark ? 'bg-dark text-light' : 'bg-light text-black'} p-0`}
      style={{ height: 'max-content', overflowY: 'auto', overflowX: 'hidden' }}
    >
      <LoginNotification socketInstance={socket} />
      <LogoutNotification socketInstance={socket} />
      <Row className="h-100 flex-xs-row flex-md-row flex-sm-row flex-lg-row">
        {/* IconBar Column */}
        <Col
          xs={1}
          sm={1}
          md={1}
          lg={1}
          style={{ position: 'sticky', maxWidth: 50 }}
          className="p-0 border-end"
        >
          {/* <IconBar pic={data && data.auth}/> */}
          <IconBar profile={signedUser} onUpdateProfile={setSignedUser} />
        </Col>

        {/* Sidebar Column */}
        <Col
          xs={10}
          sm={10}
          md={10}
          lg={5}
          style={{ margin: 'auto', marginLeft: 20, paddingLeft: 20, overflowX: 'hidden' }}
          className=" border-end "
        >
          <Sidebar
            onSelectChat={handleSelectChat}
            pic={data && data.auth}
            authenticatedUser={authUser}
            selectedChat={selectedChat}
            // typingUserId={typingUserId}
            isOnline={isOnline}
            notifiedUser={notifiedUser}
            loading={contacts_loading}
            error={contacts_error}
            isRead={read}
            // isActiveRecipient={isActive}
            contacts={contacts?.users || []}
            unreadMap={unreadMap}
            typingUsers={typingUsers}
            notificationMap={notificationMap}
            selectedClient={selectedChat}
            onlineUsers={onlineUsers}
          />
        </Col>

        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <Card key={idx}>
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
          <Col
            style={{
              borderRadius: 20,
              padding: 'auto 100px',
              width: '100%',
              display: 'flex',
              overflowX: 'hidden',
              overflowY: 'scroll',
              maxHeight: '100vh'
            }}
            xs={10}
            sm={10}
            md={11}
            lg
            className="justify-content-end d-flex flex-column"
          >
            <ChatHeader
              chat={selectedChat}
              pic={data?.auth}
              selectedUser={selectedChat}
              // typingUserId={typingUserId}
              onlineUsers={onlineUsers}
            />
            <ChatBody
              messages={messages}
              chat={selectedChat}
              pic={data?.auth}
              // typingUserId={typingUserId}
            />
            <ChatInput input={input} setInput={handleTyping} onSend={sendMessage} />
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default memo(ChatApp);
