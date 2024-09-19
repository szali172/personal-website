/*
 * Keep the favicon animation running even when the tab is inactive
 */
let frameIndex = 0;
const totalFrames = 48;
const frameDelay = 100; // Adjust delay for speed

// Post a message to the main thread to update the favicon
function updateFavicon() {
  frameIndex = (frameIndex + 1) % totalFrames;
  self.postMessage(frameIndex);
  setTimeout(updateFavicon, frameDelay); // Continue looping
}

updateFavicon();
