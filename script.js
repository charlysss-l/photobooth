//Para ma-access yung live feed ng camera, in real-time
const video = document.getElementById('camera');

//Use current frame from the camera, it can saved as images by converting canvas into data URL
const canvas = document.getElementById('canvas');

//Pagnaclick na ni user itong button na to, photo capture from live video 
const captureButton = document.getElementById('capture');

// Once user captured desired number of photos this button allow to pint
const printButton = document.getElementById('print');

//shows countdown before each photo taken Capture 1/4...
const counterDisplay = document.getElementById('counter');

//ctx variable use to draw captured frame(photo) from video feed onto canvas
const ctx = canvas.getContext('2d');
//maximum number ng photos limit to 4
const maxPhotos = 4;
//empty array called photos. as photo captured from vide0 pwede save as base64 data URLs allows to store multiple photos for later use
//each photo captured is added in this array
let photos = [];
//use to track number of photos use has taken. each captured is incremented. use for Captured 1/4
let photoCount = 0;
//stream used to store live video once camera accessed. later used to stop webcam when photo capture completed
let stream = null;
//countdown variable set to 3 seconds
let countdown = 3; 
//countdownInterval variable stores the reference to the interval timer for the countdown
let countdownInterval;


//startCamera function: request permission from user to access webcam
function startCamera() {
    //navigator.mediaDevices.getUserMedia() API -paa ma-access yung webcam and microphone from user's device
    navigator.mediaDevices.getUserMedia({ video: true })
        //.then() use to handle Promise that getUserMedia returns. camStream is variable that hold the media steam from camera once granted
        .then(camStream => {
            //para magamit later to stop camera from other manipulation
            stream = camStream;
            //live feed from webcam display sa loob ng html
            video.srcObject = stream;
            //mirror camera feed
            video.style.transform = "scaleX(-1)";
        })
        //catch error if user denies camera or other issue occure pagina-access camera
        .catch(error => {
            alert("Camera access denied! Please allow camera permissions.");
            console.error("Error accessing camera:", error);
        });
}

//captureButton eventListener: when clicked function executed
captureButton.addEventListener('click', () => {
    //captureButton is disabled once clicked. para maprevent user from clicking it multiple times
    captureButton.disabled = true; 
    //initialize countdown to 3secs
    countdown = 3;
    //updates text content of counterDisplay element to display message Starting in 3s
    counterDisplay.textContent = `Starting in ${countdown}s`;
    //will repeatedly call setInterval method every 1000 milliseconds (1second)
    countdownInterval = setInterval(updateCountdown, 1000);
});

//Responsible for decreasing countdown timer every second
function updateCountdown() {
    //decrease value by 1 each tie function runs. First call: countdown = 3. Second call: countdown = 2 ... to countdown = 0 (stops countdown)
    countdown--;
    //updates display countdown on sceen
    counterDisplay.textContent = `Starting in ${countdown}s`;

    //check if countdown reach 0 or below
    if (countdown <= 0) {
        //stops countdown by clearing setInterval() function that updating countdown every second
        clearInterval(countdownInterval); 
        //calls capturePhoto function to automaticall take picture once countdown reaches 0
        capturePhoto();
    }
}

function capturePhoto() {
    if (photoCount < maxPhotos) {

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        photos.push(canvas.toDataURL('image/png'));
        photoCount++;

        counterDisplay.textContent = `Captured ${photoCount}/${maxPhotos}`;

        if (photoCount < maxPhotos) {

            countdown = 3; 
            setTimeout(() => {
                counterDisplay.textContent = `Starting in ${countdown}s`;
                countdownInterval = setInterval(updateCountdown, 1000);
            }, 1000); 
        } else {
            captureButton.style.display = "none"; 
            printButton.style.display = "block"; 
            
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            video.style.display = "none"; 
        }
    }
}


printButton.addEventListener('click', () => {
    sessionStorage.setItem('photos', JSON.stringify(photos));
    window.location.href = 'photostrip.html';
});


startCamera();
