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
    }
  }
`;