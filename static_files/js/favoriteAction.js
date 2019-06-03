/**
 * File: favoriteAction.js
 * Description: Contains the logic for favoriting or unfavoriting a tip, 
 *              story, or song. Will update the user's info accordingly 
 *              in the database.
 * Author: Connie Luong
 */
$(document).ready(function () {
    //Favorites
    $(document).on("click", ".favorite", function (event) {
        console.log("attempting to favorite...");

        //determine collection & item
        var url = document.location.pathname;
        var collection = (url.includes('index') || url.includes('search')) ? 'tips' : (url.includes('story') ? 'stories' : 'songs');
        var item = (collection == 'songs') ? event.target.id : event.target.id;

        $.ajax({
            url: 'favorite',
            type: 'POST',
            data: {
                collection: collection,
                item: item
            },
            success: (data) => {
                console.log(data);
                console.log(data.message);
                if (data.message == "Please sign in to add to favorites.")
                    alert(data.message);

                //change favorite button if favorited/unfavorited
                switch (data.message) {
                    case "Added item to your favorites":
                        $('.favorite').html('<i class="fas fa-star fa-fw"></i> Favorited');
                        break;
                    default:
                        $('.favorite').html('<i class="far fa-star fa-fw"></i> Favorite');
                        break;
                }
            },
            error: (data) => {
                console.log(data.message);
                alert(data.message);
            }
        });
    });
});