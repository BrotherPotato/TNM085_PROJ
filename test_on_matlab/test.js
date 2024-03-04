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
        this.eorWall = 0.9;
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
            this.draw();
        }

        this.getContainerFriction = function(vel){
            const my = 0.5; //the friction coefficient
            const F_friction = -my * vel;
            return F_friction;
        }

        this.moveCircle = function () {
            // Calculate drag force
            let F_drag_x, F_drag_y, v_mag_x, v_mag_y, scaled_r;

            v_mag_x = this.vx ** 2;
            v_mag_y = this.vy ** 2; 

            //scale the radius
            scaled_r = this.radius * 0.0001;

            F_drag_x = -0.5 * rho * (Math.PI * (scaled_r ** 2)) * C * this.vx * v_mag_x;
            F_drag_y = -0.5 * rho * (Math.PI * (scaled_r ** 2)) * C * this.vy * v_mag_y;

            this.ax += (F_drag_x / m);
            this.ay += (g + (F_drag_y / m));
            // }

            // Update velocity
            this.vx += this.ax * h;
            this.vy += this.ay * h;

            // Update position
            this.x += this.vx * h;
            this.y += this.vy * h;

            this.ax = 0;
            this.ay = 0;

            this.bounce();
        }

        this.bounce = function () {
            if (this.x + this.radius >= tfCanvas.width) { // höger
                this.x = tfCanvas.width - this.radius;
                this.vx = -this.vx * this.eorWall;
                let friction = this.getContainerFriction(this.vy);
                this.ay = friction/this.mass;
            }
            if (this.x - this.radius <= 0) { // vänster
                this.x = this.radius;
                this.vx = -this.vx * this.eorWall;
                let friction = this.getContainerFriction(this.vy);
                this.ay = friction/this.mass;
            }
            if (this.y + this.radius >= tfCanvas.height) { // botten
                this.y = tfCanvas.height - this.radius;
                this.vy = -this.vy * this.eorWall;
                let friction = this.getContainerFriction(this.vx);
                this.ax = friction/this.mass;
            }
            if (this.y - this.radius <= 0) { // topp
                this.y = this.radius;
                this.vy = -this.vy * this.eorWall;
                let friction = this.getContainerFriction(this.vx);
                this.ax = friction/this.mass;
            }

            for (var i = 0; i < particleArray.length; i++) {
                if (this === particleArray[i]) continue;
                // if (this.checkCollision(particleArray[i])) {

                // }

                this.checkCollision(particleArray[i])
            }
        }

        this.checkCollision = function (otherCircle) {
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