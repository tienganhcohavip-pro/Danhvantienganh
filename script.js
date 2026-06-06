// 1. Đồng bộ cấu trúc dữ liệu 17 bài học theo đúng thiết kế hình ảnh của bạn
const defaultLessons = [
    { id: 1, type: "Nguyên âm ngắn", detail: "/æ/", icon: "🍎", audioWord: "apple" },
    { id: 2, type: "Nguyên âm ngắn", detail: "/e/, /ɪ/", icon: "🐘", audioWord: "elephant" },
    { id: 3, type: "Nguyên âm ngắn", detail: "/ɒ/, /ʌ/", icon: "🐙", audioWord: "octopus" },
    { id: 4, type: "Nguyên âm ngắn", detail: "/ʊ/", icon: "🦆", audioWord: "duck" },
    { id: 5, type: "Nguyên âm dài", detail: "/i:/, /ɑ:/", icon: "⭐", audioWord: "star" },
    { id: 6, type: "Nguyên âm dài", detail: "/ɔ:/, /u:/, /ɜ:/", icon: "🌙", audioWord: "moon" },
    { id: 7, type: "Nguyên âm dài", detail: "/aɪ/, /eɪ/, /ɔɪ/", icon: "🚲", audioWord: "bike" },
    { id: 8, type: "Nguyên âm dài", detail: "/aʊ/, /əʊ/, /eə/", icon: "🏠", audioWord: "home" },
    { id: 9, type: "Phụ âm ghép", detail: "/bl/, /cl/, /br/, /cr/... ", icon: "📘", audioWord: "blue" },
    { id: 10, type: "Phụ âm ghép", detail: "/sh/, /ch/, /ph/, /wh/", icon: "🐟", audioWord: "fish" },
    { id: 11, type: "Phụ âm ghép", detail: "/st/, /sk/, /sp/", icon: "🕷️", audioWord: "spider" },
    { id: 12, type: "Phụ âm ghép", detail: "/tr/, /dr/, /gr/", icon: "🌳", audioWord: "tree" },
    { id: 13, type: "Kết hợp chữ", detail: "/ar/, /er/, /ir/", icon: "🐦", audioWord: "bird" },
    { id: 14, type: "Kết hợp chữ", detail: "/or/, /ur/, /air/", icon: "🌽", audioWord: "corn" },
    { id: 15, type: "Kết hợp chữ", detail: "/ear/, /eer/, /our/", icon: "👂", audioWord: "ear" },
    { id: 16, type: "Âm câm & Cụm vần đặc biệt", detail: "Cụm đặc biệt", icon: "✨", audioWord: "ghost" },
    { id: 17, type: "Review", detail: "Ôn tập tổng hợp", icon: "🏆", audioWord: "review" }
];

// 2. Kiểm tra bộ nhớ LocalStorage để giữ trạng thái khi làm mới trang
let userProgress = JSON.parse(localStorage.getItem('english_spell_progress')) || {
    completedLessons: [], 
    currentLessonId: 1,   
    stars: 0,             
    coins: 0              
};

const container = document.getElementById('lesson-container');

// 3. Hàm tính toán và cập nhật cấu trúc tiến độ Gamification ở trên đầu
function updateTopProgressBar() {
    const totalLessons = defaultLessons.length;
    const completedCount = userProgress.completedLessons.length;
    const percent = Math.round((completedCount / totalLessons) * 100);
    
    document.getElementById('progress-percent').innerText = `${percent}% Hoàn thành`;
    document.querySelector('.progress-fill').style.width = `${percent}%`;
    
    // Cách tính điểm game: mỗi bài hoàn thành nhận được 3 sao và 20 xu xu
    userProgress.stars = completedCount * 3;
    userProgress.coins = completedCount * 20;
    
    document.getElementById('star-count').innerText = userProgress.stars;
    document.getElementById('coin-count').innerText = userProgress.coins;

    localStorage.setItem('english_spell_progress', JSON.stringify(userProgress));
}

