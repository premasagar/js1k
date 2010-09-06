var // the var statement can be removed after minification, and the commas below changed to semicolons

    // Document
    doc = document,
    canvas = doc.getElementById('c'),
    ctx = canvas.getContext('2d'),
    width = canvas.width = innerWidth - 21,
    height = canvas.height = innerHeight - 21,
    
    // Maths
    M = Math,
    pi2 = 7, // over-approximation of 2*PI, for canvas arc drawing
    phi = .618,
    PHI = 1 / phi,
    phiTenth = phi / 10,
    PHIten = PHI * 10,
    phiWidth = width * phi,
    phiHeight = height * phi,
    RGBMAX = 255,
    ceil = M.ceil,
    random = M.random,
    
    // Settings
    frequency = 60,
    unitsPerFrame = 26, // approximation of PHI * PHI * 10
    driftFactor = .02,  // approximation of PHI / 100
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
    //closePath = 'closePath',
    onmouse = 'onmouse',
    units = [],
    
    // Declarations - these can all be removed after minification
    intensity, factor, radius, rgbStroke, firstCoords, i, x, y, r, g, b, rgbStr1, rgbStr2, driftX, driftY, lineToCoords, comparisonColor, xy, burst, lineStartOrigin;

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

function lines(units){
    ctx[beginPath]();
    lineStartOrigin = randomInt(PHIten);
    ctx.moveTo(
        lineStartOrigin ? phiWidth + driftX : randomInt(width),
        lineStartOrigin ? phiHeight + driftY : randomInt(height)
    );
    for (i = units[len]; xy = units[--i];){
        ctx.lineTo(xy[0], xy[1]);
    }
    //ctx[closePath]();
}

function frame(){
    function color(which){
        return which != tone || burst ?
            randomInt(RGBMAX) :            
            ceil((M.exp(intensity) / 2.72) * RGBMAX); // exponential intensity (2.72 ~= Math.exp(1))
    }
    
    units[len] = i = 0; // save bytes by emptying array and setting 'i' in one statement
    driftX = drift(driftFactorWidth);
    driftY = drift(driftFactorHeight);

    // Main calculation loop
    for (; i < unitsPerFrame; i++){
        x = randomInt(width / PHI) * PHI;
        y = randomInt(height / PHI) * PHI;
        
        // Intensity
        intensity = 1 - hypotenuse(x - phiWidth, y - phiHeight) / maxProximity; // proximity to the Golden Ration coords
        factor = random() * intensity * (intensity / PHI);
        radius = driftFactorWidth * (randomInt(PHIten) ? factor * PHI : (1 - factor * phi)); // add variety to radius - show large circles at the periphery only 1:PHI times
        
        // Colors
        r = color(0);
        g = color(1);
        b = color(2);
        rgbStr1 = rgba + r + ',' + g + ',' + b + ',';
        
        // Path for circle
        ctx[beginPath]();
        ctx.arc(x, y, radius, 0, pi2, 0);
        //ctx[closePath]();
        
        // Canvas styles
        ctx[strokeStyle] = rgbStroke = (randomInt(PHI) ? rgba + r * phiTenth + ',' + g * phiTenth + ',' + b * phiTenth + ',' : rgbStr1) + factor +')';
        ctx.fillStyle = rgbStr1 + (burst ? intensity * phi : factor * intensity) +')';
        
        // Draw
        ctx[stroke]();
        ctx.fill();
        units[i] = [x, y, intensity, rgbStroke];
    }
    
    firstCoords = units[0];
    
    // coloured lines
    lines([firstCoords]);
    ctx[strokeStyle] = firstCoords[3];
    ctx[stroke]();
    
    // black
    lines(units);
    ctx[strokeStyle] = rgbaBlack + (phi * phi * firstCoords[2]) + ')';
    ctx[stroke]();
}

// Set body style
canvas.style.background='#000';
burst = 0;
canvas[onmouse + 'up'] = canvas[onmouse + 'down'] = function(){
    burst = ~burst;
};

// Start animation

// For minified version, the line below is uncommented, and block below is commented
//setInterval(frame, frequency);

// toggle animation on any mouse click or key press
var intervalRef;
(canvas.onclick = doc.onkeydown = function(event){
    if (!event || /*event.which == 1 || */event.which == 32){
        intervalRef = intervalRef ?
            clearInterval(intervalRef) :    // clearInterval and set intervalRef to undefined
            setInterval(frame, frequency);  // setInterval and create reference to it
    }
})();
