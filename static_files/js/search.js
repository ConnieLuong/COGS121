function search(query){
    //search thru each collection
    var tips = searchTips(query);
    var songs = searchSongs(query);
    var stories = searchStories(query);

    //return object containing search results
    return {
        tips: tips, 
        songs: songs, 
        stories: stories
    };
}

function searchTips(query){

}

function searchSongs(query){

}

function searchStories(query){
    
}