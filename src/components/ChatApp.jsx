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

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Container, Row, Col, Card, Placeholder } from 'react-bootstrap';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import IconBar from './IconBar';
import { AUTH } from '../graphql/queries';
import { useQuery } from '@apollo/client';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null); // ✅ new
  const { data, loading, error } = useQuery(AUTH);
  const user = data?.auth || null

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

useEffect(() => {
   
    if (socket) {
        socket.on('newMessage', (msg) => {
        console.log('📩 New message received:', msg);
        setMessages((prev) => [...prev, msg]);
        });
    }
      
    if (socket && user?._id) {
        socket.emit('joinChat', { userId: user?._id });
    }

    return () => {
        socket?.off('newMessage');
    };
  }, [socket, user?._id]);
  
    
const handleSelectChat = async (chatUser) => {
       
    setSelectedChat(chatUser);
      
        try {
          const res = await fetch(`http://localhost:7334/api/getChatHistory?userId=${chatUser?._id}`, {
            method: 'GET',
            credentials: 'include', // 👈 important for sending cookies
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!res.ok) {
            throw new Error('Failed to fetch chat history');
          }
      
          const history = await res.json();
          setMessages(history.messages);
        } catch (error) {
          console.error('Error fetching chat history:', error);
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
        <Col xs={10} sm={10} md={10} lg={4} style={{marginLeft:30, overflowX: 'hidden'}} className="p-0 border-end ">
          <Sidebar onSelectChat={handleSelectChat} pic={data && data.auth}/>
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
            <ChatHeader chat={selectedChat} pic={data?.auth} />
            <ChatBody messages={messages} chat={selectedChat} pic={data?.auth}/>
            <ChatInput input={input} setInput={setInput} onSend={sendMessage} />
        </Col>
                
          
          )
        }
        
      </Row>
    </Container>
  );
};

export default ChatApp;

