# ResolveHub – Complaint Management System

A responsive web application for submitting, tracking and resolving complaints. Built with **React**, **Tailwind CSS**, Bootstrap-style components and vanilla JavaScript, with a ready-to-import **MongoDB** dataset for backend integration.

## Features

- Submit complaints with name, title, category, priority and description
- Form validation with inline error messages
- Dashboard with live statistics (Total, Pending, In Progress, Resolved)
- Search (debounced) and status filters
- Update complaint status or delete complaints
- Complaint detail modal (closes with `Esc` or outside click)
- Light theme by default with a dark mode toggle
- Data saved in the browser (`localStorage`)
- Fully responsive (mobile, tablet, desktop)

## Tech Stack

| Layer | Technology |
|---|---|
| UI library | React 18 (hooks) |
| Styling | Tailwind CSS, custom Bootstrap-style components, CSS variables |
| Scripting | JavaScript (ES6+) |
| Database | MongoDB (seed data in `complaints.json`) |
| Tools | Git, GitHub, MongoDB Compass |

## React Concepts Used

Components and props, `useState`, `useReducer`, `useContext`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `React.memo`, custom hook (`useDebounce`), controlled forms, conditional rendering, lists and keys.

## Project Structure

```
complaint-management-system/
├── index.html          # Page entry point
├── css/
│   └── style.css       # Theme tokens and component styles
├── js/
│   ├── main.js         # Plain JavaScript (theme toggle, scroll shadow)
│   ├── app.jsx         # React source code
│   └── app.js          # Compiled version of app.jsx (loaded by index.html)
├── complaints.json     # Sample data (25 complaints) for MongoDB
└── README.md
```

## Current Status and Roadmap

The current version is a frontend application that stores data in `localStorage`. The MongoDB dataset is prepared for the next phase.

## Author

**Wahab ur Rehman**
GitHub: [Wahaburrehman](https://github.com/Wahaburrehman) · LinkedIn: [wahab-ur-rehman](https://linkedin.com/in/wahab-ur-rehman)
