function get_color(freq) {
    var hue = (freq - 55) * 10;
    return "hsl(" + hue + ", 100%, 50%)";
}

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
            // get color from frequency with color based on hue
            var color = get_color(freq);
            
            // var color = "grey";
            var sobj = new Piano(freq);
        }
        super(ctx, x, y, color, is_hard, sobj);
        this.width = width;
        this.height = height;
    }

    draw() {
        // console.log(this.color);
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
            var color = get_color(freq);
            var sobj = new Piano();
        }

        super(ctx, x1, y1, color, is_hard, sobj);
        this.x2 = x2;
        this.y2 = y2;
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
            var color = get_color(freq);
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

class Triangle extends Obstacle{
    constructor(ctx, x1, y1, x2, y2, x3, y3, is_hard, freq=60) {
        if (is_hard) {
            var color = "black";
            var sobj = new Snare();
        } else {
            var color = get_color(freq);
            var sobj = new Piano(freq);
        }

        super(ctx, x1, y1, color, is_hard, sobj);
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;

        this.v1 = createVector(this.x, this.y);
        this.v2 = createVector(this.x2, this.y2);
        this.v3 = createVector(this.x3, this.y3);
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x2, this.y2);
        this.ctx.lineTo(this.x3, this.y3);
        this.ctx.fill();
    }

    
    getNearestEdge(p) {
        const edges = [
            [this.v1, this.v2],
            [this.v2, this.v3],
            [this.v3, this.v1]
        ];

        let nearestEdge = null;
        let nearestDistance = Infinity;
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            const distance = this.distToSegment(p, edge[0], edge[1]);
            if (distance < nearestDistance) {
                nearestEdge = edge;
                nearestDistance = distance;
            }
        }
        return p5.Vector.sub(nearestEdge[1], nearestEdge[0]);

    }

    distToSegment(p, v1, v2) {
        const v = p5.Vector.sub(v2, v1);
        const w = p5.Vector.sub(p, v1);
        const c1 = p5.Vector.dot(w, v);
        if (c1 <= 0) {
          return p5.Vector.dist(p, v1);
        }
        const c2 = p5.Vector.dot(v, v);
        if (c2 <= c1) {
          return p5.Vector.dist(p, v2);
        }
        const b = c1 / c2;
        const pb = p5.Vector.add(v1, p5.Vector.mult(v, b));
        return p5.Vector.dist(p, pb);
      }


    isInside(x, y, radius) {
        function sign(p1, p2, p3) {
            return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
        }

        const pt = createVector(x, y);

        const b1 = sign(pt, this.v1, this.v2) < 0;
        const b2 = sign(pt, this.v2, this.v3) < 0;
        const b3 = sign(pt, this.v3, this.v1) < 0;
        return ((b1 == b2) && (b2 == b3));
    }


    bounce(bouncer) {
        this.collide();
        // bounce off the normal
        const nearestEdge = this.getNearestEdge(bouncer.pos);
        const normal = createVector(nearestEdge.y, -nearestEdge.x).normalize();
        const dot = p5.Vector.dot(normal, bouncer.vel);
        const reflected = p5.Vector.sub(bouncer.vel, p5.Vector.mult(normal, 2 * dot));
        bouncer.vel = reflected;
    }
}

