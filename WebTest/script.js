
let ca_pos, cb_pos, ca_radius, cb_radius, ca_pnt, can;

window.addEventListener("load", function(){
ca_pos		= new Vec3( 0, 0, 0 );		// Position of Vert Circle
  cb_pos		= new Vec3( 200, 50, 0 );	// Position of Colliding Circle
  ca_radius	= 150;						        // Radius of Vert Circle
  cb_radius	= 150;			        			// Radius of Colliding Circle
  ca_pnt		= [];			          			// Array of verts
  can 		  = null;						        // Canvas Object

    can = new Canvas( "canvas" ).center().flip_y().fill_color( "#303030" );
    draw_base();
    calc();
});

function draw_base( cnt=20 ){
    can.both( "#909090" );

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // DRAW THE TEST VERTS
    let i, v, inc = Math.PI * 2 / cnt;
    for( i=0; i < cnt; i++ ){
        v = new Vec3(
            ca_radius * Math.cos( inc * i ),
            ca_radius * Math.sin( inc * i ),
            0 );
        can.circle_vec( v, 3 );
        ca_pnt.push( v );
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    can
        .circle_vec( cb_pos, cb_radius, 2 ) // Draw the Sphere doing the pushing.
        .line_width( 2 )
        .circle_vec( ca_pos, 5, 2 )			// Draw Center of Verts
        .circle_vec( cb_pos, 5, 2 );		// Draw Center of Pushing Circle
}

function calc(){
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Use the two center points of the two circles to determine the direction
    // in which the sphere is pushing into the vertices
    let dir = Vec3.sub( ca_pos, cb_pos ); //.norm();

    let _dir_len = dir.length() * 1.4;	//Length is only need for visualizing direction
    dir.norm()
    can.arrow( cb_pos, Vec3.scale( dir, _dir_len ).add( cb_pos ), 12 );

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    can.line_width( 1 ).fill( "#00ff00" );
    for( let pnt of ca_pnt ){
        //...................................
        // Is the Vert within the sphere
        let to_cir		= Vec3.sub( cb_pos, pnt );	// Direction of Vert to Collide Circle Center
        let to_cir_len	= to_cir.length()			// Length of Vert to CC Center

        if( to_cir_len >= cb_radius ) continue;		// If outside, ignore	

        //...................................
        can.undash().stroke( "#ffff00" ).circle_vec( pnt, 6, 2 ); // mark which verts are within the sphere's range

        // Draw out the two vectors
        can.dash().stroke("#ffff00")
            .line_vec( pnt, Vec3.add( pnt, to_cir ) )
            .arrow( pnt, Vec3.scale( dir, 130 ).add( pnt ), 15 );

        //...................................
        to_cir.norm(); // Need to normalize for dot product and angle calcs
        let dot = Vec3.dot( dir, to_cir );
        let move_pnt;

        if( dot < -0.999 ){ // if the vert is aligned to the center of the of both circles,
            move_pnt = Vec3.scale( dir, cb_radius ).add( cb_pos );
        }else{
            let angle 	= Vec3.angle( to_cir, dir );						// Get Angle between Vert to Movement Dir & Vert to CC Center
            let c		= law_sin_Aab_c( angle, cb_radius, to_cir_len );	// Use a Triangle to solve distance to travel
            move_pnt	= Vec3.scale( dir, c ).add( pnt );
        }

        //...................................
        can.circle_vec( move_pnt, 5 );
    }
}


function law_sin_Aab_c( A, a, b ){
    let sinA	= Math.sin(A);
    let B		= Math.asin( b * sinA / a );
    //let BB		= Math.PI - B;
    let C		= Math.PI - A - B;
    //let CC	= Math.PI - A - BB;

    let c		= a / sinA * Math.sin(C);
    return c;
}


class Canvas{
constructor( elmName, w = null, h = null ){
    this.canvas		= document.getElementById(elmName);
    this.ctx		= this.canvas.getContext("2d");
    this.offsetX	= 0;
    this.offsetY	= 0;
    this.clearX		= 0;
    this.clearY		= 0;

    if( w && h ) 	this.size( w, h );
    else 			this.size( window.innerWidth, window.innerHeight );
}


//////////////////////////////////////////////////////////////////
// Mouse
//////////////////////////////////////////////////////////////////
    /*
    let x = e.clientX - gNC.mouseOffsetX + window.pageXOffset,
        y = e.clientY - gNC.mouseOffsetY + window.pageYOffset,
    */
    mouse_on( onDown=null, onMove=null, onUp=null ){
        if(onDown){
            this.canvas.addEventListener("mousedown", (e)=>{
                e.preventDefault(); e.stopPropagation();
                onDown(e, e.clientX - this.offsetX, e.clientY - this.offsetY);
            });
        }
        if(onMove){
            this.canvas.addEventListener("mousemove", (e)=>{
                e.preventDefault(); e.stopPropagation();
                onMove(e, e.clientX - this.offsetX, e.clientY - this.offsetY);
            });
        }
        
        if(onUp){
            this.canvas.addEventListener("mouseup", (e)=>{
                e.preventDefault(); e.stopPropagation();
                onUp(e, e.clientX - this.offsetX, e.clientY - this.offsetY);
            });
        }
        return this;
    }


//////////////////////////////////////////////////////////////////
// Coord System
//////////////////////////////////////////////////////////////////
    center(){
        this.ctx.translate(this.width * 0.5, this.height * 0.5);
        this.clearX = -this.width * 0.5;
        this.clearY = -this.height * 0.5;
        return this;
    }

    flip_y(){ this.ctx.scale(1,-1); return this; }

    bottom_left(){
        this.ctx.translate( 0, this.height );
        this.ctx.scale( 1, -1 );
        this.clearX = 0;
        this.clearY = 0;
        return this;
    }


//////////////////////////////////////////////////////////////////
// Style
//////////////////////////////////////////////////////////////////
    line_width(v){ this.ctx.lineWidth = v; return this; }
    fill(v){ this.ctx.fillStyle = v; return this; }
    stroke(v){ this.ctx.strokeStyle = v; return this; }
    both(v){ this.ctx.strokeStyle = v; this.ctx.fillStyle = v; return this; }

    style(cFill = "#ffffff", cStroke = "#505050", lWidth = 3){
        if(cFill != null) 	this.ctx.fillStyle		= cFill;
        if(cStroke != null) this.ctx.strokeStyle	= cStroke;
        if(lWidth != null) 	this.ctx.lineWidth		= lWidth;
        return this;
    }

    line_dash(ary = null, lineWidth = null){ 
        if(!ary) ary = [0];
        this.ctx.setLineDash(ary);

        if(lineWidth != null) this.ctx.lineWidth = lineWidth;
        return this;
    }

    dash(){ this.ctx.setLineDash( [4,5] ); return this; }
    undash(){ this.ctx.setLineDash( [0] ); return this; }

    font(font = "12px verdana", textAlign="left"){
        if(font)		this.ctx.font		= font;
        if(textAlign)	this.ctx.textAlign	= textAlign;
        return this;
    }


//////////////////////////////////////////////////////////////////
// Misc
//////////////////////////////////////////////////////////////////
    fill_color(c){ return this.fill(c).rect( this.clearX, this.clearY, this.width, this.height, 1 ); }
    clear(){ this.ctx.clearRect(this.clearX, this.clearY, this.width, this.height); return this; }

    restore_transform(){ this.ctx.restore(); return this; }
    save_transform( vpos = null, ang = null, vscale = null ){
        this.ctx.save();
        if(vpos)		this.ctx.translate( vpos[0], vpos[1] );
        if(ang != null)	this.ctx.rotate( ang );
        if(vscale)		this.ctx.scale( vscale[0], vscale[1] );
        return this;
    }

    /** Test text width */
    get_text_width( txt ){ 
        /* CHROME SUPPORTS THIS ONLY BEHIND A FLAG, FIREFOX WILL SUPPORT IT AT SOME POINT
        let metrics = ctx.measureText(text);
        let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent; */
        return this.ctx.measureText( txt ).width;
    }

    //Set the size of the canvas html element and the rendering view port
    size( w = 500, h = 500 ){
        var box				= this.canvas.getBoundingClientRect();
        this.offsetX		= box.left;	//Help get X,Y in relation to the canvas position.
        this.offsetY		= box.top;
        //TODO, might need to replace offset with mouseOffset
        this.mouseOffsetX	= this.canvas.scrollLeft + this.canvas.offsetLeft; 	//box.left;	// Help get X,Y in relation to the canvas position.
        this.mouseOffsetY	= this.canvas.scrollTop + this.canvas.offsetTop; 	//box.top;

        //set the size of the canvas, on chrome we need to set it 3 ways to make it work perfectly.
        this.canvas.style.width		= w + "px";
        this.canvas.style.height	= h + "px";
        this.canvas.width			= w;
        this.canvas.height			= h;
        this.width 					= w;
        this.height 				= h;

        return this;
    }


//////////////////////////////////////////////////////////////////
// Drawing
//////////////////////////////////////////////////////////////////
    draw( d ){
        if( (d & 1) != 0 ) this.ctx.fill();
        if( (d & 2) != 0 ) this.ctx.stroke();
    }

    //++++++++++++++++++++++++++++++

    text( txt, x=0, y=0, draw=1 ){ 
        //this.ctx.font = "Bold 30px Arial";
        if( (draw & 1) != 0 ) this.ctx.fillText( txt, x, y );
        if( (draw & 2) != 0 ) this.ctx.strokeText( txt, x, y );
        return this;
    }

    text_center( txt, yOffset=0, draw=1 ){
        let tw = this.ctx.measureText( txt ).width,
            th = this.ctx.measureText( "M" ).width, //this.fontSize,
            cw = this.ctx.canvas.width,
            ch = this.ctx.canvas.height;

        this.text( txt, (cw - tw) * 0.5, th + yOffset, draw );
        return this;
    }

    //++++++++++++++++++++++++++++++

    circle(x, y, radius = 10, draw = 1 ){
        const p2 = Math.PI * 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius ,0, p2, false );
        this.draw( draw );
        return this;
    }

    circle_vec( v, radius = 10, draw = 1 ){
        const p2 = Math.PI * 2;
        this.ctx.beginPath();
        this.ctx.arc( v[0], v[1], radius ,0, p2, false );
        this.draw( draw );
        return this;
    }

    circle_vec_ary( draw, radius, v ){
        const p2 = Math.PI * 2;
        for(var i=1; i < arguments.length; i++){
            this.ctx.beginPath();
            this.ctx.arc( arguments[i][0], arguments[i][1], radius ,0, p2, false );
            this.draw( draw );
        }

        return this;
    }

    ellipse_vec( v, xRadius = 5, yRadius = 10, draw = 2 ){
        const p2 = Math.PI * 2;
        this.ctx.beginPath();
        this.ctx.ellipse(v[0], v[1], xRadius, yRadius , 0, p2, false);
        this.draw( draw );
        return this;
    }

    //++++++++++++++++++++++++++++++

    rect( x=0, y=0, w=0, h=0, draw = 2 ){
        if(!w) w = this.width;
        if(!h) h = this.height;

        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.draw( draw );
        return this;
    }

    rect_round( x, y, w, h, r=0, draw = 1 ){
        this.ctx.beginPath();

        this.ctx.moveTo( x+r, y );
        this.ctx.lineTo( x+w-r, y );
        this.ctx.quadraticCurveTo( x+w, y, x+w, y+r );

        this.ctx.lineTo( x+w, y+h-r );
        this.ctx.quadraticCurveTo( x+w, y+h, x+w-r, y+h );

        this.ctx.lineTo( x+r, y+h );
        this.ctx.quadraticCurveTo( x, y+h, x, y+h-r );

        this.ctx.lineTo( x, y+r );
        this.ctx.quadraticCurveTo( x, y, x+r, y );

        this.ctx.closePath();
        
           this.draw( draw );
        return this;
    }

    rect_border( pad, r, draw = 1 ){
        let x = pad,
            y = pad,
            w = this.ctx.canvas.width - pad * 2,
            h = this.ctx.canvas.height - pad * 2;
        this.rect_round( x, y, w, h, r, draw );
        return this;
    }

    //++++++++++++++++++++++++++++++

    line_vec( p0, p1 ){
        this.ctx.beginPath();
        this.ctx.moveTo( p0[0], p0[1] );
        this.ctx.lineTo( p1[0], p1[1] );
        this.ctx.stroke();
        return this;
    }

    line_vec_ary( draw, p0, p1 ){
        this.ctx.beginPath();
        this.ctx.moveTo( p0[0], p0[1] );

        for(var i=2; i < arguments.length; i++)
            this.ctx.lineTo( arguments[i][0], arguments[i][1] );

        this.draw( draw );
        return this;
    }

    //++++++++++++++++++++++++++++++

    tri_vec( wh, hh, offsetX = 0, offsetY = 0, draw=1 ){
        this.ctx.beginPath();
        this.ctx.moveTo(offsetX,		offsetY + hh );
        this.ctx.lineTo(offsetX - wh,	offsetY - hh );
        this.ctx.lineTo(offsetX + wh,	offsetY - hh );
        this.draw( draw );
        return this;
    }

    //++++++++++++++++++++++++++++++
    arrow( from, to, head_len=10 ){
        let dx		= to[0] - from[0],
            dy		= to[1] - from[1],
            angle	= Math.atan2(dy, dx),
            inc 	= Math.PI / 6;

        this.ctx.beginPath();
        this.ctx.moveTo( from[0], from[1] );
        this.ctx.lineTo( to[0], to[1]);
        this.ctx.lineTo( 
            to[0] - head_len * Math.cos( angle - inc ), 
            to[1] - head_len * Math.sin( angle - inc )
        );
        this.ctx.moveTo( to[0], to[1]);
        this.ctx.lineTo( 
            to[0] - head_len * Math.cos( angle + inc ), 
            to[1] - head_len * Math.sin( angle + inc )
        );
        this.ctx.stroke();
    }



//////////////////////////////////////////////////////////////////
// Pixel Drawing
//////////////////////////////////////////////////////////////////

    prepare_px_drawing(){
        this.imageData	= this.ctx.getImageData( 0, 0, this.width, this.height );	// Get Image Data object
        this.aryRGBA	= this.imageData.data;										// Then its raw RGBA Array
        return this;
    }

    update_px(){ this.ctx.putImageData( this.imageData, 0, 0 ); return this; }

    set_px( x, y, r, g, b, a=255 ){
        var idx = ( y * this.width + x ) * 4; // RowStart Plus Col Times RGBA component count
        this.aryRGBA[idx]	= r;
        this.aryRGBA[idx+1]	= g;
        this.aryRGBA[idx+2]	= b;
        this.aryRGBA[idx+3]	= a;
        return this;
    }

    set_px_clr( x, y, hex ){
        var bigint	= parseInt( hex, 16 ),
            r 		= (bigint >> 16) & 255,
            g		= (bigint >> 8) & 255,
            b		= bigint & 255;

        var idx = ( y * this.width + x ) * 4; // RowStart Plus Col Times RGBA component count
        this.aryRGBA[idx]	= r;
        this.aryRGBA[idx+1]	= g;
        this.aryRGBA[idx+2]	= b;
        this.aryRGBA[idx+3]	= 255;
        return this;
    }

    // http://iquilezles.org/www/articles/palettes/palettes.htm
    // vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
    // return a + b*cos( 6.28318*(c*t+d) );
    set_palette( x, y, t, a, b, c, d ){
        var idx = (y*this.width + x) * 4; //RowStart Plus Col Times RGBA component count
        this.aryRGBA[ idx ]		= ( a[0] + b[0] * Math.cos( 6.28318 * ( c[0] * t + d[0]) ) ) * 255;
        this.aryRGBA[ idx+1 ]	= ( a[1] + b[1] * Math.cos( 6.28318 * ( c[1] * t + d[1]) ) ) * 255;
        this.aryRGBA[ idx+2 ]	= ( a[2] + b[2] * Math.cos( 6.28318 * ( c[2] * t + d[2]) ) ) * 255;
        this.aryRGBA[ idx+3 ]	= 255;
    }

    get_px( x, y ){
        var idx = ( y * this.width + x ) * 4;
        return [
            this.aryRGBA[ idx ],
            this.aryRGBA[ idx+1 ],
            this.aryRGBA[ idx+2 ],
            this.aryRGBA[ idx+3 ]
        ];
    }

    download(){
        //Force it to download, instead of view by changing the mime time.
        var uri = this.canvas.toDataURL().replace("image/png","image/octet-stream");
        //window.location.href = uri;
        console.log(uri);
        return this;
    }

}



