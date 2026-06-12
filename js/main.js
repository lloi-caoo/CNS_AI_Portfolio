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

    // 6. Interactive Cyber Canvas Particle Network & Skills Linkage
    const canvas = document.getElementById('cyberCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let packets = [];
        let mouse = { x: null, y: null, radius: 160, rotation: 0 };
        const labelPool = ["SYS-HUB 01", "DATA-RX", "VNU-IT", "NODE-70", "SEC-CON", "NET-PORT", "AI-PROC"];

        // Handle sizing
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        // Particle Class (Representing diverse tech nodes)
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35;
                this.radius = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.5 + 0.2;
                this.pulseSpeed = Math.random() * 0.015 + 0.005;
                this.pulseDir = 1;
                
                // Determine node type
                const rand = Math.random();
                if (rand < 0.6) {
                    this.type = 'dot';
                } else if (rand < 0.75) {
                    this.type = 'hub'; // Server/router hub with rings & labels
                    this.radius = Math.random() * 3 + 3;
                    this.label = labelPool[Math.floor(Math.random() * labelPool.length)];
                } else if (rand < 0.9) {
                    this.type = 'crosshair'; // Small mechanical "+" symbol
                    this.angle = Math.random() * Math.PI;
                    this.rotSpeed = (Math.random() - 0.5) * 0.02;
                } else {
                    this.type = 'hexagon'; // Tech hexagon
                    this.angle = Math.random() * Math.PI;
                    this.rotSpeed = (Math.random() - 0.5) * 0.015;
                    this.size = Math.random() * 4 + 4;
                }
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Breathe effect (pulse opacity)
                this.alpha += this.pulseSpeed * this.pulseDir;
                if (this.alpha > 0.8 || this.alpha < 0.15) {
                    this.pulseDir = -this.pulseDir;
                }

                // Rotation
                if (this.type === 'crosshair' || this.type === 'hexagon') {
                    this.angle += this.rotSpeed;
                }
            }

            draw() {
                const isLightTheme = document.documentElement.classList.contains('light-theme');
                const baseAlpha = isLightTheme ? this.alpha * 0.5 : this.alpha;
                ctx.save();
                
                // Set glowing shadow color in dark mode
                if (!isLightTheme) {
                    ctx.shadowBlur = this.type === 'hub' ? 10 : 6;
                    ctx.shadowColor = '#10b981';
                }
                ctx.fillStyle = `rgba(16, 185, 129, ${baseAlpha})`;
                ctx.strokeStyle = `rgba(16, 185, 129, ${baseAlpha * 0.7})`;
                ctx.lineWidth = 1;

                if (this.type === 'dot') {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                } else if (this.type === 'hub') {
                    // Draw outer concentric ring
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius + 4 + Math.sin(Date.now() * 0.005) * 2, 0, Math.PI * 2);
                    ctx.stroke();

                    // Draw center core
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius - 1, 0, Math.PI * 2);
                    ctx.fill();

                    // Text labels
                    ctx.shadowBlur = 0; // Turn off shadow for text readability
                    ctx.font = '9px monospace';
                    ctx.fillStyle = `rgba(16, 185, 129, ${baseAlpha * 0.6})`;
                    ctx.fillText(this.label, this.x + this.radius + 6, this.y + 3);
                } else if (this.type === 'crosshair') {
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    ctx.beginPath();
                    // Draw horizontal line
                    ctx.moveTo(-5, 0); ctx.lineTo(5, 0);
                    // Draw vertical line
                    ctx.moveTo(0, -5); ctx.lineTo(0, 5);
                    ctx.stroke();
                } else if (this.type === 'hexagon') {
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);
                    ctx.beginPath();
                    for (let side = 0; side < 6; side++) {
                        const angle = (side * Math.PI) / 3;
                        const px = Math.cos(angle) * this.size;
                        const py = Math.sin(angle) * this.size;
                        if (side === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }

                ctx.restore();
            }
        }

        // DataPacket Class (moving signals along nodes)
        class DataPacket {
            constructor(startNode, endNode) {
                this.start = startNode;
                this.end = endNode;
                this.progress = 0;
                this.speed = Math.random() * 0.02 + 0.015; // Speed fraction per frame
            }

            update() {
                this.progress += this.speed;
                return this.progress >= 1; // Returns true when packet reaches target
            }

            draw() {
                const isLightTheme = document.documentElement.classList.contains('light-theme');
                // Calculate current coordinates
                const x = this.start.x + (this.end.x - this.start.x) * this.progress;
                const y = this.start.y + (this.end.y - this.start.y) * this.progress;

                ctx.save();
                if (!isLightTheme) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#10b981';
                }
                ctx.beginPath();
                ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = isLightTheme ? 'rgba(16, 185, 129, 0.9)' : '#10b981';
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize particles
        function initParticles() {
            particles = [];
            packets = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 75);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        // Connect particles & manage packets spawn
        function connectParticles() {
            const maxDistance = 120;
            const isLightTheme = document.documentElement.classList.contains('light-theme');
            
            for (let i = 0; i < particles.length; i++) {
                let connectionsCount = 0;
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        connectionsCount++;
                        const alpha = (1 - dist / maxDistance) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = isLightTheme ? `rgba(16, 185, 129, ${alpha * 0.5})` : `rgba(16, 185, 129, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();

                        // Randomly spawn data packet between these two connected nodes
                        if (Math.random() < 0.0006 && packets.length < 15) {
                            packets.push(new DataPacket(particles[i], particles[j]));
                        }
                    }
                }

                // Connect to mouse cursor
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const alpha = (1 - dist / mouse.radius) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = isLightTheme ? `rgba(16, 185, 129, ${alpha * 0.4})` : `rgba(16, 185, 129, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }

        // Draw Interactive Cyber HUD Radar
        function drawCyberHUD() {
            if (mouse.x === null || mouse.y === null) return;
            const isLightTheme = document.documentElement.classList.contains('light-theme');
            const hudAlpha = isLightTheme ? 0.25 : 0.65;

            ctx.save();
            ctx.strokeStyle = `rgba(16, 185, 129, ${hudAlpha})`;
            ctx.lineWidth = 1;

            // Increment rotation
            mouse.rotation += 0.006;

            // 1. Draw outer dotted radar ring
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 45, 0, Math.PI * 2);
            ctx.setLineDash([3, 5]);
            ctx.stroke();
            ctx.setLineDash([]); // reset

            // 2. Draw inner rotating crosshair brackets
            ctx.translate(mouse.x, mouse.y);
            ctx.rotate(mouse.rotation);
            ctx.beginPath();
            // Draw four brackets
            for (let b = 0; b < 4; b++) {
                ctx.rotate(Math.PI / 2);
                ctx.moveTo(22, -6);
                ctx.lineTo(28, -6);
                ctx.lineTo(28, 6);
            }
            ctx.stroke();

            // 3. Draw tiny center reticle
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, ${hudAlpha * 0.8})`;
            ctx.fill();

            // 4. Draw screen coordinates text readout
            ctx.rotate(-mouse.rotation); // Reset rotation to normal text angle
            ctx.font = '9px monospace';
            ctx.fillStyle = `rgba(16, 185, 129, ${hudAlpha})`;
            const textLoc = `LOC [${Math.floor(mouse.x)}, ${Math.floor(mouse.y)}]`;
            const textStat = `SYS_ST: ONLINE`;
            ctx.fillText(textLoc, 55, -8);
            ctx.fillText(textStat, 55, 6);

            ctx.restore();
        }

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw and update nodes
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw and update packets
            packets = packets.filter(packet => {
                const finished = packet.update();
                packet.draw();
                return !finished; // Keep if not finished
            });

            // Connect nodes & draw HUD
            connectParticles();
            drawCyberHUD();

            requestAnimationFrame(animate);
        }

        // Listen for mousemove
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Listen for mouseout
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Setup
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }

    // 7. Interactive Skills & Project Linkage Logic
    const skillCards = document.querySelectorAll('.skill-card');
    const timelineCards = document.querySelectorAll('.timeline-card');

    if (skillCards.length > 0 && timelineCards.length > 0) {
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const targetLessonsStr = card.getAttribute('data-lessons');
                if (!targetLessonsStr) return;
                
                const targetLessons = targetLessonsStr.split(',').map(n => n.trim());
                
                timelineCards.forEach(tCard => {
                    const lessonNum = tCard.getAttribute('data-lesson');
                    if (targetLessons.includes(lessonNum)) {
                        tCard.classList.add('highlighted');
                        tCard.classList.remove('faded');
                    } else {
                        tCard.classList.add('faded');
                        tCard.classList.remove('highlighted');
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                timelineCards.forEach(tCard => {
                    tCard.classList.remove('highlighted');
                    tCard.classList.remove('faded');
                });
            });
        });
    }
});
