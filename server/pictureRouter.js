import express from 'express';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

const pictureRouter = express.Router();

pictureRouter.get('/:id', (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, {
      bucketName: 'chatPictures'
    });

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    //   bucket.openDownloadStream(fileId).pipe(res);
    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('error', (err) => {
      console.error('❌ GridFS error:', err);
      res.sendStatus(404);
    });

    downloadStream.on('end', () => {
      res.end();
    });
  } catch (err) {
    res.status(500).json({ error: 'Image not found' });
  }
});

export default pictureRouter;
