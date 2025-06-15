// import React, { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { GET_CONTACTS } from '../graphql/queries';
// import {
//   Form,
//   InputGroup,
//   ButtonGroup,
//   ListGroup,
//   Placeholder,
// } from 'react-bootstrap';
// import {
//   Search, Video, Phone, Plus, Sun, Moon, Settings,
// } from 'lucide-react';
// import Avatar from './Avatar';
// import Button from './Button';

// const Sidebar = ({ onSelectChat }) => {
//   const { loading, error, data } = useQuery(GET_CONTACTS);
//   const [tab, setTab] = useState('all');
//   const [search, setSearch] = useState('');

//   const users = data?.users || [];
//   const groups = data?.groups || [];

//   const filteredChats = (tab === 'groups' ? groups : users).filter((chat) =>
//     chat.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div style={{ width: 'auto' }} className="bg-dark text-light p-3 d-flex flex-column h-100">
//       {/* Top Icons */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div className="fw-bold text-purple">D</div>
//         <div className="d-flex gap-2">
//           <Sun role="button" />
//           <Moon role="button" />
//         </div>
//       </div>

//       {/* Search Bar */}
//       <InputGroup className="mb-3">
//         <InputGroup.Text className="bg-secondary border-0">
//           <Search size={16} />
//         </InputGroup.Text>
//         <Form.Control
//           className="bg-secondary border-0 text-light"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </InputGroup>

//       {/* Tabs */}
//       <div className="d-flex justify-content-between align-items-center mb-2">
//         <h5 className="mb-0">Message</h5>
//         <ButtonGroup>
//           <Button variant={tab === 'all' ? 'primary' : 'outline-light'} onClick={() => setTab('all')}>All Chats</Button>
//           <Button variant={tab === 'groups' ? 'primary' : 'outline-light'} onClick={() => setTab('groups')}>Groups</Button>
//           <Button variant={tab === 'contacts' ? 'primary' : 'outline-light'} onClick={() => setTab('contacts')}>Contacts</Button>
//         </ButtonGroup>
//       </div>

//       {/* Chat List */}
//       <div className="overflow-auto mb-3" style={{ maxHeight: '30vh' }}>
//         <ListGroup variant="flush">
//           {loading ? (
//             // Skeleton loading UI
//             Array.from({ length: 5 }).map((_, idx) => (
//               <ListGroup.Item key={idx} className="bg-secondary text-light d-flex align-items-center">
//                 <Placeholder as="div" animation="glow">
//                   <Placeholder className="rounded-circle me-3" style={{ width: 40, height: 40 }} />
//                 </Placeholder>
//                 <div className="flex-grow-1">
//                   <Placeholder as="div" animation="glow">
//                     <Placeholder xs={6} />
//                   </Placeholder>
//                   <Placeholder as="div" animation="glow">
//                     <Placeholder xs={4} />
//                   </Placeholder>
//                 </div>
//               </ListGroup.Item>
//             ))
//           ) : error ? (
//             <ListGroup.Item className="bg-secondary text-danger">Error fetching contacts</ListGroup.Item>
//           ) : (
//             filteredChats.map((chat) => (
//               <ListGroup.Item
//                 key={chat._id}
//                 action
//                 onClick={() => onSelectChat(chat)}
//                 className="bg-secondary text-light d-flex align-items-center"
//               >
//                 <Avatar src={chat.picture || chat.avatar} size={40} className="me-3" />
//                 <div className="flex-grow-1">
//                   <div className="fw-bold">{chat.username || chat.name}</div>
//                   <div className="text-success small">
//                     {chat.typing ? 'Typing...' : chat.lastMessage || 'No messages'}
//                   </div>
//                 </div>
//                 {chat.unread && <span className="badge bg-success">{chat.unread}</span>}
//               </ListGroup.Item>
//             ))
//           )}
//         </ListGroup>
//       </div>

