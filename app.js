/*
 * Play a GIF for the favicon compatible with any browser
 */
function animateFavicon() {
  // Utilize a web worker
  const worker = new Worker('faviconWorker.js');

  worker.onmessage = function(e) {
    let frameIndex = e.data;
    let filename = `/Assets/animated_favicon_frames/frame_${String(frameIndex).padStart(2, '0')}_delay-0.04s.png`;
    document.getElementById('icon').href = filename;
  };
}

animateFavicon();



/*
 * Update the up and down arrows based on the current section
 */
function setArrowOptions(section) {
  if (sections.includes(section)) {
    const currIdx = sections.indexOf(section);

    const prevOption = currIdx - 1 < 0 ? 0 : currIdx - 1;
    const nextOption =
      currIdx + 1 >= sections.length ? sections.length - 1 : currIdx + 1;

    document
      .getElementById("arrow-up")
      .setAttribute("href", "#" + sections[prevOption]);
    document
      .getElementById("arrow-down")
      .setAttribute("href", "#" + sections[nextOption]);
  }
}

/*
 * Find the corresponding tab to the intersecting section
 */
function getTab(section_id) {
  var tab;
  for (var i = 0; i < tabs.length; i++) {
    if ("#" + section_id === tabs[i].getAttribute("href")) {
      tab = tabs[i];
    }
  }
  return tab;
}

/* 
 * Dynamically updates tabIndex's 
 * according to the section in view
 */
function updateTabIndexes(elementsInView, elementsOutOfView) {
  // Set the tabIndex for elements in the view now in order
  for (let i = 0; i < elementsInView.length; i++) {
    document.getElementById(elementsInView[i]).tabIndex = i + 1;
  }

  // Reset tabIndex for elements now out of the view
  for (let i = 0; i < elementsOutOfView.length; i++) {
    document.getElementById(elementsOutOfView[i]).tabIndex = -1;
  }
}



/*
 * Create waypoint marker for the intro section only
 */
function createIntroWaypoint(section) {

  const tabsContainer = document.getElementById("tabs-container");
  const tabsIconContainer = document.getElementById("icons-container");
  const contactMeButton = document.getElementById("contact-me-button");

  // Ids of elements that use tabindex attributes
  const introTabbedElementsIds = ["btn-outline-to-home"];
  const mainTabbedElementsIds = ["git-icon", "resume-icon", "contact-me-button",
                                 "arrow-up", "first-section-tab", "second-section-tab", 
                                 "third-section-tab", "arrow-down"];

  function enterIntroSection() {
    tabsContainer.classList.remove("show-tabs");
    tabsIconContainer.classList.remove("show-tabs");
    contactMeButton.classList.remove("show-tabs");
    updateTabIndexes(introTabbedElementsIds, mainTabbedElementsIds);
  }

  function exitIntroSection() {
    tabsContainer.classList.add("show-tabs");
    tabsIconContainer.classList.add("show-tabs");
    contactMeButton.classList.add("show-tabs");
    updateTabIndexes(mainTabbedElementsIds, introTabbedElementsIds);
  }

  new Waypoint.Inview({
    element: document.getElementById(section),
    enter: function () {
      enterIntroSection();
    },
    entered: function () {
      enterIntroSection();
    },
    exited: function () {
      exitIntroSection();
    },
  });
}



/*
 * Create waypoint markers for each section, except the intro
 */
function enterSection(element, section) {
  element.childNodes[1].classList.add("show");
  setArrowOptions(section);
  const tab = getTab(element.getAttribute("id"));
  tab.classList.add("selected-tab");
}

function exitSection(element) {
  element.childNodes[1].classList.remove("show");
  const tab = getTab(element.getAttribute("id"));
  tab.classList.remove("selected-tab");
}

function createSectionWaypoint(section) {
  new Waypoint.Inview({
    element: document.getElementById(section),
    enter: function () {
      enterSection(this.element, section);
    },
    entered: function () {
      enterSection(this.element, section);
    },
    exited: function () {
      exitSection(this.element);
    },
  });
}

const tabs = document.querySelectorAll(".tab");
const sections = ["intro", "first-section", "second-section", "third-section"];

// Create waypoints for each section
sections.slice(1).forEach((element) => createSectionWaypoint(element));
createIntroWaypoint(sections[0]); // Intro section has a special waypoint



/*
 * The page animations are hidden on page load.
 * This method brings the animations back after a timeout
 */
setTimeout(function () {
  document.body.className = "";
}, 300);

/*
 * Set a timeout for button clicks to avoid weird overclicking
 */
function timeoutButton(button) {
  button.classList.add("deactivate-cursor");
  setTimeout(function () {
    button.classList.remove("deactivate-cursor");
  }, 500);
}



const icons = document.querySelectorAll('.icon');

icons.forEach(button => {
  let expanded = false; // Track the button's expansion state
  let timeout;

  button.addEventListener('click', function(event) {
    const iconText = button.querySelector('.icon-text');

    // Prevent default navigation behavior on the first click
    if (!expanded) {
      event.preventDefault();

      // Collapse other icons
      icons.forEach(otherButton => {
        if (otherButton !== button) {
          const otherIconText = otherButton.querySelector('.icon-text');
          otherIconText.style.animation = 'none'; // Reset animation
          otherIconText.classList.add('hidden'); // Trigger reverse typing animation
          otherButton.classList.remove('expanded'); // Collapse other buttons
          otherButton.expanded = false; // Update their expanded state
        }
      });

      // Expand the current button and show the text
      button.classList.add('expanded');
      iconText.classList.remove('hidden'); // Show the text
      iconText.style.animation = 'typing 0.5s steps(100) forwards'; // Typing effect
      expanded = true;

      // Clear any existing timeouts to avoid conflicts
      clearTimeout(timeout);

      // Set timeout to shrink the button after 5 seconds if no second click happens
      timeout = setTimeout(() => {
        iconText.style.animation = 'none'; // Reset animation
        iconText.classList.add('hidden'); // Trigger reverse typing animation

        setTimeout(() => {
          button.classList.remove('expanded');
          expanded = false;
        }, 500);
      }, 5000);

    // If the button is already expanded, allow the navigation to occur
    } else {
      const href = button.getAttribute('href');
      if (href) { window.location.href = href; }
    }
  });
});



customElements.define("my-el", class extends HTMLElement {
  constructor() {
    super().attachShadow({mode:"open"}).innerHTML=`<a></a>`;
    this.a = this.shadowRoot.querySelector("a");
  }
  
  set myText(v) {
    this.a.textContent = v;
    this.a.style = "color: white";
  }
});

const frag = new DocumentFragment();
const el = document.createElement("my-el");
frag.append(el);
el.myText = "abc"; 

document.body.append(frag);

/* 
 * Parse the current Spotify playlist page and grab the playlist image
 */
// function parsePlaylist(playlist_url) {

// }}

// parsePlaylist("https://open.spotify.com/playlist/5KFFA9C8g5mVQtNPOZ6tNz");