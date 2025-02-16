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


function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(camStream => {
            stream = camStream;
            video.srcObject = stream;
        })
        .catch(error => {
            alert("Camera access denied! Please allow camera permissions.");
            console.error("Error accessing camera:", error);
        });
}


startCamera();

captureButton.addEventListener('click', () => {
    if (photoCount < maxPhotos) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        photos.push(canvas.toDataURL('image/png'));
        photoCount++;

        counterDisplay.textContent = `Captured ${photoCount}/${maxPhotos}`;

        if (photoCount === maxPhotos) {
            captureButton.style.display = "none"; 
            printButton.style.display = "block"; 
          
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            video.style.display = "none"; 
        }
    }
});

printButton.addEventListener('click', () => {
    
    sessionStorage.setItem('photos', JSON.stringify(photos));
    
    window.location.href = 'photostrip.html';
});
