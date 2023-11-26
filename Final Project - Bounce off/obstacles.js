class Obstacle {
    constructor(ctx, x, y, color, is_hard, sobj) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.is_hard = is_hard;
        this.ctx = ctx;
        this.sobj = sobj;
    }

    setup() {
        this.draw();
    }

    collide() {
        this.sobj.play_sound();
    }

    update() {
        this.draw();
    }

    isInside(x, y) {
        return false;
    }
}


class Rectangle extends Obstacle{
    constructor(ctx, x, y, width, height, is_hard, freq=60) {
        if (is_hard) {
            var color = "black";
            var sobj = new Snare();
        } else {
            var color = "grey";
            var sobj = new Piano(freq);
        }
        super(ctx, x, y, color, is_hard, sobj);
        this.width = width;
        this.height = height;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // bounce off bouncers
    bounce(bouncer) {
        this.collide();
        if (bouncer.pos.x < this.x || bouncer.pos.x > this.x + this.width) {
            bouncer.vel.x *= -1;
        }
        if (bouncer.pos.y < this.y || bouncer.pos.y > this.y + this.height) {
            bouncer.vel.y *= -1;
        }
    }

    isInside(x, y, radius) {
        // return (this.x < x && x < this.x + this.width && this.y < y && y < this.y + this.height);
        return (this.x - radius < x && x < this.x + this.width + radius && this.y - radius < y && y < this.y + this.height + radius);
    }
}

class Square extends Rectangle {
    constructor(ctx, x, y, size, is_hard, freq=60) {
        super(ctx, x, y, size, size, is_hard, freq);
    }
}

class Line extends Obstacle{
    constructor(ctx, x1, y1, x2, y2, is_hard) {
        if (is_hard) {
            var color = "black";
            var sobj = new Snare();
        } else {
            var color = "grey";
            var sobj = new Piano();
        }

        super(ctx, x1, y1, color, is_hard, sobj);
        this.x2 = x2;
        this.y2 = y2
    }

    draw() {
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x2, this.y2);
        this.ctx.stroke();
    }
}

class Disc extends Obstacle{
    constructor(ctx, x, y, radius, is_hard, freq=60) {
        if (is_hard) {
            var color = "black";
            var sobj = new Snare();
        } else {
            var color = "grey";
            var sobj = new Piano(freq);
        }

        super(ctx, x, y, color, is_hard, sobj);
        this.radius = radius;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    isInside(x, y, radius) {
        return (Math.sqrt((this.x - x)**2 + (this.y - y)**2) < this.radius + radius);
    }

    // bounce off bouncers
    bounce(bouncer) {
        this.collide();
        // bounce off the normal
        const normal = createVector(bouncer.pos.x - this.x, bouncer.pos.y - this.y);
        normal.normalize();
        const dot = p5.Vector.dot(normal, bouncer.vel);
        const reflected = p5.Vector.sub(bouncer.vel, p5.Vector.mult(normal, 2 * dot));

        bouncer.vel = reflected;
    }
}