import { enableAssert } from 'scenerystack/assert';
import { Property } from 'scenerystack/axon';
import { Bounds2 } from 'scenerystack/dot';
import { platform } from 'scenerystack/phet-core';
import { Display, Node, Rectangle, Text } from 'scenerystack/scenery';

// @ts-ignore
if ( process.env.NODE_ENV === 'development' ) {
  // Enable assertions if we are in development mode
  enableAssert();
}

// Tracks the bounds of the window (can listen with layoutBoundsProperty.link)
export const layoutBoundsProperty = new Property( new Bounds2( 0, 0, window.innerWidth, window.innerHeight ) );

// The root node of the scene graph (all Scenery content will be placed in here)
const rootNode = new Node();

// Display will render the scene graph to the DOM
const display = new Display( rootNode, {
  allowSceneOverflow: false,
  backgroundColor: '#eee',
  listenToOnlyElement: false,
  assumeFullWindow: true
} );

// We'll add the automatically-created DOM element to the body.
document.body.appendChild( display.domElement );

// Attach event listeners to the DOM.
display.initializeEvents();

// Lazy resizing logic
let resizePending = true;
const resize = () => {
  resizePending = false;

  const layoutBounds = new Bounds2( 0, 0, window.innerWidth, window.innerHeight );
  display.setWidthHeight( layoutBounds.width, layoutBounds.height );
  layoutBoundsProperty.value = layoutBounds;

  if ( platform.mobileSafari ) {
    window.scrollTo(0, 0);
  }
};
const resizeListener = () => {
  resizePending = true;
};
window.addEventListener( 'resize', resizeListener );
window.addEventListener( 'orientationchange', resizeListener );
window.visualViewport && window.visualViewport.addEventListener( 'resize', resizeListener );
resize();

// Content
const rotatingRectangle = new Rectangle( -150, -20, 300, 40, {
  fill: '#ccc'
} );
const contentText = new Text( 'Content goes here', {
  font: '24px sans-serif',
} );

rootNode.children = [
  rotatingRectangle,
  contentText
];

// Center the text and the rectangle dynamically
layoutBoundsProperty.link( bounds => {
  contentText.center = bounds.center;
  rotatingRectangle.translation = bounds.center;
} );

// Frame step logic
display.updateOnRequestAnimationFrame( dt => {
  if ( resizePending ) {
    resize();
  }

  // Rotate the rectangle
  rotatingRectangle.rotation += 2 * dt;
} );
