// Coding Train / Daniel Shiffman


const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;

const { GravityBehavior } = toxi.physics2d.behaviors;

const { Vec2D, Rect } = toxi.geom;

let physics;
let gravity;

let particles = [];
let springs = [];


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  physics = new VerletPhysics2D();
  gravity = new GravityBehavior(); 

  let bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);
  
  let x = 0;
  let y = 0;
  let radius = 100;
  let steps = 48;
  
  for(i=0; i<steps; i++){
    x = radius * cos(2 * PI * ( i / (steps * 1.0)));
    y = radius * sin(2 * PI * ( i / (steps * 1.0)));
    
    particles.push(new Particle(x,y));
    
  }
  //particles.push(new Particle(10,10));

  
  for(i=0; i<steps; i++){
    if(i == (steps - 1)){
      springs.push(new Spring(particles[i], particles[0], 0.1));
    }else{
      springs.push(new Spring(particles[i], particles[i+1], 0.1));
    }

    //springs.push(new Spring(particles[i], particles[8], 0.01));

  }
  
    for(i=0; i<steps; i++){
        for(y=0; y<steps; y++){
            springs.push(new Spring(particles[i], particles[y], 0.001));

        }
    }
  
}

function draw() {
  background(255);


  physics.update();

  fill(127);
  stroke(0);
  strokeWeight(2);
  beginShape();
  for (let particle of particles) {
    vertex(particle.x, particle.y);
  }
  endShape(CLOSE);

  // for (let particle of particles) {
  //   particle.show();
  // }

  // for (let spring of springs) {
  //   spring.show();
  // }

  particles.forEach(element => {
    element.y += 0.5;
  });

  if (mouseIsPressed) {
    particles[0].lock();
    particles[0].x = mouseX;
    particles[0].y = mouseY;
    particles[0].unlock();
  }
}
