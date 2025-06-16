import React from 'react';
import { Video, Phone } from 'lucide-react';
import { Container, Image } from 'react-bootstrap';

const ChatHeader = ({ username = "Darshan Zalavadiya", online = true, pic, selectedUser }) => {
     
    
    return (
        
        <div style={{backgroundColor: ' #1f1d1d'}} className="d-flex align-items-center justify-content-between p-3 border-bottom border-dark bg-dark text-white">
            <div className="d-flex align-items-center">
                <Image src={selectedUser && selectedUser.picture} alt="Avatar" className="rounded-circle" style={{ width: 40, height: 40, marginRight: 12 }} />
                <div>
                    <div className="fw-bold">{selectedUser && selectedUser.username}</div>
                    <div style={{ fontSize: '0.8rem', color: '#00e676' }}>{online ? 'Online' : 'Offline'}</div>
                </div>
            </div>
            <div className="d-flex gap-3">
                <Video className="text-white" />
                <Phone className="text-white" />
            </div>
        </div>
    );
};

export default ChatHeader;