// 4. Hàm dựng giao diện danh sách bài học (Ngăn chặn lỗi chuyển hướng thẻ a bằng cấu trúc hàm)
function renderLessons() {
    container.innerHTML = ""; 
    
    defaultLessons.forEach(lesson => {
        // Định dạng chuỗi thêm số 0 đứng trước cho các bài học từ 1 đến 9: '01', '02'...'17'
        const formattedId = lesson.id < 10 ? '0' + lesson.id : lesson.id;

        const card = document.createElement('div');
        
        let statusClass = 'not-started';
        let badgeHTML = `<div class="status-badge wait"><i class="far fa-circle"></i></div>`;
        let progressText = 'Chưa học';

        // Xác định logic trạng thái học tập
        if (userProgress.completedLessons.includes(lesson.id)) {
            statusClass = 'completed';
            badgeHTML = `<div class="status-badge done"><i class="fas fa-check-circle"></i></div>`;
            progressText = 'Đã hoàn thành 🎉';
        } else if (lesson.id === userProgress.currentLessonId) {
            statusClass = 'in-progress';
            badgeHTML = `<div class="status-badge"><i class="fas fa-spinner fa-spin text-warning"></i></div>`;
            progressText = 'Đang học 📝';
        }

        card.className = `lesson-card ${statusClass}`;

        card.innerHTML = `
            ${badgeHTML}
            <span class="lesson-icon">${lesson.icon}</span>
            <div class="lesson-number">Lesson ${lesson.id}</div>
            <p class="lesson-title-text">${lesson.type}<br><strong>${lesson.detail}</strong></p>
            <div class="mini-progress">${progressText}</div>
            <div class="card-actions">
                <button class="btn-action btn-practice">
                    <i class="fas fa-book-open"></i> Vào học
                </button>
                <button class="btn-action btn-listen">
                    <i class="fas fa-volume-up"></i> Nghe âm
                </button>
            </div>
        `;
        
        // SỬA LỖI ĐIỀU HƯỚNG: Sử dụng giải pháp bắt sự kiện click an toàn qua hàm điều hướng nội bộ
        card.addEventListener('click', (e) => {
            const isListenBtn = e.target.closest('.btn-listen');
            
            if (isListenBtn) {
                // Nếu bé chỉ nhấn nút nghe, phát âm thanh và không chuyển trang
                playAudio(lesson.audioWord, isListenBtn);
            } else {
                // Thực hiện lưu tiến độ bài học trước, sau đó mới chuyển hướng đi
                processNavigation(lesson.id, formattedId);
            }
        });

        container.appendChild(card);
    });
}

// 5. Hàm xử lý trung gian lưu dữ liệu và kiểm soát chuyển hướng trang tránh lỗi 404
function processNavigation(lessonId, formattedId) {
    // 1. Cập nhật mảng lưu trữ các bài học đã qua
    if (!userProgress.completedLessons.includes(lessonId)) {
        userProgress.completedLessons.push(lessonId);
    }
    
    // 2. Chuyển chỉ mục bài học hiện tại lên bài tiếp theo
    if (lessonId === userProgress.currentLessonId && lessonId < defaultLessons.length) {
        userProgress.currentLessonId = lessonId + 1;
    }

    // 3. Thực thi đồng bộ ghi dữ liệu vào LocalStorage trước
    updateTopProgressBar();

    // 4. TÍNH TOÁN ĐƯỜNG DẪN TƯƠNG ĐỐI AN TOÀN CHO GITHUB PAGES:
    // Sử dụng đường dẫn không chứa ký tự lạ đầu chuỗi để tránh việc tìm sai cấp thư mục
    const targetUrl = `lesson${formattedId}.html`;
    
    console.log("Đang chuyển hướng an toàn tới file: " + targetUrl);
    window.location.href = targetUrl;
}

// 6. Hàm phát giọng đọc âm chuẩn cho trẻ em (Web Speech API kết hợp hiệu ứng nảy nút)
function playAudio(textToSpeak, element) {
    element.style.transform = "scale(1.15)";
    setTimeout(() => { element.style.transform = "scale(1)"; }, 150);

    // Xóa toàn bộ lệnh đọc cũ đang chạy dở để tránh xung đột âm thanh
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-US";
    utterance.rate = 0.8; // Tốc độ đọc chậm vừa phải giúp trẻ tiểu học nghe rõ từng âm tiết
    window.speechSynthesis.speak(utterance);
}

// Khởi chạy ứng dụng khi toàn bộ tài nguyên cây thư mục DOM được tải xong
document.addEventListener("DOMContentLoaded", () => {
    updateTopProgressBar();
    renderLessons();
});