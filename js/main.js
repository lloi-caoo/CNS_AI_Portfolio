// Main JavaScript for Cao Doan Loi Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Header scroll effect (sticky header)
    const mobileHeader = document.querySelector('.mobile-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mobileHeader?.classList.add('scrolled');
        } else {
            mobileHeader?.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle (Slide out drawer)
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    if (mobileNavToggle && mobileMenuDrawer && mobileMenuOverlay) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('active');
            mobileMenuDrawer.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
        });

        mobileMenuOverlay.addEventListener('click', () => {
            mobileNavToggle.classList.remove('active');
            mobileMenuDrawer.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
        });

        // Close menu when clicking links
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('active');
                mobileMenuDrawer.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
            });
        });
    }

    // 3. Project Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active class on buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // Filter cards
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        // Trigger fade in animation
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 4. Sliding Side Drawer Logic & Loading HTML Content Dynamically
    const drawer = document.getElementById('projectDrawer');
    const drawerBody = document.getElementById('drawerBody');
    const drawerClose = document.getElementById('drawerClose');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const openDrawerBtns = document.querySelectorAll('.open-modal-btn'); // Matches button class in projects.html

    // Projects metadata for badge and category mapping
    const projectsMeta = {
        1: { badge: "Bài 1", category: "Hệ điều hành Windows" },
        2: { badge: "Bài 2", category: "Nghiên cứu khoa học" },
        3: { badge: "Bài 3", category: "Prompt Engineering / Python" },
        4: { badge: "Bài 4", category: "Làm việc nhóm / Quản trị số" },
        5: { badge: "Bài 5", category: "Java OOP / Sáng tạo nội dung" },
        6: { badge: "Bài 6", category: "Đạo đức AI & Liêm chính" }
    };

    // Open Drawer function loading raw original html file dynamically
    function openDrawer(projectId) {
        const meta = projectsMeta[projectId];
        if (!meta) return;

        // 1. Try to load content from local inline elements (offline / file-protocol compatibility)
        const localContentEl = document.getElementById(`project-content-${projectId}`);
        if (localContentEl) {
            const htmlContent = localContentEl.innerHTML;
            const processedHtml = htmlContent.replace(/(src=["'])proofs\//g, '$1assets/proofs/');

            drawerBody.innerHTML = `
                <div class="modal-header-desc">
                    <span class="badge">${meta.badge}</span>
                    <span class="badge badge-secondary" style="background: rgba(255,255,255,0.03); color: var(--text-muted); border-color: var(--border-color);">${meta.category}</span>
                </div>
                ${processedHtml}
            `;
            drawer.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable page scrolling
            return;
        }

        // 2. Fallback: Fetch the HTML content dynamically from assets/project[N].html (if not inlined)
        // Show loading state first
        drawerBody.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; color: var(--text-muted);">
                <div class="loading-spinner" style="width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.05); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;"></div>
                <p>Đang tải nội dung bản gốc từ file báo cáo...</p>
            </div>
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;

        drawer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable page scrolling

        // Fetch the HTML content dynamically from assets/project[N].html
        // Use cache-busting query parameter if served over HTTP/HTTPS to prevent browser caching old paths
        const isLocalFile = window.location.protocol === 'file:';
        const fetchUrl = isLocalFile ? `assets/project${projectId}.html` : `assets/project${projectId}.html?v=${Date.now()}`;

        fetch(fetchUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Không thể tải file báo cáo gốc.");
                }
                return response.text();
            })
            .then(htmlContent => {
                // Adjust image paths starting with 'proofs/' to 'assets/proofs/' 
                // because this HTML is being injected into projects.html at the root folder
                const processedHtml = htmlContent.replace(/(src=["'])proofs\//g, '$1assets/proofs/');

                drawerBody.innerHTML = `
                    <div class="modal-header-desc">
                        <span class="badge">${meta.badge}</span>
                        <span class="badge badge-secondary" style="background: rgba(255,255,255,0.03); color: var(--text-muted); border-color: var(--border-color);">${meta.category}</span>
                    </div>
                    ${processedHtml}
                `;
            })
            .catch(error => {
                drawerBody.innerHTML = `
                    <div style="padding: 40px; text-align: center; color: #ef4444;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 16px; display: block; margin-left: auto; margin-right: auto;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <p>Đã xảy ra lỗi khi tải nội dung: ${error.message}</p>
                    </div>
                `;
            });
    }

    // Close Drawer function
    function closeDrawer() {
        drawer.classList.remove('active');
        document.body.style.overflow = ''; // Enable page scrolling
    }

    // Bind event listeners to open buttons
    openDrawerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            openDrawer(projectId);
        });
    });

    // Bind close events
    if (drawerClose) {
        drawerClose.addEventListener('click', closeDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    // Close drawer on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
            closeDrawer();
        }
    });

    // 5. Synchronized Light/Dark Theme Toggles
    const themeToggles = document.querySelectorAll('.theme-toggle');
    if (themeToggles.length > 0) {
        // Sync body class with html class on initialization
        if (document.documentElement.classList.contains('light-theme')) {
            document.body.classList.add('light-theme');
        }
        
        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const isLight = document.documentElement.classList.toggle('light-theme');
                document.body.classList.toggle('light-theme');
                
                // Save theme preference
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            });
        });
    }
});
