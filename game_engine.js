let Simplex_input = {
    mouse: {
        position: {
            x: undefined,
            y: undefined,
        },
        button: {
            up: true,
            down: false
        }
    },
    keyboard: {
        key_up: undefined,
        key_down: undefined,
    }
};
window.addEventListener("mousemove", (e) => {
    Simplex_input.mouse.position.x = e.clientX;
    Simplex_input.mouse.position.y = e.clientY;
});
window.addEventListener("mouseup", () => {
    Simplex_input.mouse.button.up = true
    Simplex_input.mouse.button.down = false

});
window.addEventListener("mousedown", () => {
    Simplex_input.mouse.button.up = false
    Simplex_input.mouse.button.down = true

});
window.addEventListener("keydown", (e) => {
    Simplex_input.keyboard.key_down = e.keyCode
});
window.addEventListener("keyup", (e) => {
    Simplex_input.keyboard.key_up = e.keyCode
});

class Simplex_events {
    constructor(props) {
        this.events = [];

    }

    register_event = (message, handler) => {
        this.events.push({message, handler})

    }

    fire_event = (message) => {
        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].message === message) {
                try {
                    this.events[i].handler();
                } catch (e) {
                }
            }
        }
    }

}

class Simplex_math {
    constructor(props) {
    }

    lerp = (val_a, val_b, amount) => {
        return (1 - amount) * val_a + amount * val_b;
    };
    clamp = (value, min, max) => {
        if (value < min) return min;
        else if (value > max) return max;
        return value;
    };
    clamp_reset = (value, min, max) => {
        if (value < min) return min;
        else if (value > max) return min;
        return value;
    };
    vec_2 = (x, y) => {
        return {x: x, y: y}
    };
    normalize_vec_2 = (vec) => {
        let x = vec.x;
        let y = vec.y;
        x = Math.round(x / x);
        y = Math.round(y / y);
        return {x: x, y: y};
    };

}

class Simplex_layer {
    constructor(renderer, props) {
        this.renderer = renderer;
        this.id = props.id || renderer.layers.length;
        this.ctx = undefined;
        this.z_index = props.z_index || 0;
        this.canvas = undefined;
        this.auto_clean = props.auto_clean || true;
    }

    create = _ => {
        let viewport = document.getElementsByTagName("body")[0];
        viewport.insertAdjacentHTML("afterbegin", `
               <canvas id="${this.id}" style="z-index: ${this.z_index}; position: fixed"></canvas>
        `);
        this.canvas = document.getElementById(this.id);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        window.addEventListener("resize", _ => {
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerWidth;
        });
        this.renderer.layers.push(this);
    }
}

class Simplex_renderer {
    constructor(frame_rate) {
        this.pause = false;
        this.frame_rate = frame_rate || 60;
        this.now = undefined;
        this.then = Date.now();
        this.interval = 1000 / this.frame_rate;
        this.delta_time = undefined;
        this.frame_count = 0;
        this.layers = [];
        this.entities = [];
        this.frame_count = 0;
    }

    init = () => {
        if (this.pause === false) {
            requestAnimationFrame(this.init);
        }
        this.now = Date.now();
        this.delta_time = this.now - this.then;
        if (this.delta_time > this.interval) {
            this.then = this.now - (this.delta_time % this.interval);
            for (let i = 0; i < this.layers.length; i++) {
                console.log();
                this.layers[i].ctx.clearRect(0, 0, this.layers[i].canvas.width, this.layers[i].canvas.height)
            }

            //render entities
            for (let i = 0; i < this.entities.length; i++) {
                this.entities[i].update();
            }
            this.frame_count++;
            if (this.frame_count > this.frame_rate) {
                this.frame_count = 0;
            }
        }
    }
}

class Simplex_entity {
    constructor(layer, props) {
        this.id = props.id || layer.renderer.entities.length;
        this.tag = props.tag || "entity";
        this.position = props.position || new Simplex_math().vec_2(200, 200);
        this.layer = layer;
        this.ctx = this.layer.ctx;
        this.renderer = this.layer.renderer;
        this.update = props.update;
        //collision_detection_props
        this.colliding_with = [];
        this.collision_box = {
            position: props.collision_box.position ||this.position,
            size: props.collision_box.size || {
                w: 50,
                h: 50
            }
        }
    }
    test_collision = (player1) => {
        this.colliding_with = [];
        let entities = this.layer.renderer.entities;
        for (let i = 0; i < entities.length; i++) {
            if (entities[i].id === this.id) {
                continue
            }
            if (player1.collision_box.position.x < entities[i].collision_box.position.x + entities[i].collision_box.size.w &&
                player1.collision_box.position.x + player1.collision_box.size.w > entities[i].collision_box.position.x &&
                player1.collision_box.position.y < entities[i].collision_box.position.y + entities[i].collision_box.size.h &&
                player1.collision_box.position.y + player1.collision_box.size.h > entities[i].collision_box.position.y) {
                this.colliding_with.push(entities[i])
            }
        }
    };
    has_collided = tag => {
        let collided = {
            collided: false,
            entity: undefined,
        };
        if (tag){
            for (let i = 0; i < this.colliding_with.length; i++) {
                if (tag === this.colliding_with[i].tag) {
                    collided.collided = true;
                    collided.entity = this.colliding_with[i];
                }
            }
        }else {
            if (this.colliding_with.length > 0){
                collided.collided = true;
                collided.entity = this.colliding_with;
            }
        }
        return collided;
    };
    debug_collisions = (color) => {
        let ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = color || "pink";
        ctx.fillRect(this.collision_box.position.x,
            this.collision_box.position.y,
            this.collision_box.size.w,
            this.collision_box.size.h);
        ctx.restore();
    };

    destroy = (eliminate) => {
        let arr = this.layer.renderer.entities;

        this.layer.renderer.entities = arr.filter((item) => {
            if (item !== eliminate) {
                return item
            }
        })
    };


    create = () => {
        this.layer.renderer.entities.push(this);

    }
}


