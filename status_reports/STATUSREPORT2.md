STATUS REPORT 2 4-14-17

TEAM1

1) This past week we split off to divide and conquer the different elements of the project. Progress for the week include beginning to implement templates for our index because each user’s profile/game statistics will be displayed on the home screen once they have logged in. We’ve begun to set up more of the server side.  The main data we’ll be storing is a JSON object for each player, with their wins, losses, username, password, and ELO.  We’ve also made the server side functions (although we haven’t integrated them with the front end) to verify login information.  The JSON string we’ll be storing will look like

{“username”: “attackerman”, “password”: “Very Secure Password”, “wins”: 6, “losses”: 7, 
“ELO”:1452, “Past_Games”: [{“opponent”: “other_username”, “win”: true, “opponent ELO”: 1400}, /*all past games */]}
    The last element is so we can chart/graph progress over time. We’ve also begun to work on the actual game, starting with a basic tile map and doing research into implementing the board and players with phaser2D. We’re also debating whether or not to implement the game as turn based or real time. Nevertheless we have created a basic map, and we expect to have a player icon moving on it soon.
    
2) Issues arose due to our divide and conquer method as most elements depend on one another. For example, templating requires information from the server, thus making it difficult to quickly progress without knowing the final formatting of the server.

3) Our group is scheduled to meet this saturday the 15th to address these issues. Ideally we will have a minimum value product for the html and css by the end of the next week. Additionally, progress on the game itself and the server side will continue.
