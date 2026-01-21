// Global variables
let repositories = [];
let filteredRepos = [];
let currentUser = '';

// Language colors mapping
const languageColors = {
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'HTML': '#e34c26',
    'CSS': '#1572B6',
    'TypeScript': '#2b7489',
    'Java': '#b07219',
    'C#': '#239120',
    'C++': '#f34b7d',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Dart': '#00B4AB',
    'Shell': '#89e051',
    'Vue': '#2c3e50',
    'Jupyter Notebook': '#DA5B0B'
};

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const githubInput = document.getElementById('github-username');
const loadReposBtn = document.getElementById('load-repos');
const projectsGrid = document.getElementById('projects-grid');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const languageFilter = document.getElementById('language-filter');
const sortRepos = document.getElementById('sort-repos');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    
    // Set david-foy89 as the default username
    const defaultUsername = 'david-foy89';
    githubInput.value = defaultUsername;
    
    // Automatically load repositories for david-foy89
    setTimeout(() => {
        loadRepositories();
    }, 500); // Small delay to ensure UI is ready
});

// Event Listeners
function initializeEventListeners() {
    // Mobile navigation toggle
    hamburger.addEventListener('click', toggleMobileNav);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // GitHub repository loading
    loadReposBtn.addEventListener('click', loadRepositories);
    githubInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadRepositories();
        }
    });
    
    // Filtering and sorting
    languageFilter.addEventListener('change', filterRepositories);
    sortRepos.addEventListener('change', sortRepositories);
    
    // View toggle
    gridViewBtn.addEventListener('click', () => toggleView('grid'));
    listViewBtn.addEventListener('click', () => toggleView('list'));
}

// Mobile Navigation
function toggleMobileNav() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Close mobile nav when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// GitHub API Functions
async function loadRepositories() {
    const username = githubInput.value.trim();
    
    if (!username) {
        alert('Please enter a GitHub username');
        return;
    }
    
    currentUser = username;
    localStorage.setItem('github-username', username);
    
    showLoading(true);
    hideError();
    
    try {
        // Fetch user data and repositories
        const [userData, reposData] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
        ]);
        
        if (!userData.ok || !reposData.ok) {
            throw new Error('User not found or API limit reached');
        }
        
        const user = await userData.json();
        const repos = await reposData.json();
        
        // Filter out forks and empty repositories
        repositories = repos.filter(repo => 
            !repo.fork && 
            repo.size > 0 && 
            !repo.archived
        );
        
        // Update user info
        updateUserInfo(user, repositories);
        
        // Get language data for each repository
        await enrichRepositoriesWithLanguages();
        
        // Display repositories
        filteredRepos = [...repositories];
        displayRepositories();
        updateLanguageFilter();
        
    } catch (error) {
        console.error('Error loading repositories:', error);
        showError('Unable to load repositories. Please check the username and try again.');
    } finally {
        showLoading(false);
    }
}

async function enrichRepositoriesWithLanguages() {
    const languagePromises = repositories.map(async (repo) => {
        try {
            const response = await fetch(repo.languages_url);
            if (response.ok) {
                const languages = await response.json();
                repo.languages = languages;
                repo.primaryLanguage = Object.keys(languages)[0] || null;
            }
        } catch (error) {
            console.error(`Error fetching languages for ${repo.name}:`, error);
            repo.languages = {};
            repo.primaryLanguage = repo.language;
        }
    });
    
    await Promise.all(languagePromises);
}

function updateUserInfo(user, repos) {
    // Update GitHub link
    const githubLink = document.getElementById('github-link');
    githubLink.textContent = `github.com/${user.login}`;
    githubLink.onclick = () => window.open(user.html_url, '_blank');
    githubLink.style.cursor = 'pointer';
    githubLink.style.color = '#667eea';
}

function displayRepositories() {
    if (filteredRepos.length === 0) {
        projectsGrid.innerHTML = '<div class="no-repos"><p>No repositories found matching the current filters.</p></div>';
        return;
    }
    
    projectsGrid.innerHTML = filteredRepos.map(repo => createRepositoryCard(repo)).join('');
}

