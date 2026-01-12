const firebaseConfig = { databaseURL: "https://the-10-million-pixels-plus-default-rtdb.firebaseio.com/" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const cv = document.getElementById('mainCanvas');
const ctx = cv.getContext('2d');

const blockW = 60, blockH = 40; // আপনার পার্মানেন্ট সাইজ
const cols = 100, rows = 200; // ১০০ x ২০০ = ২০,০০০ ঘর
cv.width = cols * blockW; cv.height = rows * blockH;

let pixels = {};

function render() {
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = "#000000"; ctx.lineWidth = 0.5;

    // গ্রিড দাগ টানা
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath(); ctx.moveTo(i * blockW, 0); ctx.lineTo(i * blockW, cv.height); ctx.stroke();
    }
    for (let j = 0; j <= rows; j++) {
        ctx.beginPath(); ctx.moveTo(0, j * blockH); ctx.lineTo(cv.width, j * blockH); ctx.stroke();
    }

    Object.keys(pixels).forEach(id => {
        const p = pixels[id];
        if (p.imageUrl) {
            const img = new Image(); img.crossOrigin = "anonymous"; img.src = p.imageUrl;
            img.onload = () => { ctx.drawImage(img, p.x, p.y, blockW, blockH); };
        }
    });
}

function copyText(val) {
    navigator.clipboard.writeText(val).then(() => alert("Copied: " + val));
}

db.ref('pixels').on('value', s => {
    pixels = s.val() || {};
    const count = Object.keys(pixels).length;
    document.getElementById('sold-count').innerText = count;
    document.getElementById('rem-count').innerText = 20000 - count;
    render();
});
