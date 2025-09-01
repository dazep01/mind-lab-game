// File: /src/js/core/router.js

class Router {
    constructor() {
        this.routes = {
            '/': 'index.html',
            '/level-1': 'levels/level-1.html',
            '/level-2': 'levels/level-2.html',
            '/level-3': 'levels/level-3.html',
            '/level-4': 'levels/level-4.html',
            '/level-5': 'levels/level-5.html',
            '/level-6': 'levels/level-6.html',
            '/level-7': 'levels/level-7.html',
            '/paths/path-a': 'levels/paths/path-a.html',
            '/paths/path-b': 'levels/paths/path-b.html',
            '/paths/path-c': 'levels/paths/path-c.html',
            '/epilogue': 'levels/epilogue.html'
        };
        
        this.isGitHubPages = window.location.hostname.includes('github.io');
        this.basePath = this.isGitHubPages ? '/mind-lab-game/' : '/';
        
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
            this.loadPage(window.location.pathname);
        });

        // Load halaman saat pertama kali
        this.loadPage(window.location.pathname);
    }

    navigate(path) {
        // Untuk GitHub Pages, kita perlu menangani base URL
        const fullPath = this.isGitHubPages ? this.basePath + path.replace(/^\//, '') : path;
        history.pushState({}, '', fullPath);
        this.loadPage(path);
    }

    async loadPage(path) {
        // Normalisasi path untuk menghandle GitHub Pages
        const normalizedPath = path.replace(this.basePath, '');
        const route = this.routes[normalizedPath] || this.routes['/'];
        
        try {
            const response = await fetch(route);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const html = await response.text();
            
            // Gunakan selector yang lebih spesifik untuk area konten
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = html;
                
                // Load script JS khusus untuk halaman tersebut jika ada
                this.loadPageScript(normalizedPath);
                
                // Scroll ke atas setelah load halaman baru
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Failed to load page:', error, route);
            this.showErrorPage();
        }
    }

    loadPageScript(path) {
        // Hapus script sebelumnya jika ada
        const oldScript = document.getElementById('page-script');
        if (oldScript) oldScript.remove();

        // Map path ke file script yang sesuai
        const scriptMap = {
            '/level-1': 'js/levels/level-1.js',
            '/level-2': 'js/levels/level-2.js',
            '/level-3': 'js/levels/level-3.js',
            '/level-4': 'js/levels/level-4.js',
            '/level-5': 'js/levels/level-5.js',
            '/level-6': 'js/levels/level-6.js',
            '/level-7': 'js/levels/level-7.js',
            '/paths/path-a': 'js/levels/paths/path-a.js',
            '/paths/path-b': 'js/levels/paths/path-b.js',
            '/paths/path-c': 'js/levels/paths/path-c.js',
            '/epilogue': 'js/levels/epilogue.js'
        };

        if (scriptMap[path]) {
            const script = document.createElement('script');
            script.id = 'page-script';
            script.src = scriptMap[path];
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

    // Helper untuk mendapatkan path relatif
    getRelativePath() {
        if (this.isGitHubPages) {
            return window.location.pathname.replace(this.basePath, '');
        }
        return window.location.pathname;
    }
}

// Inisialisasi router saat dokumen siap
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
