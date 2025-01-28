# Flamin' Finger
Flamin' Finger is a web-based recreation of the 2003 maze arcade redemption game, aiming to match the original as closely as possible while providing modified gameplay for a more enjoyable experience.

### [Live Deployment](https://flamin-finger.netlify.app/)

![alt text](https://austinaluzzi.com/assets/images/flaminfinger.png "Demo Gameplay")

# Technologies
### Frontend
- React
- Tailwind CSS
- HTML Canvas

This is a single page application built in React with Tailwind to match the theme of the arcade cabinet. The actual game itself utilzies HTML Canvas, where logic runs on a game loop seperate from React's state management and component lifecycle.

Since the original source code of the game isn't available, the maze generation algorithm was developed from scratch. I used a popular DFS algorithm with backtracking, but I modified the generator to be weighted and biased towards the top right corner of the maze, resulting in smaller, straighter paths like the original.

### Backend
- Node.js
- MongoDB
- Mongoose
- JWT

### [Backend Source](https://github.com/aaluzzi/flamin-finger-backend)

The backend application is a simple Node.js with Express. User accounts are handled via OAuth2 with Discord, along with JWTs for stateless session management. The leaderboard data is stored in a MongoDB database, with Mongoose for ODM. 

# Modified Gameplay

The original game was designed to be jackpot-based. Players were presented with a single maze, and if they navigated it before the timer expired, they won the jackpot. However, the timer was rigged, making it impossible to win until a certain number of configured plays had been reached.

I’ve redefined the gameplay to be score-based. The game now starts with a long, unrigged timer (scaled to the maze size) for players. If the maze is navigated in time, the player's score increases, and a new maze is generated. Each successive maze has a shorter timer than the last, and the game ends when the timer runs out. High scores are tracked and can be uploaded to the online leaderboard.

On touchscreen devices, the maze size is reduced compared to the original to accommodate the smaller display. The online leaderboard is split between mouse and touch players for balance.

# Installation

### Prerequisites
- **Node.js and npm**

### Steps

1. Clone this repository
    ```
    git clone https://github.com/aaluzzi/flamin-finger.git
    cd flamin-finger
    ```
2. Install dependencies
    ```
    npm install
    ```
3. Run the application
    ```
    npm run dev
    ```