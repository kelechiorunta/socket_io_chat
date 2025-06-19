import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const unreadMsgSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // The user who has unread messages
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: false },    // Who sent the messages
  unreadMsgs: [{ type: Schema.Types.ObjectId, ref: 'ChatMessage' }],       // The actual unread messages
}, { timestamps: true });

const UnreadMsg = mongoose.models.UnreadMsg || mongoose.model('UnreadMsg', unreadMsgSchema);

export default UnreadMsg