var tt_template;
var tc_template;
var story_template;
var song_template;
$(document).ready(function () {
    //instantiate templates
    tt_template = Handlebars.compile($('#tip-template').html()); //tip-template    
    tc_template = Handlebars.compile($('#tip-content-template').html()); //tip-content-template
    story_template = Handlebars.compile($('#story-template').html()); //story template
    song_template = Handlebars.compile($('#song-template').html()); //song template


    //instantiate query & search
    var query = localStorage.getItem("query");
    $('#query2').html(query);
    console.log("query:", query);
    if (query) {
        search(query);
        $('#query').val(query);
    }

    //if query null or search results empty display message

    //When click on a tip card image, show its content
    $(document).on("click", ".card-img-top", function (event) {
    // $(document).on("click", ".card-title", function (event) {
        const tipNum = event.target.id;
        console.log("clicking a tip:", event.target.id);

        //if content is showing, don't show content.
        if (event.target.classList.contains("showing")) {
            event.target.classList.remove("showing");
            $('#' + tipNum + 'content').remove();
        }
        //else mark element as showing & show content
        else {
            event.target.classList.add("showing");
            showTipContent(tipNum, tc_template);

            //check if tip is favorited
            $.ajax({
                url: 'getFavorite',
                type: 'POST',
                data: { collection: "tips" },
                success: function (data) {
                    console.log("Checking if ", tipNum, " is favorited: ", data);
                    var userFavTips = Object.keys(data);
                    //if a user is signed in and current tip is in their favorites
                    if (userFavTips.length > 0 && userFavTips.includes(tipNum)) {
                        $('.favorite').html('<i class="fas fa-star fa-fw"></i> Favorited');
                    }
                },
            });
        }
    });

})
function search(query) {
    //search thru each collection
    searchTips(query);
    searchSongs(query);
    searchStories(query);
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
                    return (key == 'tip_img');
                })// {tip_tags: ['a'], tip_text:'b', tip_title:'c'}
                    .values() // [['a'], 'b', 'c']
                    .flatten()// ['a','b','c']
                    .value(); // [tip_tags, tip_text, tip_title]


                _.each(cleanedTipValue, function (val) {
                    if (val.toLowerCase().includes(query.toLowerCase())) {
                        $.extend(res, { [tipKey]: tipValue });
                    }
                })
            });
            console.log("ajax call ==> tips res:", res);

            //display results
            if(Object.keys(res).length == 0){
                $('.tipResults').append("No results");
                return;
            }
            _.each(res, function (e) {
                var html = tt_template(e);
                $('.tipResults').append(html);
            });
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
                // var cleanedSongValue = _.chain(storyValue).omit(function (value, key, object) {
                //     return (key == 'Link' || key == 'No');
                // })// {Category: 'a', Content:'b', Name:'c'}
                //     .values() // ['a', 'b', 'c']
                //     .value();

                var cleanedSongValue = _.chain(storyValue).omit(function (value, key, object) {
                    return (key == 'No');
                })// {Category: 'a', Content:'b', Name:'c'}
                    .values() // ['a', 'b', 'c']
                    .value();


                _.each(cleanedSongValue, function (val) {
                    if (val.toLowerCase().includes(query.toLowerCase())) {
                        $.extend(res, { [storyKey]: storyValue });
                    }
                })
            });

            console.log("ajax call ==> stories res:", res);

            //TODO display results
            _.each(res, function (e) {
                var html = story_template(e);
                $('.storyResults').append(html);
            });
            if(Object.keys(res).length == 0){
                $('.storyResults').append("No results");
                return;
            }
            // $('.storyResults').append('No results');
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
                    track_name: value.track_name,
                    cover_art: value.cover_art
                }
            }) //{track0: {album_name:'a', artist_name:'b', track_name:'c'}, ...}
                .each(function (trackValue, trackKey) {
                    _.chain(trackValue).values() // ['a', 'b', 'c']
                        .each(function (val) {
                            if (val.toLowerCase().includes(query.toLowerCase())) {
                                var newKey = 'favorite/' + trackKey;
                                $.extend(res, { [newKey]: trackValue });
                            }
                        })
                        .value();
                });

            _.chain(hotSongs).mapObject(function (value, key) {
                return {
                    album_name: value.album_name,
                    artist_name: value.artist_name,
                    track_name: value.track_name,
                    cover_art: value.cover_art
                }
            }) //{track0: {album_name:'a', artist_name:'b', track_name:'c'}, ...}
                .each(function (trackValue, trackKey) {
                    _.chain(trackValue).values() // ['a', 'b', 'c']
                        .each(function (val) {
                            if (val.toLowerCase().includes(query.toLowerCase())) {
                                var newKey = 'hot/' + trackKey;
                                $.extend(res, { [newKey]: trackValue });
                            }
                        })
                        .value();
                });

            _.chain(newSongs).mapObject(function (value, key) {
                return {
                    album_name: value.album_name,
                    artist_name: value.artist_name,
                    track_name: value.track_name,                    
                    cover_art: value.cover_art
                }
            }) //{track0: {album_name:'a', artist_name:'b', track_name:'c'}, ...}
                .each(function (trackValue, trackKey) {
                    _.chain(trackValue).values() // ['a', 'b', 'c']
                        .each(function (val) {
                            if (val.toLowerCase().includes(query.toLowerCase())) {
                                var newKey = 'new/' + trackKey;
                                $.extend(res, { [newKey]: trackValue });
                            }
                        })
                        .value();
                });

            console.log("ajax call ==> songs res:", res);

            // TODO display results
            _.each(res, function (e) {
                var html = song_template(e);
                $('.songResults').append(html);
            });

            if(Object.keys(res).length == 0){
                $('.songResults').append("No results");
                return;
            }
            // $('.songResults').append('No results');
        }
    });
}

function showTipContent(tipNum, tc_template){
    $.ajax({
        url: 'tips',
        type: 'GET',
        data: JSON,
        success: function (data) {
            var tips = data;
            var html = tc_template(tips[tipNum]);
            $('#' + tipNum + 'card').append(html);
        },
    });
}

//knowing which song is clicked
function getTrackDetails(track_name, artist_name, section) {
    console.log(track_name);
    console.log(artist_name);
    console.log(section);
    url =
      "./song.html?name=" +
      encodeURIComponent(track_name) +
      "&artist=" +
      encodeURIComponent(artist_name) +
      "&section=" +
      encodeURIComponent(section);
    console.log(url);
  
    document.location.href = url;
  }
  
  function getStoryDetails(story_name) {
    console.log(story_name);
    url = "./story.html?name=" + encodeURIComponent(story_name);
    console.log(url);
    document.location.href = url;
  }