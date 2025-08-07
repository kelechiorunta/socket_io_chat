// import { useEffect, useRef } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// /**
//  * Combined login/logout notifications from socket events
//  */
// const SocketNotifications = ({ socketInstance }) => {
//   const loginToastRef = useRef(null);
//   const logoutToastRef = useRef(null);
//   const profileToastRef = useRef(null);

//   const shownUsersRef = useRef(new Set());

//   useEffect(() => {
//     if (!socketInstance) return;

//     const handleLoggingIn = ({ status, loggedInUser }) => {
//       if (status === 'ok' && loggedInUser?.username) {
//         if (!shownUsersRef.current.has(loggedInUser.username)) {
//           shownUsersRef.current.add(loggedInUser.username);
//           if (!toast.isActive(loginToastRef.current)) {
//             loginToastRef.current = toast.success(`🎉 ${loggedInUser.username} just joined in!`, {
//               position: 'top-right',
//               autoClose: 4000,
//               pauseOnHover: true,
//               draggable: true
//             });
//           }
//         }
//       }
//     };

//     const handleLoggingOut = ({ signedOutUser }) => {
//       if (signedOutUser && signedOutUser?.username) {
//         if (!toast.isActive(logoutToastRef.current)) {
//           logoutToastRef.current = toast.info(`👋 ${signedOutUser.username} just logged out!`, {
//             position: 'top-right',
//             autoClose: 4000,
//             pauseOnHover: true,
//             draggable: true
//           });
//         }
//       }
//     };

//     const handleProfileChanged = ({ updatedProfileUser }) => {
//       if (updatedProfileUser?.username) {
//         // if (!shownUsersRef.current.has(updatedProfileUser.username)) {
//         //   socketInstance.on('LoggingIn');
//         // } else {
//         //   socketInstance.off('LoggingIn');
//         // }
//         if (!toast.isActive(profileToastRef.current)) {
//           // shownUsersRef.current.add(updatedProfileUser.username);
//           profileToastRef.current = toast.success(
//             `👋 ${updatedProfileUser.username} just updated profile!`,
//             {
//               position: 'top-right',
//               autoClose: 4000,
//               pauseOnHover: true,
//               draggable: true
//             }
//           );
//         }
//       }
//     };

//     socketInstance.on('LoggingIn', handleLoggingIn);
//     socketInstance.on('LoggingOut', handleLoggingOut);
//     socketInstance.on('ProfileUpdated', handleProfileChanged);

//     return () => {
//       socketInstance.off('LoggingIn', handleLoggingIn);
//       socketInstance.off('LoggingOut', handleLoggingOut);
//       socketInstance.off('ProfileUpdated', handleProfileChanged);
//     };
//   }, [socketInstance]);

//   return <ToastContainer style={{ fontFamily: 'Poppins' }} />;
// };

// export default SocketNotifications;

import { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SocketNotifications = ({ socketInstance }) => {
  // Track active toast IDs per event type
  const loginToasts = useRef(new Set());
  const logoutToasts = useRef(new Set());
  const profileToasts = useRef(new Set());

  useEffect(() => {
    if (!socketInstance) return;

    const handleLoggingIn = ({ status, loggedInUser }) => {
      if (status === 'ok' && loggedInUser?.username) {
        const toastKey = `login-${loggedInUser.username}`;
        if (!loginToasts.current.has(toastKey)) {
          const id = toast.success(`🎉 ${loggedInUser.username} just joined in!`, {
            position: 'top-right',
            autoClose: 4000,
            pauseOnHover: true,
            draggable: true,
            toastId: toastKey
          });
          loginToasts.current.add(toastKey);
        }
      }
    };

    const handleLoggingOut = ({ signedOutUser }) => {
      if (signedOutUser?.username) {
        const toastKey = `logout-${signedOutUser.username}`;
        if (!logoutToasts.current.has(toastKey)) {
          const id = toast.info(`👋 ${signedOutUser.username} just logged out!`, {
            position: 'top-right',
            autoClose: 4000,
            pauseOnHover: true,
            draggable: true,
            toastId: toastKey
          });
          logoutToasts.current.add(toastKey);
        }
      }
    };

    const handleProfileChanged = ({ updatedProfileUser }) => {
      if (updatedProfileUser?.username) {
        const toastKey = `profile-${updatedProfileUser.username}-${Date.now()}`;
        // We allow showing profile update multiple times with unique keys
        toast.success(`✏️ ${updatedProfileUser.username} updated profile!`, {
          position: 'top-right',
          autoClose: 4000,
          pauseOnHover: true,
          draggable: true,
          toastId: toastKey
        });
        profileToasts.current.add(toastKey);
      }
    };

    socketInstance.on('LoggingIn', handleLoggingIn);
    socketInstance.on('LoggingOut', handleLoggingOut);
    socketInstance.on('ProfileUpdated', handleProfileChanged);

    return () => {
      socketInstance.off('LoggingIn', handleLoggingIn);
      socketInstance.off('LoggingOut', handleLoggingOut);
      socketInstance.off('ProfileUpdated', handleProfileChanged);
    };
  }, [socketInstance]);

  return <ToastContainer style={{ fontFamily: 'Poppins' }} />;
};

export default SocketNotifications;
