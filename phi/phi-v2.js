var // Maths
    M = Math,
    phi = .618,
    PHI = 1 / phi,
    RGBMAX = 255,
    ceil = M.ceil,
    random = M.random,
    pow = M.pow,
    
    // Settings
    fps = PHI,
    unitsPerFrame = phi * 100,
    multiplier = 1,
    maxDriftFactor = PHI / Infinity, // factor of canvas dimensions
    
    // Window & document
    win = this,
    doc = document,
    canvas = doc.getElementById('c'),
    ctx = canvas.getContext('2d'),
    width = canvas.width = win.innerWidth,
    height = canvas.height = win.innerHeight,    
    
    // Modifiers
    factor = 1 + (1 / multiplier * phi),
    maxDriftX = width * maxDriftFactor,
    maxDriftY = height * maxDriftFactor,
    maxRadius = width * pow(phi, phi * 16),
    
    // Timeline
    frequency = 1 / fps,
    intervalRef,
    
    // String lookups
    length = 'length',
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
    var radius = ceil(intensity * maxRadius),
        r = RGBMAX,
        g = RGBMAX,
        b = RGBMAX,
        rgbStr;
    
    // create paths
    ctx[beginPath]();
    ctx.arc(x, y, radius, 0, M.PI * 2, 0);
    ctx[closePath]();
    
    // styles
    //rbgStr = rgba + r + ',' + g + ',' + b + ',';
    //ctx[strokeStyle] = rbgStr + phi * drift +')';
    //ctx.fillStyle = rbgStr + (phi * phi * phi * drift) +')';
    rbgStr = rgba + r + ',' + g + ',' + b + ',';
    ctx[strokeStyle] = rbgStr + (phi * intensity) +')';
    ctx.fillStyle = rbgStr + (phi / PHI * intensity) +')';
    
    // draw
    ctx[stroke]();
    ctx.fill();
}

function lines(units){ // i === coords.length
    var i = units[length] - 1,
        xy = units[i];
        
    // draw connecting lines
    ctx[beginPath]();
    ctx.moveTo(xy[0], xy[1]);    
    for (; i; i--){
        xy = units[i-1];
        ctx.lineTo(xy[0], xy[1]);
    }
    ctx[closePath]();
}

function unit(){
    var x = randomInt(width - maxDriftX + 1),
        y = randomInt(height - maxDriftY + 1),
        factorX, factorY,
        directionX, directionY,
        driftX, driftY,
        intensity;
    
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
    x = x * PHI;
    y = y * PHI;
    
    intensity = ((x / width) + (y / height)) / 2; // x, y position, in relation to the available width and height
    _(x, y, intensity);
    circle(x, y, intensity);
    
    return [x, y, intensity];
}

function frame(){
    var units = [];

    for (var i = 0; i < unitsPerFrame; i++){
        units[i] = unit();
    }
    
    // white lines (don't do it)
    lines(units.slice(0,2));
    ctx[strokeStyle] = rgba + RGBMAX + ',' + RGBMAX + ',' + RGBMAX + ',' + phi * phi * units[0][2] + ')';
    ctx[stroke]();
    
    /*
    if (!randomInt(3)){
        window.setTimeout(function(){
            lines(units.slice(0,2));
            ctx[strokeStyle] = rgba + '0,0,0,' + units[0][2] + ')';
            ctx[stroke]();
        }, 1000);
    }
    */
    
    // black
    lines(units.slice(2));
    ctx[strokeStyle] = rgba + '0,0,0,' + phi * units[2][2] + ')';
    ctx[stroke]();
}

// Set body style
doc.body.style.cssText = 'margin:0;background-color:#000;overflow:hidden';

//setInterval(frame, frequency);

// toggle animation on any mouse click or key press
(canvas.onclick = doc.onkeydown = function(){
    intervalRef = intervalRef ?
        clearInterval(intervalRef) :    // clearInterval and set intervalRef to undefined
        setInterval(frame, frequency);  // setInterval and create reference to it
})(); // start animation
