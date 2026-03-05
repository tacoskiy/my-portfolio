document.addEventListener('DOMContentLoaded', () => {
  const bookObject = document.getElementById('book-object-tilt') as HTMLElement;
  const titleSvg = document.querySelector('.interactive-title') as HTMLElement;
  const chromaGradient = document.getElementById('paint0_linear_17_42');
  const glareGradient = document.getElementById('glareOverlay');
  
  if (!bookObject || !titleSvg || !chromaGradient || !glareGradient) return;

  // Target physical mouse values (-0.5 to 0.5)
  let targetX = 0;
  let targetY = 0;
  
  // Current smoothed values
  let currentX = 0;
  let currentY = 0;
  let currentIntensity = 1.0; // Smooth multiplier for state transitions

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth) - 0.5;
    targetY = (e.clientY / window.innerHeight) - 0.5;
  });

  document.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function renderLoop() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    // 0. Contextual Intensity (Smoothly fade when open)
    const innerBook = bookObject.querySelector('#book') as HTMLElement;
    const isOpen = innerBook?.dataset?.openStatus === 'open';
    const targetIntensity = isOpen ? 0.25 : 1.0; 
    
    // LERP the intensity itself for a smooth "shimmer down" effect
    currentIntensity += (targetIntensity - currentIntensity) * 0.05; 
    const intensity = currentIntensity;

    // 1. Calculate Optical Gradients (Reflections) - Amplified multipliers for "glitzy" movement
    const shiftX = currentX * 1200; // was 300
    const shiftY = currentY * 200;  // was 50
    const chromaAngle = currentX * 60 + currentY * 20; // was 15 and 5
    chromaGradient!.setAttribute('gradientTransform', `rotate(${chromaAngle}, 444, 105) translate(${shiftX}, ${shiftY})`);
    
    const glareShiftX = currentX * -1800; // was -400
    const glareAngle = -30 + currentY * 30; // was 10
    glareGradient!.setAttribute('gradientTransform', `rotate(${glareAngle}, 444, 105) translate(${glareShiftX}, 0)`);

    // 2. Maintain Sticker Position
    // Removed independent rotateX/rotateY/skewX to ensure perfect synchronization with the book's face.
    // We only apply a slight scale to make it pop.
    titleSvg.style.transform = `scale(1.03) translateZ(1px)`;
    
    // 3. Calculate Responsive Shadows
    // Using negative multipliers so the shadow moves opposite to the mouse/viewing angle.
    const shadowX = currentX * -45; 
    const shadowY = currentY * -45 + 10; // Modest base dropping shadow
    
    titleSvg.style.setProperty('--s-x', `${shadowX}px`);
    titleSvg.style.setProperty('--s-y', `${shadowY}px`);
    
    // 4. Calculate Subtle Global Book Transform (Scale by intensity)
    const bookRotateY = currentX * 45 * intensity; 
    const bookRotateX = currentY * -25 * intensity; 
    const bookSkewX = currentX * -5 * intensity; 
    bookObject.style.transform = `rotateX(${bookRotateX}deg) rotateY(${bookRotateY}deg) skewX(${bookSkewX}deg)`;

    requestAnimationFrame(renderLoop);
  }

  // Start animation loop
  requestAnimationFrame(renderLoop);
});
