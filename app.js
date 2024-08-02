
/*
 * Update the up and down arrows based on the current section
 */
function setArrowOptions(section) {

    if (sections.includes(section)) {
        const currIdx = sections.indexOf(section);

        const prevOption = (currIdx - 1 < 0) ? 0 : currIdx - 1;
        const nextOption = (currIdx + 1 >= sections.length) ? sections.length - 1 : currIdx + 1;

        document.getElementById('arrow-up').setAttribute('href', "#" + sections[prevOption]);
        document.getElementById('arrow-down').setAttribute('href', "#" + sections[nextOption]);
    }
};


/* 
 * Find the corresponding tab to the intersecting section
 */
function getTab(section_id) {

    var tab;
    for (var i = 0; i < tabs.length; i++) {
        if (("#" + section_id) === tabs[i].getAttribute('href')) {
            tab = tabs[i]
        }
    }
    return tab;
};


/*
 * Create waypoint marker for the intro section only
 */
function createIntroWaypoint(section) {
    new Waypoint.Inview({
        element: document.getElementById(section),
        enter: function() {
            const tabsContainer = document.getElementById("tabs-container");
            const tabsIconContainer = document.getElementById("tabs-icons-container");
            tabsContainer.classList.remove("show-tabs");
            tabsIconContainer.classList.remove("show-tabs");
        },
        entered: function() {
            const tabsContainer = document.getElementById("tabs-container");
            const tabsIconContainer = document.getElementById("tabs-icons-container");
            tabsContainer.classList.remove("show-tabs");
            tabsIconContainer.classList.remove("show-tabs");
        },
        exited: function() {
            const tabsContainer = document.getElementById("tabs-container");
            const tabsIconContainer = document.getElementById("tabs-icons-container");
            tabsContainer.classList.add("show-tabs");
            tabsIconContainer.classList.add("show-tabs");
        }
    })
};


/* 
 * Create waypoint markers for each section, except the intro
 */
function enterSection(element, section) {
    element.childNodes[1].classList.add('show');
    setArrowOptions(section);
    const tab = getTab(element.getAttribute('id'));
    tab.classList.add('selected-tab');
};

function exitSection(element) {
    element.childNodes[1].classList.remove('show');
    const tab = getTab(element.getAttribute('id'));
    tab.classList.remove('selected-tab');
};

function createSectionWaypoint(section) {

    new Waypoint.Inview({
        element: document.getElementById(section),
        enter: function() { enterSection(this.element, section) },
        entered: function() { enterSection(this.element, section) },
        exited: function() { exitSection(this.element) }
    })
};


const tabs = document.querySelectorAll('.tab');
const sections = ["intro", "first-section", "second-section", "third-section"];

// Create waypoints for each section
sections.slice(1).forEach((element) => createSectionWaypoint(element));
createIntroWaypoint(sections[0]); // Intro section has a special waypoint




/*
 * The page animations are hidden on page load.
 * This method brings the animations back after a timeout
 */
setTimeout(function(){ document.body.className=""; }, 300);


/*
 * Set a timeout for button clicks to avoid weird overclicking
 */
function timeoutButton(button) {
    button.classList.add("deactivate-cursor");
    setTimeout(function() { button.classList.remove("deactivate-cursor"); }, 500);
}



// function checkScreenSize() {
//     const tabsIcons = document.querySelectorAll('.tabs-icon-text');
//     if (window.innerWidth <= 1100) {
//         tabsIcons.forEach(icon => {
//             icon.classList.add('hidden');
//         });
//     } else {
//         tabsIcons.forEach(icon => {
//             icon.classList.remove('hidden');
//         });
//     }
// }

// window.addEventListener('resize', checkScreenSize);
// window.addEventListener('load', checkScreenSize);