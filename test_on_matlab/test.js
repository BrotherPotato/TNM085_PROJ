window.addEventListener('DOMContentLoaded', () => {

    // Define constants
    const g = 9.81; // acceleration due to gravity (m/s^2)
    const e = 0.8; // coefficient of restitution
    const dt = 0.001; // time step (s)
    const total_time = 10; // total simulation time (s)
    const m = 0.5; // mass (kg)
    const r = 0.02; // radius
    const A = Math.PI * (r ** 2); // cross section area (m^2)
    const rho = 1.2; // air density (kg/m^3)
    const C = 0.47; // drag coeff


    window.onresize = function () { location.reload(); }
    const FPS = 60;
    let tfCanvas = document.querySelector("#simCanvas");
    var c = tfCanvas.getContext("2d");

    const h = 1/6;
    //const h = 100/FPS; 

    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;
    var scale = 2;
    tfCanvas.style.width = displayWidth + 'px';
    tfCanvas.style.height = displayHeight + 'px';
    tfCanvas.width = displayWidth * scale;
    tfCanvas.height = displayHeight * scale;


    var mouse = { x: 0, y: 0, down: false, nodeSelected: -1 };

    var rect = tfCanvas.getBoundingClientRect();
    //console.log(rect);

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    window.addEventListener('mousemove', function (e) {
        var mousePos = getMousePos(tfCanvas, e);

        mouse.x = mousePos.x * scale;
        mouse.y = mousePos.y * scale;
        mouse.down = e.buttons == 1;
        //console.log(mouse);
        //console.log(particleArray[0]);
        //console.log(e.buttons == 1); 
        if (e.buttons == 0) {
            mouse.nodeSelected = -1;
        }


    }, false);

    window.addEventListener('mousedown', function (e) {
        var mousePos = getMousePos(tfCanvas, e);

        mouse.x = mousePos.x * scale;
        mouse.y = mousePos.y * scale;
        mouse.down = e.buttons == 1;
        console.log(mouse);
        //console.log(e.buttons == 1); 
        if (e.buttons == 0) {
            mouse.nodeSelected = -1;
        }
        if (e.buttons == 1) {
            dragBallInterval = setInterval(dragBalls, FPS);
        }


    }, false);

    window.addEventListener('mouseup', function (e) {
        if (!(e.buttons == 1)) {
            clearInterval(dragBallInterval);
        }
    }, false);

    function dragBalls() {
        console.log("clicked");
        let mouseRadius = 550;
        for (var i = 0; i < particleArray.length; i++) {
            var dx = Math.abs(mouse.x - particleArray[i].x);
            var dy = Math.abs(mouse.y - particleArray[i].y);
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= particleArray[i].radius + mouseRadius) {
                //draw line to mouse
                c.beginPath();
                c.moveTo(particleArray[i].x, particleArray[i].y);
                c.lineTo(mouse.x, mouse.y);
                c.stroke();
                //draw circle at mouse
                // c.beginPath();
                // c.arc(mouse.x, mouse.y, mouseRadius, 0, Math.PI * 2, false);
                // c.fillStyle = "red";
                // c.fill();
                // c.stroke();

                // add force to particle
                var dx = mouse.x - particleArray[i].x;
                var dy = mouse.y - particleArray[i].y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                var force = distance*2;
                var angle = Math.atan2(dy, dx);
                var fx = Math.cos(angle) * force;
                var fy = Math.sin(angle) * force;

                particleArray[i].ax += fx/m;
                particleArray[i].ay += fy/m;

                particleArray[i].vx += particleArray[i].ax * h;
                particleArray[i].vy += particleArray[i].ay * h;

                particleArray[i].x += particleArray[i].vx * h;
                particleArray[i].y += particleArray[i].vy * h;
            }
        }
    }

    /* let dragBallInterval;

    function dragBalls() {
        let mouseRadius = 550;
        for (var i = 0; i < particleArray.length; i++) {
            var dx = mouse.x - particleArray[i].x;
            var dy = mouse.y - particleArray[i].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= particleArray[i].radius + mouseRadius) { // Change 10 to the radius you want for mouse interaction

                c.beginPath();
                c.moveTo(particleArray[i].x, particleArray[i].y);
                c.lineTo(mouse.x, mouse.y);
                c.stroke();

                // add force to particle
                var dx = mouse.x - particleArray[i].x;
                var dy = mouse.y - particleArray[i].y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                var force = distance*0.005;
                var angle = Math.atan2(dy, dx);
                var fx = Math.cos(angle) * force;
                var fy = Math.sin(angle) * force;

                particleArray[i].ax = (fx / m) * dt;
                particleArray[i].ay = (fy / m) * dt;

                particleArray[i].vx += particleArray[i].ax *dt;
                particleArray[i].vy += particleArray[i].ay * dt;

                particleArray[i].x += particleArray[i].vx;
                particleArray[i].y += particleArray[i].vy; 
            }
        }
    }
 */
    function Cricle(x, y, vx, vy, ax, ay, radius, color, type) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;
        this.radius = radius;
        this.color = color;
        this.type = type;
        this.eor = e;
        this.mass = m;

        this.draw = function () {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

            //c.fillStyle = this.color;
            //console.log(this.color);    
            //c.fillStyle = "red";
            c.fillStyle = hexToRgb(this.color);
            //c.fillStyle = this.color;

            c.fill();

            //context.strokeStyle = '#003300';
            c.stroke();
        }

        this.update = function () {
            /*
            if (Math.abs(mouse.x - this.x) < 20 && Math.abs(mouse.y - this.y) < 20) {
                if (this.radius < maxRadius) {
                    this.radius += 1;
                }

            } else if (this.radius > minRadius) {
                this.radius -= 1;
            }
            */
            //console.log(this.x);

            //console.log(this.x);
            this.draw();
        }

        /* this.moveCircle = function () {
            this.x += this.vx;
            this.y += this.vy;
            this.vx += this.ax;
            this.vy += this.ay;
            this.ax -= this.ax * 0.1;
            this.ay -= this.ay * 0.1;
           


            this.bounce();
        } */

        this.moveCircle = function () {
            // Calculate drag force
            let F_drag_x, F_drag_y, v_mag_x, v_mag_y, scaled_r;
            /*  if (this.y <= 0) {
                 this.vx *= e;
                 this.vy *= -e;
             } else { */
            v_mag_x = this.vx ** 2;
            v_mag_y = this.vy ** 2; 

            //scale the radius
            scaled_r = this.radius * 0.0001;

            F_drag_x = -0.5 * rho * (Math.PI * (scaled_r ** 2)) * C * this.vx * v_mag_x;
            F_drag_y = -0.5 * rho * (Math.PI * (scaled_r ** 2)) * C * this.vy * v_mag_y;

            this.ax = (F_drag_x / m);
            this.ay = (g + (F_drag_y / m));
            // }

            // Update velocity
            this.vx += this.ax * h;
            this.vy += this.ay * h;

            // Update position
            this.x += this.vx * h;
            this.y += this.vy * h;

            this.bounce();
        }

        this.bounce = function () {
            /*  // if (this.x + this.radius >= tfCanvas.width || this.x - this.radius <= 0) {
             //     this.vx = -this.vx;
             // }
             // if (this.y + this.radius >= tfCanvas.height || this.y - this.radius <= 0) {
             //     this.vy = -this.vy;
             // }
 
             if (this.x + this.radius >= tfCanvas.width) {
                 this.x = tfCanvas.width - this.radius;
                 this.vx = -this.vx;
             }
             if (this.x - this.radius <= 0) {
                 this.x = this.radius;
                 this.vx = -this.vx;
             }
             if (this.y + this.radius >= tfCanvas.height) {
                 this.y = tfCanvas.height - this.radius;
                 this.vy = -this.vy;
             }
             if (this.y - this.radius <= 0) {
                 this.y = this.radius;
                 this.vy = -this.vy;
             }
 
 
 
             for (var i = 0; i < particleArray.length; i++) {
                 if (this === particleArray[i]) continue;
                 if (this.checkCollision(particleArray[i])) {
                     //console.log("collision");
 
                 }
             } */

            if (this.x + this.radius >= tfCanvas.width) {
                this.x = tfCanvas.width - this.radius;
                this.vx = -this.vx;
                this.vy = this.vy * 0.99;
            }
            if (this.x - this.radius <= 0) {
                this.x = this.radius;
                this.vx = -this.vx;
                this.vy = this.vy * 0.99;
            }
            if (this.y + this.radius >= tfCanvas.height) {
                this.y = tfCanvas.height - this.radius;
                this.vy = -this.vy;
                this.vx = this.vx * 0.99;
            }
            if (this.y - this.radius <= 0) {
                this.y = this.radius;
                this.vy = -this.vy;
                this.vx = this.vx * 0.99;
            }

            for (var i = 0; i < particleArray.length; i++) {
                if (this === particleArray[i]) continue;
                // if (this.checkCollision(particleArray[i])) {

                // }

                this.checkCollision(particleArray[i])
            }
        }

        this.checkCollision = function (otherCircle) {
            /*  // add move ball x and y on hit
             var dx = this.x - otherCircle.x;
             var dy = this.y - otherCircle.y;
             var distance = Math.sqrt(dx * dx + dy * dy);
 
 
             if (distance <= this.radius + otherCircle.radius + 0.001) {
                 //otherCircle.color = "red";
                 //this.color = "blue";
 
                 //get normalized direction vector
                 normalizedDx = dx / distance;
                 normalizedDy = dy / distance;
                 //calculate collision point
                 collisionPointMidX = this.x - dx / 2;
                 collisionPointMidY = this.y - dy / 2;
 
                 //fix new position with collisionPointMid
                 this.x = collisionPointMidX + this.radius * normalizedDx;
                 this.y = collisionPointMidY + this.radius * normalizedDy;
                 otherCircle.x = collisionPointMidX - otherCircle.radius * normalizedDx;
                 otherCircle.y = collisionPointMidY - otherCircle.radius * normalizedDy;
 
 
 
                 // conservation of momentum
                 // var mass = 1;
                 // var otherMass = 1;
                 // var v1in = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                 // var v2in = Math.sqrt(otherCircle.vx * otherCircle.vx + otherCircle.vy * otherCircle.vy);
                 // var momentum = v1in * mass + v2in * otherMass;
 
 
 
 
 
                 let tempV1 = this.vx * this.elasticity + otherCircle.vx * (1 - otherCircle.elasticity);
                 let tempV2 = this.vy * this.elasticity + otherCircle.vy * (1 - otherCircle.elasticity);
                 this.vx = otherCircle.vx * otherCircle.elasticity + this.vx * (1 - this.elasticity);
                 this.vy = otherCircle.vy * otherCircle.elasticity + this.vy * (1 - this.elasticity);
                 otherCircle.vx = tempV1;
                 otherCircle.vy = tempV2;
                 // console.log(this.vx);
                 // console.log(this.vy);
                 // console.log(otherCircle.vx);
                 // console.log(otherCircle.vy);
 
 
                 return true;
             } else {
                 return false;
             } */
            var dx = this.x - otherCircle.x;
            var dy = this.y - otherCircle.y;
            var distance = Math.sqrt(dx ** 2 + dy ** 2);

            if (distance <= this.radius + otherCircle.radius) {

                
                //get normalized direction vector (Normal) from this to otherCircle
                let normalizedDx = dx / distance;
                let normalizedDy = dy / distance;
                //calculate collision point
                let collisionPointMidX = this.x - dx / 2;
                let collisionPointMidY = this.y - dy / 2;

                //fix new position with collisionPointMid
                this.x = collisionPointMidX + (this.radius  * 1.02) * normalizedDx;
                this.y = collisionPointMidY + (this.radius  * 1.02) * normalizedDy;
                otherCircle.x = collisionPointMidX - (otherCircle.radius * 1.02) * normalizedDx;
                otherCircle.y = collisionPointMidY - (otherCircle.radius * 1.02) * normalizedDy;

                //get tangetial vector to normal vector (90 degrees rotation counterclowise)
                let tangentX = -normalizedDy;
                let tangentY = normalizedDx;

                // get velocity in normal and tangent direction
                let thisInitialVNormal = this.vx * normalizedDx + this.vy * normalizedDy;
                let thisInitialVTangent = this.vx * tangentX + this.vy * tangentY;
                let otherInitialVNormal = otherCircle.vx * normalizedDx + otherCircle.vy * normalizedDy;
                let otherInitialVTangent = otherCircle.vx * tangentX + otherCircle.vy * tangentY;

                // tangent velocities remain the same
                let thisFinalVTangent = thisInitialVTangent;
                let otherFinalVTangent = otherInitialVTangent;

                // calculate the velocities in the normal direction after collision
                let thisFinalVNormal = this.mass * thisInitialVNormal + otherCircle.mass * otherInitialVNormal + otherCircle.mass * otherCircle.eor * (otherInitialVNormal - thisInitialVNormal);
                let otherFinalVNormal = this.mass * thisInitialVNormal + otherCircle.mass * otherInitialVNormal + this.mass * this.eor * (thisInitialVNormal - otherInitialVNormal);



                // set new velocities
                this.vx = (thisFinalVNormal * normalizedDx + thisFinalVTangent * tangentX);
                this.vy = (thisFinalVNormal * normalizedDy + thisFinalVTangent * tangentY);
                otherCircle.vx = (otherFinalVNormal * normalizedDx + otherFinalVTangent * tangentX);
                otherCircle.vy = (otherFinalVNormal * normalizedDy + otherFinalVTangent * tangentY);



                // Phong and Blinn-Phong shading calculations (no force) +
                // hanterar bara då this är över otherCircle

                // //vector from collision to this circle (Normal) (Normalised)
                // let v1xN = this.x - collisionPointMidX;
                // let v1yN = this.y - collisionPointMidY;
                // v1xN = v1xN / Math.sqrt(v1xN ** 2 + v1yN ** 2);
                // v1yN = v1yN / Math.sqrt(v1xN ** 2 + v1yN ** 2);
                
                // // vector from collision to input angle (L) (Normalised)
                // let v1xL = -this.vx
                // let v1yL = -this.vy
                // v1xL = v1xL / Math.sqrt(v1xL ** 2 + v1yL ** 2);
                // v1yL = v1yL / Math.sqrt(v1xL ** 2 + v1yL ** 2);

                // // calculate the dot product of the two vectors
                // let dotProduct1 = v1xL * v1xN + v1yL * v1yN;
                // //dotProduct1 = Math.abs(dotProduct1);
                // //console.log(dotProduct1);
                // // calculate the reflection vector
                // let reflectionX1 = 2 * dotProduct1 * v1xN - v1xL;
                // let reflectionY1 = 2 * dotProduct1 * v1yN - v1yL;

                // // vector from collision to other circle (Normal) (Normalised)
                // let v2xN = otherCircle.x - collisionPointMidX;
                // let v2yN = otherCircle.y - collisionPointMidY;
                // v2xN = v2xN / Math.sqrt(v2xN ** 2 + v2yN ** 2);
                // v2yN = v2yN / Math.sqrt(v2xN ** 2 + v2yN ** 2);

                // // vector from collision to input angle (L) (Normalised)
                // let v2xL = -otherCircle.vx
                // let v2yL = -otherCircle.vy
                // v2xL = v2xL / Math.sqrt(v2xL ** 2 + v2yL ** 2);
                // v2yL = v2yL / Math.sqrt(v2xL ** 2 + v2yL ** 2);

                // // calculate the dot product of the two vectors
                // let dotProduct2 = v2xL * v2xN + v2yL * v2yN;
                // //dotProduct2 = Math.abs(dotProduct2);
                // // calculate the reflection vector
                // let reflectionX2 = 2 * dotProduct2 * v2xN - v2xL;
                // let reflectionY2 = 2 * dotProduct2 * v2yN - v2yL;

                // // normalise the reflection vectors
                // let reflectionSize = Math.sqrt(reflectionX1 ** 2 + reflectionY1 ** 2);
                // reflectionX1 = reflectionX1 / reflectionSize;
                // reflectionY1 = reflectionY1 / reflectionSize;

                // let reflectionSize2 = Math.sqrt(reflectionX2 ** 2 + reflectionY2 ** 2);
                // reflectionX2 = reflectionX2 / reflectionSize2;
                // reflectionY2 = reflectionY2 / reflectionSize2;


                // // size of previous velocity
                // let v1Size = Math.sqrt(this.vx ** 2 + this.vy ** 2);
                // let v2Size = Math.sqrt(otherCircle.vx ** 2 + otherCircle.vy ** 2);

                // // calculate the new velocity
                // let oldv1x = this.vx;
                // let oldv1y = this.vy;
                // this.vx = reflectionX1 * v1Size * this.elasticity + otherCircle.vx * (1 - otherCircle.elasticity);
                // this.vy = reflectionY1 * v1Size * this.elasticity + otherCircle.vx * (1 - otherCircle.elasticity);
                // otherCircle.vx = reflectionX2 * v2Size * otherCircle.elasticity + oldv1x * (1 - this.elasticity);
                // otherCircle.vy = reflectionY2 * v2Size * otherCircle.elasticity + oldv1y * (1 - this.elasticity);



                // calculate velocity with momentum and kinetic energy
                
                


                // let tempV1 = this.vx * e + otherCircle.vx * (1 - otherCircle.elasticity);
                // let tempV2 = this.vy * e + otherCircle.vy * (1 - otherCircle.elasticity);
                // this.vx = otherCircle.vx * otherCircle.elasticity + this.vx * (1 - this.elasticity);
                // this.vy = otherCircle.vy * otherCircle.elasticity + this.vy * (1 - this.elasticity);
                // otherCircle.vx = tempV1;
                // otherCircle.vy = tempV2;

                return true;
            } else {
                return false;
            }
        }

        this.drawCircleVelocity = function () {
            c.beginPath();
            c.moveTo(this.x, this.y);
            c.lineTo(this.x + this.vx, this.y + this.vy);
            c.stroke();
        }
        this.drawCircleAcc = function () {
            c.beginPath();
            c.moveTo(this.x, this.y);
            c.lineTo(this.x + this.ax, this.y + this.ay);
            c.stroke();
        }

    }

    var particleArray = [];
    var arrayOfRainbowColors = [
        "ff0000",
        "ffa500",
        "ffff00",
        "008000",
        "0000ff",
        "4b0082",
        "ee82ee"
    ];

    function hexToRgb(hex) {
        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }

    let btn = document.querySelector("#createParticleBtn");
    btn.addEventListener("click", function () {
        createParticle();
        createParticle();
        createParticle();
        createParticle();
        createParticle();
        createParticle();
        createParticle();
        createParticle();
        createParticle();
        createParticle();
        createParticle();
        createParticle();
    });

    function getNextColor() {
        let color = arrayOfRainbowColors.shift();
        arrayOfRainbowColors.push(color);
        return color;
    }

    function checkSpawn(x, y) {
        for (let i = 0; i < particleArray.length; i++) {
            let particle = particleArray[i];
            if (particle.x + (particle.radius * 2) > x && particle.x - (particle.radius * 2) < x
                && particle.y + (particle.radius * 2) > y && particle.y - (particle.radius * 2) < y) {
                return false;
            }
        }
        return true;
    }


    function createParticle() {
        var radius = 50;
        var x = Math.random() * (tfCanvas.width - radius * 2) + radius;
        var y = Math.random() * (tfCanvas.height - radius * 2) + radius;
        while (!checkSpawn(x, y)) {
            x = Math.random() * (tfCanvas.width - radius * 2) + radius;
            y = Math.random() * (tfCanvas.height - radius * 2) + radius;
        }

        let g = 9.81;
        var vx = 100 * (Math.random() * 2 - 1);
        var vy = 100 * (Math.random() * 2 - 1);
        var ax = 100 * (Math.random() * 2 - 1);
        var ay = 100 * (Math.random() * 2 - 1) ;



        var color = getNextColor();
        //console.log(color);
        var type = 'water';
        particleArray.push(new Cricle(x, y, vx, vy, ax, ay, radius, color, type));
    }

    function animate() {
        //requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth * 2, innerHeight * 2);

        c.lineWidth = 1;
        for (var i = 0; i < particleArray.length; i++) {
            particleArray[i].moveCircle();
            particleArray[i].update();
            particleArray[i].drawCircleVelocity();
            particleArray[i].drawCircleAcc();
        }

    }
    var color = getNextColor();
    particleArray.push(new Cricle(625, 300, -0.5, 0.5, 0, 0, 50, color, "water"));
    particleArray.push(new Cricle(300, 600, 2, -2, 0, 0, 50, color, "water"));

    particleArray.push(new Cricle(500, 500, 1, 1, 0, 0, 50, "#283618", "water"));
    particleArray.push(new Cricle(800, 800, -2, -2, 0, 0, 50, "#283618", "water"));

    //particleArray.push(new Cricle(500, 500, 1, 0, 0, 0, 10, color, "water"));
    //particleArray.push(new Cricle(700, 500, -2, 0, 0, 0, 10, color, "water"));
    //createParticle()
    //animate();

    window.setInterval(animate, 1000 / FPS);

});