class Vec3 extends Float32Array{
constructor(ini){
    super(3);

    if(ini instanceof Vec3 || (ini && ini.length == 3)){
        this[0] = ini[0]; this[1] = ini[1]; this[2] = ini[2];
    }else if(arguments.length == 3){
        this[0] = arguments[0]; this[1] = arguments[1]; this[2] = arguments[2];
    }else{
        this[0] = this[1] = this[2] = ini || 0;
    }
}

////////////////////////////////////////////////////////////////////
// GETTER - SETTERS
////////////////////////////////////////////////////////////////////

    set( x=null, y=null, z=null ){ 
        if( x != null ) this[0] = x;
        if( y != null ) this[1] = y; 
        if( z != null ) this[2] = z;
        return this;
    }

    get x(){ return this[0]; }	set x(val){ this[0] = val; }
    get y(){ return this[1]; }	set y(val){ this[1] = val; }
    get z(){ return this[2]; }	set z(val){ this[2] = val; }

    clone(){ return new Vec3(this); }
    
    copy(v){ this[0] = v[0]; this[1] = v[1]; this[2] = v[2]; return this; }

    setLength(len){ return this.norm().scale(len); }

    length(v){
        //Only get the magnitude of this vector
        if(v === undefined) return Math.sqrt( this[0]*this[0] + this[1]*this[1] + this[2]*this[2] );

        //Get magnitude based on another vector
        var x = this[0] - v[0],
            y = this[1] - v[1],
            z = this[2] - v[2];

        return Math.sqrt( x*x + y*y + z*z );
    }
    
