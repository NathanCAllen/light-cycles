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
		We’ll be storing player account information, including username, 
		password, wins, losses, ranking, etc.

	Front-end framework including (React)
		We’re using react to create a turn based two-player game similar to 
		snake, or to tron. We’ll be creating a grid, where each player starts 
		in opposite corners, and moves up, down, left, or right, leaving a trail 
		of their color behind them. You lose if you cannot move, so the goal is 
		to trap your opponent between you “trail” and/or the wall. 	
	
	Reporting with charts and graphs
		Stored player data (W/L, Elo) will be made available to the user. 
		Graphs of this information will also be available to users, and a 
		basic leaderboard will be displayed on our homepage.

Data Collected
	Track wins/losses for each registered player.
	Allow character images to be uploaded to server and stored.


Algorithms and Special Techniques
	Algorithm to compute Elo rating for individual players.
	Algorithm to determine randomized features of map.

#Comments by Ming
* Very cool idea. Please tell me that one can use the traditional arrow keys to play the game. My only question: is React the right framework for this?
