// File: /src/js/core/router.js

class Router {
    constructor() {
        this.routes = {
            '/': 'src/index.html',
            '/level-1': 'src/levels/level-1.html',
            '/level-2': 'src/levels/level-2.html',
            '/level-3': 'src/levels/level-3.html',
            '/level-4': 'src/levels/level-4.html',
            '/level-5': 'src/levels/level-5.html',
            '/level-6': 'src/levels/level-6.html',
            '/level-7': 'src/levels/level-7.html',
            '/paths/path-a': 'src/levels/paths/path-a.html',
            '/paths/path-b': 'src/levels/paths/path-b.html',
            '/paths/path-c': 'src/levels/paths/path-c.html',
            '/epilogue': 'src/levels/epilogue.html'
        };

        // Deteksi environment
        this.isGitHubPages = window.location.hostname.includes('github.io');
        this.repositoryName = 'mind-lab-game'; // Ganti dengan nama repo Anda
        this.basePath = this.isGitHubPages ? `/${this.repositoryName}/` : '/';
        
        this.init();
    }

    init() {
        // Handle klik pada link yang menggunakan class "nav-link"
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('.nav-link');
            if (link) {
                e.preventDefault();
                const path = link.getAttribute('href');
                this.navigate(path);
            }
        });

        // Handle tombol back/forward browser
        window.addEventListener('popstate', () => {
            this.loadPage(this.getNormalizedPath(window.location.pathname));
        });

        // Load halaman saat pertama kali
        this.loadPage(this.getNormalizedPath(window.location.pathname));
    }

    navigate(path) {
        const fullPath = this.isGitHubPages ? 
            `${this.basePath}${path.replace(/^\//, '')}` : 
            path;
            
        history.pushState({}, '', fullPath);
        this.loadPage(path);
    }

    async loadPage(path) {
        // Normalisasi path
        const normalizedPath = this.getNormalizedPath(path);
        const route = this.routes[normalizedPath] || this.routes['/'];
        
        // Path untuk fetch
        const fetchPath = this.isGitHubPages ? 
            `${this.basePath}${route}` : 
            route;

        try {
            const response = await fetch(fetchPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const html = await response.text();
            
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = html;
                
                // Load script JS khusus untuk halaman tersebut jika ada
                this.loadPageScript(normalizedPath);
                
                // Scroll ke atas setelah load halaman baru
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Failed to load page:', error, fetchPath);
            this.showErrorPage();
        }
    }

    loadPageScript(path) {
        // Hapus script sebelumnya jika ada
        const oldScript = document.getElementById('page-script');
        if (oldScript) oldScript.remove();

        // Map path ke file script yang sesuai
        const scriptMap = {
            '/level-1': 'src/js/levels/level-1.js',
            '/level-2': 'src/js/levels/level-2.js',
            '/level-3': 'src/js/levels/level-3.js',
            '/level-4': 'src/js/levels/level-4.js',
            '/level-5': 'src/js/levels/level-5.js',
            '/level-6': 'src/js/levels/level-6.js',
            '/level-7': 'src/js/levels/level-7.js',
            '/paths/path-a': 'src/js/levels/paths/path-a.js',
            '/paths/path-b': 'src/js/levels/paths/path-b.js',
            '/paths/path-c': 'src/js/levels/paths/path-c.js',
            '/epilogue': 'src/js/levels/epilogue.js'
        };

        if (scriptMap[path]) {
            const scriptPath = this.isGitHubPages ?
                `${this.basePath}${scriptMap[path]}` :
                scriptMap[path];
                
            const script = document.createElement('script');
            script.id = 'page-script';
            script.src = scriptPath;
            document.body.appendChild(script);
        }
    }

    showErrorPage() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-container">
                    <h2>Neuro-Sync Connection Failed</h2>
                    <p>Unable to load the requested mind simulation. Please check your connection and try again.</p>
                    <button onclick="window.router.navigate('/')">Return to Main Menu</button>
                </div>
            `;
        }
    }

    // Helper untuk normalisasi path
    getNormalizedPath(path) {
        if (this.isGitHubPages) {
            // Hapus basePath dari path jika ada
            return path.replace(this.basePath, '').replace(/^\//, '') || '/';
        }
        return path || '/';
    }
}

// Inisialisasi router saat dokumen siap
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
    
    // Debug info
    console.log('Router initialized');
    console.log('GitHub Pages mode:', window.router.isGitHubPages);
    console.log('Base path:', window.router.basePath);
});