    lengthSqr(v){
        //Only get the squared magnitude of this vector
        if(v === undefined) return this[0]*this[0] + this[1]*this[1] + this[2]*this[2];

        //Get squared magnitude based on another vector
        var x = this[0] - v[0],
            y = this[1] - v[1],
            z = this[2] - v[2];

        return x*x + y*y + z*z;
    }

    dot( v ){ return this[0] * v[0] + this[1] * v[1] + this[2] * v[2]; }

    from_cross( a, b ){
        var ax = a[0], ay = a[1], az = a[2],
            bx = b[0], by = b[1], bz = b[2];
        this[0] = ay * bz - az * by;
        this[1] = az * bx - ax * bz;
        this[2] = ax * by - ay * bx;
        return this;
    }

    from_add( a, b ){
        this[0] = a[0] + b[0];
        this[1] = a[1] + b[1];
        this[2] = a[2] + b[2];
        return this;
    }

    from_sub( a, b ){
        this[0] = a[0] - b[0];
        this[1] = a[1] - b[1];
        this[2] = a[2] - b[2];
        return this;
    }

    from_mul( a, b ){
        this[0] = a[0] * b[0];
        this[1] = a[1] * b[1];
        this[2] = a[2] * b[2];
        return this;
    }


    from_scale( a, s ){
        this[0] = a[0] * s;
        this[1] = a[1] * s;
        this[2] = a[2] * s;
        return this;
    }

