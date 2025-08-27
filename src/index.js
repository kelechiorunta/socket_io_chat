import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { ApolloProvider } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import client from './components/client.js';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext.js';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme.js';
// import '@radix-ui/themes/styles.css';
// import '@radix-ui/themes/layout.css';

// import reportWebVitals from './reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </ThemeProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
