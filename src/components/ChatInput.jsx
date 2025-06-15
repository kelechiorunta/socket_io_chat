import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { Send, Mic, Image, Paperclip, Smile } from 'lucide-react';

const ChatInput = ({ input, setInput, onSend }) => {
    return (
        <div className="p-3 border-top border-dark bg-dark">
            <InputGroup>
                <Button variant="outline-secondary"><Smile size={18} /></Button>
                <Button variant="outline-secondary"><Paperclip size={18} /></Button>
                <Button variant="outline-secondary"><Image size={18} /></Button>
                <FormControl
                    placeholder="Message......."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-dark text-white border-secondary"
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
