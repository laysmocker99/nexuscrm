import { describe, it, expect, vi, beforeEach } from 'vitest';
import { leadsAPI, tasksAPI } from '../supabase-api';
import { MOCK_LEADS, MOCK_TASKS } from '../mock-data';

// Mock lib/supabase to force demo mode
vi.mock('../../lib/supabase', () => ({
  supabase: {},
  isDemoMode: true
}));

describe('Supabase API Mock (Demo Mode)', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should return initial mock leads', async () => {
    const leads = await leadsAPI.getAll();
    expect(leads).toHaveLength(MOCK_LEADS.length);
    expect(leads[0].firstName).toBe(MOCK_LEADS[0].firstName);
  });

  it('should create a new lead in mock storage', async () => {
    const newLeadData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      status: 'NOUVEAU',
      value: 1000
    };

    const createdLead = await leadsAPI.create(newLeadData as any);
    expect(createdLead.firstName).toBe('Test');
    expect(createdLead.id).toBeDefined();

    const leads = await leadsAPI.getAll();
    expect(leads).toHaveLength(MOCK_LEADS.length + 1);
    expect(leads.find(l => l.id === createdLead.id)).toBeDefined();
  });

  it('should update a lead', async () => {
    // First verify initial state
    const leadsBefore = await leadsAPI.getAll();
    const targetLead = leadsBefore[0];

    // Update
    const updatedLead = await leadsAPI.update(targetLead.id, { company: 'Updated Company' });
    expect(updatedLead.company).toBe('Updated Company');

    // Verify persistence
    const leadsAfter = await leadsAPI.getAll();
    const leadInDb = leadsAfter.find(l => l.id === targetLead.id);
    expect(leadInDb?.company).toBe('Updated Company');
  });

  it('should delete a lead', async () => {
    const leadsBefore = await leadsAPI.getAll();
    const targetId = leadsBefore[0].id;

    await leadsAPI.delete(targetId);

    const leadsAfter = await leadsAPI.getAll();
    expect(leadsAfter).toHaveLength(leadsBefore.length - 1);
    expect(leadsAfter.find(l => l.id === targetId)).toBeUndefined();
  });

  it('should toggle task completion', async () => {
    const tasks = await tasksAPI.getAll();
    const targetTask = tasks[0];
    const initialStatus = targetTask.completed;

    const updatedTask = await tasksAPI.toggle(targetTask.id);
    expect(updatedTask.completed).toBe(!initialStatus);

    const tasksAfter = await tasksAPI.getAll();
    const taskInDb = tasksAfter.find(t => t.id === targetTask.id);
    expect(taskInDb?.completed).toBe(!initialStatus);
  });
});
