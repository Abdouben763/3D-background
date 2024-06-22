import {
	Vector2
} from 'three';



const BlurEffect = {

	name: 'BlurEffect',

	uniforms: {

		tDiffuse: { value: null },
		scale: { value: 1.0 } , 
        blur : { value: 0.09} // the blur intensity 

	},


	vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: `

		uniform float scale;
        uniform float blur ; 

		uniform sampler2D tDiffuse;

		varying vec2 vUv;


        // random function 
                    float rand(vec2 p) {
            vec2 k1 = vec2(
                23.14069263277926, 
                2.665144142690225 
            );
            return fract(
                cos(dot(p, k1)) * 12345.6789
            );
}


		void main() {


			vec4 color = texture2D( tDiffuse, vUv );
            // randomize the uv

            vec2 uvrandom = vUv ; 
            uvrandom.y *= rand(vec2(uvrandom.y , 0.4)) ; 
            color.rgb += rand(uvrandom) * blur ; 


            gl_FragColor = color ; 
		}`

};
export { BlurEffect};