    from_lerp( t, a, b ){ //Linear Interpolation : (1 - t) * v0 + t * v1;
        var ti = 1 - t;
        this[0] = a[0] * ti + b[0] * t;
        this[1] = a[1] * ti + b[1] * t;
        this[2] = a[2] * ti + b[2] * t;
        return this;
    }

    from_quat( q, dir=null ){
        Vec3.transformQuat( dir || Vec3.FORWARD, q, this );
        return this;
    }

    set_polar( lon, lat ) {
        let phi 	= ( 90 - lat ) * 0.01745329251, //deg 2 rad
            theta 	= lon * 0.01745329251,  //( lon + 180 ) * 0.01745329251,
            sp     	= Math.sin(phi);

        this[0] = -sp * Math.sin( theta );
        this[1] = Math.cos( phi );
        this[2] = sp * Math.cos( theta );
        return this;
    }


////////////////////////////////////////////////////////////////////
// INSTANCE OPERATORS
////////////////////////////////////////////////////////////////////
    add(v,out){
        out = out || this;
        out[0] = this[0] + v[0];
        out[1] = this[1] + v[1];
        out[2] = this[2] + v[2];
        return out;
    }

    sub(v,out){
        out = out || this;
        out[0] = this[0] - v[0];
        out[1] = this[1] - v[1];
        out[2] = this[2] - v[2];
        return out;
    }

