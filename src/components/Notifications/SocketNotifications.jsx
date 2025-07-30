import { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Combined login/logout notifications from socket events
 */
const SocketNotifications = ({ socketInstance }) => {
  const loginToastRef = useRef(null);
  const logoutToastRef = useRef(null);

  useEffect(() => {
    if (!socketInstance) return;

    const handleLoggingIn = ({ status, loggedInUser }) => {
      if (status === 'ok' && loggedInUser?.username) {
        if (!toast.isActive(loginToastRef.current)) {
          loginToastRef.current = toast.success(`🎉 ${loggedInUser.username} just joined in!`, {
            position: 'top-right',
            autoClose: 4000,
            pauseOnHover: true,
            draggable: true
          });
        }
      }
    };

    const handleLoggingOut = ({ signedOutUser }) => {
      if (signedOutUser?.username) {
        if (!toast.isActive(logoutToastRef.current)) {
          logoutToastRef.current = toast.info(`👋 ${signedOutUser.username} just logged out!`, {
            position: 'top-right',
            autoClose: 4000,
            pauseOnHover: true,
            draggable: true
          });
        }
      }
    };

    socketInstance.on('LoggingIn', handleLoggingIn);
    socketInstance.on('LoggingOut', handleLoggingOut);

    return () => {
      socketInstance.off('LoggingIn', handleLoggingIn);
      socketInstance.off('LoggingOut', handleLoggingOut);
    };
  }, [socketInstance]);

  return <ToastContainer />;
};

export default SocketNotifications;
