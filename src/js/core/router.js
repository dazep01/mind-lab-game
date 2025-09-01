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
        this.init();
    }

    init() {
        // Handle klik pada link yang menggunakan class "nav-link"
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
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
        const base = this.getBaseUrl();
        history.pushState({}, '', base + path);
        this.loadPage(path);
    }

    async loadPage(path) {
        const route = this.routes[path] || this.routes['/'];
        
        try {
            const response = await fetch(route);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const html = await response.text();
            document.getElementById('main-content').innerHTML = html;
            
            // Load script JS khusus untuk halaman tersebut jika ada
            this.loadPageScript(path);
        } catch (error) {
            console.error('Failed to load page:', error);
            this.showErrorPage();
        }
    }

    loadPageScript(path) {
        // Hapus script sebelumnya jika ada
        const oldScript = document.getElementById('page-script');
        if (oldScript) oldScript.remove();

        const scriptMap = {
            '/level-1': 'js/levels/level-1.js',
            '/level-2': 'js/levels/level-2.js',
            // ... tambahkan mapping untuk level lainnya
        };

        if (scriptMap[path]) {
            const script = document.createElement('script');
            script.id = 'page-script';
            script.src = scriptMap[path];
            document.body.appendChild(script);
        }
    }

    getBaseUrl() {
        // Untuk GitHub Pages, kita perlu mengetahui base URL
        const repoName = 'mind-lab-game';
        return window.location.hostname === 'localhost' 
            ? '' 
            : `/${repoName}/`;
    }

    showErrorPage() {
        document.getElementById('main-content').innerHTML = `
            <div class="error-container">
                <h2>Neuro-Sync Connection Failed</h2>
                <p>Unable to load the requested mind simulation. Please check your connection and try again.</p>
                <button onclick="window.router.navigate('/')">Return to Main Menu</button>
            </div>
        `;
    }
}

// Inisialisasi router saat dokumen siap
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