    mul(v,out){
        out = out || this;
        out[0] = this[0] * v[0];
        out[1] = this[1] * v[1];
        out[2] = this[2] * v[2];

        return out;
    }

    div(v,out){
        out = out || this;
        out[0] = (v[0] != 0)? this[0] / v[0] : 0;
        out[1] = (v[1] != 0)? this[1] / v[1] : 0;
        out[2] = (v[2] != 0)? this[2] / v[2] : 0;

        return out;
    }

    divInvScale(v,out){
        out = out || this;
        out[0] = (this[0] != 0)? v / this[0] : 0;
        out[1] = (this[1] != 0)? v / this[1] : 0;
        out[2] = (this[2] != 0)? v / this[2] : 0;
        return out;
    }	

    scale(v,out){
        out = out || this;
        out[0] = this[0] * v;
        out[1] = this[1] * v;
        out[2] = this[2] * v;
        return out;
    }

    divScale(v,out){
        out = out || this;
        out[0] = this[0] / v;
        out[1] = this[1] / v;
        out[2] = this[2] / v;
        return out;
    }

    abs( out ){
        out = out || this;
        out[0] = Math.abs( this[0] );
        out[1] = Math.abs( this[1] );
        out[2] = Math.abs( this[2] );
        return out;
    }

    floor( out ){
        out = out || this;
        out[0] = Math.floor( this[0] );
        out[1] = Math.floor( this[1] );
        out[2] = Math.floor( this[2] );
        return out;
    }

