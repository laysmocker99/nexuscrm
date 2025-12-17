import express from 'express';
import db from '../services/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Get all quotes
router.get('/', (req, res) => {
  try {
    const quotes = db.prepare('SELECT * FROM quotes WHERE userId = ? ORDER BY createdAt DESC').all(req.user.id);

    const parsedQuotes = quotes.map(quote => ({
      ...quote,
      items: JSON.parse(quote.items || '[]')
    }));

    res.json(parsedQuotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get quotes by lead
router.get('/lead/:leadId', (req, res) => {
  try {
    const quotes = db.prepare('SELECT * FROM quotes WHERE leadId = ? AND userId = ? ORDER BY createdAt DESC').all(req.params.leadId, req.user.id);

    const parsedQuotes = quotes.map(quote => ({
      ...quote,
      items: JSON.parse(quote.items || '[]')
    }));

    res.json(parsedQuotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create quote
router.post('/', (req, res) => {
  try {
    const { id, leadId, date, status, totalAmount, items } = req.body;

    db.prepare(`
      INSERT INTO quotes (id, leadId, date, status, totalAmount, items, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      leadId,
      date,
      status,
      totalAmount,
      JSON.stringify(items || []),
      req.user.id
    );

    const newQuote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(id);

    res.status(201).json({
      ...newQuote,
      items: JSON.parse(newQuote.items || '[]')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update quote
router.put('/:id', (req, res) => {
  try {
    const { date, status, totalAmount, items } = req.body;

    const existingQuote = db.prepare('SELECT * FROM quotes WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
    if (!existingQuote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    db.prepare(`
      UPDATE quotes SET
        date = ?,
        status = ?,
        totalAmount = ?,
        items = ?
      WHERE id = ? AND userId = ?
    `).run(
      date,
      status,
      totalAmount,
      JSON.stringify(items || []),
      req.params.id,
      req.user.id
    );

    const updatedQuote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);

    res.json({
      ...updatedQuote,
      items: JSON.parse(updatedQuote.items || '[]')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete quote
router.delete('/:id', (req, res) => {
  try {
    const existingQuote = db.prepare('SELECT * FROM quotes WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
    if (!existingQuote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    db.prepare('DELETE FROM quotes WHERE id = ? AND userId = ?').run(req.params.id, req.user.id);

    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
