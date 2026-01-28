document.addEventListener("DOMContentLoaded", () => {
  // === 1. KHỞI TẠO CÁC BIẾN ===
  const customSelect = document.querySelector(".custom-select");
  const searchInput = document.getElementById("searchInput");
  const allCards = document.querySelectorAll(".card-container .card");
  
  let currentFilter = "all";
  let currentSearchTerm = "";

  // Tạo bộ đệm tên danh mục (chỉ chạy nếu có customSelect)
  const categoryNameMap = new Map();
  if (customSelect) {
    const optionsList = customSelect.querySelectorAll(".options div");
    optionsList.forEach(option => {
      if (option.dataset.value !== "all") {
        categoryNameMap.set(option.dataset.value, option.textContent);
      }
    });
  }

  /**
   * Hàm chuẩn hóa văn bản Tiếng Việt
   */
  function normalizeText(text) {
    return text.toLowerCase()
               .normalize("NFD")
               .replace(/[\u0300-\u036f]/g, "")
               .replace(/đ/g, "d");
  }

  /**
   * HÀM LỌC CHÍNH - Đã sửa để tập trung tìm kiếm theo Tên (h3)
   */
  function filterCards() {
    const normalizedSearchTerm = normalizeText(currentSearchTerm);

    allCards.forEach(card => {
      // --- PHẦN 1: LẤY TIÊU ĐỀ (H3) ---
      const titleElement = card.querySelector(".card-text h3");
      const cardTitle = titleElement ? titleElement.innerText : "";
      const normalizedCardTitle = normalizeText(cardTitle);

      // --- PHẦN 2: KIỂM TRA ĐIỀU KIỆN ---
      
      // 2.1. Khớp tìm kiếm (Chỉ so sánh với Tiêu đề)
      const searchMatch = normalizedCardTitle.includes(normalizedSearchTerm);

      // 2.2. Khớp danh mục (Nếu không có dropdown thì mặc định là true)
      const cardTypeString = card.dataset.type || "";
      const cardTypesArray = cardTypeString.split(' ').filter(t => t !== "");
      const filterMatch = !customSelect || (currentFilter === "all") || cardTypesArray.includes(currentFilter);

      // --- PHẦN 3: HIỂN THỊ ---
      if (filterMatch && searchMatch) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  // === 2. GẮN SỰ KIỆN LỌC & TÌM KIẾM ===

  // Sự kiện Dropdown (Chỉ chạy nếu có customSelect trên trang)
  if (customSelect) {
    const selected = customSelect.querySelector(".selected");
    const optionsList = customSelect.querySelectorAll(".options div");

    selected.addEventListener("click", () => {
      customSelect.classList.toggle("active");
    });

    optionsList.forEach(option => {
      option.addEventListener("click", () => {
        selected.textContent = option.textContent;
        customSelect.classList.remove("active");
        currentFilter = option.dataset.value;
        filterCards(); 
      });
    });

    document.addEventListener("click", e => {
      if (!customSelect.contains(e.target)) {
        customSelect.classList.remove("active");
      }
    });
  }

  // Sự kiện ô tìm kiếm
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      currentSearchTerm = searchInput.value;
      filterCards();
    });
  }

  // === 3. LOGIC ÂM NHẠC ĐỊA PHƯƠNG (GIỮ NGUYÊN) ===
  const audioToggleBtn = document.getElementById("audioToggleBtn"); 
  const songListContainer = document.getElementById("songListContainer"); 
  const songItems = document.querySelectorAll(".song-item"); 
  const playerWrapper = document.getElementById("playerWrapper");
  const localPlayer = document.getElementById("localAudioPlayer");
  const audioCloseBtn = document.getElementById("audioCloseBtn");
  const currentPlayerTitle = document.getElementById("currentPlayerTitle");

  if (audioToggleBtn && songListContainer && songItems.length > 0 && playerWrapper && localPlayer) {
    audioToggleBtn.addEventListener("click", () => {
      audioToggleBtn.classList.toggle("active");
      songListContainer.style.display = (songListContainer.style.display === "block") ? "none" : "block";
    });

    songItems.forEach(item => {
      item.addEventListener("click", () => {
        const songSrc = item.dataset.src;
        const songTitle = item.dataset.title;
        localPlayer.src = songSrc;
        currentPlayerTitle.textContent = songTitle;
        playerWrapper.style.display = "block";
        songListContainer.style.display = "none";
        audioToggleBtn.classList.remove("active");
        localPlayer.load();
        localPlayer.play();
      });
    });

    if (audioCloseBtn) {
      audioCloseBtn.addEventListener("click", () => {
        playerWrapper.style.display = "none";
        localPlayer.pause();
        localPlayer.currentTime = 0;
        localPlayer.src = ""; 
        songListContainer.style.display = "block";
        audioToggleBtn.classList.add("active");
      });
    }
  }

  // Chạy bộ lọc lần đầu
  filterCards();
  // === 4. LOGIC NÚT XEM CHI TIẾT (MỚI THÊM) ===
  const toggleButtons = document.querySelectorAll(".btn-toggle");

    toggleButtons.forEach(btn => {
        btn.addEventListener("click", () => {
        // Tìm thẻ p (card-desc) nằm ngay sau nút bấm
        const desc = btn.nextElementSibling;
        
        if (desc && desc.classList.contains("card-desc")) {
            // Toggle class 'show' để hiện/ẩn
            desc.classList.toggle("show");

            // Đổi tên nút
            if (desc.classList.contains("show")) {
            btn.textContent = "Thu gọn";
            btn.style.backgroundColor = "#555"; // (Tuỳ chọn) Đổi màu nút khi đang mở
            } else {
            btn.textContent = "Xem chi tiết";
            btn.style.backgroundColor = ""; // Trả về màu CSS mặc định
            }
        }
        });
    });
  // === 5. LOGIC MENU MOBILE (MỚI THÊM) ===
  const menuToggle = document.getElementById('mobile-menu');
  const navList = document.querySelector('.nav-list');

  if (menuToggle && navList) {
      menuToggle.addEventListener('click', () => {
          // Toggle class 'active' cho danh sách để hiện/ẩn
          navList.classList.toggle('active');
          // Toggle class 'is-active' cho nút bấm để tạo hiệu ứng xoay X
          menuToggle.classList.toggle('is-active');
      });
  }
});