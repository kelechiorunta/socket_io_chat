// In a component like ChatApp.js or ContactList.js
import { useApolloClient } from '@apollo/client';
import { useEffect } from 'react';
import { GET_CONTACTS } from '../graphql/queries';

const ContactUpdater = ({ socketInstance }) => {
  const client = useApolloClient();

  useEffect(() => {
    if (!socketInstance) return;

    const handleUpdating = ({ updatedUser }) => {
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
      } catch (err) {
        console.error('Error updating contacts in real-time:', err);
      }
    };

    socketInstance.on('Updating', handleUpdating);

    return () => {
      socketInstance.off('Updating', handleUpdating);
    };
  }, [socketInstance, client]);

  return null;
};

export default ContactUpdater;
