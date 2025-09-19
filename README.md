# Constitution Connect

**A Digital Platform for Promoting Constitutional Literacy Using MERN Stack**

---

## Overview

Constitution Connect is an interactive web application designed to promote constitutional literacy among citizens. It simplifies complex constitutional topics and engages users through blogs, quizzes, and a chatbot. The platform makes the Indian Constitution accessible and understandable for everyone.

---

## Features

- Homepage with blog content explaining constitutional topics.  
- Interactive chatbot answering questions on articles, rights, and duties.  
- Quizzes on Preamble, Fundamental Rights, Directive Principles, and Fundamental Duties.  
- Contact & About pages for information and support.  
- Responsive design for desktop and mobile.

---

## Technology Stack

- **Frontend:** React, TailwindCSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Atlas or local)  
- **Tools & Utilities:** Git, GitHub, VS Code  

---

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/constitution-connect.git
cd constitution-connect
Install dependencies:

bash
Copy code
npm install
Create a .env file with:

ini
Copy code
MONGO_URI=your_mongodb_connection_string
PORT=5000
⚠️ Do NOT push .env to GitHub.

Run the server:

bash
Copy code
node server.js
# or
npm start
(Optional) Run frontend if in /client:

bash
Copy code
cd client
npm install
npm start
Open your browser:

Frontend: http://localhost:3000

Backend: http://localhost:5000

Folder Structure
bash
Copy code
/constitution-connect
├─ /client          # React frontend
├─ /server          # Node.js backend
├─ .env             # Environment variables (not pushed)
├─ .gitignore
├─ .env.example
├─ package.json
├─ README.md
└─ ...
