import { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useApolloClient } from '@apollo/client';
import { GET_CONTACTS } from '../../graphql/queries';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Combined login/logout notifications from socket events
 */
const SocketNotifications = ({ socketInstance }) => {
  const loginToastRef = useRef(null);
  const logoutToastRef = useRef(null);
  const profileToastRef = useRef(null);

  const client = useApolloClient();
  // const shownUsersRef = useRef(new Set());

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

    const handleProfileChanged = ({ updatedUser }) => {
      try {
        const existing = client.readQuery({ query: GET_CONTACTS });

        if (!existing) return;

        const updatedUsers = existing.users.map((user) =>
          user._id === updatedUser._id ? { ...user, ...updatedUser } : user
        );

        client.writeQuery({
          query: GET_CONTACTS,
          data: { users: updatedUsers }
        });

        if (updatedUser?.username) {
          if (!toast.isActive(profileToastRef.current)) {
            profileToastRef.current = toast.success(
              `👋 ${updatedUser.username} just updated profile!`,
              {
                position: 'top-right',
                autoClose: 4000,
                pauseOnHover: true,
                draggable: true
              }
            );
          }
        }
        // socket.emit('ProfileUpdated', { updatedUser: updatedUser });
      } catch (err) {
        console.error('Error updating contacts in real-time:', err);
      }
    };

    socketInstance.on('LoggingIn', handleLoggingIn);
    socketInstance.on('LoggingOut', handleLoggingOut);
    socketInstance.on('Updating', handleProfileChanged);

    return () => {
      socketInstance.off('LoggingIn', handleLoggingIn);
      socketInstance.off('LoggingOut', handleLoggingOut);
      socketInstance.off('Updating', handleProfileChanged);
    };
  }, [socketInstance, client]);

  return <ToastContainer style={{ fontFamily: 'Poppins' }} />;
};

export default SocketNotifications;

// import { useEffect, useRef } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const SocketNotifications = ({ socketInstance }) => {
//   // Track active toast IDs per event type
//   const loginToasts = useRef(new Set());
//   const logoutToasts = useRef(new Set());
//   const profileToasts = useRef(new Set());

//   useEffect(() => {
//     if (!socketInstance) return;

//     const handleLoggingIn = ({ status, loggedInUser }) => {
//       if (status === 'ok' && loggedInUser?.username) {
//         const toastKey = `login-${loggedInUser.username}`;
//         if (!loginToasts.current.has(toastKey)) {
//           toast.success(`🎉 ${loggedInUser.username} just joined in!`, {
//             position: 'top-right',
//             autoClose: 4000,
//             pauseOnHover: true,
//             draggable: true,
//             toastId: toastKey
//           });
//           loginToasts.current.add(toastKey);
//         }
//       }
//     };

//     const handleLoggingOut = ({ signedOutUser }) => {
//       if (signedOutUser?.username) {
//         const toastKey = `logout-${signedOutUser.username}`;
//         if (!logoutToasts.current.has(toastKey)) {
//           toast.info(`👋 ${signedOutUser.username} just logged out!`, {
//             position: 'top-right',
//             autoClose: 4000,
//             pauseOnHover: true,
//             draggable: true,
//             toastId: toastKey
//           });
//           logoutToasts.current.add(toastKey);
//         }
//       }
//     };

//     const handleProfileChanged = ({ updatedProfileUser }) => {
//       if (updatedProfileUser?.username) {
//         const toastKey = `profile-${updatedProfileUser.username}-${Date.now()}`;
//         // We allow showing profile update multiple times with unique keys
//         toast.success(`✏️ ${updatedProfileUser.username} updated profile!`, {
//           position: 'top-right',
//           autoClose: 4000,
//           pauseOnHover: true,
//           draggable: true,
//           toastId: toastKey
//         });
//         profileToasts.current.add(toastKey);
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
