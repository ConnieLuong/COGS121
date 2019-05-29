function search(query) {
    //search thru each collection
    var tips = searchTips(query);
    var songs = searchSongs(query);
    var stories = searchStories(query);
}

function searchTips(query) {
    $.ajax({
        url: 'tips',
        type: 'GET',
        data: JSON,
        success: function (data) {
            var res = {};
            var tips = data; //{tip0:{tip_tags: [], tip_text:'', tip_title:''}...}

            //go through each tip and add it to res if any of tip_tags, tip_text, tip_title contains the query
            //tipValue = {tip_img:'', tip_num:'', tip_tags: [], tip_text:'', tip_title:''}
            _.each(tips, function (tipValue, tipKey) {
                var cleanedTipValue = _.chain(tipValue).omit(function (value, key, object) {
                        return (key == 'tip_img' || key == 'tip_num');
                    })// {tip_tags: ['a'], tip_text:'b', tip_title:'c'}
                    .values() // [['a'], 'b', 'c']
                    .flatten()// ['a','b','c']
                    .value(); // [tip_tags, tip_text, tip_title]
                
                
                _.each(cleanedTipValue, function (val) {
                    if (val.toLowerCase().includes(query.toLowerCase())) {
                        $.extend(res, {[tipKey]: tipValue});
                    }
                })
            });
            console.log("ajax call ==> tips res:", res);

            //TODO display results
            
        }
    });
}

function searchStories(query) {
    
    $.ajax({
        url: 'stories',
        type: 'GET',
        data: JSON,
        success: function (data) {
            var res = {};
            var stories = data; //{0:{Category: '', Content: '', Link: '', Name: '', No: ''}...}

            //go through each story and add it to res if any of category, content, name contains the query
            //tipValue = {category:'', content:'', link: '', name:'', No:''}
            _.each(stories, function (storyValue, storyKey) {
                var cleanedSongValue = _.chain(storyValue).omit(function (value, key, object) {
                    return (key == 'Link' || key == 'No');
                })// {Category: 'a', Content:'b', Name:'c'}
                .values() // ['a', 'b', 'c']
                .value();

                _.each(cleanedSongValue, function (val) {
                    if (val.toLowerCase().includes(query.toLowerCase())) {
                        $.extend(res, {[storyKey]: storyValue});
                    }
                })
            });

            console.log("ajax call ==> stories res:", res);

            //TODO display results
        }
    });
}

function searchSongs(query) {
    var res = {};
    $.ajax({
        url: 'songs',
        type: 'GET',
        data: JSON,
        success: function (data) {
            var favSongs = data.favorites; //{ track0:{}, track1:{}, ...}
            var hotSongs = data.hot;
            var newSongs = data.new;

            _.chain(favSongs).mapObject(function (value, key) {
                return {
                    album_name: value.album_name,
                    artist_name: value.artist_name,
                    track_name: value.track_name
                }
            }) //{track0: {album_name:'a', artist_name:'b', track_name:'c'}, ...}
            .each(function (trackValue, trackKey) {
                _.chain(trackValue).values() // ['a', 'b', 'c']
                .each(function (val) {
                    if (val.toLowerCase().includes(query.toLowerCase())) {
                        var newKey = 'favorite/'+ trackKey;
                        $.extend(res, {[newKey]: trackValue});
                    }
                })
                .value();
            });

            _.chain(hotSongs).mapObject(function (value, key) {
                return {
                    album_name: value.album_name,
                    artist_name: value.artist_name,
                    track_name: value.track_name
                }
            }) //{track0: {album_name:'a', artist_name:'b', track_name:'c'}, ...}
            .each(function (trackValue, trackKey) {
                _.chain(trackValue).values() // ['a', 'b', 'c']
                .each(function (val) {
                    if (val.toLowerCase().includes(query.toLowerCase())) {
                        var newKey = 'hot/'+ trackKey;
                        $.extend(res, {[newKey]: trackValue});
                    }
                })
                .value();
            });

            _.chain(newSongs).mapObject(function (value, key) {
                return {
                    album_name: value.album_name,
                    artist_name: value.artist_name,
                    track_name: value.track_name
                }
            }) //{track0: {album_name:'a', artist_name:'b', track_name:'c'}, ...}
            .each(function (trackValue, trackKey) {
                _.chain(trackValue).values() // ['a', 'b', 'c']
                .each(function (val) {
                    if (val.toLowerCase().includes(query.toLowerCase())) {
                        var newKey = 'new/'+ trackKey;
                        $.extend(res, {[newKey]: trackValue});
                    }
                })
                .value();
            });

            console.log("ajax call ==> songs res:", res);

            //TODO display results
        }
    });
}