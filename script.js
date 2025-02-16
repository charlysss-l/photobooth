const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const printButton = document.getElementById('print');
const counterDisplay = document.getElementById('counter');

const ctx = canvas.getContext('2d');
const maxPhotos = 4;
let photos = [];
let photoCount = 0;
let stream = null;
let countdown = 3; 
let countdownInterval;


function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(camStream => {
            stream = camStream;
            video.srcObject = stream;
            video.style.transform = "scaleX(-1)";
        })
        .catch(error => {
            alert("Camera access denied! Please allow camera permissions.");
            console.error("Error accessing camera:", error);
        });
}


captureButton.addEventListener('click', () => {
    captureButton.disabled = true; 

    countdown = 3;
    counterDisplay.textContent = `Starting in ${countdown}s`;
    countdownInterval = setInterval(updateCountdown, 1000);
});

function updateCountdown() {
    countdown--;
    counterDisplay.textContent = `Starting in ${countdown}s`;

    if (countdown <= 0) {
        clearInterval(countdownInterval); 
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
