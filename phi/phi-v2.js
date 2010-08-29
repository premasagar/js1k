var // Maths
    M = Math,
    phi = .618,
    PHI = 1 / phi,
    RGBMAX = 255,
    ceil = M.ceil,
    random = M.random,
    
    // Settings
    fps = 25,
    units = 10,
    multiplier = 0.1,
    maxDriftFactor = PHI / 100, // factor of canvas dimensions
    
    // Window & document
    win = this,
    doc = document,
    canvas = doc.getElementById('c'),
    ctx = canvas.getContext('2d'),
    width = canvas.width = win.innerWidth,
    height = canvas.height = win.innerHeight,    
    
    // Modifiers
    factor = multiplier * phi,
    maxDriftX = width * maxDriftFactor,
    maxDriftY = height * maxDriftFactor,
    maxRadius = width * PHI / 100,
    
    // Timeline
    frequency = 1 / fps,
    intervalRef
    
    // String lookups
    //length = 'length',
    rgba = 'rgba(',
    stroke = 'stroke',
    strokeStyle = stroke + 'Style',
    beginPath = 'beginPath',
    closePath = 'closePath';

// **

function randomInt(length){
    return ceil((length || 2) * random()) - 1;
}

function drift(maxDrift){
    return ceil(random() * (maxDrift * 2 + 1) - maxDrift / 2 - 1);
}

function circle(x, y, intensity){
    var intensity = x / width * (y / height) / 2, // x, y position, in relation to the available width and height
        radius = ceil(intensity * maxRadius); // TODO, add randomness
    
    // create paths
    ctx[beginPath]();
    ctx.arc(x, y, radius, 0, M.PI * 2, 0);
    ctx[closePath]();
    
    // styles
    //rbgStr = rgba + r + ',' + g + ',' + b + ',';
    //ctx[strokeStyle] = rbgStr + phi * drift +')';
    //ctx.fillStyle = rbgStr + (phi * phi * phi * drift) +')';
    
    // draw
    ctx[stroke]();
    ctx.fill();
}

function unit(){
    var x = randomInt(width - maxDriftX + 1),
        y = randomInt(height - maxDriftY + 1),
        factorX, factorY,
        directionX, directionY,
        driftX, driftY;
    
    // Randomise
    driftX = drift(maxDriftX);
    driftY = drift(maxDriftY);

    // Calculate new position
    factorX = x * factor;
    factorY = y * factor;
    x = ceil(x + (directionX ? factorX : -factorX) + driftX);
    y = ceil(y + (directionY ? factorY : -factorY) + driftY);

    // Wrap around at boundaries to the canvas width and height
    if (x > width || x < 0){
        x = x > width ?
            2 * width - x :
            0 - x;
        directionX = ~directionX; // swich bits, to reverse the direction
    }
    if (y > height || y < 0){
        y = y > height ?
            2 * height - y :
            0 - y;
        directionY = ~directionY;
    }
    
    // draw
    circle(x, y);
}

function frame(){
    for (var i = units; i; i--){
        unit();
    }
}

//setInterval(frame, frequency);

// toggle animation on any mouse click or key press
(canvas.onclick = doc.onkeydown = function(){
    intervalRef = intervalRef ?
        clearInterval(intervalRef) :    // clearInterval and set intervalRef to undefined
        setInterval(frame, frequency);  // setInterval and create reference to it
})(); // start animation
