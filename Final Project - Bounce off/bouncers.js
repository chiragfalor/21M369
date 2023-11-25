let mouseEnergy = 0.1;

class Bouncer {

    constructor(x, y, vx, vy, r) {
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
        this.r = r;
        this.color = color(random(255), random(200), 50+random(205));
        this.destroyed_objects = [];
    }

    
    getBallVelocity(mouseX, mouseY) {
    const v = this.propVelocity(this.pos.x, this.pos.y, mouseX, mouseY);
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
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }

    isOutOfBounds() {
        return this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height;
    }

    destroy(object) {
        if (object.isInside(this.pos.x, this.pos.y, this.r)) {
            object.bounce(this);
            if (!object.is_hard) {
                this.destroyed_objects.push(object);
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