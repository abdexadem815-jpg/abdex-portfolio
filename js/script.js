/**
 * ABDEX - Professional Developer Portfolio
 * Vanilla JavaScript implementation (No Frameworks)
 * Strict adherence to semantic DOM, accessibility, and high performance.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Portfolio Data (Customized for ABDEX's 3 Healthcare Systems) ---
  const projectsData = [
    {
      id: 'hospital-management-system',
      title: 'Hospital Management System',
      category: 'hospital-system',
      categoryLabel: 'Hospital System',
      summary: 'Comprehensive clinical operations, ward allocation, and physician workflow dashboard.',
      description: 'A robust web-based hospital information system designed for clinical workflow orchestration. Integrates patient bed allocation, physician round logs, emergency department triage, clinical record transfers, and real-time operational analytics.',
      image: '/assets/images/hospital-management-system.jpg',
      fallbackImage: '/assets/images/placeholder-hospital.svg',
      tags: ['Healthcare System', 'Clinical Workflows', 'Dashboard', 'Role Permissions', 'HTML5/JS'],
      client: 'Healthcare Network',
      year: '2026',
      imageSlotNote: 'Image slot: /assets/images/hospital-management-system.jpg'
    },
    {
      id: 'patient-registration-system',
      title: 'Patient Registration System',
      category: 'patient-system',
      categoryLabel: 'Patient Registration',
      summary: 'Streamlined digital patient intake, appointment triage, and biometric records verification.',
      description: 'A responsive, accessible web application for rapid patient registration and intake triage. Features multi-step medical history collection, insurance pre-authorization check, emergency priority queues, and touch-optimized self-service kiosks.',
      image: '/assets/images/patient-registration-system.jpg',
      fallbackImage: '/assets/images/placeholder-patient.svg',
      tags: ['Patient Portal', 'Accessible Forms', 'Responsive UI', 'Data Validation', 'CSS3'],
      client: 'Metropolitan Medical Center',
      year: '2026',
      imageSlotNote: 'Image slot: /assets/images/patient-registration-system.jpg'
    },
    {
      id: 'pharmacy-management-system',
      title: 'Pharmacy Management System',
      category: 'pharmacy-system',
      categoryLabel: 'Pharmacy System',
      summary: 'Prescription fulfillment, pharmaceutical stock control, and drug dispensing tracking.',
      description: 'An enterprise pharmaceutical management and inventory platform. Automates batch expiration warnings, supplier re-orders, barcode dispensing verification, inventory auditing, and daily prescription dispensing reconciliations.',
      image: '/assets/images/pharmacy-management-system.jpg',
      fallbackImage: '/assets/images/placeholder-pharmacy.svg',
      tags: ['Inventory System', 'Prescription Fulfillment', 'Audit Trails', 'Modern JS', 'POS'],
      client: 'Apex Care Pharmacy',
      year: '2026',
      imageSlotNote: 'Image slot: /assets/images/pharmacy-management-system.jpg'
    }
  ];

  // --- 2. Navigation & Sticky Header ---
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('mobile-open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // Active Navigation Spy
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => navObserver.observe(section));

  // --- 3. Dynamic Portfolio Rendering & Custom Image Handling ---
  const portfolioGrid = document.getElementById('portfolio-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Hidden file input for uploading custom project images
  const projectImgInput = document.createElement('input');
  projectImgInput.type = 'file';
  projectImgInput.accept = 'image/*';
  projectImgInput.style.display = 'none';
  projectImgInput.id = 'project-image-input';
  document.body.appendChild(projectImgInput);

  let targetProjectIdForUpload = null;

  projectImgInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file && targetProjectIdForUpload) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl && typeof dataUrl === 'string') {
          try {
            localStorage.setItem(`abdex_project_img_${targetProjectIdForUpload}`, dataUrl);
          } catch (err) {
            console.warn('LocalStorage quota reached; image will be displayed for this session.');
          }
          renderPortfolio(getActiveFilter());
          // Update modal if currently open
          if (modal?.classList.contains('open') && currentOpenProjectId === targetProjectIdForUpload) {
            if (modalImg) modalImg.src = dataUrl;
          }
        }
      };
      reader.readAsDataURL(file);
    }
  });

  function getActiveFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.getAttribute('data-filter') || 'all' : 'all';
  }

  function getProjectImageSrc(project) {
    const customImg = localStorage.getItem(`abdex_project_img_${project.id}`);
    return customImg || project.image;
  }

  function renderPortfolio(category = 'all') {
    if (!portfolioGrid) return;
    portfolioGrid.innerHTML = '';

    const filtered = category === 'all'
      ? projectsData
      : projectsData.filter((p) => p.category === category);

    filtered.forEach((project, index) => {
      const card = document.createElement('article');
      card.className = `portfolio-card reveal-item revealed delay-${(index % 3) + 1}`;
      card.setAttribute('data-category', project.category);
      card.setAttribute('data-id', project.id);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View details for ${project.title}`);

      const currentSrc = getProjectImageSrc(project);

      card.innerHTML = `
        <div class="portfolio-thumbnail-wrap">
          <img
            id="thumb-${project.id}"
            src="${currentSrc}"
            alt="${project.title} screenshot"
            loading="lazy"
            onerror="this.src='${project.fallbackImage}'"
          />
          <div class="portfolio-overlay">
            <span class="portfolio-category-tag">${project.categoryLabel}</span>
            <h3 class="portfolio-card-title">${project.title}</h3>
            <p class="portfolio-card-desc">${project.summary}</p>
            <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
              <span class="portfolio-card-link">
                View Project
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
              <button
                type="button"
                class="card-upload-btn"
                data-project-id="${project.id}"
                title="Select your prepared image file for this system"
                style="font-size: 0.72rem; padding: 0.25rem 0.6rem; background: rgba(59,130,246,0.3); border: 1px solid rgba(255,255,255,0.4); border-radius: 4px; color: #fff; cursor: pointer;"
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
        <div class="portfolio-card-body">
          <h3 class="portfolio-bottom-title">${project.title}</h3>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem;">
            <span class="portfolio-bottom-category">${project.categoryLabel}</span>
            <span style="font-size: 0.75rem; color: #64748b; font-family: var(--font-display);">2026</span>
          </div>
        </div>
      `;

      // Upload button handler (stops card modal propagation)
      const uploadBtn = card.querySelector('.card-upload-btn');
      uploadBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        targetProjectIdForUpload = project.id;
        projectImgInput.click();
      });

      // Open Modal on card click or Enter key
      const openModal = () => openProjectModal(project.id);
      card.addEventListener('click', openModal);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      });

      portfolioGrid.appendChild(card);
    });
  }

  // Filter click handlers
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderPortfolio(filter);
    });
  });

  // Initial portfolio render
  renderPortfolio('all');

  // --- 4. Project Details Modal (Lightbox) ---
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalClient = document.getElementById('modal-client');
  const modalYear = document.getElementById('modal-year');
  const modalDesc = document.getElementById('modal-desc');
  const modalTags = document.getElementById('modal-tags');
  let currentOpenProjectId = null;

  function openProjectModal(projectId) {
    const project = projectsData.find((p) => p.id === projectId);
    if (!project || !modal) return;
    currentOpenProjectId = projectId;

    if (modalImg) {
      modalImg.src = getProjectImageSrc(project);
      modalImg.alt = project.title;
      modalImg.onerror = () => {
        modalImg.src = project.fallbackImage;
      };
    }
    if (modalTitle) modalTitle.textContent = project.title;
    if (modalCategory) modalCategory.textContent = project.categoryLabel;
    if (modalClient) modalClient.textContent = project.client;
    if (modalYear) modalYear.textContent = project.year;
    if (modalDesc) {
      modalDesc.innerHTML = `
        <p style="margin-bottom: 1rem;">${project.description}</p>
        <div style="margin-top: 1.25rem; padding: 0.9rem 1.1rem; background-color: #f1f5f9; border-radius: 6px; border: 1px dashed #cbd5e1; font-size: 0.85rem; color: #475569; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <strong>Prepared Image Location:</strong> <code>${project.image}</code>
          </div>
          <button type="button" id="modal-upload-btn" class="custom-photo-btn" style="padding: 0.35rem 0.75rem;">
            Upload My Image File
          </button>
        </div>
      `;
      // Wire modal upload button
      const modalUploadBtn = document.getElementById('modal-upload-btn');
      modalUploadBtn?.addEventListener('click', () => {
        targetProjectIdForUpload = project.id;
        projectImgInput.click();
      });
    }

    if (modalTags) {
      modalTags.innerHTML = project.tags
        .map((tag) => `<span class="modal-tag">${tag}</span>`)
        .join('');
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalCloseBtn?.focus();
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentOpenProjectId = null;
  }

  modalCloseBtn?.addEventListener('click', closeProjectModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // --- 5. Portrait Customizer / Persistence ---
  const portraitHero = document.getElementById('hero-portrait-img');
  const portraitAbout = document.getElementById('about-portrait-img');
  const photoInput = document.getElementById('user-photo-input');
  const changePhotoBtn = document.getElementById('change-photo-btn');

  const savedPhoto = localStorage.getItem('abdex_custom_portrait');
  if (savedPhoto) {
    if (portraitHero) portraitHero.src = savedPhoto;
    if (portraitAbout) portraitAbout.src = savedPhoto;
  }

  if (changePhotoBtn && photoInput) {
    changePhotoBtn.addEventListener('click', () => {
      photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (result && typeof result === 'string') {
            if (portraitHero) portraitHero.src = result;
            if (portraitAbout) portraitAbout.src = result;
            try {
              localStorage.setItem('abdex_custom_portrait', result);
            } catch (err) {
              console.warn('Storage quota exceeded, photo displayed for current session.');
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // --- 6. Contact Form Validation & Submission ---
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  function clearErrors() {
    [nameInput, emailInput, messageInput].forEach((input) => {
      input?.classList.remove('has-error');
    });
    [nameError, emailError, messageError].forEach((err) => {
      if (err) {
        err.textContent = '';
        err.classList.remove('visible');
      }
    });
    if (formStatus) {
      formStatus.textContent = '';
      formStatus.className = 'form-status-alert';
    }
  }

  nameInput?.addEventListener('input', () => {
    nameInput.classList.remove('has-error');
    nameError?.classList.remove('visible');
  });

  emailInput?.addEventListener('input', () => {
    emailInput.classList.remove('has-error');
    emailError?.classList.remove('visible');
  });

  messageInput?.addEventListener('input', () => {
    messageInput.classList.remove('has-error');
    messageError?.classList.remove('visible');
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let hasError = false;
      const nameVal = nameInput?.value.trim() || '';
      const emailVal = emailInput?.value.trim() || '';
      const msgVal = messageInput?.value.trim() || '';

      if (!nameVal) {
        if (nameError) {
          nameError.textContent = 'Please enter your full name.';
          nameError.classList.add('visible');
        }
        nameInput?.classList.add('has-error');
        hasError = true;
      } else if (nameVal.length < 2) {
        if (nameError) {
          nameError.textContent = 'Full name must be at least 2 characters.';
          nameError.classList.add('visible');
        }
        nameInput?.classList.add('has-error');
        hasError = true;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        if (emailError) {
          emailError.textContent = 'Please enter your email address.';
          emailError.classList.add('visible');
        }
        emailInput?.classList.add('has-error');
        hasError = true;
      } else if (!emailRegex.test(emailVal)) {
        if (emailError) {
          emailError.textContent = 'Please provide a valid email format (e.g. name@example.com).';
          emailError.classList.add('visible');
        }
        emailInput?.classList.add('has-error');
        hasError = true;
      }

      if (!msgVal) {
        if (messageError) {
          messageError.textContent = 'Please enter a message.';
          messageError.classList.add('visible');
        }
        messageInput?.classList.add('has-error');
        hasError = true;
      } else if (msgVal.length < 10) {
        if (messageError) {
          messageError.textContent = 'Message should contain at least 10 characters.';
          messageError.classList.add('visible');
        }
        messageInput?.classList.add('has-error');
        hasError = true;
      }

      if (hasError) {
        if (nameInput?.classList.contains('has-error')) nameInput.focus();
        else if (emailInput?.classList.contains('has-error')) emailInput.focus();
        else if (messageInput?.classList.contains('has-error')) messageInput.focus();
        return;
      }

      if (formStatus && submitBtn) {
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Preparing Message...';
        submitBtn.setAttribute('disabled', 'true');

        setTimeout(() => {
          formStatus.textContent = `Thank you, ${nameVal}! Your message has been prepared for Abdex (abdexadem815@gmail.com). We are launching your default email client now.`;
          formStatus.className = 'form-status-alert success';
          submitBtn.textContent = originalBtnText;
          submitBtn.removeAttribute('disabled');

          const subject = encodeURIComponent(`Project Inquiry from ${nameVal}`);
          const body = encodeURIComponent(`Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${msgVal}`);
          window.location.href = `mailto:abdexadem815@gmail.com?subject=${subject}&body=${body}`;

          contactForm.reset();
        }, 600);
      }
    });
  }

  // --- 7. Scroll Reveal Observer ---
  const reveals = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  reveals.forEach((el) => revealObserver.observe(el));
});
