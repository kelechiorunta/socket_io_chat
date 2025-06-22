// import React, { useState, useEffect } from 'react'
// import { io } from 'socket.io-client'

// const ChatApp = () => {
//     const [messages, setMessages] = useState([{ text: '', from: 'client' || 'server' }]);
//     const [input, setInput] = useState({ from: 'client', chat: '' });
//     const [socket, setSocket] = useState(null);

//     useEffect(() => {
//         const connectWebSocket = () => {
//             const host = window.location.hostname;
//             // const ws = new WebSocket(
//             //     host === 'localhost'
//             //         ? 'ws://localhost:7334'
//             //         : 'wss://node-chat-app-ecru.vercel.app'
//             // );
//             const ws = io('ws://localhost:7334');

//             setSocket(ws);

//             ws.on('connection', () => {
//                 console.log('Connected to io server')
//             })

//             // ws.onopen = () => {
//             //     console.log('Connected to WebSocket server');
//             // };

//             // ws.onmessage = (event) => {
//             //     const data = event.data;
//             //     console.log('Received:', data);
//             //     setMessages(prev => [...prev, { text: data, from: 'server' }]);
//             // };

//             // ws.onclose = () => {
//             //     setTimeout(() => connectWebSocket(), 5000);
//             // };

//             // ws.onerror = (error) => {
//             //     console.error('WebSocket error:', error);
//             // };
//         };

//         connectWebSocket();
//     }, []);

//     const sendMessage = () => {
//         if (socket && input.chat.trim()) {
//             socket.send(input.chat);
//             setMessages(prev => [...prev, { text: input.chat, from: 'client' }]);
//             setInput({ from: 'client', chat: '' });
//         }
//     };

//     return (
//         <div>
//             <h1>Chat App</h1>
//             <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                 {messages.map((msg, index) => (
//                     <li
//                         key={index}
//                         style={{
//                             alignSelf: msg.from === 'client' ? 'flex-end' : 'flex-start',
//                             backgroundColor: msg.from === 'client' ? '#dcf8c6' : '#eee',
//                             padding: '12px 16px',
//                             borderRadius: '12px',
//                             maxWidth: '60%',
//                             margin: '4px 0',
//                         }}
//                     >
//                         {msg.text}
//                     </li>
//                 ))}
//             </ul>
//             <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
//                 <input
//                     type="text"
//                     value={input.chat}
//                     onChange={(e) =>
//                         setInput({ from: 'client', chat: e.target.value })
//                     }
//                     placeholder="Type your message"
//                     style={{ flex: 1, padding: '8px' }}
//                 />
//                 <button onClick={sendMessage}>Send</button>
//             </div>
//         </div>
//     );
// };


// export default ChatApp

// import React, { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import Sidebar from './Sidebar';

// const ChatApp = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const [socket, setSocket] = useState(null);

//     useEffect(() => {
//         const host = window.location.hostname;
//         const socketServerURL =
//             host === 'localhost'
//                 ? 'http://localhost:7334'
//                 : 'https://node-chat-app-ecru.vercel.app';

//         const socketInstance = io(socketServerURL, {
//             transports: ['websocket'], // ensure upgrade to WebSocket
//             withCredentials: true
//         });

//         setSocket(socketInstance);

//         socketInstance.on('connect', () => {
//             console.log('✅ Connected to Socket.IO server');
//         });

//         socketInstance.on('message', (data) => {
//             console.log('📩 Message received:', data);
//             setMessages((prev) => [...prev, { text: data, from: 'server' }]);
//         });

//         socketInstance.on('disconnect', () => {
//             console.log('❌ Disconnected from server');
//         });

//         socketInstance.on('connect_error', (err) => {
//             console.error('Socket.IO connection error:', err.message);
//         });

//         return () => {
//             socketInstance.disconnect();
//         };
//     }, []);

//     const sendMessage = () => {
//         if (socket && input.trim()) {
//             socket.emit('message', input, (ackMessage) => {
//                 console.log('Server acknowledged:', ackMessage);
//             });            
//             setMessages((prev) => [...prev, { text: input, from: 'client' }]);
//             setInput('');
//         }
//     };

//     return (
//         <div style={{ display: 'flex', height: '100vh', width: '100%', padding: 20 }}>
//             {/* <h1>Chat App</h1> */}
//             <Sidebar />
            
//             <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', height:'100vh' }}>
//                 {messages.map((msg, index) => (
//                     <li
//                         key={index}
//                         style={{
//                             alignSelf: msg.from === 'client' ? 'flex-end' : 'flex-start',
//                             backgroundColor: msg.from === 'client' ? '#dcf8c6' : '#eee',
//                             padding: '12px 16px',
//                             borderRadius: '12px',
//                             maxWidth: '60%',
//                             margin: '4px 0',
//                         }}
//                     >
//                         {msg.text}
//                     </li>
//                 ))}
//                 <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Type your message"
//                     style={{ flex: 1, padding: '8px' }}
//                 />
//                 <button onClick={sendMessage}>Send</button>
//             </div>
//             </ul>
            
