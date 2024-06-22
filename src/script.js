import * as THREE from 'three'
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import { BlurEffect } from './blurshader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { add } from 'three/examples/jsm/nodes/Nodes.js'



// mouse 
const cursor= new THREE.Vector2(0,0)

// mouse position 

window.addEventListener('mousemove' , (event)=>{

    cursor.x= event.clientX / sizes.width - 0.5
    cursor.y= event.clientY / sizes.width - 0.5

})

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Geometry
const geometry = new THREE.SphereGeometry(2,  64, 64)




// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide , 
    uniforms : { // change the values after configurating 
        utime : { value: 0} , 
        uresolution : { value: new THREE.Vector4()} ,
        noiseEffect : { value: 1.4} , 
        patternShape : {value : 1.6} , 
        noisespeed : { value: 0.2} , 
        patternAngle : {value: 0.7} , 
        lighting : { value : 1.2}, 
        umouse : {value : cursor}
    } , 
    // wireframe: true 

 
})
// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    composer.setSize(sizes.width, sizes.height)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 0)
scene.add(camera)

// gui settings (delete after configuration ) 
gui.add(camera.position , 'z').min(-10).max(10).step(0.001)
gui.add(camera.position , 'x').min(-10).max(10).step(0.001)
gui.add(camera.position , 'y').min(-10).max(10).step(0.001)
gui.add(material.uniforms.noiseEffect,'value').min(0.5).max(10.0).step(0.001).name('noiseEffect')
gui.add(material.uniforms.patternShape,'value').min(0.1).max(10.0).step(0.001).name('patternShape')
gui.add(material.uniforms.noisespeed,'value').min(0.0).max(5.0).step(0.001).name('noisespeed')
gui.add(material.uniforms.patternAngle,'value').min(-5.0).max(5.0).step(0.001).name('patternAngle')
gui.add(material.uniforms.lighting,'value' ).min(0.0).max(3.0).step(0.001).name('light')


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true 
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// post processing : 

const composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );

const effect1 = new ShaderPass(BlurEffect );
effect1.uniforms[ 'scale' ].value = 4;
composer.addPass( effect1 );



// clock 
const clock = new THREE.Clock() 


//Animate
 
const tick = () =>
{

    const elapsedtime = clock.getElapsedTime()

    material.uniforms.utime.value= elapsedtime 

    // Render
    composer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()