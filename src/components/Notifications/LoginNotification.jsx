import { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginNotification = ({ socketInstance }) => {
  const toastIdRef = useRef(null);

  useEffect(() => {
    if (!socketInstance) return;

    const handleLoggingIn = ({ status, loggedInUser }) => {
      if (status === 'ok' && loggedInUser?.username) {
        if (!toast.isActive(toastIdRef.current)) {
          toastIdRef.current = toast.success(`🎉${loggedInUser.username} just logged in!`, {
            position: 'top-right',
            autoClose: 4000,
            pauseOnHover: true,
            draggable: true
          });
        }
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
