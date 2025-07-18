import { Nav, Image, Button } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
    Home, Search, Bookmark, Share2, Settings, Moon, Sun, LogOutIcon
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useNavigate } from 'react-router-dom';

const IconBar = ({ pic }) => {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === 'dark';

    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch('/logout', { method: 'POST', credentials: 'include' });
        // Clear state, tokens, etc.
        navigate('/login'); // or home
      };

    return (
        <div
            className="d-flex flex-column justify-content-between align-items-center p-2"
            style={{
                height: '100vh',
                minWidth: '80px',
                color: 'var(--text-color)',
                backgroundColor: 'var(--bg-color)',
                borderRight: `1px solid var(--border-color)`
            }}
        >
            <div className="d-flex flex-column align-items-center gap-3">
                <Image
                    src={pic && pic.picture}
                    alt="Logo"
                    style={{ width: 30, height: 30 }}
                    rounded
                />

                <Nav defaultActiveKey="/home" className="flex-column text-center">
                    {[{ icon: Home, label: 'Home' }, { icon: Search, label: 'Search' },
                      { icon: Bookmark, label: 'Save' }, { icon: Share2, label: 'Share' },
                      { icon: Settings, label: 'Settings' }].map(({ icon: Icon, label }) => (
                        <OverlayTrigger key={label} placement="right" overlay={<Tooltip>{label}</Tooltip>}>
                              <Nav.Link href="#" className={`${isDark? 'text-white' : 'text-black'} d-flex flex-column align-items-center`}>
                                <Icon size={20} />
                                <small style={{ fontSize: '0.7rem' }}>{label}</small>
                            </Nav.Link>
                        </OverlayTrigger>
                    ))}
                </Nav>
            </div>

            <div className="d-flex flex-column align-items-center gap-3">
                <OverlayTrigger placement="right" overlay={<Tooltip>Toggle Theme</Tooltip>}>
                    <Button
                        variant="outline-secondary"
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: 36, height: 36, borderRadius: '50%' }}
                        onClick={toggleTheme}
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                </OverlayTrigger>

                <OverlayTrigger placement="right" overlay={<Tooltip>Logout</Tooltip>}>
                    <Button
                        variant="outline-secondary"
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: 36, height: 36, borderRadius: '50%' }}
                        onClick={handleLogout}
                    >
                        <LogOutIcon size={18} />
                    </Button>
                </OverlayTrigger>

                <Image
                    onClick={handleLogout}
                    src={pic && pic.picture}
                    roundedCircle
                    style={{ width: 36, height: 36, cursor: 'pointer' }}
                />
            </div>
        </div>
    );
};

export default IconBar;