function createRepositoryCard(repo) {
    const updatedDate = new Date(repo.updated_at).toLocaleDateString();
    const createdDate = new Date(repo.created_at).toLocaleDateString();
    
    // Enhanced demo link detection
    let hasDemo = false;
    let demoUrl = null;
    let demoText = 'Live Demo';
    
    // Check homepage URL first
    if (repo.homepage && repo.homepage.trim() !== '') {
        // Special handling for TechForum repository with incorrect homepage
        if (repo.name === 'TechForum---Advanced-Developer-Q-A-Platform' && repo.homepage.includes('Project4')) {
            hasDemo = true;
            demoUrl = `https://${repo.owner.login}.github.io/${repo.name}`;
            demoText = 'GitHub Pages';
        } else {
            hasDemo = true;
            demoUrl = repo.homepage;
            
            // Customize demo text based on platform
            const url = repo.homepage.toLowerCase();
            if (url.includes('github.io')) {
                demoText = 'GitHub Pages';
            } else if (url.includes('netlify')) {
                demoText = 'Netlify Demo';
            } else if (url.includes('vercel')) {
                demoText = 'Vercel Demo';
            } else if (url.includes('heroku')) {
                demoText = 'Heroku Demo';
            } else if (url.includes('replit')) {
                demoText = 'Replit Demo';
            } else if (url.includes('codepen')) {
                demoText = 'CodePen';
            } else if (url.includes('codesandbox')) {
                demoText = 'CodeSandbox';
            }
        }
    }
    
    // Fallback: Check if GitHub Pages might be available
    if (!hasDemo && repo.name.includes('github.io')) {
        hasDemo = true;
        demoUrl = `https://${repo.owner.login}.github.io/${repo.name}`;
        demoText = 'GitHub Pages';
    }
    
    // Additional fallback: Try standard GitHub Pages URL for web projects
    if (!hasDemo && (repo.language === 'HTML' || repo.language === 'JavaScript' || repo.language === 'CSS')) {
        // Check if this might be a GitHub Pages site
        // Encode the repository name to handle special characters
        const encodedRepoName = encodeURIComponent(repo.name);
        const potentialUrl = `https://${repo.owner.login}.github.io/${encodedRepoName}`;
        demoUrl = potentialUrl;
        demoText = 'GitHub Pages';
        hasDemo = true; // We'll show the button, user can click to test
    }
    
    // Get all languages
    let languagesDisplay = '';
    if (repo.languages && Object.keys(repo.languages).length > 0) {
        const languageItems = Object.entries(repo.languages)
            .sort(([,a], [,b]) => b - a) // Sort by bytes descending
            .slice(0, 5) // Show top 5 languages
            .map(([language, bytes]) => {
                const color = languageColors[language] || '#858585';
                return `
                    <div class="language-item">
                        <div class="language-color" style="background-color: ${color}"></div>
                        <span class="language-name">${language}</span>
                    </div>
                `;
            }).join('');
        
        languagesDisplay = `<div class="project-languages">${languageItems}</div>`;
    } else if (repo.language) {
        // Fallback to primary language if languages API fails
        const languageColor = languageColors[repo.language] || '#858585';
        languagesDisplay = `
            <div class="project-languages">
                <div class="language-item">
                    <div class="language-color" style="background-color: ${languageColor}"></div>
                    <span class="language-name">${repo.language}</span>
                </div>
            </div>
        `;
    }
    
    // Format topics
    const topics = repo.topics && repo.topics.length > 0 
        ? repo.topics.slice(0, 5).map(topic => `<span class="topic-tag">${topic}</span>`).join('')
        : '';
    
    return `
        <div class="project-card" data-language="${repo.language || ''}" data-stars="${repo.stargazers_count}" data-updated="${repo.updated_at}" data-created="${repo.created_at}" data-name="${repo.name.toLowerCase()}">
            <div class="project-header">
                <h3 class="project-title">${repo.name}</h3>
                ${repo.private ? '<span class="private-badge">Private</span>' : ''}
            </div>
            
            ${languagesDisplay}
            
            <div class="project-meta">
                ${repo.stargazers_count > 0 ? `
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>${repo.stargazers_count}</span>
                    </div>
                ` : ''}
                
                ${repo.forks_count > 0 ? `
                    <div class="meta-item">
                        <i class="fas fa-code-branch"></i>
                        <span>${repo.forks_count}</span>
                    </div>
                ` : ''}
            </div>
            
            ${topics ? `<div class="project-topics">${topics}</div>` : ''}
            
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                    <i class="fab fa-github"></i>
                    View Code
                </a>
                
                <a href="${demoUrl || repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link demo ${!hasDemo ? 'disabled-demo' : ''}">
                    <i class="fas fa-external-link-alt"></i>
                    ${hasDemo ? demoText : 'No Live Demo'}
                </a>
            </div>
        </div>
    `;
}

function updateLanguageFilter() {
    const languages = new Set();
    repositories.forEach(repo => {
        if (repo.language) languages.add(repo.language);
    });
    
    const sortedLanguages = Array.from(languages).sort();
    
    languageFilter.innerHTML = '<option value="">All Languages</option>' +
        sortedLanguages.map(lang => `<option value="${lang}">${lang}</option>`).join('');
}

function filterRepositories() {
    const selectedLanguage = languageFilter.value;
    
    if (selectedLanguage === '') {
        filteredRepos = [...repositories];
    } else {
        filteredRepos = repositories.filter(repo => repo.language === selectedLanguage);
    }
    
    sortRepositories();
}

function sortRepositories() {
    const sortBy = sortRepos.value;
    
    filteredRepos.sort((a, b) => {
        switch (sortBy) {
            case 'stars':
                return b.stargazers_count - a.stargazers_count;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'created':
                return new Date(b.created_at) - new Date(a.created_at);
            case 'updated':
            default:
                return new Date(b.updated_at) - new Date(a.updated_at);
        }
    });
    
    displayRepositories();
}

function toggleView(view) {
    if (view === 'grid') {
        projectsGrid.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    } else {
        projectsGrid.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    }
}

// Utility functions
function showLoading(show) {
    loading.classList.toggle('hidden', !show);
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.classList.remove('hidden');
}

// Scroll animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Call observe function when repositories are loaded
const originalDisplayRepositories = displayRepositories;
displayRepositories = function() {
    originalDisplayRepositories.call(this);
    setTimeout(observeElements, 100);
};

// Active navigation highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add some sample placeholder text update
document.addEventListener('DOMContentLoaded', () => {
    // You can customize these values
    const heroTitle = document.querySelector('.hero-title .highlight');
    const contactItems = document.querySelectorAll('.contact-item span');
    
    // Update contact information placeholders
    if (contactItems.length >= 2) {
        contactItems[0].textContent = 'david.foy89@gmail.com';
        contactItems[1].textContent = 'github.com/david-foy89';
    }
});