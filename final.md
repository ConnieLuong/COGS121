## Team Name: 
Daddy in the house!

## Members & Contributions: 
1. Hao-In Choi
    * Assitant developer & Storyteller: contributed on developing the frontend, backend, and solving bugs. Presenting and pitching our app and ideas to graders.
    * In charge of some parts of the backend & frontend logic and ultilized the music API. For example, I scrapped the songs and lyrics from the API, did the logic for loading favorited tips to the favorite page and built the skeleton UI and logic for bedtime page.  
2. Connie Luong
    * Project leader: made sure all tasks assigned were going to be completed on time, cutting scope if needed.
    * In charge of most of the backend & frontend logic. For example, I did the logic for favoriting/unfavoriting items, user sign in/sign out/sign up,  searching, displaying tips on the main page (index), filtering, and updating profile.
3. Boya Ren
    * UI designer & Front-end developer: contributed to designing the user interface and implementing the visual elements.
    * In charge of creating prototypes & style guides and implementing the web design based on the prototypes. For example, I coded the styling for all pages in terms of the content layout, typography, icons, color and interactions and I made visuals for the presentation.
4. Alessandra Landingin
   *  UI Designer & Assistant Front-End Developer: contributed to designing the user interface and assisted in implementing the visual elemenets. 
   * In charge of creating prototypes & style guides and implementing the web design based on the prototypes.

## Source Code Files
### HTML
* `bedtime.html`: Displays songs and stories in the categories of "Editor's favorites", "Hot" and "New". Users can switch between songs and stories pages through pressing the tabs on the navbar.  
* `favorites.html`: Displays tips, songs, and stories that users saved in other pages in feed style. Allows for unfavoriting if the user is signed in. If the user has not signed in, he cannot use the function and an overlap will appear to ask him to sign in or sign up. 
* `index.html`: Diplays tips to the user depending on the filter user chooses. Allows for favoriting tips if the user is signed in. This is the home page.
* `nav.html`: Structure of the navigation bar that is attached to all pages on the site.
* `searchResults.html`: Displays the search results based on the query a user makes through the search bar at the top.
* `settings.html`: Allows users to update their name, email, and password.
* `signin.html`: Holds the Sign in/Sign up forms.
* `song.html`: Display the corresponding song title, artist and lyrics. Users can favorite/unfavorite the song in this page.
* `story.html`: Display the corresponding story title and content. Users can favorite/unfavorite the story in this page.

### CSS
* `bedtime.css`: styles the songs and stories cards and the sections
* `favorites.css` : styles all the favorited content
* `index.css`: styles the tips on the home page
* `nav.css`: styles the navigation bar
* `searchResults.css`: styles the search results
* `settings.css`: styles the settings page
* `signin.css`: styles the sign in/sign up forms
* `song.css`: styles the song content page
* `story.css`: styles the story content page
* `general.css`: contained the styling of the overall app

### JS
* `server.js`: Performs all the GET & POST calls to Firebase
* `bedtime.js`: Contains all the logic of loading songs and stories onto the page, regenerating new songs/tracks list, carousel and sending info to song.html and story.html
and carousel.
* `favorites.js`: Contains the logic for loading favorited tip, story, or song according to the user's data info
* `favoriteAction.js`: Contains the logic for favoriting or unfavoriting a tip, story, or song. Will update the user's info accordingly in the database
* `index.js`: Contains the logic to load the tips onto the page, as well as links the favorite action.
* `nav.js`: logic for the navbar & signin/signout button
* `search.js`: logic to process a user's search query, searching the whole site for matching tips, stories, and songs; returns results and displays on the searchResults page
* `settings.js`: makes appropriate api calls to properly update a user's profile or password
* `signin.js`: makes the api calls necessary to signin or signout a user
* `song.js`: Contains the logic for loading in specific song name and content based on the data passed from the url
* `story.js`: Contains the logic for loading in specific story name and content based on the data passed from the url

## Presentation Slide
* https://docs.google.com/presentation/d/1M9oDjkbW-VxojCRI3ZwjUyXuAKp5DZiQngTV1wGY9u0/edit?usp=sharing

## Demo Video
* https://vimeo.com/340057865

