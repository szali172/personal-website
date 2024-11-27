async function loadProjects() {
    const response = await fetch('projects.json');
    const projects = await response.json();
    return projects;
}



function createCarouselItem(project, index) {
    const item = document.createElement('div');
    item.classList.add('carousel-item');
    if (index === 0) item.classList.add('active');  // Make the first item active
  
    item.innerHTML = `
      <div class="d-flex justify-content-center align-items-center">
        <img src="${project.image}" alt="${project.name}">
      </div>
    `;
    return item;
}
  


function displayProjectDetails(project) {
    document.getElementById('project-title').textContent = project.name;
    document.getElementById('project-description').textContent = project.description;
  
    const skillsList = document.getElementById('project-skills');
    skillsList.innerHTML = '';
    project.skills.forEach(skill => {
      const listItem = document.createElement('li');
      listItem.textContent = skill;
      skillsList.appendChild(listItem);
    });
}
  


async function initializeCarousel() {
    const projects = await loadProjects();
    const carouselInner = document.getElementById('carousel-inner');
  
    projects.forEach((project, index) => {
      const item = createCarouselItem(project, index);
      carouselInner.appendChild(item);
    });
  
    if (projects.length > 0) displayProjectDetails(projects[0]);
  
    // Update project details on carousel slide
    const carousel = document.getElementById('projects-carousel');
    carousel.addEventListener('slide.bs.carousel', (event) => {
      const nextIndex = event.to;
      displayProjectDetails(projects[nextIndex]);
    });
}


initializeCarousel();