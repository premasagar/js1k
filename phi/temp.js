var _ = console.log,
    M = Math,
    random = M.random,
    ceil = M.ceil;

function randomInt(length){
    return ceil((length || 2) * random()) - 1;
}

function drift(maxDrift){
    return ceil(random() * (maxDrift + 1)) - 1
}

var w = 200,
    h = 100,
    dirX, dirY,
    maxDriftX = 20,
    maxDriftY = 10,
    x = randomInt(w - maxDriftX + 1),
    y = randomInt(h - maxDriftY + 1),
    driftX, driftY;

//_('starting');
for (var i=0; i<30; i++){

driftX = drift(maxDriftX);
driftY = drift(maxDriftY);

if (!dirX && x - maxDriftX < 0 || dirX && x + maxDriftX > w){
    //_('reversing X');
    dirX = ~dirX;
}
if (!dirY && y - maxDriftY < 0 || dirY && y + maxDriftY > h){
    //_('reversing Y');
    dirY = ~dirY;
}

x += dirX ? driftX : -driftX;
y += dirY ? driftY : -driftY;

//_(x,y, dirX, dirY);
if (x > w){
    _(! x>w);
}
if (x < 0){
    _(! x<0);
}
if (y > h){
    _(! y>h);
}
if (y < 0){
    _(! y<0);
}

}
_('finished');




////////////////////////////////////



(function(){
var _ = console.log,
    M = Math,
    random = M.random,
    ceil = M.ceil,
    phi = .618,
    PHI = 1 / phi;



var x = 3, xFactor = x * 0.1 * phi, driftX = -5, dirX=-1;
//_(ceil(x + (dirX ? xFactor : -xFactor) + driftX));
//_(x + (dirX ? xFactor : -xFactor) + driftX);

_(200 + 20);
return;



// **

function randomInt(length){
    return ceil((length || 2) * random()) - 1;
}

function drift(maxDrift){
    return ceil(random() * (maxDrift * 2 + 1) - maxDrift / 2 - 1);
}

var w = 200,
    h = 100,
    multiplier = 0.1,
    factor = multiplier * phi,
    dirX, dirY,
    maxDriftX = 20,
    maxDriftY = 10,
    x = randomInt(w - maxDriftX + 1),
    y = randomInt(h - maxDriftY + 1),
    driftX, driftY,
    xFactor = x * factor,
    yFactor = y * factor;

_('starting', x, y, !!dirX, !!dirY);
for (var i=0; i < 10; i++){

if(a){b=c}
b=a?c:d;

dirX = dirX && x + xFactor + maxDriftX > w || !dirX && x - xFactor - maxDriftX < 0 ?
    ~dirX : dirX;

dirY = dirY && y + yFactor + maxDriftY > h || !dirY && y - yFactor - maxDriftY < 0 ?
    ~dirY : dirY;

/*
if (dirX && x + xFactor + maxDriftX > w || !dirX && x - xFactor - maxDriftX < 0){
    _('reversing X', x, dirX, xFactor, x + xFactor + maxDriftX > w, x - xFactor - maxDriftX < 0);
    dirX = ~dirX;
}
if (dirY && y + yFactor + maxDriftY > h || !dirY && y - yFactor - maxDriftY < 0){
    _('reversing Y');
    dirY = ~dirY;
}
*/

driftX = drift(maxDriftX);
driftY = drift(maxDriftY);

x = ceil(x + (dirX ? xFactor : -xFactor) + driftX);
y = ceil(y + (dirY ? yFactor : -yFactor) + driftY);


// TESTING
_(x, y, !!dirX, !!dirY, driftX, driftY);

if (x > w){
    _('! x>w');
}
if (x < 0){
    _('! x<0');
}
if (y > h){
    _('! y>h');
}
if (y < 0){
    _('! y<0');
}

}
_('finished');
}());


//////////////////////////



(function(){
var _ = console.log,
    M = Math,
    random = M.random,
    ceil = M.ceil,
    phi = .618,
    PHI = 1 / phi;


/*
var x = 3, xFactor = x * 0.1 * phi, driftX = -5, dirX=-1;
//_(ceil(x + (dirX ? xFactor : -xFactor) + driftX));
//_(x + (dirX ? xFactor : -xFactor) + driftX);

//_(200 - (220 - 200));
_(0-(-20));
_(M.abs(-20));
return;
*/


// **

function randomInt(length){
    return ceil((length || 2) * random()) - 1;
}

function drift(maxDrift){
    return ceil(random() * (maxDrift * 2 + 1) - maxDrift / 2 - 1);
}

var w = 200,
    h = 100,
    multiplier = 0.1,
    factor = multiplier * phi,
    maxDriftX = w * PHI / 100,
    maxDriftY = h * PHI / 100,
    x = randomInt(w - maxDriftX + 1),
    y = randomInt(h - maxDriftY + 1),
    xFactor = x * factor,
    yFactor = y * factor,
    dirX, dirY,
    driftX, driftY;

_('starting', x, y, !!dirX, !!dirY);
for (var i=0; i < 20; i++){

driftX = drift(maxDriftX);
driftY = drift(maxDriftY);

_('setting x, previous: ', x, xFactor, driftX, !!dirX);
//_('setting y, previous: ', y, yFactor, driftY, !!dirY);
x = ceil(x + (dirX ? xFactor : -xFactor) + driftX);
y = ceil(y + (dirY ? yFactor : -yFactor) + driftY);


// TESTING

if (x > w || x < 0){
    _('REVERSING x', x, xFactor, driftX, !!dirX);
    x = x > w ?
        2 * w - x :
        0 - x;
    dirX = ~dirX;
}

if (y > h || y < 0){
    //_('REVERSING y', y, yFactor, driftY, !!dirY);
    y = y > h ?
        2 * h - y :
        0 - y;
    dirY = ~dirY;
}
_('-> x', x, driftX, !!dirX);
//_('-> y', y, driftY, !!dirY);

}
_('finished');
}());
