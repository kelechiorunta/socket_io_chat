// import mongoose from 'mongoose';
// import User from './User.js';

// const messageSchema = new mongoose.Schema({
//   content: { type: String, required: true },
//   sender: { type: String, required: true }, // user ID or username
//   receiver: { type: String, required: false }, // user ID or username
//   groupId: { type: String, required: false }, // group ID (for group chat)
//   senderName: { type: String, required: false },
//   receiverName: { type: String, required: false },
//   senderAvatar: { type: String, required: false },
//   receiverAvatar: { type: String, required: false },
//   createdAt: { type: Date, default: Date.now }
// });

// messageSchema.pre('save', async function (next) {
//   try {
//     // Only run if sender or receiver are still in ID format
//     if (mongoose.Types.ObjectId.isValid(this.sender)) {
//       const senderUser = await User.findById(this.sender);
//       if (senderUser) {
//         this.senderName = senderUser.username;
//         this.senderAvatar = senderUser.picture;
//       }
//     }

//     if (mongoose.Types.ObjectId.isValid(this.receiver)) {
//       const receiverUser = await User.findById(this.receiver);
//       if (receiverUser) {
//         this.receiverName = receiverUser.username;
//         this.receiverAvatar = receiverUser.picture;
//       }
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });
// // export const Message = mongoose.model('Message', messageSchema);
// const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// export default Message;

import mongoose from 'mongoose';
import User from './User.js';
import ChatPicture from './ChatPicture.js';

const messageSchema = new mongoose.Schema({
  content: { type: String, required: false }, // text content
  sender: { type: String, required: true }, // user ID
  receiver: { type: String, required: false },
  groupId: { type: String, required: false },
  senderName: { type: String, required: false },
  receiverName: { type: String, required: false },
  senderAvatar: { type: String, required: false },
  receiverAvatar: { type: String, required: false },

  // 👇 Link to picture if any
  hasImage: { type: Boolean, default: false },
  imageFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatPicture', required: false },
  imageUrl: { type: String, required: false },

  createdAt: { type: Date, default: Date.now }
});

// Populate sender and receiver fields
messageSchema.pre('save', async function (next) {
  try {
    if (mongoose.Types.ObjectId.isValid(this.sender)) {
      const senderUser = await User.findById(this.sender);
      if (senderUser) {
        this.senderName = senderUser.username;
        this.senderAvatar = senderUser.picture;
      }
    }

    if (mongoose.Types.ObjectId.isValid(this.receiver)) {
      const receiverUser = await User.findById(this.receiver);
      if (receiverUser) {
        this.receiverName = receiverUser.username;
        this.receiverAvatar = receiverUser.picture;
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

// 👇 After saving, if message has an imageFileId, create ChatPicture entry
messageSchema.post('save', async function (doc, next) {
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

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
