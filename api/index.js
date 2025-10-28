import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI required');
  process.exit(1);
}

console.log('Connecting to MongoDB Atlas...');

mongoose.connect(MONGODB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const dataItemSchema = new mongoose.Schema({
  name: String,
  hex: String,
  type: String,
  source: String,
});

const DataItem = mongoose.model('DataItem', dataItemSchema, 'dataitems');

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 100 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (q && q.trim()) {
      const searchTerm = q.trim();
      
      if (searchTerm.startsWith('0x') || /^[0-9a-fA-F]+$/.test(searchTerm)) {
        const hexTerm = searchTerm.startsWith('0x') ? searchTerm : `0x${searchTerm}`;
        query = { 
          $or: [
            { hex: hexTerm },
            { hex: searchTerm }
          ]
        };
      } else {
        query = { name: { $regex: searchTerm, $options: 'i' } };
      }
    } else {
      return res.json({
        results: [],
        pagination: { current: 1, total: 0, totalItems: 0 }
      });
    }

    const [results, total] = await Promise.all([
      DataItem.find(query).skip(skip).limit(parseInt(limit)).sort({ name: 1 }).allowDiskUse(true),
      DataItem.countDocuments(query)
    ]);

    res.json({ 
      results, 
      pagination: { 
        current: parseInt(page), 
        total: Math.ceil(total / limit), 
        totalItems: total 
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const totalItems = await DataItem.countDocuments();
    res.json({ totalItems });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use(express.static(path.join(__dirname, '../build')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});