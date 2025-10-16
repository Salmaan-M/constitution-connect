# Constitution Connect

A digital platform for promoting constitutional literacy among Indian citizens.

## Live Link

https://constitution-connect.onrender.com/ 

## Table of Contents
- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## About
Constitution Connect is a MERN stack project designed to increase awareness and understanding of the Indian Constitution. It provides interactive content, quizzes, blogs, and user engagement tools built using modern web technologies.

## Features
- User registration and authentication
- Informative blogs and educational resources
- Quizzes for learning and assessment
- Admin dashboard for managing content
- User profile management

## Installation
### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) (v6 or newer)
- [MongoDB](https://www.mongodb.com/)

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/constitution-connect.git
   cd constitution-connect
   ```

2. **Install dependencies for both client and server:**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables:**
   - Copy `server/config.env.example` to `server/config.env` and update with your MongoDB URI and desired settings.

4. **Start application (development mode):**
   ```bash
   npm run dev
   ```
   The client will run on [http://localhost:3000](http://localhost:3000), and the server on [http://localhost:5000](http://localhost:5000).

## Usage
- Open your browser and navigate to [http://localhost:3000](http://localhost:3000)
- Register or log in to access resources, quizzes, and more.

## Available Scripts
- `npm run dev` – Start both client and server concurrently (development)
- `npm run server` – Start backend server
- `npm run client` – Start frontend in development
- `npm run install-all` – Install dependencies for all parts
- `npm run build` – Build client for production
- `npm run start` – Start backend for production

## Technologies Used
- **Frontend:** React, React Router, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Others:** JWT authentication

## Contributing
Pull requests are welcome! For major changes, please open an issue to discuss what you would like to change. See [CONTRIBUTING.md](CONTRIBUTING.md) if available for more information.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
