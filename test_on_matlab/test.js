window.addEventListener('DOMContentLoaded', () => {

    // Define constants
    const g = 9.81; // acceleration due to gravity (m/s^2)
    const e = 0.9; // coefficient of restitution
    const dt = 0.01; // time step (s)
    const total_time = 10; // total simulation time (s)
    const m = 1.5; // mass (kg)
    const r = 0.02; // radius
    const A = Math.PI * (r ** 2); // cross section area (m^2)
    const rho = 1.2; // air density (kg/m^3)
    const C = 0.47; // drag coeff


    window.onresize = function () { location.reload(); }
    const FPS = 60;
    let tfCanvas = document.querySelector("#simCanvas");
    var c = tfCanvas.getContext("2d");

    const h = 1000 / FPS;

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
        //console.log(mouse);
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
                var force = distance*10;
                var angle = Math.atan2(dy, dx);
                var fx = Math.cos(angle) * force;
                var fy = Math.sin(angle) * force;

                particleArray[i].ax += fx/m;
                particleArray[i].ay += fy/m;

                particleArray[i].vx += particleArray[i].ax * dt;
                particleArray[i].vy += particleArray[i].ay * dt;

                particleArray[i].x += particleArray[i].vx * dt;
                particleArray[i].y += particleArray[i].vy * dt;
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
        this.elasticity = e;

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
            let F_drag_x, F_drag_y, v_mag, scaled_r;
            /*  if (this.y <= 0) {
                 this.vx *= e;
                 this.vy *= -e;
             } else { */
            v_mag = Math.sqrt(this.vx ** 2 + this.vy ** 2);

            //scale the radius
            scaled_r = this.radius * 0.0000001;

            F_drag_x = -0.5 * rho * (Math.PI * (scaled_r ** 2)) * C * this.vx * v_mag;
            F_drag_y = -0.5 * rho * (Math.PI * (scaled_r ** 2)) * C * this.vy * v_mag;

            this.ax = (F_drag_x / m);
            this.ay = (-g + (F_drag_y / m));
            // }

            // Update velocity
            this.vx += this.ax * dt;
            this.vy += this.ay * dt;

            // Update position
            this.x += this.vx * dt;
            this.y += this.vy * dt;

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

            if (distance <= this.radius + otherCircle.radius + 0.001) {
                normalizedDx = dx / distance;
                normalizedDy = dy / distance;
                collisionPointMidX = this.x - dx / 2;
                collisionPointMidY = this.y - dy / 2;

                this.x = collisionPointMidX + this.radius * normalizedDx;
                this.y = collisionPointMidY + this.radius * normalizedDy;
                otherCircle.x = collisionPointMidX - otherCircle.radius * normalizedDx;
                otherCircle.y = collisionPointMidY - otherCircle.radius * normalizedDy;

                let tempV1 = this.vx * e + otherCircle.vx * (1 - otherCircle.elasticity);
                let tempV2 = this.vy * e + otherCircle.vy * (1 - otherCircle.elasticity);
                this.vx = otherCircle.vx * otherCircle.elasticity + this.vx * (1 - this.elasticity);
                this.vy = otherCircle.vy * otherCircle.elasticity + this.vy * (1 - this.elasticity);
                otherCircle.vx = tempV1;
                otherCircle.vy = tempV2;

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

        }

    }
    var color = getNextColor();
    //particleArray.push(new Cricle(625, 300, -0.5, 0.5, 0, 0, 50, color, "water"));
    //particleArray.push(new Cricle(300, 600, 2, -2, 0, 0, 50, color, "water"));

    //particleArray.push(new Cricle(500, 500, 1, 1, 0, 0, 10, "#283618", "water"));
    //particleArray.push(new Cricle(800, 800, -2, -2, 0, 0, 10, "#283618", "water"));

    //particleArray.push(new Cricle(500, 500, 1, 0, 0, 0, 10, color, "water"));
    //particleArray.push(new Cricle(700, 500, -2, 0, 0, 0, 10, color, "water"));
    //createParticle()
    //animate();

    window.setInterval(animate, 1000 / FPS);

});