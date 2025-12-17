import express from 'express';
import db from '../services/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all leads
router.get('/', (req, res) => {
  try {
    const leads = db.prepare('SELECT * FROM leads WHERE userId = ? ORDER BY createdAt DESC').all(req.user.id);

    // Parse JSON fields
    const parsedLeads = leads.map(lead => ({
      ...lead,
      gaData: JSON.parse(lead.gaData || '{}'),
      interactions: JSON.parse(lead.interactions || '[]')
    }));

    res.json(parsedLeads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single lead
router.get('/:id', (req, res) => {
  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const parsedLead = {
      ...lead,
      gaData: JSON.parse(lead.gaData || '{}'),
      interactions: JSON.parse(lead.interactions || '[]')
    };

    res.json(parsedLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create lead
router.post('/', (req, res) => {
  try {
    const { id, firstName, lastName, email, phone, company, position, status, value, channel, gaData, interactions, score, lastContacted, avatarUrl } = req.body;

    const result = db.prepare(`
      INSERT INTO leads (id, firstName, lastName, email, phone, company, position, status, value, channel, gaData, interactions, score, lastContacted, avatarUrl, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      firstName,
      lastName,
      email,
      phone || '',
      company || '',
      position || '',
      status,
      value,
      channel,
      JSON.stringify(gaData || {}),
      JSON.stringify(interactions || []),
      score || null,
      lastContacted,
      avatarUrl || null,
      req.user.id
    );

    const newLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);

    res.status(201).json({
      ...newLead,
      gaData: JSON.parse(newLead.gaData || '{}'),
      interactions: JSON.parse(newLead.interactions || '[]')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead
router.put('/:id', (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, position, status, value, channel, gaData, interactions, score, lastContacted, avatarUrl } = req.body;

    // Check if lead exists and belongs to user
    const existingLead = db.prepare('SELECT * FROM leads WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    db.prepare(`
      UPDATE leads SET
        firstName = ?,
        lastName = ?,
        email = ?,
        phone = ?,
        company = ?,
        position = ?,
        status = ?,
        value = ?,
        channel = ?,
        gaData = ?,
        interactions = ?,
        score = ?,
        lastContacted = ?,
        avatarUrl = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ? AND userId = ?
    `).run(
      firstName,
      lastName,
      email,
      phone || '',
      company || '',
      position || '',
      status,
      value,
      JSON.stringify(gaData || {}),
      JSON.stringify(interactions || []),
      score || null,
      lastContacted,
      avatarUrl || null,
      req.params.id,
      req.user.id
    );

    const updatedLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);

    res.json({
      ...updatedLead,
      gaData: JSON.parse(updatedLead.gaData || '{}'),
      interactions: JSON.parse(updatedLead.interactions || '[]')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;

    const existingLead = db.prepare('SELECT * FROM leads WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    db.prepare('UPDATE leads SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?')
      .run(status, req.params.id, req.user.id);

    const updatedLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);

    res.json({
      ...updatedLead,
      gaData: JSON.parse(updatedLead.gaData || '{}'),
      interactions: JSON.parse(updatedLead.interactions || '[]')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lead
router.delete('/:id', (req, res) => {
  try {
    const existingLead = db.prepare('SELECT * FROM leads WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    db.prepare('DELETE FROM leads WHERE id = ? AND userId = ?').run(req.params.id, req.user.id);

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
