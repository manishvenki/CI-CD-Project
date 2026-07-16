/* ==========================================================================
   CI/CD Demo Pipeline Landing Page - Core Script
   Features: Real-time telemetry clock, active nav highlighting,
             hamburger menu control, and DevOps terminal build simulator.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Live Clock for Deployment Time
    const timeDisplay = document.getElementById('deploymentTime');
    
    function updateClock() {
        const now = new Date();
        
        // Format options: "Thu, 16 Jul 2026 16:53:19 GMT+0530" or similar readable format
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            timeZoneName: 'short' 
        };
        
        timeDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Initialize clock and update every second
    updateClock();
    setInterval(updateClock, 1000);


    // 2. Mobile Responsive Menu Toggle (Hamburger)
    const hamburger = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Toggle hamburger icon between bars and close X
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.querySelector('i').className = 'fa-solid fa-bars';
        });
    });


    // 3. Navigation Highlighting on Scroll (ScrollSpy)
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // 4. DevOps Terminal Simulation (Interactive "Deploy Now" action)
    const deployButtons = [
        document.getElementById('navDeployBtn'),
        document.getElementById('heroDeployBtn')
    ];
    const terminalModal = document.getElementById('terminalModal');
    const terminalCloseBtn = document.getElementById('terminalCloseBtn');
    const terminalBody = document.getElementById('terminalBody');
    const terminalLogs = document.getElementById('terminalLogs');

    // High-fidelity logs mimicking actual deployment telemetry
    const deploymentSteps = [
        { text: "[16:53:19] [INIT] Initializing deployment pipeline v1.0.0...", class: "init" },
        { text: "[16:53:20] [INIT] Loading pipeline scripts and setting up environment...", class: "init" },
        { text: "[16:53:20] [GIT] Pulling latest code changes from branch 'main'...", class: "git" },
        { text: "[16:53:21] [GIT] Repository status: Clean. Syncing commit [7df8a01] 'Update index'...", class: "git" },
        { text: "[16:53:21] [GIT] Fetch successful. Triggering Webhook for build...", class: "git" },
        { text: "[16:53:22] [JENKINS] Agent workspace allocated. Starting Jenkins Pipeline Job #42...", class: "jenkins" },
        { text: "[16:53:22] [JENKINS] Stage 'Source Pull': Completed.", class: "jenkins" },
        { text: "[16:53:23] [JENKINS] Stage 'Unit Tests': Running npm test suite...", class: "jenkins" },
        { text: "[16:53:23] [JENKINS] Unit Tests PASS. Coverage reports archived.", class: "jenkins" },
        { text: "[16:53:24] [JENKINS] Stage 'Compilation': Build success.", class: "jenkins" },
        { text: "[16:53:24] [DOCKER] Stage 'Build Container Image': Executing docker build...", class: "docker" },
        { text: "[16:53:25] [DOCKER] Sending build context to Docker daemon: 2.14 MB", class: "docker" },
        { text: "[16:53:25] [DOCKER] Image pipeline-demo-app:latest compiled successfully.", class: "docker" },
        { text: "[16:53:26] [DOCKER] Pushing image tag 'v1.0' to Docker Hub registry...", class: "docker" },
        { text: "[16:53:26] [DOCKER] Image push completed successfully.", class: "docker" },
        { text: "[16:53:27] [TERRAFORM] Stage 'Infrastructure Provisioning': terraform plan...", class: "terraform" },
        { text: "[16:53:27] [TERRAFORM] Configuration valid. Executing terraform apply -auto-approve...", class: "terraform" },
        { text: "[16:53:28] [TERRAFORM] Creating target load balancers, DNS records, and Node groups...", class: "terraform" },
        { text: "[16:53:29] [TERRAFORM] Infrastructure updated. Outputs: app_endpoint = http://demo-pipeline.dev", class: "terraform" },
        { text: "[16:53:29] [KUBERNETES] Stage 'Rolling Cluster Rollout': kubectl apply -f k8s/...", class: "k8s" },
        { text: "[16:53:30] [KUBERNETES] Container rollout in progress. Terminating stale pods...", class: "k8s" },
        { text: "[16:53:30] [KUBERNETES] Scaling ReplicaSet 'demo-app-deployment' to 3 nodes...", class: "k8s" },
        { text: "[16:53:31] [KUBERNETES] Rollout complete. All 3 nodes reporting status HEALTHY.", class: "k8s" },
        { text: "[16:53:31] [MONITORING] Scraping targets registered with Prometheus server...", class: "monitoring" },
        { text: "[16:53:32] [MONITORING] Grafana dashboards updated. Health Metrics: ACTIVE.", class: "monitoring" },
        { text: "[16:53:32] [SUCCESS] Deployment Completed! Status Code: 0 (SUCCESS) ✅", class: "success" }
    ];

    let currentLogIndex = 0;
    let logInterval = null;

    // Open terminal modal and run the simulation
    function openDeployTerminal() {
        // Reset state
        terminalLogs.innerHTML = '';
        currentLogIndex = 0;
        terminalModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // lock scrolling
        
        // Disable click outside while building or allow close
        runSimulation();
    }

    function runSimulation() {
        if (logInterval) clearInterval(logInterval);
        
        logInterval = setInterval(() => {
            if (currentLogIndex < deploymentSteps.length) {
                const step = deploymentSteps[currentLogIndex];
                
                // Create list item element
                const li = document.createElement('li');
                li.className = `log-line ${step.class}`;
                
                // Style log timing based on current timestamp
                const now = new Date();
                const timeStr = `[${now.toTimeString().split(' ')[0]}]`;
                const cleanText = step.text.replace(/^\[\d{2}:\d{2}:\d{2}\]/, timeStr);
                
                li.textContent = cleanText;
                terminalLogs.appendChild(li);
                
                // Scroll body to bottom
                terminalBody.scrollTop = terminalBody.scrollHeight;
                
                currentLogIndex++;
            } else {
                clearInterval(logInterval);
                logInterval = null;
                
                // Once completed, stamp the Telemetry Card with the exact deployment time
                updateClock();
            }
        }, 180); // Speed of logs printing (180ms delay between logs)
    }

    // Bind event listeners for Deploy buttons
    deployButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', openDeployTerminal);
        }
    });

    // Close terminal modal
    function closeTerminal() {
        if (logInterval) {
            clearInterval(logInterval);
            logInterval = null;
        }
        terminalModal.style.display = 'none';
        document.body.style.overflow = ''; // unlock scrolling
    }

    terminalCloseBtn.addEventListener('click', closeTerminal);

    // Close when clicking outside of the terminal card
    terminalModal.addEventListener('click', (e) => {
        if (e.target === terminalModal) {
            closeTerminal();
        }
    });

    // Allow escape key to close terminal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && terminalModal.style.display === 'flex') {
            closeTerminal();
        }
    });

});
