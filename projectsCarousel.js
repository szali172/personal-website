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
    document.getElementById('project-subheading').textContent = project.subheading;
    document.getElementById('project-role').innerHTML = 
    `
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person-workspace" viewBox="0 0 16 16">
      <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
      <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z"/>
    </svg>
    ${project.role}
    `

    document.getElementById('project-date').innerHTML = 
    `
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-calendar2-week" viewBox="0 0 16 16">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/>
      <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
    </svg>
    ${project.relativeDate}
    `

    document.getElementById('project-goal').innerHTML = 
    `
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-mortarboard" viewBox="0 0 16 16">
      <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/>
      <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/>
    </svg>
    ${project.goal}
    `
    
    document.getElementById('project-description').textContent = project.description;
    const links = document.getElementById('project-links')
    links.innerHTML = '';

    project.links.forEach(link => {
      const linkChip = document.createElement('a');
      linkChip.href = link;
      if (link.toLowerCase().includes("git")) {
        linkChip.innerHTML = 
        `
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-git project-link-icon" viewBox="0 0 16 16">
          <path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.03 1.03 0 0 0 0-1.457"/>
        </svg>
        <div class="project-link-text noselect">Git Repository</div>
        `
      }
      linkChip.classList.add('project-link');
      links.appendChild(linkChip);
    })
    
    const skillsList = document.getElementById('project-skills');
    skillsList.innerHTML = '';

    for (const category in project.skills) {
      project.skills[category].forEach(skill => {
        const chip = document.createElement('div');
        chip.textContent = skill;
        chip.setAttribute('data-bs-toggle', 'tooltip');
        chip.setAttribute('title', `${category[0].toUpperCase() + category.slice(1)}`);
        chip.setAttribute('data-bs-delay', 300);
        chip.classList.add('skill', `${category}-skill`, 'noselect');
        skillsList.appendChild(chip)
      })
    }

    // Initialize tooltips for newly added elements
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
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