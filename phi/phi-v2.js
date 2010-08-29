var // Maths
    M = Math,
    phi = .618,
    PHI = 1 / phi,
    RGBMAX = 255,
    ceil = M.ceil,
    random = M.random,
    
    // Settings
    fps = 1,
    steps = 1,
    multiplier = 0.1,
    maxDriftFactor = PHI / 100, // factor of canvas dimensions
    
    // Window & document
    win = this,
    doc = document,
    canvas = doc.getElementById('c'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = win.innerWidth,
    h = canvas.height = win.innerHeight,    
    
    // Modifiers
    frequency = 1 / fps,
    factor = multiplier * phi,
    maxDriftX = w * maxDriftFactor,
    maxDriftY = h * maxDriftFactor,
    
    // Initialise
    x = randomInt(w - maxDriftX + 1),
    y = randomInt(h - maxDriftY + 1),
    xFactor = x * factor,
    yFactor = y * factor,
    dirX, dirY, driftX, driftY,
    intervalRef;


// **

function randomInt(length){
    return ceil((length || 2) * random()) - 1;
}

function drift(maxDrift){
    return ceil(random() * (maxDrift * 2 + 1) - maxDrift / 2 - 1);
}

function step(){
    driftX = drift(maxDriftX);
    driftY = drift(maxDriftY);

    x = ceil(x + (dirX ? xFactor : -xFactor) + driftX);
    y = ceil(y + (dirY ? yFactor : -yFactor) + driftY);

    if (x > w || x < 0){
        x = x > w ?
            2 * w - x :
            0 - x;
        dirX = ~dirX;
    }

    if (y > h || y < 0){
        y = y > h ?
            2 * h - y :
            0 - y;
        dirY = ~dirY;
    }
    
    _(x, y);
}

function frame(){
    for (var i = steps; i; i--){
        step();
    }
}

//setInterval(frame, frequency);

// toggle animation on any mouse click or key press
(canvas.onclick = doc.onkeydown = function(){
    intervalRef = intervalRef ?
        clearInterval(intervalRef) :    // clearInterval and set intervalRef to undefined
        setInterval(frame, frequency);  // setInterval and create reference to it
})(); // start animation
