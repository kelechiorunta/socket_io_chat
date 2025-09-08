import { Router } from 'express';
import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';

const pictureRouter = Router();

pictureRouter.get('/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'chatPictures' });

    const fileId = new ObjectId(req.params.id);
    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.set('Content-Type', files[0].contentType || 'application/octet-stream');
    res.set('Cache-Control', 'no-store'); // 🚨 Disable caching for real-time updates

    bucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    console.error('❌ GridFS error:', err);
    res.status(500).json({ error: 'Image not found' });
  }
});

export default pictureRouter;
