TO_DO_List — Deadline & Notification feature

What I changed

- Added a Deadline input (`<input id="deadline-input" type="datetime-local">`) when creating a task.
- Added a "Notify me when due" checkbox (`#notify-checkbox`).
- Tasks now save `deadline` (ISO string) and `notify` (boolean) in localStorage alongside other task properties.
- A background checker runs every 30 seconds and will show an in-app notification and a browser notification (if the user granted permission) when a task deadline is reached. Once notified a task is marked internally as `_notified` to avoid repeats.
- Deadlines are shown in the task card; overdue deadlines are highlighted in red.

How to use

1. Open `TO_DO_List/index.html` in your browser.
2. Log in with a username.
3. Add a task, optionally set a deadline and check "Notify me when due".
4. To receive browser notifications, allow notifications when the browser prompts you (the app requests permission automatically).
5. Keep the tab open (or in the background) — the app checks every 30s and will notify when the deadline passes.

Notes & limitations

- Browser notifications require HTTPS or localhost and user permission. If running the file via `file://` you may not see browser notifications — open the page through a local server (e.g., `npx http-server` or similar) or host it.
- The notification check runs in-page every 30 seconds, so notifications may appear up to 30s after the deadline.
- The code stores a temporary `_notified` flag on tasks to avoid duplicate notifications. That flag is saved in localStorage.

Next steps (optional)

- Add a UI to edit a task's deadline or to clear the `_notified` flag.
- Allow scheduling reminders some minutes before the deadline.
- Persist notification history or allow snoozing.

If you'd like, I can add an "edit" UI for deadlines and a snooze option next.