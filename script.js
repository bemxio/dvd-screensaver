function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function move(image, x, y) {
    image.style.left = x;
    image.style.top = y;
}

// constants
const logo = document.getElementById("dvd-logo");
const speed = 1;

// variables
let x = randint(1, window.innerWidth - logo.clientWidth - 1);
let y = randint(1, window.innerHeight - logo.clientHeight - 1);
let direction = [1, 1];

// main loop
setInterval(() => {
    x += speed * direction[0];
    y += speed * direction[1];

    if (x <= 1) {
        direction[0] = 1;
    } else if (x + logo.clientWidth + 1 >= window.innerWidth) {
        direction[0] = -1;
    }
    
    if (y <= 1) {
        direction[1] = 1;
    } else if (y + logo.clientHeight + 1 >= window.innerHeight) {
        direction[1] = -1;
    }

    move(logo, x, y);
}, 0);