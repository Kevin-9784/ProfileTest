/**
 * Professional Portfolio JavaScript | 2026 Edition
 * Handles Theme Toggling, Scroll Animations, and GitHub API Integration.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. DARK MODE TOGGLE & SYSTEM PREFERENCE DETECTION
    // ==========================================================================
    const themeBtn = document.getElementById('theme-btn');
    const htmlElement = document.documentElement;
    
    // Check local storage or system preference on load
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.setAttribute('data-theme', 'dark');
        themeBtn.textContent = '☀️'; // Change icon to sun
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeBtn.textContent = '🌓';
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeBtn.textContent = '☀️';
        }
    });

    // ==========================================================================
    // 2. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    // Fades in content blocks as you scroll down the page
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Grab all major sections to animate
    const sectionsToAnimate = document.querySelectorAll('.content-block, .project-card, .skill-category');
    
    // Initial state for CSS (You would add .visible { opacity: 1; transform: translateY(0); } to your CSS)
    sectionsToAnimate.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        scrollObserver.observe(section);
    });

    // ==========================================================================
    // 3. LIVE GITHUB STATS FETCHING
    // ==========================================================================
    // Replace 'torvalds' with your actual GitHub username
    const githubUsername = 'torvalds'; 
    const statsContainer = document.querySelector('.github-stats-placeholder');

    async function fetchGitHubStats() {
        if (!statsContainer) return;
        
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}`);
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            // Format the HTML to inject
            statsContainer.innerHTML = `
                <p>
                    <small>
                        <a href="${data.html_url}" target="_blank" rel="noopener noreferrer">
                            @${data.login}
                        </a> | 
                        Public Repos: ${data.public_repos} | 
                        Followers: ${data.followers}
                    </small>
                </p>
            `;
        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
            statsContainer.innerHTML = `<p><small>GitHub stats temporarily unavailable.</small></p>`;
        }
    }

    // Call the function to fetch stats
    fetchGitHubStats();
});
