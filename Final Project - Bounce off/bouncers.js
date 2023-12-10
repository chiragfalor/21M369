let mouseEnergy = 0.1;

class Bouncer {

    constructor(x, y, vx, vy, r, ctx) {
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
        this.r = r;
        this.color = color(random(100), random(200), random(255));
        this.ctx = ctx
        this.destroyed_objects = [];
    }

    
    getBallVelocity(mouseX, mouseY) {
    const v = this.propVelocity(this.pos.x, this.pos.y, mouseX, mouseY);
    // bound the velocity
    if (v.mag() < 2) {
      v.setMag(2);
    }
    if (v.mag() > 10) {
      v.setMag(10);
    }
    return v;
    }
  
//   function getBallRadius() {
//     const duration = millis() - mousePressedTime;
//     r = map(duration, 0, 1000, 0, 50);
//     return min(r, 20);
//   }
  
    propVelocity(ballx, bally, mouseX, mouseY) {
    const dx = -(mouseX - ballx);
    const dy = -(mouseY - bally);
    const v = createVector(dx*mouseEnergy, dy*mouseEnergy);
    // if v is 0, set it to a small value in the x direction
    if (v.mag() <= 0.1) {
      v.x = 0.1;
    }
    return v;
  }


    update() {
        // Update the position of the ball
        this.pos.add(this.vel);
    
        // Update the velocity of the ball
        this.update_velocity();
    
        // Update the age of the ball
        this.update_age();

        // Draw the ball
        this.draw();
        // console.log(this.color);
      }

    draw() {
        // make an ellipse with color
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * PI);
        this.ctx.fill();
    }

    isOutOfBounds() {
        return this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height;
    }

    destroy(object) {
        if (object.isInside(this.pos.x, this.pos.y, this.r)) {
            object.bounce(this);
            if (!object.is_hard) {
                this.destroyed_objects.push(object);
                // take color of object
                this.color = object.color;
                return true;
            }
        }

        return false;
    }

    update_velocity() {
        return;
    }

    update_age() {
        return;
    }

}