Jonah Feldman, Nathan Allen, Liam Goldsten, Tyler Leong, Tyler Coleman

Project Title
    Light Cycles
    
Problem
When you want to play a simple competitive game against others over a computer 
browser that’s fun and challenging, what do you do?

Solution
    Develop a browser-based, turn-based game based off of snake and tron.

List Features
    Server-side data persistence
        We’re storing player account information, including username, password,
        wins, losses, ranking, etc.

    Front-end framework
        We’re using Phaser2d to create a turn based two-player game similar to 
        snake, or to tron. Each player will start near the center, across from
        each other, and moves up, down, left, or right, leaving a trail 
        of their color behind them. You lose if you cannot move, so the goal is 
        to trap your opponent between you “trail” and/or the wall.
    
    Back-end framework
    	We're also using socket.io on the server to match players and put them
    	into rooms. The communication of movement is also handled by the server.

Data Collected
    Tracks wins/losses for each registered player.