    //When values are very small, like less then 0.000001, just make it zero.
    nearZero(out){
        out = out || this;

        if(Math.abs(out[0]) <= 1e-6) out[0] = 0;
        if(Math.abs(out[1]) <= 1e-6) out[1] = 0;
        if(Math.abs(out[2]) <= 1e-6) out[2] = 0;

        return out;
    }

    invert(out){
        out = out || this;
        out[0] = -this[0];
        out[1] = -this[1];
        out[2] = -this[2];
        return out;
    }

    norm(out){
        var mag = Math.sqrt( this[0]*this[0] + this[1]*this[1] + this[2]*this[2] );
        if(mag == 0) return this;

        out = out || this;
        out[0] = this[0] / mag;
        out[1] = this[1] / mag;
        out[2] = this[2] / mag;

        return out;
    }


////////////////////////////////////////////////////////////////////
// TRANSFORMATIONS
////////////////////////////////////////////////////////////////////
    
    transformMat3(m,out){
        var x = this[0], y = this[1], z = this[2];
        out = out || this;
        out[0] = x * m[0] + y * m[3] + z * m[6];
        out[1] = x * m[1] + y * m[4] + z * m[7];
        out[2] = x * m[2] + y * m[5] + z * m[8];
        return out;
    }

    transformMat4(m,out){
        var x = this[0], y = this[1], z = this[2],
            w = m[3] * x + m[7] * y + m[11] * z + m[15];
        w = w || 1.0;

        out = out || this;
        out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
        out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
        out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
        return out;
    }

