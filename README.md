# To-do List (TaskBoard)

A lightweight, client-side To-do List web app with priorities, optional deadlines, and notifications. Tasks are stored per-user in localStorage so you can keep separate lists by entering different usernames.

Live demo
-- You can host this repo using GitHub Pages or any static file server. (No server required — app is plain HTML/CSS/JS.)

Features
- Add tasks with description and priority (Low / Medium / High).
- Optional deadline using a datetime picker.
- Optional notification flag to alert you when a task is due (in-app and browser notification if permission granted).
- View tasks with simple filtering (All / Pending / Completed / Priority).
- Per-user storage using localStorage: log in with any username to keep separate lists.

Files
- `index.html` — app UI
- `style.css` — styling
- `script.js` — app logic (task CRUD, localStorage, notifications)
- `README.md` — this file

Usage

1. Clone or download this repository.
2. Serve the folder with a local static server for best notifications support (recommended):

```powershell
cd "d:\lenovo\learning\javascript_learn\chai aur code\basic_projects\TO_DO_List"
# using python
python -m http.server 8000
# or with npx http-server
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

3. Enter a username and click "Get Started". If the username is new, an empty task list will be created.

4. Add tasks. Optionally set a deadline and enable "Notify me when due". The app will request browser notification permission the first time; allow it to receive system notifications.

Notes and limitations
- Browser notifications require user permission and typically require HTTPS or localhost. If you open the file via `file://`, browser notifications may not work.
- The app runs a simple in-page check every 30 seconds for due tasks. Notifications may appear up to 30 seconds after the exact deadline.
- If you close the tab or the browser, the in-page checker will not run. For persistent push notifications you'd need a Service Worker + Push setup and a backend.

Development

- The app is plain HTML/CSS/JS. No build step required.
- To modify code, edit `script.js` and `style.css`, then refresh your browser to see changes.

Contributing

If you'd like to contribute enhancements (edit UI, snooze, reminders), please open an issue or a pull request. Small, focused changes with explanatory commits are preferred.

License

This project is provided as-is. Add a license file if you plan to share it publicly (e.g., MIT license).

---

If you want, I can also:
- Expand the README with screenshots and a quick API/behavior section.
- Add a GitHub Actions workflow to validate the HTML/CSS on push.
- Create a GitHub Pages workflow to publish the app automatically.