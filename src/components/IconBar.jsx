import React from 'react';
import { Nav, Image, Button } from 'react-bootstrap';
import {
    Home,
    Search,
    Bookmark,
    Share2,
    Settings,
    Moon,
    Sun
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IconBar = ({pic}) => {
    const navigate = useNavigate();
    return (
        <div
            className="d-flex flex-column justify-content-between align-items-center p-2"
            style={{
                height: '100vh',
                minWidth: '80px',
                backgroundColor: '#1e1e1e',
                borderRight: '1px solid #333'
            }}
        >
            <div className="d-flex flex-column align-items-center gap-3">
                {/* Top Logo */}
                <Image
                    src={pic && pic.picture}
                    alt="Logo"
                    style={{ width: 30, height: 30 }}
                    rounded
                />

                <Nav defaultActiveKey="/home" className="flex-column text-center">
                    <Nav.Link href="#" className="text-white d-flex flex-column align-items-center">
                        <Home size={20} />
                        <small style={{ fontSize: '0.7rem' }}>Home</small>
                    </Nav.Link>
                    <Nav.Link href="#" className="text-white d-flex flex-column align-items-center">
                        <Search size={20} />
                        <small style={{ fontSize: '0.7rem' }}>Search</small>
                    </Nav.Link>
                    <Nav.Link href="#" className="text-white d-flex flex-column align-items-center">
                        <Bookmark size={20} />
                        <small style={{ fontSize: '0.7rem' }}>Save</small>
                    </Nav.Link>
                    <Nav.Link href="#" className="text-white d-flex flex-column align-items-center">
                        <Share2 size={20} />
                        <small style={{ fontSize: '0.7rem' }}>Share</small>
                    </Nav.Link>
                    <Nav.Link href="#" className="text-white d-flex flex-column align-items-center">
                        <Settings size={20} />
                        <small style={{ fontSize: '0.7rem' }}>Setting</small>
                    </Nav.Link>
                </Nav>
            </div>

            <div className="d-flex flex-column align-items-center gap-3">
                {/* Light/Dark Mode Toggle */}
                <Button
                    variant="outline-secondary"
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: 36, height: 36, borderRadius: '50%' }}
                >
                    {/* You could toggle with state later */}
                    <Moon size={18} />
                </Button>

                {/* User Avatar */}
                <Image
                    onClick={()=> window.location.href = 'http://localhost:7334/logout'}
                    src={pic && pic.picture}
                    roundedCircle
                    style={{ width: 36, height: 36, cursor: 'pointer' }}
                />
            </div>
        </div>
    );
};

export default IconBar;
