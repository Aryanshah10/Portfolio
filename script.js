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
  if (animatedHeadline) setTimeout(typeText, 1000);

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
  const submitText = submitBtn && submitBtn.querySelector('.btn-text');
  const submitLoader = submitBtn && submitBtn.querySelector('.btn-loader');
  const consoleOutput = document.getElementById('terminal-console-output');

  if (contactForm) contactForm.addEventListener('submit', (e) => {
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
  // 6. Tabs (About, Recognition & Community)
  // ==========================================
  document.querySelectorAll('[data-tabgroup]').forEach((group) => {
    const name = group.dataset.tabgroup;
    const tabs = group.querySelectorAll('[data-tab]');
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      document.querySelectorAll(`[data-pane-group="${name}"]`).forEach((p) => {
        p.classList.toggle('active', p.dataset.pane === tab.dataset.tab);
      });
      const heading = document.querySelector(`[data-heading-for="${name}"]`);
      if (heading && tab.dataset.label) heading.textContent = tab.dataset.label;
    }));
  });

  // ==========================================
  // 6b. Filter groups (Projects, Certifications)
  // ==========================================
  function bindFilter(groupId, itemSelector, attr) {
    const group = document.getElementById(groupId);
    if (!group) return;
    const buttons = group.querySelectorAll('[data-filter]');
    buttons.forEach((btn) => btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      document.querySelectorAll(itemSelector).forEach((item) => {
        item.classList.toggle('hidden', btn.dataset.filter !== 'all' && item.dataset[attr] !== btn.dataset.filter);
      });
    }));
  }
  bindFilter('project-filters', '.project-card', 'group');
  bindFilter('cert-filters', '.cert-card', 'domain');

  // ==========================================
  // 6d. View all experience
  // ==========================================
  const expAllBtn = document.getElementById('exp-view-all');
  const expMore = document.getElementById('exp-more');
  if (expAllBtn) expAllBtn.addEventListener('click', () => {
    const open = expMore.classList.toggle('open');
    expAllBtn.setAttribute('aria-expanded', String(open));
    expAllBtn.querySelector('.exp-all-text').textContent = open ? 'Show fewer' : 'View all experience';
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

  // ==========================================
  // 8. Scroll Reveal
  // ==========================================
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('in');
        io.unobserve(el);
        // Hand transitions back to the element once revealed, so hover effects work normally
        el.addEventListener('transitionend', function done(ev) {
          if (ev.target !== el || ev.propertyName !== 'opacity') return;
          el.classList.remove('reveal', 'in');
          el.style.transitionDelay = '';
          el.removeEventListener('transitionend', done);
        });
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
      '.hero-text, .hero-visual, .section-header-center, .head-stack, .head-row, .info-card, .experience-card, .project-card, .skill-card, .service-card, .cert-bar, .cert-card, .contact-grid > *, .page-title, .thesis-meta'
    ).forEach((el) => {
      const index = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.transitionDelay = Math.min(index, 4) * 90 + 'ms';
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // Footer Dynamic Year
  document.getElementById('footer-year').textContent = new Date().getFullYear();
});
