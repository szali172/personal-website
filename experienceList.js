async function loadExperiences() {
    const response = await fetch('data.json');
    return await response.json()
    .then(data => { 
      return data['experiences'];
    })
    .catch(error => {
      console.error("Failed to load experience");
      return [];
    });
};



function getSantizedTitle(title) {
    return title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
}



/* Adds transparency (alpha) to a passed hex color
   Found this neat function here: https://www.grepper.com/answers/155851/javascript+add+alpha+to+hex
*/
function addAlpha(color, opacity) {
  // coerce values so ti is between 0 and 1.
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}



function getPoints(experience) {
  let bulletPoints = '<ul class="bullet-points">';
  for (const point in experience.points) {
    bulletPoints += `<li>${experience.points[point]}</li>`;
  }
  bulletPoints += '</ul>';
  return bulletPoints;
}



async function initializeExperiences() {
    const expList = await loadExperiences();
    const expContainer = document.getElementById('experience-container');

    // Create the accordion parent container
    const accordionGroup = document.createElement('div');
    accordionGroup.classList.add('accordion');
    accordionGroup.id = 'accordion-group';  // Init accordion parent container

    expList.forEach((experience) => {
        const expItem = document.createElement('div');
        expItem.classList.add('experience-item');
        const sanitizedTitle = getSantizedTitle(experience.title);
        const bulletPoints = getPoints(experience);
        
        expItem.innerHTML = 
        `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading-${sanitizedTitle}">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${sanitizedTitle}" aria-expanded="false" aria-controls="collapse-${sanitizedTitle}">
              <div class="accordion-item-header">
                <div class="accordion-item-header-top-row">
                  <div class="accordion-item-title">${experience.title}</div>
                  <div class="accordion-item-company">
                    <span>${experience.company}</span>
                    <img class="accordion-item-company-img" src="${experience.logo}" alt=""/>
                  </div>
                </div>
                <div class="accordion-item-date">${experience.date}</div>
              </div>
            </button>
          </h2>
          <div id="collapse-${sanitizedTitle}" class="accordion-collapse collapse" aria-labelledby="heading-${sanitizedTitle}" data-bs-parent="#accordion-group">
            <div class="accordion-body">
            ${bulletPoints}
            </div>
          </div>
        </div>
        `;console.log(experience.logo)

        // Set dynamic background color for each experience
        const backgroundColor = `linear-gradient(90deg, ${addAlpha(experience.color, 0.4)} 0%, ${experience.color} 60%)`;
        expItem.querySelector('.accordion-button').style.background = backgroundColor;
        expItem.querySelector('.accordion-body').style.background = backgroundColor;

        accordionGroup.appendChild(expItem);
    });
    expContainer.appendChild(accordionGroup);
}


initializeExperiences();