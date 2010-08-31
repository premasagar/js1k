_(window.innerWidth, window.innerHeight, document.body.clientWidth, document.body.clientHeight);

var // Maths
    M = Math,
    phi = .618,
    PHI = 1 / phi,
    phiTenth = phi / 10,
    RGBMAX = 255,
    ceil = M.ceil,
    random = M.random,
    pow = M.pow,
    
    // Window & document
    win = this,
    doc = document,
    canvas = doc.getElementById('c'),
    ctx = canvas.getContext('2d'),
    width = canvas.width = win.innerWidth,
    height = canvas.height = win.innerHeight,    
    
    // Settings
    fps = PHI * 10,
    unitsPerFrame = phi * 100,
    multiplier = phi,
    maxRadiusFactor = phi, // should be 0 to 1
    
    // Modifiers
    tone = randomInt(3),
    maxRadius = width * pow(phi, phi * (20 - (maxRadiusFactor * 10))), // should be pow(phi, phi * 10) to pow(phi, phi * 16)
    
    // Timeline
    frequency = 1000 / fps,
    intervalRef,
    
    // String lookups
    length = 'length',
    rgba = 'rgba(',
    rgbaBlack = rgba + '0,0,0,',
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
    function color(which){
        return ceil(tone === which ? RGBMAX : randomInt(RGBMAX));
    }

    var x = randomInt(width),
        y = randomInt(height),
        intensity,
        r = color(0),
        g = color(1),
        b = color(2),
        factor,
        radius,
        rgbStr1 = rgba + r + ',' + g + ',' + b + ',',
        rgbStr2 = rgba + ceil(r * phiTenth) + ',' + ceil(g * phiTenth) + ',' + ceil(b * phiTenth) + ',',
        rgbStroke;

    // Calculate new position
    x = x * PHI;
    y = y * PHI;

    // Wrap around at boundaries to the canvas width and height
    if (x > width || x < 0){
        x = x > width ?
            2 * width - x :
            0 - x;
    }
    if (y > height || y < 0){
        y = y > height ?
            2 * height - y :
            0 - y;
    }
    
    intensity = ((x / width) + (y / height)) / 2; // x, y position, in relation to the available width and height
    factor = random() * intensity;
    
    // path for circle
    ctx[beginPath]();
    ctx.arc(x, y, ceil(factor * maxRadius), 0, M.PI * 2, 0);
    ctx[closePath]();
    
    // styles
    rgbStroke = (randomInt(PHI) ? rgbStr2 : rgbStr1) + factor +')';
    ctx[strokeStyle] = rgbStroke;
    ctx.fillStyle = rgbStr1 + (factor * intensity) +')';
    
    // draw
    ctx[stroke]();
    ctx.fill();
    return [x, y, intensity, rgbStroke];
}

function frame(){
    var units = [],
        firstUnits;

    for (var i = 0; i < unitsPerFrame; i++){
        units[i] = unit();
    }
    firstUnits = units.slice(0,2)
    
    // coloured lines
    if (randomInt(PHI)){
        lines(firstUnits);
        ctx[strokeStyle] = units[0][3];
        ctx[stroke]();
        
        // darken later, sometimes
        /*
        if (randomInt(PHI)){
            setTimeout(function(){
                lines(firstUnits);
                ctx[strokeStyle] = rgbaBlack + (units[0][2] * maxRadiusFactor) + ')';
                ctx[stroke]();
            }, PHI * 1000);
        }
        */
    }
    
    // black
    lines(units.slice(2));
    ctx[strokeStyle] = rgbaBlack + (phi * units[2][2] * maxRadiusFactor) + ')';
    ctx[stroke]();
}

// Set body style
doc.body.style.cssText = 'margin:0;background:#000;overflow:hidden';

setInterval(frame, frequency);
/*
// toggle animation on any mouse click or key press
(canvas.onclick = doc.onkeydown = function(){
    intervalRef = intervalRef ?
        clearInterval(intervalRef) :    // clearInterval and set intervalRef to undefined
        setInterval(frame, frequency);  // setInterval and create reference to it
})(); // start animation
*/
