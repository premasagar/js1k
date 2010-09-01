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
    
    // Settings
    frequency = 10,
    unitsPerFrame = PHIten * PHI,
    driftFactor = PHI / 100,
    driftFactorWidth = width * driftFactor,
    driftFactorHeight = height * driftFactor,
    maxProximity = hypotenuse(width, height),
    
    // Modifiers
    tone = randomInt(3),
    
    // String lookups
    len = 'length',
    rgba = 'rgba(',
    rgbaBlack = rgba + '0,0,0,',
    stroke = 'stroke',
    strokeStyle = stroke + 'Style',
    beginPath = 'beginPath',
    closePath = 'closePath',
    units = [],
    
    // Declarations
    intensity, factor, radius, rgbStroke, firstCoords, i, x, y, r, g, b, rgbStr1, rgbStr2, driftX, driftY, lineToCoords, comparisonColor, xy;

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
    xy = units[i = units[len] - 1];
        
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
        return which == tone ? (intensity > phiTenth ? RGBMAX : (intensity > phi * phi ? randomInt(61) + 195 : randomInt(98) + 158)) : randomInt(RGBMAX);
    }
    
    units[len] = i = 0;
    driftX = drift(driftFactorWidth);
    driftY = drift(driftFactorHeight);
    lineToCoords = randomInt(PHIten) ? // select coordinates to use in this run
        [phiWidth + driftX, phiHeight + driftY] :
        [randomInt(width), randomInt(height)];

    // Main calculation loop
    for (; i < unitsPerFrame; i++){
        x = randomInt(width / PHI) * PHI;
        y = randomInt(height / PHI) * PHI;
        
        // Intensity
        intensity = 1 - hypotenuse(x - phiWidth, y - phiHeight) / maxProximity; // proximity to the Golden Ration coords
        factor = random() * intensity * (intensity / PHI);
        radius = driftFactorWidth * (randomInt(PHIten) ? factor * PHI : (1 - factor * phi));
        //radius = driftFactorWidth / 2;
        
        // Colors
        r = color(0);
        g = color(1);
        b = color(2);
        rgbStr1 = rgba + r + ',' + g + ',' + b + ',';
        
        // Path for circle
        ctx[beginPath]();
        ctx.arc(x, y, radius, 0, pi2, 0);
        ctx[closePath]();
        
        // Canvas styles
        ctx[strokeStyle] = rgbStroke = (randomInt(PHI) ? rgba + r * phiTenth + ',' + g * phiTenth + ',' + b * phiTenth + ',' : rgbStr1) + factor +')';
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
    ctx[strokeStyle] = rgbaBlack + (phi * phi * firstCoords[2]) + ')';
    ctx[stroke]();
}

// Set body style
doc.body.style.cssText = 'margin:0;background:#000;overflow:hidden';

setInterval(frame, frequency);
/*
// toggle animation on any mouse click or key press
var intervalRef;
(canvas.onclick = doc.onkeydown = function(event){
    if (!event || event.which == 1 || event.which == 32){
        intervalRef = intervalRef ?
            clearInterval(intervalRef) :    // clearInterval and set intervalRef to undefined
            setInterval(frame, frequency);  // setInterval and create reference to it
    }
})(); // start animation
*/
