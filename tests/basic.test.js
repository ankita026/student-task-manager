
 // @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest';

const setupHTML = () => {
  document.body.innerHTML = `
    <form id="task-form">
      <input id="task-input" />
      <button type="submit">Add Task</button>
    </form>

    <ul id="task-list"></ul>
    <p id="empty-message"></p>

    <span id="total-count"></span>
    <span id="pending-count"></span>
    <span id="completed-count"></span>

    <span id="completion-percent"></span>
    <div id="progress-fill"></div>
    <div id="progress-track"></div>
    <p id="progress-note"></p>

    <button data-filter="all">All</button>
    <button data-filter="pending">Pending</button>
    <button data-filter="completed">Completed</button>
  `;
};

describe('Student Task Manager', () => {
  beforeEach(async () => {
    // Create a fresh dashboard for every test.
    setupHTML();

    // Load the dashboard code again.
    vi.resetModules();
    await import('../script.js');
  });

  it('starts with zero tasks', () => {
    expect(document.getElementById('total-count').textContent).toBe('0');
    expect(document.getElementById('pending-count').textContent).toBe('0');
    expect(document.getElementById('completed-count').textContent).toBe('0');
  });

  it('adds a task and updates the dashboard', () => {
    const input = document.getElementById('task-input');
    input.value = 'Study Python';

    document.getElementById('task-form').requestSubmit();

    expect(document.querySelectorAll('.task-item')).toHaveLength(1);
    expect(document.getElementById('total-count').textContent).toBe('1');
    expect(document.getElementById('pending-count').textContent).toBe('1');
    expect(input.value).toBe('');
  });

  it('shows an alert when an empty task is submitted', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    document.getElementById('task-form').requestSubmit();

    expect(alertSpy).toHaveBeenCalledWith('Please enter a task name!');
    expect(document.querySelectorAll('.task-item')).toHaveLength(0);

    alertSpy.mockRestore();
  });

  it('marks a task as completed', () => {
    const input = document.getElementById('task-input');
    input.value = 'Finish assignment';

    document.getElementById('task-form').requestSubmit();

    document.querySelector('.task-item input[type="checkbox"]').click();

    expect(document.getElementById('completed-count').textContent).toBe('1');
    expect(document.getElementById('pending-count').textContent).toBe('0');
    expect(document.getElementById('completion-percent').textContent).toBe('100%');
  });

  it('deletes a task', () => {
    const input = document.getElementById('task-input');
    input.value = 'Delete this task';

    document.getElementById('task-form').requestSubmit();

    document.querySelector('.task-item button').click();

    expect(document.querySelectorAll('.task-item')).toHaveLength(0);
    expect(document.getElementById('total-count').textContent).toBe('0');
  });
});
