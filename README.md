# Skyline Explorer 🏙️

> A beautiful, searchable interface for discovering and curating Wikipedia content and imagery.

## 📖 About the Project

Skyline Explorer takes the vast wealth of data and media available on Wikipedia and WikiImages and transforms it into a highly visual, user-friendly experience. It allows users to effortlessly search and filter through entries, while also providing a personalized dashboard to track their discoveries. 

Whether you are building a wishlist of places to go, tagging interesting topics, or logging entries you've already visited, this app makes exploring Wikipedia data interactive and personal.

### ✨ Key Features
* **Rich Data Integration:** Aggregates and beautifully presents text and imagery directly from Wikipedia/WikiImages.
* **Advanced Search & Filtering:** Quickly find exactly what you're looking for with robust search tools and custom filters.
* **Personalized Collections:** Logged-in users can save, tag, and organize their favorite entries.
* **Status Tracking:** Keep track of your real-world or digital explorations by marking entries as "wishlisted" or "visited."
* **Real-time Syncing:** User data and preferences are securely saved and synced instantly.

---

## 🛠 Tech Stack

This project combines a modern React interface with a robust backend for managing user accounts and saved data.

* **Frontend Framework:** [React](https://reactjs.org/) (via JSX)
* **Build Tool:** [Vite](https://vitejs.dev/) - for lightning-fast development and bundling.
* **Backend & Database:** [Supabase](https://supabase.com/) - handling secure user authentication and PostgreSQL data storage for tags/wishlists.
* **External APIs:** Wikipedia / Wikimedia Commons API for fetching content and images.
* **Static Pages:** Vanilla HTML, CSS, and standard JavaScript for the landing experience.

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

Make sure you have Node.js and npm (Node Package Manager) installed.
* [Download Node.js](https://nodejs.org/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/](https://github.com/)[your-username]/[your-repo-name].git

2. **Navigate to the project directory:**

Bash
cd [your-repo-name]

3. **Install dependencies:**

Bash
npm install

**Environment Variables**

To run this project, you will need to connect it to your Supabase project to handle the user accounts and saved/visited tags.

Create a .env.local file in the root directory.

Add your Supabase credentials (found in your Supabase project settings):

Code-Snippet
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
(Note: Never commit your .env files to GitHub!)

**💻 Available Scripts**
In the project directory, you can run:

npm run dev

Runs the app in the development mode.
Open http://localhost:5173 to view it in the browser. The page will reload if you make edits.

npm run build

Builds the app for production to the dist folder. It correctly bundles React in production mode and optimizes the build for the best performance.

npm run preview

Boots up a local static web server that serves the files from the dist folder, allowing you to check the production build locally.

🤝 Contributing
Contributions, issues, and feature requests are welcome!

📄 License
**All Rights Reserved**

The source code in this repository is made available for educational and portfolio purposes only.

Copyright © 2026 Moritz Engelhardt (EngelHeartWare). All rights reserved.

You are welcome to read the code to learn from it, but you may not use, copy, modify, merge, publish, distribute, sublicense, or sell copies of this software without explicit written permission.
