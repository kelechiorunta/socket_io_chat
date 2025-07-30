import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Props:
 * @param socketInstance - Your connected socket.io-client instance
 */
const LoginNotification = ({ socketInstance }) => {
  useEffect(() => {
    if (!socketInstance) return;

    const handleLoggingIn = ({ status, loggedInUser }) => {
      if (status === 'ok' && loggedInUser && loggedInUser?.username) {
        toast.success(`🎉 ${loggedInUser.username} just joined in!`, {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });
      }
    };

    socketInstance.on('LoggingIn', handleLoggingIn);

    return () => {
      socketInstance.off('LoggingIn', handleLoggingIn);
    };
  }, [socketInstance]);

  return <ToastContainer />;
};

export default LoginNotification;
