import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { Send, Mic, Image, Paperclip, Smile } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const ChatInput = ({ input, setInput, onSend }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [showPicker, setShowPicker] = useState(false);

    const addEmoji = (emoji) => {
        setInput(prev => prev + emoji.native);
    };

    return (
        <div
            className="p-3 border-top border-dark"
            style={{
                backgroundColor: isDark ? '#212529' : 'white',
                color: isDark ? 'white' : 'black',
                position: 'relative'
            }}
        >
            {showPicker && (
                <div style={{ position: 'absolute', bottom: '60px', zIndex: 1000 }}>
                    <Picker data={data} onEmojiSelect={addEmoji} theme={isDark ? 'dark' : 'light'} />
                </div>
            )}

            <InputGroup>
                <Button variant="outline-secondary" onClick={() => setShowPicker(!showPicker)}>
                    <Smile size={18} />
                </Button>
                <Button variant="outline-secondary"><Paperclip size={18} /></Button>
                <Button variant="outline-secondary"><Image size={18} /></Button>
                <FormControl
                    placeholder="Message......."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border-secondary"
                    style={{
                        backgroundColor: isDark ? '#212529' : 'white',
                        color: isDark ? 'white' : 'black'
                    }}
                />
                <Button variant="outline-secondary" onClick={onSend}>
                    <Send size={18} />
                </Button>
                <Button variant="outline-secondary"><Mic size={18} /></Button>
            </InputGroup>
        </div>
    );
};

export default ChatInput;


