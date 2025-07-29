import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Props:
 * @param socketInstance - Your connected socket.io-client instance
 */
const LogoutNotification = ({ socketInstance }) => {
  useEffect(() => {
    if (!socketInstance) return;

    const handleLoggingOut = ({ signedOutUser }) => {
      if (signedOutUser && signedOutUser?.username) {
        toast.success(`🎉 ${signedOutUser.username} just logged out!`, {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });
      }
    };

    socketInstance.on('LoggingOut', handleLoggingOut);

    return () => {
      socketInstance.off('LoggingOut', handleLoggingOut);
    };
  }, []);

  return <ToastContainer />;
};

export default LogoutNotification;
