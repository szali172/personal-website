/*
 * Play a GIF for the favicon compatible with any browser
 */
function animateFavicon() {
  // Utilize a web worker
  const worker = new Worker('faviconWorker.js');

  worker.onmessage = function(e) {
    let frameIndex = e.data;
    let filename = `/Assets/animated_favicon_frames/frame_${String(frameIndex)}_delay-0.04s.png`;
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
function getHiddenElements(element) {
    return Array.from(element.getElementsByClassName('hidden-left'))
                .concat(Array.from(element.getElementsByClassName('hidden-right')))
}

function enterSection(element, section, pics) {
  // Reveal hidden sections
  getHiddenElements(element).forEach(x => x.classList.add("show"));
  
  try {
    pics.forEach(x => document.getElementById(x).classList.add("show"));
  } catch { }
  
  setArrowOptions(section);
  const tab = getTab(element.getAttribute("id"));
  tab.classList.add("selected-tab");
}

function exitSection(element, pics) {
  // Hide hideable sections
  getHiddenElements(element).forEach(x => x.classList.remove("show"));

  try {
    pics.forEach(x => document.getElementById(x).classList.remove("show"));
  } catch { }
  
  const tab = getTab(element.getAttribute("id"));
  tab.classList.remove("selected-tab");
}

function createSectionWaypoint(section, pics) {
  new Waypoint.Inview({
    element: document.getElementById(section),
    enter: function () {
      enterSection(this.element, section, pics);
    },
    entered: function () {
      enterSection(this.element, section, pics);
    },
    exited: function () {
      exitSection(this.element, pics);
    },
  });
}

const tabs = document.querySelectorAll(".tab");
const sections = ["intro", "first-section", "second-section", "third-section"];
const pictures = {"first-section": ['pic-one', 'pic-two', 'pic-three'],}

// Create waypoints for each section
sections.slice(1).forEach((element) => createSectionWaypoint(element, pictures[element]));
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

/*
 * Brings the selected picture to the top of the view stack
 */
function bringToTop(div) {
  div.classList.add('image-view')
  setTimeout(function() {
    div.classList.remove('image-view')
  }, 3000)
}



/*
 * Allow button to be expanded on mobile resolutions.
 * Buttons will auto collapse after inactivity
 */
const icons = document.querySelectorAll('.icon');

function isSmallScreen() {
  return window.matchMedia('(max-width: 800px)').matches;
}

icons.forEach(button => {
  button.expanded = false;
  let timeout;

  button.addEventListener('click', function(event) {
    const iconText = button.querySelector('.icon-text');

    // Prevent default navigation behavior on the first click
    if (isSmallScreen()) {
      if (!button.expanded) {
        event.preventDefault();

        // Collapse other icons
        icons.forEach(otherButton => {
          if (otherButton !== button) {
            const otherIconText = otherButton.querySelector('.icon-text');
            otherIconText.style.animation = 'none';
            otherIconText.classList.add('hidden');
            otherButton.classList.remove('expanded');
            otherButton.expanded = false;

            // Clear the timeout for other buttons
            if (otherButton.timeout) {
              clearTimeout(otherButton.timeout);
              otherButton.timeout = null;
            }
          }
        });

        // Expand the current button and show the text
        button.classList.add('expanded');
        iconText.classList.remove('hidden');
        iconText.style.animation = 'typing 0.5s steps(100) forwards'; // Typing effect
        button.expanded = true;

        // Collapse the button after 5 seconds of button inactivity
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          iconText.style.animation = 'none';
          iconText.classList.add('hidden');

          setTimeout(() => {
            button.classList.remove('expanded');
            button.expanded = false;
          }, 500);
        }, 5000);

        button.timeout = timeout;

      // If the button is already expanded, allow the navigation to occur
      } else {
        const href = button.getAttribute('href');
        if (href) { window.location.href = href; }
      }
    }
  });
});