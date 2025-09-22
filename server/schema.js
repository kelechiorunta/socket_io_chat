export default `type Query {
  users: [User]!
  auth: User
  getUnread(senderId: ID!, recipientId: ID!): UnreadResult
  messages(chatId: ID!): [Message]
  fetch_chats(userId: ID!, currentUserId: ID!): ChatHistoryResponse
}

type Mutation {
  markMessagesAsRead(senderId: ID!): Boolean
  createUnread(input: CreateUnreadInput!): UnreadResult
  clearUnread(senderId: ID!, recipientId: ID!): Boolean
  updateProfile(input: UpdateProfileInput!): UpdateProfileResponse!
  deleteMessage(messageId: ID!, senderId: ID!): DeleteMessageResponse!
  createGroup(name: String!, logo: ID!, description: String!, memberIds: [ID!]!): Group!
}

type Group {
  id: ID!
  name: String!
  members: [User!]!
  description: String
  logo: ID
  createdAt: String
}

type ChatHistoryResponse {
  messages: [Message!]!
  notifiedUser: User
}

input CreateUnreadInput {
  senderId: ID!
  recipientId: ID!
  newMessage: String
}

type UnreadResult {
  count: Int
  lastMessage: String
  createdAt: String
  updatedAt: String
}

type UnreadCount {
  count: Int
  lastMessage: String
}

type UnreadCountEntry {
  senderId: ID
  data: UnreadCount
}

input UpdateProfileInput {
  username: String
  email: String
  gender: String
  phone: String
  address: String
  picture: String
  birthday: String
}

type UpdateProfileResponse {
  success: Boolean
  message: String
  user: User
}

type User {
  _id: ID
  username: String
  email: String
  picture: String
  lastMessage: String
  lastMessageCount: Int
  isOnline: Boolean
  unread: [UnreadMsg]
  phone: String
  gender: String
  address: String
  birthday: String
}

type ChatMessage {
  _id: ID!
  content: String
  sender: User
  receiver: User
  createdAt: String
  updatedAt: String
  imageUrl: String
  placeholderUrl: String
  hasImage: Boolean
}

type UnreadMsg {
  _id: ID!
  sender: User
  recipient: User
  count: Int
  lastMessage: String
  createdAt: String
  updatedAt: String
}

type Message {
  _id: ID
  chat: ID
  sender: User
  receiver: User
  content: String
  createdAt: String
  updatedAt: String
  imageUrl: String
  placeholderUrl: String
  hasImage: Boolean
}

type DeleteMessageResponse {
  success: Boolean!
  messageId: ID
  error: String
}

schema {
  query: Query
  mutation: Mutation
}
`;