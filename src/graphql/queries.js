// export const GET_CONTACTS = gql`
//   query GetContacts {
//     users {
//       _id
//       username
//       avatar
//       lastMessage
//       isTyping
//       unread
//     }
//     groups {
//       _id
//       name
//       avatar
//       lastMessage
//       unread
//     }
//   }
// `;
import { gql } from "@apollo/client";
export const GET_CONTACTS = gql`
  query GetContacts {
    users {
      _id
      email
      username
      picture
      lastMessage
      lastMessageCount
      isOnline
      unread {
        sender {
          _id
          username
        }
        unreadMsgs {
          _id
          content
        }
    }
    }
  }
`;

export const AUTH = gql`
  query authenticatedUser {
    auth {
      _id
      email
      username
      picture
      lastMessage
      lastMessageCount
      isOnline
      unread {
        sender {
          _id
          username
        }
        unreadMsgs {
          _id
          content
        }
      }
    }
  }
`;

export const MARK_MESSAGES_AS_READ = gql`
  mutation MarkMessagesAsRead($senderId: ID!) {
    markMessagesAsRead(senderId: $senderId)
  }
`;