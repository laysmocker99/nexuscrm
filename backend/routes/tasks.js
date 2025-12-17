import express from 'express';
import db from '../services/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Get all tasks
router.get('/', (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks WHERE userId = ? ORDER BY date DESC, time DESC').all(req.user.id);

    const parsedTasks = tasks.map(task => ({
      ...task,
      completed: Boolean(task.completed),
      priority: Boolean(task.priority)
    }));

    res.json(parsedTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', (req, res) => {
  try {
    const { id, title, type, date, time, completed, priority, description, amount } = req.body;

    db.prepare(`
      INSERT INTO tasks (id, title, type, date, time, completed, priority, description, amount, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title,
      type,
      date,
      time || null,
      completed ? 1 : 0,
      priority ? 1 : 0,
      description || null,
      amount || null,
      req.user.id
    );

    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    res.status(201).json({
      ...newTask,
      completed: Boolean(newTask.completed),
      priority: Boolean(newTask.priority)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/:id', (req, res) => {
  try {
    const { title, type, date, time, completed, priority, description, amount } = req.body;

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare(`
      UPDATE tasks SET
        title = ?,
        type = ?,
        date = ?,
        time = ?,
        completed = ?,
        priority = ?,
        description = ?,
        amount = ?
      WHERE id = ? AND userId = ?
    `).run(
      title,
      type,
      date,
      time || null,
      completed ? 1 : 0,
      priority ? 1 : 0,
      description || null,
      amount || null,
      req.params.id,
      req.user.id
    );

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    res.json({
      ...updatedTask,
      completed: Boolean(updatedTask.completed),
      priority: Boolean(updatedTask.priority)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle task completion
router.patch('/:id/toggle', (req, res) => {
  try {
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const newCompleted = existingTask.completed ? 0 : 1;

    db.prepare('UPDATE tasks SET completed = ? WHERE id = ? AND userId = ?')
      .run(newCompleted, req.params.id, req.user.id);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    res.json({
      ...updatedTask,
      completed: Boolean(updatedTask.completed),
      priority: Boolean(updatedTask.priority)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', (req, res) => {
  try {
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ? AND userId = ?').run(req.params.id, req.user.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
