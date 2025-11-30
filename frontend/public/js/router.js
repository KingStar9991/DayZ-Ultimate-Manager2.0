class Router {
  constructor() {
    this.routes = new Map();
    this.currentPage = null;
    this.init();
  }

  init() {
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
    
    this.handleRoute();
  }

  register(path, pageComponent) {
    this.routes.set(path, pageComponent);
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  async handleRoute() {
    const path = window.location.pathname || '/';
    const pageComponent = this.routes.get(path) || this.routes.get('/');
    
    if (pageComponent) {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = '';
        const page = await pageComponent();
        if (typeof page === 'string') {
          mainContent.innerHTML = page;
        } else if (page instanceof HTMLElement) {
          mainContent.appendChild(page);
        }
        
        // Update active sidebar item
        this.updateActiveSidebarItem(path);
      }
    }
  }

  updateActiveSidebarItem(path) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.path === path) {
        item.classList.add('active');
      }
    });
  }
}

const router = new Router();
window.router = router;