    //https://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/3drota.htm
    rotate(rad, axis = "x", out = null){
        out = out || this;

        var sin = Math.sin(rad),
            cos = Math.cos(rad),
            x 	= this[0],
            y 	= this[1],
            z 	= this[2];

        switch(axis){
            case "y": //..........................
                out[0]	= z*sin + x*cos; //x
                out[2]	= z*cos - x*sin; //z
            break;
            case "x": //..........................
                out[1]	= y*cos - z*sin; //y
                out[2]	= y*sin + z*cos; //z
            break;
            case "z": //..........................
                out[0]	= x*cos - y*sin; //x
                out[1]	= x*sin + y*cos; //y
            break;
        }

        return out;
    }

    lerp(v, t, out){
        if(out == null) out = this;
        var tMin1 = 1 - t;

        //Linear Interpolation : (1 - t) * v0 + t * v1;
        out[0] = this[0] * tMin1 + v[0] * t;
        out[1] = this[1] * tMin1 + v[1] * t;
        out[2] = this[2] * tMin1 + v[2] * t;
        return out;
    }

    transform_quat( q ){ return Vec3.transformQuat( this, q, this ); }

    
    rot_axis_angle( axis, rad, out ){
        // Rodrigues Rotation formula:
        // v_rot = v * cos(theta) + cross( axis, v ) * sin(theta) + axis * dot( axis, v) * (1-cos(theta))
        let cp	= Vec3.cross( axis, this ),
            dot	= Vec3.dot( axis, this ),
            s	= Math.sin(rad),
            c	= Math.cos(rad),
            ci	= 1 - c;

        out = out || this;
        out[ 0 ] = this[0] * c + cp[0] * s + axis[0] * dot * ci;
        out[ 1 ] = this[1] * c + cp[1] * s + axis[1] * dot * ci;
        out[ 2 ] = this[2] * c + cp[2] * s + axis[2] * dot * ci;
        return out;
    }


////////////////////////////////////////////////////////////////////
// STATIC OPERATORS
////////////////////////////////////////////////////////////////////

    static add(a, b, out){ 
        out = out || new Vec3();
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        return out;
    }

    static sub(a, b, out){ 
        out = out || new Vec3();
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        return out;
    }

    static mul(a, b, out){
        out = out || new Vec3();
        out[0] = a[0] * b[0];
        out[1] = a[1] * b[1];
        out[2] = a[2] * b[2];
        return out;
    }

    static div(a,b,out){
        out = out || new Vec3();
        out[0] = (b[0] != 0)? a[0] / b[0] : 0;
        out[1] = (b[1] != 0)? a[1] / b[1] : 0;
        out[2] = (b[2] != 0)? a[2] / b[2] : 0;
        return out;
    }

    static scale(v,s,out){
        out	= out || new Vec3();
        out[0] = v[0] * s;
        out[1] = v[1] * s;
        out[2] = v[2] * s;
        return out;
    }

    static invert(v,out){
        out	= out || new Vec3();
        out[0] = -v[0];
        out[1] = -v[1];
        out[2] = -v[2];
        return out;
    }

