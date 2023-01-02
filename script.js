// utility functions
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function move(image, x, y) {
    image.style.left = x;
    image.style.top = y;
}

// functions for getting the logo
function getLogoURL() {
    if (!params.has("logo")) {
        return "/logos/default.svg"
    }
    
    return params.get("logo");
}

function getLogo(url) {
    const request = new XMLHttpRequest();
    const parser = new DOMParser();
    
    request.open("GET", url, false);
    request.send(null);
    
    // parse and get the SVG element
    // if there are any errors along the way,
    // get the default "DVD Video" logo instead
    
    if (request.status != 200) {
        return getLogo("/logos/default.svg");
    }
    
    let image = parser.parseFromString(request.responseText, "text/html");

    if (image.querySelector("parsererror")) {
        return getLogo("/logos/default.svg");
    }
    
    image = image.querySelector("svg");

    if (image == null) {
        return getLogo("/logos/default.svg");
    }
    
    // filter any "background color defying" attributes in the SVG
    for (const element of image.querySelectorAll("[fill]")) {
        element.removeAttribute("fill");
    }

    for (const element of image.querySelectorAll("[style]")) {
        element.removeAttribute("style");
    }
    
    return image;
}

// constants
const params = new URLSearchParams(window.location.search);

const logo = getLogo(getLogoURL());
const speed = 1;

// variables
let x = randint(1, window.innerWidth - logo.clientWidth - 1);
let y = randint(1, window.innerHeight - logo.clientHeight - 1);

let direction = [1, 1];

// set the ID and the fill color to the logo
logo.id = "dvd-logo";
logo.style.fill = "white";

// add the logo to the page
document.body.append(logo);

// move the logo to the randomized initial position
move(logo, x, y);

// main loop
setInterval(() => {
    x += speed * direction[0];
    y += speed * direction[1];

    // check if logo is bouncing on the left/right side
    if (x <= 1) {
        direction[0] = 1;
    } else if (x + logo.clientWidth + 1 >= window.innerWidth) {
        direction[0] = -1;
    }
    
    // check if logo is bouncing on the top/bottom side
    if (y <= 1) {
        direction[1] = 1;
    } else if (y + logo.clientHeight + 1 >= window.innerHeight) {
        direction[1] = -1;
    }

    move(logo, x, y);
});