// import React, { useState } from 'react';
// import { InputGroup, FormControl, Button } from 'react-bootstrap';
// import { Send, Mic, Image, Paperclip, Smile } from 'lucide-react';
// import { useTheme } from './ThemeContext';
// import Picker from '@emoji-mart/react';
// import data from '@emoji-mart/data';

// const ChatInput = ({ input, setInput, onSend, isMobile }) => {
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';
//   const [showPicker, setShowPicker] = useState(false);

//   const addEmoji = (emoji) => {
//     setInput((prev) => prev + emoji.native);
//   };

//   return (
//     <div
//       className="p-3 border-top border-dark"
//       style={{
//         backgroundColor: isDark ? '#212529' : 'white',
//         color: isDark ? 'white' : 'black',
//         position: 'relative'
//       }}
//     >
//       {showPicker && (
//         <div style={{ position: 'absolute', bottom: '60px', zIndex: 1000 }}>
//           <Picker data={data} onEmojiSelect={addEmoji} theme={isDark ? 'dark' : 'light'} />
//         </div>
//       )}

//       <InputGroup>
//         <Button variant="outline-secondary" onClick={() => setShowPicker(!showPicker)}>
//           <Smile size={18} />
//         </Button>
//         {!isMobile && (
//           <Button variant="outline-secondary">
//             <Paperclip size={18} />
//           </Button>
//         )}
//         {!isMobile && (
//           <Button variant="outline-secondary">
//             <Image size={18} />
//           </Button>
//         )}
//         <FormControl
//           placeholder="Message......."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="border-secondary"
//           style={{
//             backgroundColor: isDark ? '#212529' : 'white',
//             color: isDark ? 'white' : 'black'
//           }}
//         />
//         <Button variant="outline-secondary" onClick={onSend}>
//           <Send size={18} />
//         </Button>
//         {!isMobile && (
//           <Button variant="outline-secondary">
//             <Mic size={18} />
//           </Button>
//         )}
//       </InputGroup>
//     </div>
//   );
// };

// export default ChatInput;

import { useState, useRef } from 'react';
import { Send, Mic, Image, Paperclip, Smile } from 'lucide-react';
// import { useTheme } from './ThemeContext';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { TextField, IconButton, Box } from '@mui/material';

const ChatInput = ({ isDark, input, setInput, onSend, isMobile }) => {
  // const { theme } = useTheme();
  // const isDark = theme === 'dark';
  const [showPicker, setShowPicker] = useState(false);
  const [file, setFile] = useState(null);

  const fileInputRef = useRef();

  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji.native);
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = () => {
    if (!input.trim() && !file) return;

    // prepare formdata
    const formData = new FormData();
    formData.append('content', input);
    if (file) {
      formData.append('file', file);
    }
    onSend(formData); // pass formData to handler
    setInput('');
    setFile(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderTop: '1px solid',
        borderColor: isDark ? 'grey.800' : 'grey.300',
        bgcolor: isDark ? '#212529' : 'white',
        color: isDark ? 'white' : 'black',
        position: 'relative'
      }}
    >
      {showPicker && (
        <Box sx={{ position: 'absolute', bottom: '60px', zIndex: 1000 }}>
          <Picker data={data} onEmojiSelect={addEmoji} theme={isDark ? 'light' : 'light'} />
        </Box>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <TextField
        style={{ color: isDark ? 'white' : 'black' }}
        fullWidth
        placeholder="Message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        variant="outlined"
        size="small"
        sx={{
          bgcolor: isDark ? 'grey.500' : 'white', //grey.900' : 'white',
          color: isDark ? 'white' : 'black'
        }}
        InputProps={{
          startAdornment: (
            <>
              <IconButton
                color={isDark ? 'white' : 'black'}
                onClick={() => setShowPicker(!showPicker)}
              >
                <Smile size={18} />
              </IconButton>
              {!isMobile && (
                <IconButton onClick={() => fileInputRef.current.click()}>
                  <Paperclip size={18} />
                </IconButton>
              )}
              {isMobile && (
                <IconButton
                  color={isDark ? 'white' : 'black'}
                  onClick={() => fileInputRef.current.click()}
                >
                  <Image size={18} />
                </IconButton>
              )}
            </>
          ),
          endAdornment: (
            <>
              <IconButton color={isDark ? 'white' : 'black'} onClick={handleSend}>
                <Send size={18} />
              </IconButton>
              {!isMobile && (
                <IconButton>
                  <Mic size={18} />
                </IconButton>
              )}
            </>
          )
        }}
      />

      {file && (
        <Box sx={{ mt: 1, fontSize: 12, color: isDark ? 'white' : 'grey.500' }}>
          📎 {file.name} selected
        </Box>
      )}
    </Box>
  );
};

export default ChatInput;
