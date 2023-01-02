// utility functions
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function move(image, x, y) {
    image.style.left = x;
    image.style.top = y;
}

function getDimensions(image) {
    let width = image.getAttribute("width");
    let height = image.getAttribute("height");

    if (width != null && height != null) {
        return [parseInt(width), parseInt(height)];
    }

    // if getting the width & height from the specific attributes
    // didn't work, then get the values from the viewbox
    let viewbox = image.getAttribute("viewBox");

    if (viewbox == null) {
        return [300, 150]; // default dimensions for SVG
    }

    viewbox = viewbox.split(" ");

    // TODO: add the offsets of min-x and min-y to the width & height
    width = parseInt(viewbox[2]);
    height = parseInt(viewbox[3]);

    return [width, height];
}

function changeDirection(index, value) {
    direction[index] = value;

    // check if color randomization is enabled and if the direction changed
    if (randomizeColor) {
        logo.style.fill = `rgb(${randint(0, 255)}, ${randint(0, 255)}, ${randint(0, 255)})`;
    }
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
const dimensions = getDimensions(logo);

const initalColor = params.has("initalColor") ? params.get("initalColor") : "white";
const randomizeColor = params.has("randomizeColor") ? params.get("randomizeColor") : true;

const speed = params.has("speed") ? params.get("speed") : 1;

// variables
let x = randint(1, window.innerWidth - dimensions[0] - 1);
let y = randint(1, window.innerHeight - dimensions[1] - 1);

let direction = [1, 1];

// set the ID and the fill color to the logo
logo.id = "dvd-logo";
logo.style.fill = initalColor;

// add the logo to the page
document.body.append(logo);

// move the logo to the randomized initial position
move(logo, x, y);

// main loop
setInterval(() => {
    // change the coords based on the direction & speed
    x += speed * direction[0];
    y += speed * direction[1];

    // check if logo is bouncing on the left/right side
    if (x <= 1) {
        changeDirection(0, 1);
    } else if (x + dimensions[0] + 1 >= window.innerWidth) {
        changeDirection(0, -1);
    }
    
    // check if logo is bouncing on the top/bottom side
    if (y <= 1) {
        changeDirection(1, 1);
    } else if (y + dimensions[1] + 1 >= window.innerHeight) {
        changeDirection(1, -1);
    }

    // move the logo to the current X and Y coords
    move(logo, x, y);
});