//         </div>
//     );
// };

// export default ChatApp;

import React, { useState, useEffect, memo, useMemo } from 'react';
import { io } from 'socket.io-client';
import { Container, Row, Col, Card, Placeholder } from 'react-bootstrap';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import IconBar from './IconBar';
import { AUTH, GET_CONTACTS } from '../graphql/queries';
import { useQuery, useMutation } from '@apollo/client';
import debounce from 'lodash.debounce';
// import socketInstance from './socket_client.js';
import { MARK_MESSAGES_AS_READ, CREATE_UNREAD, CLEAR_UNREAD } from '../graphql/queries';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null); 
  const [typingUserId, setTypingUserId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [read, setRead] = useState(null);
  const { data: contacts, loading: contacts_loading, error: contacts_error, refetch } = useQuery(GET_CONTACTS, {
      fetchPolicy: 'cache-and-network',
      onCompleted: (data) => {
        // You can do something like sync avatars, badges, etc.
        console.log('Contacts updated!', data);
      },
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isOnline, setIsOnline] = useState(null);
  const [notifiedUser, setNotifiedUser] = useState(null);
  const [createUnread] = useMutation(CREATE_UNREAD);
  const [clearUnread] = useMutation(CLEAR_UNREAD);
  
const [markMessagesAsRead] = useMutation(MARK_MESSAGES_AS_READ, {
    update(cache, { data, variables }) {
      const existing = cache.readQuery({ query: GET_CONTACTS });
  
      if (!existing || !variables?.senderId) return;
  
      const updatedUsers = existing.users.map(user => {
        if (user._id === variables.senderId) {
          return {
            ...user,
            unread: [], // ✅ clear unread messages for this user
          };
        }
        return user;
      });
  
      cache.writeQuery({
        query: GET_CONTACTS,
        data: { users: updatedUsers },
      });
    },
  });
  

    //   const [onlineUser, setOnlineUser] = useState(null)
    const [authUser, setAuthUser] = useState(null);
    const { data, loading, error, refetch: refetchAuth } = useQuery(AUTH, {
      fetchPolicy: 'network-only'
  });
    const user = data?.auth 
    const currentContacts = contacts?.users || null

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
    
        if ((!storedUser) && user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            setAuthUser(user);
        } else if (storedUser) {
            console.log(`storedUser is ${JSON.parse(storedUser)}`)
            setAuthUser(JSON.parse(storedUser));
        }
    }, [user]);

  useEffect(() => {
    const host = window.location.hostname;
    const socketServerURL =
      host === 'localhost'
        ? 'http://localhost:7334'
        : 'https://node-chat-app-ecru.vercel.app';

    const socketInstance = io(socketServerURL, {
        transports: ['websocket'],
        extraHeaders: ['Authorization', 'Content-Type'], 
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
        console.log('✅ Connected to Socket.IO server');
        
    });
    // socketInstance.on('message', (data) => {
    //   setMessages((prev) => [...prev, { text: data, from: 'server' }]);
    // });

    return () => socketInstance.disconnect();
  }, []);
    
    //Broadcast message to receiver from sender 
const sendMessage = () => {
  if (socket && input.trim() && selectedChat) {
    const payload = {
      content: input,
      receiverId: selectedChat._id, // make sure this matches backend user ID
    };

    socket.emit('sendMessage', payload);
    // setMessages(prev => [...prev, { text: input, from: 'client' }]);
    setInput('');
  }
};

    // Emit typing to the receiver
    // 🔁 Debounced typing emitter
