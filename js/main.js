// Main JavaScript for Cao Doan Loi Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
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

    // 4. Modal Popup Logic & Loading HTML Content Dynamically
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');

    // Projects metadata for badge and category mapping
    const projectsMeta = {
        1: { badge: "Bài 1", category: "Hệ điều hành Windows" },
        2: { badge: "Bài 2", category: "Nghiên cứu khoa học" },
        3: { badge: "Bài 3", category: "Prompt Engineering / Python" },
        4: { badge: "Bài 4", category: "Làm việc nhóm / Quản trị số" },
        5: { badge: "Bài 5", category: "Java OOP / Sáng tạo nội dung" },
        6: { badge: "Bài 6", category: "Đạo đức AI & Liêm chính" }
    };

    // Open Modal function loading raw original html file dynamically
    function openModal(projectId) {
        const meta = projectsMeta[projectId];
        if (!meta) return;

        // Show loading state first
        modalBody.innerHTML = `
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

        modal.classList.add('active');
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

                modalBody.innerHTML = `
                    <div class="modal-header-desc">
                        <span class="badge">${meta.badge}</span>
                        <span class="badge badge-secondary" style="background: rgba(255,255,255,0.03); color: var(--text-muted); border-color: var(--border-color);">${meta.category}</span>
                    </div>
                    ${processedHtml}
                `;
            })
            .catch(error => {
                modalBody.innerHTML = `
                    <div style="padding: 40px; text-align: center; color: #ef4444;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 16px; display: block; margin-left: auto; margin-right: auto;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <p>Đã xảy ra lỗi khi tải nội dung: ${error.message}</p>
                    </div>
                `;
            });
    }

    // Close Modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Enable page scrolling
    }

    // Bind event listeners to open buttons
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            openModal(projectId);
        });
    });

    // Bind close events
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 5. Light/Dark Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Sync body class with html class
        if (document.documentElement.classList.contains('light-theme')) {
            document.body.classList.add('light-theme');
        }
        
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('light-theme');
            document.body.classList.toggle('light-theme');
            
            // Save theme preference
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }
});

