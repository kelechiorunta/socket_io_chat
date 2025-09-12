import mongoose from 'mongoose';
import ChatPicture from './ChatPicture.js';

const chatMessageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    hasImage: { type: Boolean, default: false },
    imageFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatPicture', required: false },
    imageUrl: { type: String, required: false },
    placeholderImgId: { type: mongoose.Schema.Types.ObjectId, required: false },
    placeholderUrl: { type: String, required: false },
    groupId: { type: String, required: false } // group ID (for group chat)
  },
  { timestamps: true }
);

// 👇 After saving, if message has an imageFileId, create ChatPicture entry
chatMessageSchema.post('save', async function (doc, next) {
  try {
    if (doc.hasImage && doc.imageFileId) {
      await ChatPicture.create({
        fileId: doc.imageFileId,
        senderId: doc.sender,
        receiverId: doc.receiver,
        messageId: doc._id,
        pictureUrl: `/chat-pictures/${doc.imageFileId.toString()}`
      });
    }
    next();
  } catch (err) {
    next(err);
  }
});
const ChatMessage = mongoose.Model.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
