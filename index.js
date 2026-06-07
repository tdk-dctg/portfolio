/**
 * INDEX.JS - Digital Portfolio của Trần Đăng Khoa
 * Chức năng:
 *  1. Khởi tạo thư viện AOS (Animate On Scroll)
 *  2. Hiệu ứng Navbar khi cuộn trang (Glassmorphism)
 *  3. Active nav-link theo section đang xem (Intersection Observer)
 *  4. Hamburger menu di động
 *  5. Nút Scroll to Top
 *  6. Tạo các hạt bong bóng bay toàn trang (Particles)
 *  7. Hiệu ứng nghiêng nhẹ cho project cards (Tilt)
 *  8. Counter animation cho Hero metrics
 *  9. Hệ thống Modal đóng/mở tài liệu giả lập Word/PDF
 *  10. Lightbox phóng to ảnh minh chứng
 *  11. Logic chuyển đổi giao diện sáng tối thích ứng
 *  12. Logic điều khiển Slider Bài 1
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. KHỞI TẠO AOS (Animate On Scroll)
  // ============================================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      offset: 80,
      easing: 'ease-out-cubic',
    });
  }

  // ============================================================
  // 2. NAVBAR - Thêm class .scrolled khi cuộn xuống
  // ============================================================
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ============================================================
  // 3. ACTIVE NAV LINK - Highlight link theo section đang xem
  // ============================================================
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  });

  sections.forEach(section => sectionObserver.observe(section));

  // ============================================================
  // 4. HAMBURGER MENU - Menu di động
  // ============================================================
  const hamburgerBtn = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  });

  navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinksEl.classList.contains('open')) {
      navLinksEl.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // ============================================================
  // 5. NÚT SCROLL TO TOP
  // ============================================================
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  function handleScrollTopVisibility() {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
  handleScrollTopVisibility();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================================
  // 6. PARTICLES GENERATOR - Bong bóng bay toàn trang
  // ============================================================
  const particlesContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 55;
  const PARTICLE_COLORS = [
    'rgba(139,92,246,',   // violet
    'rgba(236,72,153,',   // hot pink
    'rgba(0,240,255,',    // electric cyan
    'rgba(255,255,255,',  // white
    'rgba(168,85,247,',   // purple
  ];

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  if (particlesContainer) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = randomBetween(4, 14);
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const opacity = randomBetween(0.12, 0.45);
      const duration = randomBetween(8, 18);
      const delay = randomBetween(0, duration);
      const drift = randomBetween(-40, 40);
      const posX = randomBetween(1, 99);

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color}${opacity});
        left: ${posX}%;
        --duration: ${duration}s;
        --delay: -${delay}s;
        --opacity: ${opacity};
        --drift: ${drift}px;
      `;

      particlesContainer.appendChild(particle);
    }
  }

  // ============================================================
  // 7. SMOOTH TILT EFFECT cho project cards và about cards
  // ============================================================
  const tiltElements = document.querySelectorAll('.project-card, .about-card, .ethics-card');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `
        translateY(-5px)
        rotateX(${-y * 6}deg)
        rotateY(${x * 6}deg)
      `;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.35s ease';
    });
  });

  // ============================================================
  // 8. COUNTER ANIMATION - Đếm số trong hero metrics
  // ============================================================
  function animateCounter(el, target, duration = 1200) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statTasks = document.getElementById('statTasks');
          const statPhotos = document.getElementById('statPhotos');
          const statPrompts = document.getElementById('statPrompts');

          if (statTasks) animateCounter(statTasks, 6, 900);
          if (statPhotos) animateCounter(statPhotos, 36, 1400);
          if (statPrompts) animateCounter(statPrompts, 50, 1100);

          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(metricsSection);
  }

  // ============================================================
  // 9. MODALS SYSTEM - Đóng mở cửa sổ nổi chứa tài liệu
  // ============================================================
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  const modalOverlays = document.querySelectorAll('.doc-modal-overlay');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Ngăn cuộn body
      }
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.remove('active');
        document.body.style.overflow = ''; // Cho phép cuộn body trở lại
      }
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Đóng modal khi nhấn ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.doc-modal-overlay.active');
      if (activeModal) {
        activeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // ============================================================
  // 10. LIGHTBOX - Phóng to ảnh minh chứng
  // ============================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  const triggers = document.querySelectorAll('[data-lightbox], .deck-slide-card img, .timeline-img-card img');

  triggers.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = img.getAttribute('src');
      const caption = img.getAttribute('data-lightbox') || img.getAttribute('alt') || 'Ảnh minh chứng thực hành';
      
      if (lightboxImg && lightbox) {
        lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.style.display = 'flex';
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxClose) {
        lightbox.style.display = 'none';
      }
    });
  }

  // ============================================================
  // 11. CHUYỂN ĐỔI GIAO DIỆN SÁNG TỐI
  // ============================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    });

    // Tự động khôi phục theme đã lưu
    if (localStorage.getItem('portfolio-theme') === 'light') {
      document.body.classList.add('light-theme');
    }
  }

  // ============================================================
  // 12. LOGIC CAROUSEL SLIDER BÀI 1
  // ============================================================
  const task1Slides = [
    { num: "01", desc: "Mở File Explorer và kiểm tra dung lượng các ổ đĩa trên máy tính của bạn.", img: "assets/bai1_quan-ly-tep-thu-muc_image.png" },
    { num: "02", desc: "Truy cập vào phân vùng ổ đĩa D: để chuẩn bị thiết lập không gian làm việc thực hành.", img: "assets/bai1_quan-ly-tep-thu-muc_image2.png" },
    { num: "03", desc: "Tạo thư mục chính phục vụ học tập có cấu trúc tên thống nhất: ThucHanh_TranDangKhoa.", img: "assets/bai1_quan-ly-tep-thu-muc_image3.png" },
    { num: "04", desc: "Nhập đúp chuột để truy cập vào thư mục vừa tạo, chuẩn bị tổ chức dữ liệu.", img: "assets/bai1_quan-ly-tep-thu-muc_image4.png" },
    { num: "05", desc: "Click chuột phải -> New -> Text Document để tạo tệp văn bản mới và đặt tên là GhiChu.txt.", img: "assets/bai1_quan-ly-tep-thu-muc_image5.png" },
    { num: "06", desc: "Đổi tên tệp tin (Rename) thành GhiChuQuanTrong.txt để làm nổi bật mức độ ưu tiên.", img: "assets/bai1_quan-ly-tep-thu-muc_image6.png" },
    { num: "07", desc: "Sao chép tệp tin (Copy) đã tạo để thực hiện lưu trữ dự phòng dữ liệu.", img: "assets/bai1_quan-ly-tep-thu-muc_image7.png" },
    { num: "08", desc: "Tạo một thư mục con tên là TaiLieuLuuTru để tối ưu hóa việc phân cấp lưu trữ.", img: "assets/bai1_quan-ly-tep-thu-muc_image8.png" },
    { num: "09", desc: "Di chuyển tệp GhiChuQuanTrong.txt vào thư mục con TaiLieuLuuTru vừa tạo.", img: "assets/bai1_quan-ly-tep-thu-muc_image9.png" },
    { num: "10", desc: "Xóa tệp tin dư thừa không còn sử dụng (Delete) để đưa tệp vào Recycle Bin hệ thống.", img: "assets/bai1_quan-ly-tep-thu-muc_imagea.png" },
    { num: "11", desc: "Mở Recycle Bin và thực hiện khôi phục tệp tin (Restore) về vị trí ban đầu.", img: "assets/bai1_quan-ly-tep-thu-muc_imageb.png" },
    { num: "12", desc: "Xem thuộc tính tệp tin (Properties) để kiểm tra kích thước và định dạng tệp tin.", img: "assets/bai1_quan-ly-tep-thu-muc_imagec.png" }
  ];

  let currentSlideIndex = 0;
  const slideNumEl = document.getElementById('slide-num');
  const slideDescEl = document.getElementById('slide-desc');
  const slideImgEl = document.getElementById('slide-img');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');

  function updateSlide(index) {
    if (!slideNumEl || !slideDescEl || !slideImgEl) return;
    
    currentSlideIndex = index;
    const slide = task1Slides[currentSlideIndex];
    
    slideNumEl.textContent = slide.num;
    slideDescEl.textContent = slide.desc;
    slideImgEl.src = slide.img;
    slideImgEl.setAttribute('data-lightbox', `Thao tác Bài 1 - Bước ${slide.num}: ${slide.desc}`);

    // Cập nhật dots active
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlideIndex);
    });
  }

  // Khởi tạo slider dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    task1Slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => updateSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      let idx = currentSlideIndex - 1;
      if (idx < 0) idx = task1Slides.length - 1;
      updateSlide(idx);
    });

    nextBtn.addEventListener('click', () => {
      let idx = currentSlideIndex + 1;
      if (idx >= task1Slides.length) idx = 0;
      updateSlide(idx);
    });
  }

});
