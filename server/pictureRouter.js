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

// /upload endpoint
pictureRouter.post('/logo', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'logos' });

    // create an upload stream
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', (file) => {
      res.json({ fileId: file._id.toString() });
    });

    uploadStream.on('error', (err) => {
      console.error('GridFS upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    });
  } catch (err) {
    console.error('❌ Upload route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default pictureRouter;
