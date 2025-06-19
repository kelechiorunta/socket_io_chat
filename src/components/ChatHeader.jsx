import React from 'react';
import { Video, Phone } from 'lucide-react';
import { Container, Image } from 'react-bootstrap';
import Avatar from './Avatar';

const ChatHeader = ({ username = "Darshan Zalavadiya", online = true, onlineUsers, pic, selectedUser, typingUserId }) => {
     
    
    return (
        
        <div style={{backgroundColor: ' #1f1d1d'}} className="d-flex align-items-center justify-content-between p-3 border-bottom border-dark bg-dark text-white">
            <div className="d-flex align-items-center">
                <Image src={selectedUser && (selectedUser.picture || './avatar.png')} alt="Avatar" className="rounded-circle" style={{ width: 40, height: 40, marginRight: 12 }} />
                <div>
                    <div className="fw-bold">{selectedUser && selectedUser.username}</div>
                    <div style={{ fontSize: '0.8rem', textAlign: 'left', color: '#00e676' }}>{onlineUsers?.has(selectedUser?._id) ? 'Online' : 'Offline'}</div>
                </div>
            </div>
            {/* {typingUserId && (
                                    <div className="d-flex align-items-center gap-2 mb-2 justify-content-start">
                                        <Avatar src={selectedUser?.picture || './Darshan.png'} size={32} />
                                        <div
                                        className="px-3 py-2 rounded-pill"
                                        style={{
                                            backgroundColor: '#3a3b3c',
                                            color: '#ccc',
                                            fontStyle: 'italic',
                                            fontSize: '0.9rem',
                                            maxWidth: '60%',
                                        }}
                                        >
                                        typing...
                                        </div>
                                    </div>
                                    )} */}
            <div className="d-flex gap-3">
                <Video className="text-white" />
                <Phone className="text-white" />
            </div>
        </div>
    );
};

export default ChatHeader;
