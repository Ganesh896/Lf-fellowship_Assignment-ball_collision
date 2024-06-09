// careating the outer container
const container = document.createElement("div");
const containerWidth = 1200;
const containerHeight = 680;
container.style.position = "relative";
container.style.width = containerWidth + "px";
container.style.height = containerHeight + "px";
container.style.border = "2px solid #000";

document.body.appendChild(container); //inserting the container into body

// create the class for ball/ball
class Ball {
    constructor(xpose, ypose, radius, color, speedX, speedY) {
        this.xpose = xpose;
        this.ypose = ypose;
        this.radius = radius;
        this.color = color;
        this.dx = speedX;
        this.dy = speedY;

        // creating ball and inserting into the container
        this.ball = document.createElement("div");
        this.ball.style.position = "absolute";
        this.ball.style.width = this.radius * 2 + "px";
        this.ball.style.height = this.radius * 2 + "px";
        this.ball.style.borderRadius = "50%";
        this.ball.style.background = this.color;

        container.appendChild(this.ball);

        this.setPosition(); //setting initial positon of the balls
    }

    setPosition() {
        this.ball.style.left = this.xpose + "px";
        this.ball.style.top = this.ypose + "px";
    }

    updatePosition() {
        this.xpose += this.dx;
        this.ypose += this.dy;

        if (this.xpose <= 0) {
            this.xpose = 0;
            this.dx *= -1;
        }
        if (this.xpose + this.radius * 2 >= containerWidth) {
            this.xpose = containerWidth - this.radius * 2;
            this.dx *= -1;
        }
        if (this.ypose <= 0) {
            this.ypose = 0;
            this.dy *= -1;
        }
        if (this.ypose + this.radius * 2 >= containerHeight) {
            this.ypose = containerHeight - this.radius * 2;
            this.dy *= -1;
        }

        this.setPosition();
    }
}

const balls = [];

const appendBalls = function (n) {
    for (let i = 0; i < n; i++) {
        const radius = Math.random() * 30 + 10;
        const randX = Math.floor(Math.random() * (containerWidth - radius * 2));
        const randY = Math.floor(Math.random() * (containerHeight - radius * 2));
        const red = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);

        const speedX = Math.random() * 4 - 2;
        const speedY = Math.random() * 4 - 2;

        const ball = new Ball(randX, randY, radius, `rgb(${red}, ${blue}, ${green})`, speedX, speedY);
        balls.push(ball);
    }
};

const detectCollision = function (ball1, ball2) {
    const dx = ball1.xpose - ball2.xpose;
    const dy = ball1.ypose - ball2.ypose;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball1.radius + ball2.radius) {
        // calculating sin and cos for rotating
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const x1 = 0;
        const y1 = 0;

        const x2 = dx * cos + dy * sin;
        const y2 = dy * cos - dx * sin;

        // rotating velocities for simplify in 1D
        const vx1 = ball1.dx * cos + ball1.dy * sin;
        const vy1 = ball1.dy * cos - ball1.dx * sin;

        const vx2 = ball2.dx * cos + ball2.dy * sin;
        const vy2 = ball2.dy * cos - ball2.dx * sin;

        const vx1Final = vx2;
        const vx2Final = vx1;

        // rotating the velocities back to original
        ball1.dx = vx1Final * cos - vy1 * sin;
        ball1.dy = vy1 * cos + vx1Final * sin;
        ball2.dx = vx2Final * cos - vy2 * sin;
        ball2.dy = vy2 * cos + vx2Final * sin;

        // Separating Overlapping Circles
        const overlap = (ball1.radius + ball2.radius - distance) / 2;
        const separationX = overlap * cos;
        const separationY = overlap * sin;
        ball1.xpose += separationX;
        ball1.ypose += separationY;
        ball2.xpose -= separationX;
        ball2.ypose -= separationY;
    }
};

const animateBalls = function () {
    setInterval(() => {
        balls.forEach((ball) => {
            ball.updatePosition();
        });

        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                detectCollision(balls[i], balls[j]);
            }
        }
    }, 20);
};

appendBalls(100);
animateBalls();