//       {/* Calls Section */}
//       <div className="d-flex justify-content-between align-items-center mb-2">
//         <h5 className="mb-0">Calls</h5>
//         <div className="d-flex align-items-center gap-1 text-muted">
//           <Plus size={16} /> <small>New Meet</small>
//         </div>
//       </div>
//       <div className="overflow-auto" style={{ maxHeight: '30vh' }}>
//         <ListGroup variant="flush">
//           {users.map((user) => (
//             <ListGroup.Item key={`call-${user._id}`} className="bg-secondary text-light d-flex align-items-center">
//               <Avatar src={user?.picture} size={40} className="me-3" />
//               <div className="flex-grow-1">
//                 <div className="fw-bold">{user.username}</div>
//                 <div className="text-success small">
//                   {user.isTalking ? `${user.username} is talking...` : user.lastSeen || 'Offline'}
//                 </div>
//               </div>
//               <div className="d-flex gap-2">
//                 <Video size={16} />
//                 <Phone size={16} />
//                 <Plus size={16} />
//               </div>
//             </ListGroup.Item>
//           ))}
//         </ListGroup>
//       </div>

//       {/* Footer/Profile */}
//       <div className="mt-auto pt-3 border-top border-secondary">
//         <div className="d-flex align-items-center gap-2 mb-2">
//           <Avatar src="./Darshan.png" size={32} />
//           <span>Your Profile</span>
//         </div>
//         <div className="d-flex align-items-center gap-2 text-muted cursor-pointer">
//           <Settings size={16} /> <small>Settings</small>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CONTACTS } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  InputGroup,
  ButtonGroup,
  Placeholder,
  Card,
} from 'react-bootstrap';
import {
  Search, Video, Phone, Plus, Sun, Moon, Settings,
} from 'lucide-react';
import Avatar from './Avatar';
import Button from './Button';

const Sidebar = ({ onSelectChat, pic }) => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_CONTACTS);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const users = data?.users || [];
  const groups = data?.groups || [];

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  const cardStyle = {
    backgroundColor: '#2c2f33',
    border: 'none',
    marginBottom: '0.5rem',
    cursor: 'pointer',
  };

  return (
    <div className="bg-dark text-light p-3 d-flex flex-column">
      {/* Top Icons */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fw-bold text-purple">D</div>
        <div className="d-flex gap-2">
          <Sun role="button" />
          <Moon role="button" />
        </div>
      </div>

      {/* Search Bar */}
      <InputGroup className="mb-3">
        <InputGroup.Text className="bg-secondary border-0">
          <Search size={16} />
        </InputGroup.Text>
        <Form.Control
          className="bg-secondary border-0 text-light"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {/* Message Section */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Message</h5>
        <ButtonGroup>
          <Button variant={tab === 'all' ? 'primary' : 'outline-light'} onClick={() => setTab('all')}>All Chats</Button>
          <Button variant={tab === 'groups' ? 'primary' : 'outline-light'} onClick={() => setTab('groups')}>Groups</Button>
          <Button variant={tab === 'contacts' ? 'primary' : 'outline-light'} onClick={() => setTab('contacts')}>Contacts</Button>
        </ButtonGroup>
      </div>

      <div className="overflow-scroll mb-3" style={{  maxHeight: '50vh' }}>
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
            filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => onSelectChat(user)}
                  className="d-flex align-items-center justify-content-between bg-secondary rounded-3 mb-2 p-2 px-3"
                  style={{ cursor: 'pointer' }}
                >
                  {/* Avatar & Status Dot */}
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-3">
                      <Avatar src={user?.picture || user.avatar} size={40} />
                      {user.online && (
                        <span
                          className="position-absolute bottom-0 end-0 translate-middle p-1 bg-success border border-light rounded-circle"
                          style={{ width: '10px', height: '10px' }}
                        ></span>
                      )}
                    </div>
              
                    {/* Username & Message */}
                    <div>
                      <div className="fw-bold text-white">{user.username}</div>
                      <div className="text-muted small">
                        {user.typing ? 'Typing...' : user.lastMessage || 'No messages'}
                      </div>
                    </div>
                  </div>
              
                  {/* Unread Count Badge */}
                  {user.unread > 0 && (
                    <span className="badge rounded-circle bg-success text-white">
                      {user.unread}
                    </span>
                  )}
                </div>
              ))              
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

