import { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Combined login/logout notifications from socket events
 */
const SocketNotifications = ({ socketInstance }) => {
  const loginToastRef = useRef(null);
  const logoutToastRef = useRef(null);
  // const profileToastRef = useRef(null);

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

    const handleProfileChanged = ({ updatedProfileUser }) => {
      console.log('Notification received for profile');
      if (updatedProfileUser && updatedProfileUser?.username) {
        console.log('Profile Updated');
        // if (!toast.isActive(profileToastRef.current)) {
        toast.info(`👋 ${updatedProfileUser.username} just updated profile!`, {
          position: 'top-right',
          autoClose: 4000,
          pauseOnHover: true,
          draggable: true
          // style={"fontFamily: 'Poppins'"}
        });
        // }
      }
    };

    socketInstance.on('LoggingIn', handleLoggingIn);
    socketInstance.on('LoggingOut', handleLoggingOut);
    socketInstance.on('UpdatedProfile', handleProfileChanged);

    return () => {
      socketInstance.off('LoggingIn', handleLoggingIn);
      socketInstance.off('LoggingOut', handleLoggingOut);
      socketInstance.off('UpdatedProfile', handleProfileChanged);
    };
  }, [socketInstance]);

  return <ToastContainer style={{ fontFamily: 'Poppins' }} />;
};

export default SocketNotifications;