const emitTyping = debounce(() => {
    if (socket && selectedChat?._id && user?._id) {
        socket.emit('typing', { receiverId: selectedChat._id });
        console.log("I am typing")
    }
}, 500); // Adjust debounce delay as needed
    
    const handleTyping = (val) => {
        setInput(val);
        emitTyping()
}
  
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
      socket.emit('isOnline', { receiverId: selectedChat._id });
    }
  
    // // Set up listeners ONCE
    // socket.on('newMessage', (msg) => {
    //     console.log('📩 New message received:', msg);
    //     // if (selectedChat && (selectedChat?._id === msg.receiver?._id)) {
    //         alert('hello')
    //         setMessages((prev) => [...prev, msg]);
    //     // }
     
    // });
  
    socket.on('newMessage', (msg) => {
        console.log('📩 New message received:', msg);
      
        // Show message only if it matches the currently selected chat
        const isSender = msg.sender?._id === selectedChat?._id;
        const isReceiver = msg.receiver?._id === selectedChat?._id;
      
        if (isSender || isReceiver) {
          setMessages((prev) => [...prev, msg]);
        } else {
          console.log('Message not for currently selected chat, ignoring');
        }
      });
      
    socket.on('userOnline', ({ userId, online }) => {
        setOnlineUsers((prev) => new Set(prev).add(userId));
        setIsOnline(online)
    });
  
    socket.on('currentlyOnline', ({ userIds, online }) => {
        setOnlineUsers(new Set(userIds));
        setIsOnline(online)
    });
    
    socket.on('userOffline', ({ userId }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
        // setSelectedChat(null)
    });
  
    socket.on('isConnected', ({ currentUser }) => {
      setOnlineUsers((prev) => new Set(prev).add(currentUser));
    });
  
    socket.on('typing', ({ from }) => {
      if (from === selectedChat?._id) {
        setTypingUserId(from);
        setTimeout(() => setTypingUserId(null), 2000);
      }
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
            if (senderId || storedUser ) {
              await markMessagesAsRead({
                  variables: { senderId: storedUser._id || senderId },
              });
              setRead(true)   
            }
        });
        return () => {
            socket.off('messagesMarkedAsRead');
          };
    }, [markMessagesAsRead, socket])
  
  // Then use separate effects for `user` or `selectedChat` dependent emissions:
  useEffect(() => {
    if (!socket || !user?._id || selectedChat?._id) return;
    socket.emit('isLoggedIn', { userId: user._id || selectedChat._id });
    socket.emit('joinChat', { userId: user._id || selectedChat._id });
  }, [socket, user?._id, selectedChat?._id]);
  
  useEffect(() => {
    if (!socket || !selectedChat?._id) return;
      socket.emit('isOnline', { receiverId: selectedChat._id });
      
  }, [socket, selectedChat?._id ]);
  
    useEffect(() => {
           
        // Step 1: Get contacts and online users
        const contactIds = currentContacts?.map(contact => contact._id) || [];
        const onlineIds = Array.from(onlineUsers || new Set());

        // Step 2: Find online users NOT in contacts
        const unknownOnlineUsers = onlineIds.filter(id => !contactIds.includes(id));

        // Step 3: Handle or set them (example: set the first unknown user)
        if (unknownOnlineUsers.length > 0) {
            const firstUnknownUserId = unknownOnlineUsers[0];
            setCurrentUser(firstUnknownUserId); // or fetch details from server if needed
        } else {
            setCurrentUser(user); // fallback
        }
    }, [currentContacts, onlineUsers, user])
    
    
  const handleSelectChat = async (chatUser) => {
    setSelectedChat(chatUser);
      const storedUser = localStorage.getItem('currentUser');
      const onlineIds = onlineUsers && Array.from(onlineUsers);
      const knownOnlineUserId = onlineIds.find(id => id === currentUser?._id)
      if (socket && (storedUser || currentUser) && chatUser) {
        
            socket.emit('markAsRead', {
              senderId: chatUser?._id,
              receiverId: storedUser?._id || knownOnlineUserId || currentUser?._id,
            });
          
          
            try {
        
                const res = await fetch(
                  `http://localhost:7334/api/getChatHistory?userId=${chatUser?._id}&currentUserId=${currentUser?._id}`,
                  {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                );
            
                if (!res.ok) {
                  throw new Error('Failed to fetch chat history');
                }
            
                const history = await res.json();
                setMessages(history.messages);
                setNotifiedUser(history.notifiedUser)

              
              } catch (error) {
                console.error('Error fetching chat history:', error);
              }      
        }        
  };   

  return (
    <Container fluid className="bg-dark text-light p-0" style={{ height: 'max-content', overflowY: 'auto', overflowX: 'hidden' }}>
      <Row className="h-100 flex-xs-row flex-md-row flex-sm-row flex-lg-row">
        {/* IconBar Column */}
        <Col xs={1} sm={1} md={1} lg={1} style={{position: 'sticky'}} className="p-0 border-end">
          <IconBar pic={data && data.auth}/>
        </Col>

        {/* Sidebar Column */}
        <Col xs={10} sm={10} md={10} lg={5} style={{margin:'auto', overflowX: 'hidden'}} className=" border-end ">
                  <Sidebar onSelectChat={handleSelectChat} pic={(data && data.auth)}
                      authenticatedUser={authUser}
                      selectedChat={selectedChat}
                      typingUserId={typingUserId}
                      isOnline={isOnline}
                      notifiedUser={notifiedUser}
                      loading={contacts_loading}
                      error={contacts_error}
                      isRead={read}
                      contacts={contacts?.users || []}
                      onlineUsers={onlineUsers} />
        </Col>

        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <Card key={idx} >
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
        <Col style={{
                borderRadius: 20, padding: 'auto 100px', width: '100%',
                display: 'flex', overflowX: 'hidden', overflowY: 'scroll',
                maxHeight:'100vh'
                          }}
            xs={10} sm={10} md={11} lg className="justify-content-end d-flex flex-column">
            <ChatHeader chat={selectedChat} pic={data?.auth} selectedUser={selectedChat}
                        typingUserId={typingUserId}
                        onlineUsers={onlineUsers} />
            <ChatBody messages={messages} chat={selectedChat} pic={data?.auth} typingUserId={typingUserId}/>
            <ChatInput input={input} setInput={handleTyping} onSend={sendMessage} />
        </Col>
                
          
          )
        }        
      </Row>
    </Container>
  );
};

export default memo(ChatApp);

