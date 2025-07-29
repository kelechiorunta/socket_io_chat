import { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LogoutNotification = ({ socketInstance }) => {
  const toastIdRef = useRef(null);

  useEffect(() => {
    if (!socketInstance) return;

    const handleLoggingOut = ({ signedOutUser }) => {
      if (signedOutUser && signedOutUser?.username) {
        if (!toast.isActive(toastIdRef.current)) {
          toastIdRef.current = toast.success(`🎉${signedOutUser.username} just logged out!`, {
            position: 'top-right',
            autoClose: 4000,
            pauseOnHover: true,
            draggable: true
          });
        }
      }
    };

    socketInstance.on('LoggingOut', handleLoggingOut);

    return () => {
      socketInstance.off('LoggingOut', handleLoggingOut);
    };
  }, [socketInstance]);

  return <ToastContainer />;
};

export default LogoutNotification;
