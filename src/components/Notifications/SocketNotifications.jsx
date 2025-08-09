import { useEffect, useRef, useState } from 'react';
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

  const [signedUsers, setSignedUsers] = useState(new Set());

  const [updatedProfileUser, setUpdatedProfileUser] = useState(null);
  const recentlyUpdatedProfilesRef = useRef(new Set());
  const client = useApolloClient();
  // const shownUsersRef = useRef(new Set());

  useEffect(() => {
    if (!socketInstance) return;

    const handleLoggingIn = ({ status, loggedInUser }) => {
      if (status === 'ok' && loggedInUser?.username) {
        setSignedUsers((prev) => {
          // 🚫 Skip if user just updated profile
          if (recentlyUpdatedProfilesRef.current.has(loggedInUser._id || updatedProfileUser._id)) {
            return prev; // no login toast
          }

          if (!prev.has(loggedInUser._id || updatedProfileUser._id)) {
            recentlyUpdatedProfilesRef.current.add(loggedInUser._id);
            const newSet = new Set(prev);
            newSet.add(loggedInUser._id || updatedProfileUser._id);
            loginToastRef.current = toast.success(`🎉 ${loggedInUser.username} just joined in!`, {
              position: 'top-right',
              autoClose: 4000,
              pauseOnHover: true,
              draggable: true
            });

            if (!toast.isActive(loginToastRef.current)) {
              loginToastRef.current = toast.success(`🎉 ${loggedInUser.username} just joined in!`, {
                position: 'top-right',
                autoClose: 4000,
                pauseOnHover: true,
                draggable: true
              });
            }
            return newSet;
          }
          return prev;
        });
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

        // 🕒 Track this user so they don't trigger a login toast
        setUpdatedProfileUser(updatedUser);
        recentlyUpdatedProfilesRef.current.add(updatedUser._id);
        setTimeout(() => {
          recentlyUpdatedProfilesRef.current.delete(updatedUser._id);
        }, 3000); // 5 seconds window

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
  }, [socketInstance, client, signedUsers, updatedProfileUser]);

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
