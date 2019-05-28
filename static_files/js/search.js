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
    var res = [];
    $.ajax({
        url: 'tips',
        type: 'GET',
        data: JSON,
        success: function (data) {
            var tips = data; //{tip0:{tip_tags: [], tip_text:'', tip_title:''}...}
            
            //go through each tip and add it to res if any of tip_tags, tip_text, tip_title contains the query
            //tipValue = {tip_img:'', tip_num:'', tip_tags: [], tip_text:'', tip_title:''}
            _.each(tips, function(tipValue){
                _.chain(tipValue).omit(function(value, key, object) {
                    return (key=='tip_img' || key=='tip_num');
                })// {tip_tags: [], tip_text:'', tip_title:''}
                .values() // [[''], '', '']
                .flatten()// ['','','']
                .each(function(value, key){
                    if(value.includes(query)){
                        res.push(key);
                    }
                })
                .value(); // [tip_tags, tip_text, tip_title]
            });
        }
    });

    return _.uniq(res);
}

function searchStories(query){
    $.ajax({
        url: 'stories',
        type: 'GET',
        data: JSON,
        success: function (data) {
        }
    });
}

function searchSongs(query){
    $.ajax({
        url: 'songs',
        type: 'GET',
        data: JSON,
        success: function (data) {
        }
    });
}