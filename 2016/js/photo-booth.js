const albumId = '943881975650729';
const access_token = 'CAAMmZC7iJ1p0BAJSU8o84zbCxZCXRRJQmzV0QNir4wXvSwKrHBiZCUUYWF3Bwn56S9SNktbzVOzzYKD5fZCZAWSL7SF4ZA84gT8einf08zhvYuFqfSwE2eoNiutQBo1sCUqZBpwwhIGQe9oXEIPespd7GZBNLlZAUwx3ooVOZArgHKVUHs2WineQlh';

function setupUserMedia() {
    var canvas = document.getElementById("snapshot"),
        context = canvas.getContext("2d"),
        video = document.getElementById("live"),
        videoObj = {"video": true},
        errBack = function (error) {
            alert(error);
            console.log("Video capture error: ", error.code);
        };

    if (navigator.getUserMedia) { // Standard
        navigator.getUserMedia({"video": true}, function (stream) {
            video.src = stream;
            video.play();
        }, errBack);
    } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia({"video": true}, function (stream) {
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
        }, errBack);
    }
    else if (navigator.mozGetUserMedia) { // Firefox-prefixed
        navigator.mozGetUserMedia({"video": true}, function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, errBack);
    }
}

function snap() {
    live = document.getElementById("live");
    snapshot = document.getElementById("snapshot");

    // Make the canvas the same size as the live video
    snapshot.width = live.clientWidth
    snapshot.height = live.clientHeight

    // Draw a frame of the live video onto the canvas
    c = snapshot.getContext("2d")
    c.drawImage(live, 0, 0, snapshot.width, snapshot.height)

    $('#snapshot, #repeatControl, #uploadControl').show();
    $('#live, #snapControl').hide();
}

function upload() {
    var image = document.getElementById("snapshot").toDataURL("image/png");
    
    var photoPostRequest = new FormData();
    photoPostRequest.append("source", createBlob(image));
    photoPostRequest.append("access_token", access_token);
    //photoPostRequest.append("no_story", false);

    $.ajax({
        url: 'https://graph.facebook.com/v2.4/' + albumId + '/photos',
        data: photoPostRequest,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {
            alert("Woohoo, upload gelukt!");
        },
        error: function (response) {
            alert("Booo, upload mislukt!");
        }
    });
}

function createBlob(data) {
    var blob;
    try {
        var byteString = atob(data.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        blob = new Blob([ab], {type: 'image/png'});
    } catch (e) {
        console.log(e);
    }

    return blob;
}

function repeat() {
    $('#snapshot, #repeatControl, #uploadControl').hide();
    $('#live, #snapControl').show();
}
