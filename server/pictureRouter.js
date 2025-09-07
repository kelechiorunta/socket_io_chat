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
    bucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Image not found' });
  }
});

export default pictureRouter;
