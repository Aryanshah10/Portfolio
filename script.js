document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Typewriter Subtitle Animation
  // ==========================================
  const animatedHeadline = document.getElementById('animated-headline');
  const phrases = [
    "Hardware System Engineer",
    "Electronics Engineer",
    "Embedded Developer",
    "PCB Layout Specialist",
    "Hardware Prototyper"
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeText() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove character
      animatedHeadline.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // faster deletion
    } else {
      // Add character
      animatedHeadline.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // natural typing speed
    }

    // Switch conditions
    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at full word
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // pause before typing next word
    }

    setTimeout(typeText, typingSpeed);
  }

  // Start typing loop
  setTimeout(typeText, 1000);

  // ==========================================
  // 2. Circuit Canvas Animation
  // ==========================================
  const canvas = document.getElementById('circuit-canvas');
  const ctx = canvas.getContext('2d');
  let animationFrameId;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initCircuit();
  });

  let mouse = { x: null, y: null, radius: 120 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Trace line class
  class CircuitTrace {
    constructor(startX, startY, gridSpacing) {
      this.points = [{ x: startX, y: startY }];
      this.maxPoints = Math.floor(Math.random() * 3) + 3; // 3 to 5 nodes
      this.gridSpacing = gridSpacing;
      
      let x = startX;
      let y = startY;
      
      // Procedurally generate orthagonal traces (horizontal & vertical PCB style)
      for (let i = 0; i < this.maxPoints; i++) {
        const directions = [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 }
        ];
        
        // Pick a random direction
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const length = (Math.floor(Math.random() * 4) + 2) * this.gridSpacing; // length as grid steps
        
        x += dir.dx * length;
        y += dir.dy * length;
        
        // Keep within canvas margins
        if (x > 0 && x < width && y > 0 && y < height) {
          this.points.push({ x, y });
        } else {
          break;
        }
      }

      this.signalPulse = Math.random() < 0.4; // 40% traces have a glowing current packet
      this.pulseProgress = 0;
      this.pulseSpeed = 0.015 + Math.random() * 0.015;
    }

    draw() {
      // Draw copper trace path
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      
      // Determine line color based on proximity to mouse
      let isNearMouse = false;
      if (mouse.x !== null) {
        for (let pt of this.points) {
          const dist = Math.hypot(pt.x - mouse.x, pt.y - mouse.y);
          if (dist < mouse.radius) {
            isNearMouse = true;
            break;
          }
        }
      }

      const traceColor = '#111b33';
      const glowColor = '#00f0ff';

      ctx.strokeStyle = isNearMouse ? glowColor : traceColor;
      ctx.lineWidth = isNearMouse ? 1.5 : 1.0;
      ctx.stroke();

      // Draw solder joints/nodes
      this.points.forEach((pt, index) => {
        if (index === 0 || index === this.points.length - 1 || Math.random() < 0.1) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isNearMouse ? 3.5 : 2, 0, Math.PI * 2);
          ctx.fillStyle = isNearMouse ? glowColor : '#1e293b';
          ctx.fill();
        }
      });

      // Draw electron signal pulse moving down path
      if (this.signalPulse && this.points.length > 1) {
        this.pulseProgress += this.pulseSpeed;
        if (this.pulseProgress >= 1) {
          this.pulseProgress = 0; // wrap around
        }

        // Interpolate position across multi-segment path
        const totalSegments = this.points.length - 1;
        const segmentProgress = this.pulseProgress * totalSegments;
        const currentSegment = Math.floor(segmentProgress);
        const ratio = segmentProgress - currentSegment;

        if (currentSegment < totalSegments) {
          const startPt = this.points[currentSegment];
          const endPt = this.points[currentSegment + 1];
          const px = startPt.x + (endPt.x - startPt.x) * ratio;
          const py = startPt.y + (endPt.y - startPt.y) * ratio;

          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ff7b00'; // Orange signal
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 123, 0, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow
        }
      }
    }
  }

  let traces = [];
  function initCircuit() {
    traces = [];
    const gridSpacing = 40;
    const columns = Math.ceil(width / gridSpacing);
    const rows = Math.ceil(height / gridSpacing);
    const totalTraces = Math.min(25, Math.floor((columns * rows) / 40));

    for (let i = 0; i < totalTraces; i++) {
      // Align start points to grid intersection
      const startX = Math.floor(Math.random() * columns) * gridSpacing;
      const startY = Math.floor(Math.random() * rows) * gridSpacing;
      traces.push(new CircuitTrace(startX, startY, gridSpacing));
    }
  }

  function animateCircuit() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw background dots for schematic grid look
    const gridSpacing = 40;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    for (let x = 0; x < width; x += gridSpacing) {
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }

    // Draw electrical lines
    traces.forEach(trace => trace.draw());

    animationFrameId = requestAnimationFrame(animateCircuit);
  }

  initCircuit();
  animateCircuit();

  // ==========================================
  // 3. Active Navigation Link Spy
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  function navSpy() {
    let currentActiveSectionId = '';
    const scrollPosition = window.scrollY + 120; // offset

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentActiveSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if (href === `#${currentActiveSectionId}`) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', navSpy);
  navSpy(); // invoke initially

  // ==========================================
  // 4. Interactive Contact Form Terminal
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFieldsDiv = document.querySelector('.form-fields');
  const submitBtn = document.getElementById('btn-submit-contact');
  const submitText = submitBtn.querySelector('.btn-text');
  const submitLoader = submitBtn.querySelector('.btn-loader');
  const consoleOutput = document.getElementById('terminal-console-output');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect data
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    // Show processing state
    submitBtn.disabled = true;
    submitLoader.classList.remove('hidden');
    submitText.textContent = "Transmitting...";

    // Simulated network transmission & diagnostic readout
    let consoleLogs = [
      `[info] Initializing COM1 interface connection...`,
      `[info] UART Baud Rate set to 115200 bps. 8-N-1 configured.`,
      `[status] Pinging recipient server dhruvshah.dev... SUCCESS (22ms)`,
      `[status] Securing channels via SSL/TLS handshake...`,
      `[info] Handshake established. Session ID: 0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase()}`,
      `[status] Encoding payload telemetry data...`,
      `[data] Serializing packet structures:`,
      `       { sender: "${name}", email: "${email}", subject: "${subject}" }`,
      `[status] Pushing envelope packet segments...`,
      `[progress] Sending: [======                    ] 30%`,
      `[progress] Sending: [======================    ] 75%`,
      `[progress] Sending: [==========================] 100%`,
      `[status] Signal transmission CONFIRMED.`,
      `[info] Response Code: 202 ACCEPTED. Packet ID: 0xEE42`,
      `[status] Connection termination initiated.`,
      `[info] COM1 offline.\n\n>> TRANSMISSION COMPLETE. Dhruv will get back to you shortly!`
    ];

    setTimeout(() => {
      // Hide form fields smoothly
      formFieldsDiv.style.opacity = '0.1';
      formFieldsDiv.style.pointerEvents = 'none';
      submitBtn.classList.add('hidden');
      consoleOutput.classList.remove('hidden');
      consoleOutput.textContent = "";

      let logIndex = 0;
      function printNextLog() {
        if (logIndex < consoleLogs.length) {
          consoleOutput.textContent += consoleLogs[logIndex] + "\n";
          consoleOutput.scrollTop = consoleOutput.scrollHeight;
          logIndex++;
          // Simulate different network execution speeds
          const delay = Math.random() * 200 + 150; 
          setTimeout(printNextLog, delay);
        }
      }

      printNextLog();
    }, 1500);
  });

  // ==========================================
  // 5. Mobile Menu (Hamburger Dropdown)
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function setMenuOpen(open) {
    mobileMenu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  }

  menuToggle.addEventListener('click', () => {
    setMenuOpen(!mobileMenu.classList.contains('open'));
  });

  // Close the menu when any link inside it is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // Close the menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      setMenuOpen(false);
    }
  });

  // Close the menu on Escape key (and return focus to the toggle)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  // Close the menu if the viewport grows back to desktop size (56rem = 896px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 896) {
      setMenuOpen(false);
    }
  });

  // ==========================================
  // 6. Know More Modal
  // ==========================================
  const knowMoreBtn = document.getElementById('know-more-btn');
  const knowMoreModal = document.getElementById('know-more-modal');
  const modalCloseBtn = document.getElementById('modal-close');

  function setModalOpen(open, returnFocus = true) {
    knowMoreModal.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    // Move focus into the dialog on open, back to the trigger on close
    if (open) {
      modalCloseBtn.focus();
    } else if (returnFocus) {
      knowMoreBtn.focus();
    }
  }

  knowMoreBtn.addEventListener('click', () => setModalOpen(true));
  modalCloseBtn.addEventListener('click', () => setModalOpen(false));

  // Close when clicking the dark backdrop (outside the dialog)
  knowMoreModal.addEventListener('click', (e) => {
    if (e.target === knowMoreModal) {
      setModalOpen(false);
    }
  });

  // Close the modal when the footer "Let's talk" link is used (then it scrolls to contact);
  // skip the focus return so focus stays in the flow while the page scrolls to #contact
  const modalContactLink = document.getElementById('modal-contact-link');
  modalContactLink.addEventListener('click', () => setModalOpen(false, false));

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && knowMoreModal.classList.contains('open')) {
      setModalOpen(false);
    }
  });

  // Keep Tab focus cycling inside the dialog while it is open
  knowMoreModal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = knowMoreModal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // ==========================================
  // 7. Experience Show More / Show Less
  // ==========================================
  document.querySelectorAll('.exp-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const detailsId = toggle.getAttribute('aria-controls');
      const details = document.getElementById(detailsId);
      if (!details) return;
      const isOpen = details.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      const label = toggle.querySelector('.exp-toggle-text');
      if (label) {
        label.textContent = isOpen ? 'Show Less' : 'Show More';
      }
    });
  });

  // Footer Dynamic Year
  document.getElementById('footer-year').textContent = new Date().getFullYear();
});
