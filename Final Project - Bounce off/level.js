function drawArrow(x1, y1, x2, y2, thickness, color) {
    push();
    stroke(color);
    strokeWeight(thickness);
    line(x1, y1, x2, y2);
    const angle = atan2(y2 - y1, x2 - x1);
    const headlen = 10;
    line(x2, y2, x2 - headlen * cos(angle - PI / 7), y2 - headlen * sin(angle - PI / 7));
    line(x2, y2, x2 - headlen * cos(angle + PI / 7), y2 - headlen * sin(angle + PI / 7));
    pop();
  }

class Level {
    constructor(objects, bouncer_size, ctx) {
        this.objects = objects;
        this.bouncer_size = bouncer_size;
        this.ctx = ctx;
        // this.setup();
    }

    setup() {
        // clear the canvas
        clear();
        background(200, 100, 100, 100);

        // draw the objects
        this.objects.forEach(object => object.setup());

        this.bouncers = [];
    }

    update() {
        // clear the canvas
        // clear();
        background(200, 100, 100, 500);

        // update the objects
        this.objects.forEach(object => object.update());

        // update the bouncers
        for (let i = 0; i < this.bouncers.length; i++) {
            const bouncer = this.bouncers[i];
            bouncer.update();
            // if any bouncer is out of bounds, remove it
            if (bouncer.isOutOfBounds()) {
                // check if all not is_hard objects are destroyed
                // ie all remaining objects are hard
                if (this.objects.every(object => object.is_hard)) {
                    return true;
                }
                
                // add destroyed objects to the objects array
                this.objects = this.objects.concat(bouncer.destroyed_objects);
                this.bouncers.splice(i, 1);
                i--;
            }
            // check if the bouncer collides with any object
            for (let j = 0; j < this.objects.length; j++) {
                const object = this.objects[j];
                if (bouncer.destroy(object)) {
                    // remove the object if it is not hard
                    this.objects.splice(j, 1);
                    j--;
                }
            }
            // for (let j = 0; j < this.objects.length; j++) {
            //     const object = this.objects[j];
            //     if (bouncer.collide(object)) {
            //         this.bouncers.splice(i, 1);
            //         i--;
            //         break;
            //     }
            // }
        }
        this.bouncers.forEach(bouncer => bouncer.update());

    }

    mousePressed() {
        // mousePressedtime = millis();
        // make object based on the key pressed
        const ball = new Bouncer(mouseX, mouseY, 0, 0, this.bouncer_size, this.ctx);
        this.bouncers.push(ball);




    }

    mouseIsPressed() {

        const ball = this.bouncers[this.bouncers.length - 1];
        
        // draw the velocity vector
        const v = ball.getBallVelocity(mouseX, mouseY);
        const arrowLen = 7;
        // draw the velocity vector
        drawArrow(ball.pos.x, ball.pos.y, ball.pos.x+v.x*arrowLen, ball.pos.y+v.y*arrowLen, 3, color(0, 255, 0));

    }

    mouseReleased() {
        const ball = this.bouncers[this.bouncers.length - 1];
        ball.vel = ball.getBallVelocity(mouseX, mouseY);
    }
}