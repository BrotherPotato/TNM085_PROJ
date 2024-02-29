
window.addEventListener('DOMContentLoaded', () => {
    window.onresize = function () { location.reload(); }
    const FPS = 60;
    let tfCanvas = document.querySelector("#simCanvas");
    var c = tfCanvas.getContext("2d");

    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;
    var scale = 2;
    tfCanvas.style.width = displayWidth + 'px';
    tfCanvas.style.height = displayHeight + 'px';
    tfCanvas.width = displayWidth * scale;
    tfCanvas.height = displayHeight * scale;

<<<<<<< Updated upstream
=======
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

    const h = 1000/FPS; //step size

    console.log(performance.now());

>>>>>>> Stashed changes

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
            dragBallInterval = setInterval(dragBalls, FPS /*execute every 100ms*/);
        }


    }, false);

    window.addEventListener('mouseup', function (e) {
        if(!(e.buttons == 1)){
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
                var force = distance * 0.0005;
                var angle = Math.atan2(dy, dx);
                var fx = Math.cos(angle) * force;
                var fy = Math.sin(angle) * force;
                particleArray[i].ax = fx;
                particleArray[i].ay = fy;

            }

        }
    }

<<<<<<< Updated upstream
    const g = 9.81;
=======
    let previous_time = performance.now(); // previous time (ms)

>>>>>>> Stashed changes
    class circle{

        constructor(color, type){
            this.radius = 50;
            this.x = Math.random() * (tfCanvas.width - this.radius * 2) + this.radius;
            this.y = Math.random() * (tfCanvas.width - this.radius * 2) + this.radius;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 - 1;
            this.ax = Math.random() * 2 - 1;
            this.ay = Math.random() * 2 - 1;
            this.color = color;
            this.type = type;
            this.elasticity = 0.75;

        }

        draw(){
            //console.log("hej");
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

            c.fillStyle = hexToRgb(this.color);
            c.fill();
            c.stroke();
        }

        update(){
            this.draw();
        }

<<<<<<< Updated upstream
        moveCircle(){ // updates every 
            this.x += this.vx;
            this.y += this.vy;
            this.vx += this.ax;
            this.vy += this.ay;
            this.ax -= this.ax * 0.1;
            this.ay -= this.ay * 0.1;
=======
        moveCircle(){ // updates every frame

            
        let current_time = performance.now(); // current time (ms)
        let dt = (current_time - previous_time) / 1000; // elapsed time (s)
        previous_time = current_time; // previous time (s)
        console.log(dt);


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
            this.vx += this.ax * dt;
            this.vy += this.ay * dt;

            // Update position
            this.x += this.vx * dt;
            this.y += this.vy * dt;

>>>>>>> Stashed changes
            this.bounce();
        }

        bounce(){
            // Bounds calculations
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

            //collision check
            for (var i = 0; i < particleArray.length; i++) {
                if (this === particleArray[i]) continue; //check if self
                if (this.checkCollision(particleArray[i])) {


                    //console.log("collision");
                    //deltaX = math.abs(this.x - particleArray[i].x)
                    //deltaY = math.abs(this.y - particleArray[i].y)
                    collidivec.push(new collidi(this.x, this.y, particleArray[i].x, particleArray[i].y))
                    console.log(collidivec.length);
                    
                    
                }
            }
        }

        checkCollision(otherCircle){
            // add move ball x and y on hit
            var dx = this.x - otherCircle.x;
            var dy = this.y - otherCircle.y;
            var distance = Math.sqrt(dx * dx + dy * dy);


            if (distance <= this.radius + otherCircle.radius + 0.001) {
                //otherCircle.color = "red";
                //this.color = "blue";

                //get normalized direction vector
                let normalizedDx = dx / distance;
                let normalizedDy = dy / distance;
                //calculate collision point
                let collisionPointMidX = this.x - dx / 2;
                let collisionPointMidY = this.y - dy / 2;

                //fix new position with collisionPointMid
                this.x = collisionPointMidX + this.radius * normalizedDx;
                this.y = collisionPointMidY + this.radius * normalizedDy;
                otherCircle.x = collisionPointMidX - otherCircle.radius * normalizedDx;
                otherCircle.y = collisionPointMidY - otherCircle.radius * normalizedDy;

                
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
            }
        }

        drawCircleVelocity(){
            c.beginPath();
            c.moveTo(this.x, this.y);
            c.lineTo(this.x + this.vx * 10, this.y + this.vy * 10);
            c.stroke();
        }
          



    } // end of class circle

    var collidivec = [];
    class collidi{
        constructor(fhpx, fhpy, lhpx, lhpy){ //first hit pos | last hit pos
        this.fhpx = fhpx;
        this.fhpy = fhpy;
        this.lhpx = lhpx;
        this.lhpy = lhpy;
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

        for (let i = 0; i < 10; i++) {
            
            let c1 = new circle(getNextColor(),1);
    
            while(!checkSpawn(c1.x, c1.y)){
                c1 = new circle(getNextColor(),1);
            }
    
            particleArray.push(c1);
            
        }
        //console.log(new circle(getNextColor(),1));
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
    
    function animate() {
        //requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth * 2, innerHeight * 2);
        //console.log(particleArray);
        c.lineWidth = 1;
        for (var i = 0; i < particleArray.length; i++) {
            particleArray[i].moveCircle();
            particleArray[i].update();
            particleArray[i].drawCircleVelocity();
        }
        
<<<<<<< Updated upstream
        if(!(collidivec.length == 0)){ // collision line
            collidivec.forEach(element => {
                c.beginPath();
                c.moveTo(element.fhpx, element.fhpy);
                c.lineTo(element.lhpx, element.lhpy);
                c.stroke();
            });
        }   

=======
        // if(!(collidivec.length == 0)){ // collision line
        //     collidivec.forEach(element => {
        //         c.beginPath();
        //         c.moveTo(element.fhpx, element.fhpy);
        //         c.lineTo(element.lhpx, element.lhpy);
        //         c.stroke();
        //     });
        // }   
        //animate();
>>>>>>> Stashed changes
    }

    window.setInterval(animate, dt);
    //animate();

});