import { Router } from 'express';
import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() }); // keep in memory for streaming

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

pictureRouter.get('/logo/:id', async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'logos' });
    // const fileId = new mongoose.Types.ObjectId(req.params.id);

    const fileId = new ObjectId(req.params.id);
    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.set('Content-Type', files[0].contentType || 'application/octet-stream');
    res.set('Cache-Control', 'no-store'); // 🚨 Disable caching for real-time updates

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on('error', () => {
      res.status(404).json({ error: 'Image not found' });
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid file ID' });
  }
});

// /upload endpoint
pictureRouter.post('/logo', upload.single('file'), (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'logos' });

    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype
    });

    uploadStream.end(file.buffer);

    uploadStream.on('finish', () => {
      res.json({ fileId: uploadStream.id.toString() });
    });

    uploadStream.on('error', (err) => {
      console.error('❌ GridFS upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    });
  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default pictureRouter;
