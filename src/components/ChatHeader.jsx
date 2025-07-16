import { Video, Phone } from 'lucide-react';
import { Image } from 'react-bootstrap';
import { useTheme } from './ThemeContext';

const ChatHeader = ({ username = "Darshan Zalavadiya", online = true, onlineUsers, pic, selectedUser, typingUserId }) => {
    const { theme, toggleTheme } = useTheme(); 
    const isDark = theme === 'dark';
    
    return (
        
        <div style={{
            backgroundColor: isDark ? ' #1f1d1d' : 'white',
            color: isDark? 'white' : 'black'
        }} className="d-flex align-items-center justify-content-between p-3 border-bottom border-dark">
            {/* bg-dark text-white */}
            <div className="d-flex align-items-center">
                <Image src={selectedUser? (selectedUser.picture|| './avatar.png') : './avatar.png'} alt="Avatar" className="rounded-circle" style={{ width: 40, height: 40, marginRight: 12 }} />
                <div>
                    <div className="fw-bold">{selectedUser && selectedUser.username}</div>
                    <div style={{ fontSize: '0.8rem', textAlign: 'left', color: '#00e676' }}>{onlineUsers?.has(selectedUser?._id) ? 'Online' : 'Offline'}</div>
                </div>
            </div>
            <div className="d-flex gap-3">
                <Video />
                <Phone />
            </div>
        </div>
    );
};

export default ChatHeader;
