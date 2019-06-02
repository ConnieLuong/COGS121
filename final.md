## Team Name: 
Daddy in the house!

## Members & Contributions: 
1. Hao-In Choi
2. Connie Luong
    * Project leader: made sure all tasks assigned were going to be completed on time, cutting scope if needed.
    * In charge of most of the backend & frontend logic. For example, I did the logic for favoriting/unfavoriting items, user sign in/sign out/sign up,  searching, displaying tips on the main page (index), filtering, and updating profile.
3. Boya Ren 
4. Alessandra Landingin

## Source Code Files
### HTML
* `bedtime.html`
* `favorites.html`
* `index.html`: Diplays tips to the user depending on the filter user chooses. Allows for favoriting tips if the user is signed in. This is the home page.
* `nav.html`: Structure of the navigation bar that is attached to all pages on the site.
* `searchResults.html`: Displays the search results based on the query a user makes through the search bar at the top.
* `settings.html`: Allows users to update their name, email, and password.
* `signin.html`: Holds the Sign in/Sign up forms.
* `song.html`
* `story.html`

### CSS
* `bedtime.css`
* `favorites.css`
* `index.css`: styles the tips on the home page
* `nav.css`: styles the navigation bar
* `searchResults.css`: styles the search results
* `settings.css`: styles the settings page
* `signin.css`: styles the sign in/sign up forms
* `song.css`
* `story.css`

### JS
* `server.js`: Performs all the GET & POST calls to Firebase
* `bedtime.js`
* `favorites.js`
* `favoriteAction.js`: Contains the logic for favoriting or unfavoriting a tip, story, or song. Will update the user's info accordingly in the database
* `index.js`: Contains the logic to load the tips onto the page, as well as links the favorite action.
* `nav.js`: logic for the navbar & signin/signout button
* `search.js`: logic to process a user's search query, searching the whole site for matching tips, stories, and songs; returns results and displays on the searchResults page
* `settings.js`: makes appropriate api calls to properly update a user's profile or password
* `signin.js`: makes the api calls necessary to signin or signout a user
* `song.js`
* `story.js`


