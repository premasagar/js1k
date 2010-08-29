// random integer: call it with the length of an array, to return a random index, or if no argument suppplied, then it returns 0 or 1
function randomInt(length){
    return ceil((length || 2) * random()) - 1;
}

var win = this,

    // Maths
    M = Math,
    phi = .618,
    PHI = 1 / phi,
    RGBMAX = 255,
    ceil = M.ceil,
    random = M.random,
    
    // Modifiers
    factor = PHI, //1 + PHI / (PHI * PHI),
    dirX, dirY, // flags to be bitwise toggled
    minX = 400,
    minY = minX,
    maxRadius = 100,
    
    // Render cycles
    intervalRef,
    frequency = 1000 / 25, // 1 second, per x frames
    steps = 10,
    
    // Document
    doc = document,
    
    // Canvas
    canvas = doc.getElementById('c'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = win.innerWidth,
    h = canvas.height = win.innerHeight,
    x, y,
    
    // Color
    colors = [],
    tone = randomInt(3),
    
    // String lookups
    length = 'length',
    rgba = 'rgba(',
    stroke = 'stroke',
    strokeStyle = stroke + 'Style',
    beginPath = 'beginPath',
    closePath = 'closePath';

function drawCircles(){
    var drift = random() + phi / 2,
        intenseColor = random() > .5, // in this loop, should the color be intense or not?
        intensity, radius, posX, posY, rbgStr, r, g, b;
    
    function colorComponent(color){
        return colors[color] = ceil(
            (intenseColor && color == tone) || (!intenseColor && color != tone) ? // if this color is the general tone
                intensity * RGBMAX : // then change it according to the intensity
                RGBMAX - (colors[color] || RGBMAX) * drift // otherwise, add some random component
        );
    }
    
    // direction & coords
    if (x > w - maxRadius / 2){
        dirX = ~dirX;
    }
    if (y > h - maxRadius / 2){
        dirY = ~dirY;
    }
    if (x <= minX){
        x = minX;
        dirX = 0;
    }
    if (y <= minY){
        y = minY;
        dirY = 0;
    }
    x = ceil(dirX ? x / factor * drift : x * factor);
    y = ceil(dirY ? y / factor * drift : y * factor);
    
    // intensity
    intensity = x / w;
    
    // color
    r = colorComponent(0);
    g = colorComponent(1);
    b = colorComponent(2);
    
    // radius
    radius = ceil(intensity * maxRadius * drift);
    
    // positions
    posX = ceil(x - minX - radius / 2); // TODO store var
    posY = ceil(y - minY - radius / 2);
    
    if (posX > w || posY > h){
        return [ceil(w / PHI) * drift, ceil(h / PHI) * drift];
    }
    
    // paths
    ctx[beginPath]();
    ctx.arc(posX, posY, radius, 0, M.PI * 2, 0);
    ctx[closePath]();
    
    // styles
    rbgStr = rgba + r + ',' + g + ',' + b + ',';
    ctx[strokeStyle] = rbgStr + phi * drift +')';
    ctx.fillStyle = rbgStr + (phi * phi * phi * drift) +')';
    
    // draw
    ctx[stroke]();
    ctx.fill();
    
    return [posX, posY];
}

function drawLines(coords){ // i === coords.length
    var i = coords[length] - 1,
        xy = coords[i];
    // draw connecting lines
    ctx[beginPath]();
    ctx.moveTo(xy[0], xy[1]);    
    for (; i; i--){
        xy = coords[i-1];
        ctx.lineTo(xy[0], xy[1]);
    }
    ctx[closePath]();
}

function render(){
    // draw circles, in a number of steps
    for (var coords = [], i = 0, xy; i < steps; i++){
        coords[i] = drawCircles();
    }
    
    // white lines (don't do it)
    drawLines(coords.slice(0,2));
    ctx[strokeStyle] = rgba + '100,100,100,.1)';
    ctx[stroke]();
    
    // black
    drawLines(coords);
    ctx[strokeStyle] = rgba + '0,0,0,.1)';
    ctx[stroke]();
}

doc.body.style.cssText = 'margin:0;background-color:#000;overflow:hidden';

x = ceil(w * random());
y = ceil(h * random());

// win.setInterval(render, frequency);

// toggle animation on any mouse click or key press
(canvas.onclick = doc.onkeydown = function(){
    intervalRef = intervalRef ?
        clearInterval(intervalRef) :    // clearInterval and set intervalRef to undefined
        setInterval(render, frequency);  // setInterval and create reference to it
})(); // start animation
