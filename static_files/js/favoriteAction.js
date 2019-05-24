$(document).ready(function () {
    //Favorites
    $(document).on("click", ".favorite", function(event){
        console.log("attempting to favorite...");
        $.ajax({
            url: 'favorite',
            type: 'POST', 
            data: {
                    collection: 'tips',
                    item: event.target.id
                },
            success: (data) => {
                console.log(data);
                console.log(data.message);
                
                //change ui
                switch (data.message){
                    case "Added item to your favorites":
                        $('.favorite').html('<i class="fas fa-star fa-fw"></i> Favorited');
                        break;
                    default:
                        $('.favorite').html('<i class="far fa-star fa-fw"></i> Favorite');
                        break;
                }
                //alert(data.message);
            },
            error: (data) => {
                console.log(data.message);
                alert(data.message);
            }
        });
    });
});