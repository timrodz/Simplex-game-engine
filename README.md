# Simplex-game-engine
A simple and eficient javascript game engine compatible with electron or cordoba!

# Features
1. Entity Based (every object inside the engine is treated as an entity);
2 .AABB Collision detectio.
  Filterable
  general
3. Layer system
4. Vector 2 Math
5. Basic user Input (mouse and single key strokes)
6. Custom Event Listeners for your game.
7  renderer with controllable framerate.



# Example

```Javascript
/*Calls the renderer. By default it will have it´s framerate set to 60fps 
but you can change it to what ever you want. */
const renderer = new Simplex_renderer(60);
const layer = new Simplex_layer(renderer,{
    id:"Example_layer"
});

//Creates the layer
layer.create();

//Extends the Simplex Entity
class Entity extends Simplex_entity{
    constructor(layer,props) {
        super(layer,props);
    }
    update = ()=>{
        console.log(this.position.x,this.position.y)
    }
}
let entity = new entity(layer,{});
//Pushes the entity inside the Simplex_render loop
entity.create();

//Init the renderer
renderer.init();
```
# Coming soon
* Rotate Method
* More Built in vector functions
* Built in tilemap support
* More efiecient collision detection method... Quad tree or unifrom grid maybe?
* Multi threading. Still learning to deal with web workers...
* and more!


# More documentation coming soon, stay Tuned!
