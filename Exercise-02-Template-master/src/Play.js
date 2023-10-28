class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5) // 0.5 for medium bounce, normalized btwn 0 and 1
        this.ball.setDamping(true).setDrag(0.5) // ball physics

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width/2))
        // wallA.body.setImmovable(true)
        wallA.body.setCollideWorldBounds(true)
        wallA.body.setBounce(0.5)


        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width/2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // one way obstacle
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // variables
        // control velocity
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
        // obstacle velocity
        this.WALL_A_VELOCITY_X = 200
        this.WALL_A_VELOCITY_Y_MIN = 0
        this.WALL_A_VELOCITY_Y_MAX = 0
        wallA.body.setVelocityX(Phaser.Math.Between(-this.WALL_A_VELOCITY_X, this.WALL_A_VELOCITY_X))
        wallA.body.setVelocityY(Phaser.Math.Between(this.WALL_A_VELOCITY_Y_MIN, this.WALL_A_VELOCITY_Y_MAX))

        this.input.on('pointerdown', (pointer) => {
            let shotDirection
            pointer.y <= this.ball.y ? shotDirection = 1 : shotDirection = -1 // either true or false
            // pointer.x <= this.ball.x ? shotDirection = 1 : shotDirection = -1 // either true or false
            // ^ tried to utilize pointer's x-position, but it didnt work
            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX)
            * shotDirection)
        })

        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.destroy()
            // not sure how to reset ball sprite after it gets destroyed
            // for now, create a new ball 
            this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
            this.ball.body.setCircle(this.ball.width / 2)
            this.ball.body.setCollideWorldBounds(true)
            this.ball.body.setBounce(0.5) // 0.5 for medium bounce, normalized btwn 0 and 1
            this.ball.setDamping(true).setDrag(0.5) // ball physics
            // issue w/ this is that its a new var and now everything for the original ball has to be repeated,
            // so it doesn't really work :/

        })
        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
        
    }
}