import express from 'express';
import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const pictureRouter = express.Router();

pictureRouter.get('/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, {
      bucketName: 'chatPictures'
    });

    const fileId = new ObjectId(req.params.id);
    // Check if file exists
    const files = await bucket.find({ fileId }).toArray();
    if (!files || files.length === 0) {
      res.status(404).json({ error: 'File not found' });
      return;
    }
    //   bucket.openDownloadStream(fileId).pipe(res);
    const downloadStream = bucket.openDownloadStream(fileId);
    res.set('Content-Type', files[0].contentType || 'application/octet-stream');
    downloadStream.pipe(res);
    // downloadStream.on('data', (chunk) => {
    //   res.write(chunk);
    // });

    // downloadStream.on('error', (err) => {
    //   console.error('❌ GridFS error:', err);
    //   res.sendStatus(404);
    // });

    // downloadStream.on('end', () => {
    //   res.end();
    // });
  } catch (err) {
    res.status(500).json({ error: 'Image not found' });
  }
});

export default pictureRouter;