    static abs(v,out){
        out = out || new Vec3();
        out[0] = Math.abs( v[0] );
        out[1] = Math.abs( v[1] );
        out[2] = Math.abs( v[2] );
        return out;
    }

    static norm(v, out){
        var mag = Math.sqrt( v[0]*v[0] + v[1]*v[1] + v[2]*v[2] );
        if(mag == 0) return null;
        out		= out || new Vec3();

        mag 	= 1 / mag;
        out[0]	= v[0] * mag;
        out[1]	= v[1] * mag;
        out[2]	= v[2] * mag;
        return out
    }

    static dot(a,b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
    static cross(a,b,out){
        var ax = a[0], ay = a[1], az = a[2],
            bx = b[0], by = b[1], bz = b[2];

        out	= out || new Vec3();
        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    }

    static angle( v0, v1 ){
        //acos(dot(a,b)/(len(a)*len(b))) 
        //let theta = this.dot( v0, v1 ) / ( Math.sqrt( v0.lengthSqr() * v1.lengthSqr() ) );
        //return Math.acos( Math.max( -1, Math.min( 1, theta ) ) ); // clamp ( t, -1, 1 )

        // atan2(len(cross(a,b)),dot(a,b))   Other in unstable near zero
        let d = this.dot( v0, v1 );
        let c = Vec3.cross( v0, v1 );
        return Math.atan2( c.length(), d ); 
    }

    static len( a, b ){ return Math.sqrt( (a[0]-b[0]) ** 2 + (a[1]-b[1]) ** 2 + (a[2]-b[2]) ** 2 ); }
    static len_sqr( a, b ){ return (a[0]-b[0]) ** 2 + (a[1]-b[1]) ** 2 + (a[2]-b[2]) ** 2; }

    static from_polar( lon, lat, out ) {
        let phi 	= ( 90 - lat ) * 0.01745329251, //deg 2 rad
            theta 	= lon * 0.01745329251, //( lon + 180 ) * 0.01745329251,
            sp     	= Math.sin(phi);

        out = out || new Vec3();
        out[0] = -sp * Math.sin( theta );
        out[1] = Math.cos( phi );
        out[2] = sp * Math.cos( theta );
        out.nearZero();
        return out;
    }

    //https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/vec3.js#L514
    static transformQuat(a, q, out) {
        // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
        let qx	= q[0], qy	= q[1], qz	= q[2], qw = q[3],
            x	= a[0], y	= a[1], z	= a[2];

        // var qvec = [qx, qy, qz];
        // var uv = vec3.cross([], qvec, a);
        let uvx = qy * z - qz * y,
            uvy = qz * x - qx * z,
            uvz = qx * y - qy * x;
        // var uuv = vec3.cross([], qvec, uv);
        let uuvx = qy * uvz - qz * uvy,
            uuvy = qz * uvx - qx * uvz,
            uuvz = qx * uvy - qy * uvx;
        // vec3.scale(uv, uv, 2 * w);
        let w2 = qw * 2;
        uvx *= w2;
        uvy *= w2;
        uvz *= w2;
        // vec3.scale(uuv, uuv, 2);
        uuvx *= 2;
        uuvy *= 2;
        uuvz *= 2;

        // return vec3.add(out, a, vec3.add(out, uv, uuv));
        out = out || new Vec3();
        out[0] = x + uvx + uuvx;
        out[1] = y + uvy + uuvy;
        out[2] = z + uvz + uuvz;
        return out;
    }

    //When values are very small, like less then 0.000001, just make it zero.
    static nearZero(v, out){
        out = out || new Vec3();

        out[0] = (Math.abs(v[0]) <= 1e-6) ? 0 : v[0];
        out[1] = (Math.abs(v[1]) <= 1e-6) ? 0 : v[1];
        out[2] = (Math.abs(v[2]) <= 1e-6) ? 0 : v[2];

        return out;
    }
}