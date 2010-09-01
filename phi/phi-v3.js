var // Window & document
    win = this,
    doc = document,
    canvas = doc.getElementById('c'),
    ctx = canvas.getContext('2d'),
    width = canvas.width = win.innerWidth,
    height = canvas.height = win.innerHeight,    
    
    // Maths
    M = Math,
    phi = .618,
    PHI = 1 / phi,
    phiTenth = phi / 10,
    phiTen = phi * 10,
    PHIten = PHI * 10,
    phiWidth = width * phi,
    phiHeight = height * phi,
    pi2 = M.PI * 2,
    RGBMAX = 255,
    ceil = M.ceil,
    random = M.random,
    pow = M.pow,
    powPHI = pow(PHI, phiTen),
    
    // Settings
    fps = PHIten,
    unitsPerFrame = PHIten * 10,
    multiplier = phi,
    maxRadiusFactor = phi, // should be 0 to 1
    driftFactor = pow(phi, 10),
    driftFactorWidth = width * driftFactor,
    driftFactorHeight = height * driftFactor,
    maxProximity = hypotenuse(width, height),
    
    // Modifiers
    tone = randomInt(3),
    maxRadius = width * pow(phi, phi * (20 - (maxRadiusFactor * 10))), // should be pow(phi, phi * 10) to pow(phi, phi * 16)
    
    // Timeline
    frequency = 1000 / fps,
    
    // String lookups
    len = 'length',
    rgba = 'rgba(',
    rgbaBlack = rgba + '0,0,0,',
    stroke = 'stroke',
    strokeStyle = stroke + 'Style',
    beginPath = 'beginPath',
    closePath = 'closePath',
    
    // Declarations
    intensity, factor, radius, rgbStroke, proximity, firstCoords, i, x, y, r, g, b, rgbStr1, rgbStr2, units, driftX, driftY, lineToCoords, comparisonColor, xy;

// **
    
function hypotenuse(a, b) {
    return M.sqrt((a * a) + (b * b));
}

function randomInt(len){
    return ceil((len || 2) * random()) - 1;
}

function drift(maxDrift){
    return ceil(random() * (maxDrift * 2 + 1) - maxDrift / 2 - 1);
}

function lines(units){ // i === coords.length
    i = units[len] - 1;
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

function frame(){
    function color(which){
        return which == tone ? (proximity < phiTenth ? RGBMAX : (proximity < phi * phi ? randomInt(61) + 195 : randomInt(98) + 158)) : randomInt(RGBMAX);
    }
    
    units = [];
    driftX = drift(driftFactorWidth);
    driftY = drift(driftFactorHeight);
    lineToCoords = randomInt(PHIten) ? // select coordinates to use in this run
        [phiWidth + driftX, phiHeight + driftY] :
        [randomInt(width), randomInt(height)];

    // Main calculation loop
    for (i = 0; i < unitsPerFrame; i++){
        x = randomInt(width);
        y = randomInt(height);
        
        // Calculate new position
        x = x * PHI;
        y = y * PHI;
        
        // Intensity
        proximity = hypotenuse(x - phiWidth, y - phiHeight) / maxProximity;
        intensity = 1 - proximity;
        factor = random() * intensity * (intensity / PHI);
        radius = maxRadius * (randomInt(powPHI) ? factor * PHI : (1 - factor * phi));
        
        // Colors
        r = color(0);
        g = color(1);
        b = color(2);
        rgbStr1 = rgba + r + ',' + g + ',' + b + ',';
        rgbStr2 = rgba + ceil(r * phiTenth) + ',' + ceil(g * phiTenth) + ',' + ceil(b * phiTenth) + ',';
        
        // Path for circle
        ctx[beginPath]();
        ctx.arc(x, y, radius, 0, pi2, 0);
        ctx[closePath]();
        
        // Canvas styles
        rgbStroke = (randomInt(PHI) ? rgbStr2 : rgbStr1) + factor +')';
        ctx[strokeStyle] = rgbStroke;
        ctx.fillStyle = rgbStr1 + (factor * intensity) +')';
        
        // Draw
        ctx[stroke]();
        ctx.fill();
        units[i] = [x, y, intensity, rgbStroke];
    }
    
    firstCoords = units[0];
    
    // coloured lines
    lines([firstCoords, lineToCoords]);
    ctx[strokeStyle] = firstCoords[3];
    ctx[stroke]();
    
    // black
    lines(units);
    ctx[strokeStyle] = rgbaBlack + (phi * firstCoords[2] * maxRadiusFactor) + ')';
    ctx[stroke]();
}

// Set body style
doc.body.style.cssText = 'margin:0;background:#000;overflow:hidden';

//setInterval(frame, frequency);

// toggle animation on any mouse click or key press
var intervalRef;
(canvas.onclick = doc.onkeydown = function(event){
    if (!event || event.which == 1 || event.which == 32){
        intervalRef = intervalRef ?
            clearInterval(intervalRef) :    // clearInterval and set intervalRef to undefined
            setInterval(frame, frequency);  // setInterval and create reference to it
    }
})(); // start animation

