import { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Combined login/logout notifications from socket events
 */
const SocketNotifications = ({ socketInstance }) => {
  const loginToastRef = useRef(null);
  const logoutToastRef = useRef(null);
  const ProfileToastRef = useRef(null);

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
      if (signedOutUser && signedOutUser?.username) {
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

    const handleProfileChanged = ({ user }) => {
      if (user && user?.username) {
        if (!toast.isActive(ProfileToastRef.current)) {
          ProfileToastRef.current = toast.info(`👋 ${user.username} just updated profile!`, {
            position: 'top-right',
            autoClose: 4000,
            pauseOnHover: true,
            draggable: true
            // style={"fontFamily: 'Poppins'"}
          });
        }
      }
    };

    socketInstance.on('LoggingIn', handleLoggingIn);
    socketInstance.on('LoggingOut', handleLoggingOut);
    socketInstance.on('ProfileChanged', handleProfileChanged);

    return () => {
      socketInstance.off('LoggingIn', handleLoggingIn);
      socketInstance.off('LoggingOut', handleLoggingOut);
      socketInstance.off('ProfileChanged', handleProfileChanged);
    };
  }, [socketInstance]);

  return <ToastContainer style={{ fontFamily: 'Poppins' }} />;
};

export default SocketNotifications;
