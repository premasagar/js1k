a=document;b=a.getElementById("c");c=b.getContext("2d");e=b.width=innerWidth;f=b.height=innerHeight;g=Math;h=1/.618;i=h*10;j=e*.618;k=f*.618;l=255;m=g.ceil;n=g.random;o=i;p=e*.02;q=f*.02;r=g.sqrt(e*e+f*f);s=function(d){return m((d||2)*n())-1};t=s(3);u=[];L=function(d){c.beginPath();K=s(i);c.moveTo(K?j+G:s(e),K?k+H:s(f));for(z=d.length;I=d[--z];)c.lineTo(I[0],I[1])};a.body.style.cssText="background:#000;overflow:hidden;margin:0";J=0;b.onmouseup=b.onmousedown=function(){J=!J};setInterval('d=function(M){return M!=t||J?s(l):m(g.exp(v)/2.72*l)};u.length=z=0;G=m(n()*(p*2+1)-p/2-1);for(H=m(n()*(q*2+1)-q/2-1);z<o;z++){A=s(e/h)*h;B=s(f/h)*h;v=1-g.sqrt((A-j)*(A-j)+(B-k)*(B-k))/r;w=n()*v*(v/h);x=p*(s(i)?w*h:1-w*.618);C=d(0);D=d(1);E=d(2);F="rgba("+C+","+D+","+E+",";c.beginPath();c.arc(A,B,x,0,7,0);c.strokeStyle=y=(s(h)?"rgba("+C*.0618+","+D*.0618+","+E*.0618+",":F)+w+")";c.fillStyle=F+(J?v*.618:w*v)+")";c.stroke();c.fill();u[z]=[A,B,v,y]}L([u[0]]);c.stroke();L(u);c.strokeStyle="rgba(0,0,0,"+.38*u[0][2]+")";c.stroke()',60)
