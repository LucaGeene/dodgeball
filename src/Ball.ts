/**
 * Represents a single Ball in the game.
 */
class Ball {
    private radius: number;
    private positionX: number;
    private positionY: number;
    private speedX: number;
    private speedY: number;

    /**
     * Construct a new `Ball`.
     * 
     * @param canvas The `canvas` that knows the size of the scene
     */
    public constructor(canvas: HTMLCanvasElement) {
        this.radius = Game.MIN_BALL_RADIUS + Game.BALL_RADIUS_SCATTER * Math.random();
        this.speedX = -Game.MIN_BALL_X_SPEED + Game.BALL_X_SPEED_SCATTER * Math.random();
        this.speedY = Game.MIN_BALL_Y_SPEED;
        this.positionX = this.radius +  
            (canvas.width - 2 * this.radius)*Math.random();
        this.positionY = canvas.height * (1-Game.BALL_Y_POSITION_AREA) 
            + canvas.height * Game.BALL_Y_POSITION_AREA * Math.random();
    }

    /**
     * Apply the laws of physics to simulate a falling ball under gravity.
     * 
     * @param elapsed amount of milliseconds that passed since the last 
     * update.
     */
    public applyPhysics(elapsed: number) {
        // Calculate the new position of the ball
        // Some physics here: the y-portion of the speed changes due to gravity
        // Formula: Vt = V0 + gt
        // 9.8 is the gravitational constant and time=1
        this.speedY -= Game.GRAVITY * elapsed;
        // Calculate new X and Y parts of the position 
        // Formula: S = v*t
        this.positionX += this.speedX * elapsed;
        // Formula: S=v0*t + 0.5*g*t^2
        this.positionY += this.speedY * elapsed + 0.5 * Game.GRAVITY * elapsed * elapsed;
    }

    /**
     * Check whether the ball is currently hitting one of the canvas boundaries
     * and let it bounce back.
     *  
     * @param canvas The canvas that knows the size of the scene
     */
    public bounceFromCanvasWalls(canvas: HTMLCanvasElement) {
        // Collision detection: check if the ball hits the walls and let it bounce
        // Left wall
        this.positionX >= canvas.width - this.radius;
        if (this.positionX <= this.radius && this.speedX < 0) {
            this.speedX = -this.speedX;
        }
        // Right wall
        if (this.positionX >= canvas.width - this.radius
            && this.speedX > 0) {
            this.speedX = -this.speedX;
        }

        // Bottom only (ball will always come down)
        if (this.positionY <= this.radius && this.speedY < 0) {
            this.speedY = -this.speedY;
        }
    }

    /**
     * Checks whether the ball currently overlaps with another ball with the
     * specified dimensions.
     * 
     * @param x the x-position of the other ball
     * @param y the y-position of the other ball
     * @param r the radius of the other ball
     */
    public overlapsWith(x: number, y:number, r: number) {
        //  if the ball collides with the player. It's game over then
        const distX = x - this.positionX;
        const distY = y - this.positionY;
        // Calculate the distance between ball and player using Pythagoras'
        // theorem
        const distance = Math.sqrt(distX * distX + distY * distY);
        // Collides is distance <= sum of radii of both circles
        return distance <= (this.radius + r);
    }

    /**
     * Let the ball draw itself on the specified context.
     * 
     * @param ctx the `CanvasRenderingContext2D` to render to
     */
    public render(ctx: CanvasRenderingContext2D) {
        // Render the ball
        ctx.fillStyle = Game.BALL_COLOR;
        ctx.beginPath();
        // reverse height, so the ball falls down
        ctx.ellipse(this.positionX, this.positionY, this.radius,
            this.radius, 0, 0, Game.FULL_CIRCLE);
        ctx.fill();
    }
}