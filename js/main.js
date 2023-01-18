const video = document.getElementById("myvideo");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");
var currentHand ="";

let isVideo = false;
let model = null;

let videoInterval = 100;
let imgindex = 1;

//create enumeration of hand gestures
const handGesture = {
    open: "open",
    closed: "closed",
    point: "point",
    pinch: "pinch"
}
//declare array of hand gestures
let handGestures = [];

//make a spell array for point, closed, point, closed
let spellPointClose = [handGesture.point, handGesture.closed, handGesture.point, handGesture.closed];
//make a spell array for open, closed, open, closed
let spellOpenClose = [handGesture.open, handGesture.closed, handGesture.open, handGesture.closed];

$(".pauseoverlay").show()

const modelParams = {
    flipHorizontal: true,
    maxNumBoxes: 1,
    iouThreshold: 0.5,
    scoreThreshold: 0.6,
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}

trackButton.addEventListener("click", function () {
    toggleVideo();
});

function runDetection() {
    model.detect(video).then(predictions => {
        if (predictions[0]) {
            predictions.forEach(prediction => {
                console.log(prediction.label );
                if (prediction.label != "face") {
                    currentHand = prediction.label;
                }
                $(".handType p").css("color", "black");
                $("#hand" + currentHand ).css("color", "red");

                if (currentHand == "open") {
                    $(".c").css("background-color", "red");
                }
                if (currentHand == "closed") {
                    $(".c").css("background-color", "green");
                }
                if (currentHand == "point") {
                    $(".c").css("background-color", "blue");
                }
                if (currentHand == "pinch") {
                    $(".c").css("background-color", "yellow");
                }

                //add hand gesture to array do not add if it is the same as the last one or if empty
                if (handGestures[handGestures.length - 1] != currentHand || handGestures.length == 0)
                  {  handGestures.push(currentHand);
                    console.log(handGestures);
                  }
                //if last 4 gestures are the same as the spell array
                 
                if (handGestures.slice(-4).every((val, i) => val === spellPointClose[i])) {
                    //do something
                    console.log("spell cast");
                    //set body background to image wizard-2-original.png
                    $("body").css("background-image", "url('images/wizard-2-original.png')");


                }
                if (handGestures.slice(-4).every((val, i) => val === spellOpenClose[i])) {
                    //do something
                    console.log("spell cast");
                    //set body background to image wizard-2-original.png
                    $("body").css("background-image", "url('images/wizard-3-original.png')");


                }
                
            });

            let midval = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
            gamex = document.body.clientWidth * (midval / video.width)

        }
        if (isVideo) {
            setTimeout(() => {
                runDetection(video)
            }, 100);
        }
    });
}
var pauseGameAnimationDuration = 500;
// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false

    $(".overlaycenter").animate({
        opacity: 0,
        fontSize: "0vw"
    }, pauseGameAnimationDuration, function () {
        $(".pauseoverlay").hide()
    });
});
