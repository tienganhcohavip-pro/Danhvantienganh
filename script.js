// 1. Dấu mốc dữ liệu gốc của 16 bài học (Bạn có thể đổi tên file link tương ứng ở trường 'linkUrl')
const defaultLessons = [
    { id: 1, type: "Nguyên âm ngắn", detail: "/æ/", icon: "🍎", audioWord: "apple.mp3", linkUrl: "lesson1.html" },
    { id: 2, type: "Nguyên âm ngắn", detail: "/e/, /ɪ/", icon: "🐘", audioWord: "elephant.mp3", linkUrl: "lesson2.html" },
    { id: 3, type: "Nguyên âm ngắn", detail: "/ɒ/, /ʌ/", icon: "🐙", audioWord: "octopus.mp3", linkUrl: "lesson3.html" },
    { id: 4, type: "Nguyên âm ngắn", detail: "/ʊ/", icon: "🦆", audioWord: "duck.mp3", linkUrl: "lesson4.html" },
    { id: 5, type: "Nguyên âm dài", detail: "/i:/, /ɑ:/", icon: "⭐", audioWord: "star.mp3", linkUrl: "lesson5.html" },
    { id: 6, type: "Nguyên âm dài", detail: "/ɔ:/, /u:/, /ɜ:/", icon: "🌙", audioWord: "moon.mp3", linkUrl: "lesson6.html" },
    { id: 7, type: "Nguyên âm đôi", detail: "/aɪ/, /eɪ/, /ɔɪ/", icon: "🚲", audioWord: "bike.mp3", linkUrl: "lesson7.html" },
    { id: 8, type: "Nguyên âm đôi", detail: "/aʊ/, /əʊ/, /eə/", icon: "🏠", audioWord: "home.mp3", linkUrl: "lesson8.html" },
    { id: 9, type: "Phụ âm ghép", detail: "/bl/, /cl/, /br/, /cr/", icon: "📘", audioWord: "blue.mp3", linkUrl: "lesson9.html" },
    { id: 10, type: "Phụ âm ghép", detail: "/sh/, /ch/, /ph/, /wh/", icon: "🐟", audioWord: "fish.mp3", linkUrl: "lesson10.html" },
    { id: 11, type: "Phụ âm ghép", detail: "/st/, /sk/, /sp/", icon: "🕷️", audioWord: "spider.mp3", linkUrl: "lesson11.html" },
    { id: 12, type: "Phụ âm ghép", detail: "/tr/, /dr/, /gr/", icon: "🌳", audioWord: "tree.mp3", linkUrl: "lesson12.html" },
    { id: 13, type: "Kết hợp chữ", detail: "/ar/, /er/, /ir/", icon: "🐦", audioWord: "bird.mp3", linkUrl: "lesson13.html" },
    { id: 14, type: "Kết hợp chữ", detail: "/or/, /ur/, /air/", icon: "🌽", audioWord: "corn.mp3", linkUrl: "lesson14.html" },
    { id: 15, type: "Kết hợp chữ", detail: "/ear/, /eer/, /our/", icon: "👂", audioWord: "ear.mp3", linkUrl: "lesson15.html" },
    { id: 16, type: "Âm câm & Cụm vần đặc biệt", detail: "Cụm đặc biệt", icon: "✨", audioWord: "ghost.mp3", linkUrl: "lesson16.html" }
];

// 2. Khởi tạo dữ liệu tiến độ từ LocalStorage
let userProgress = JSON.parse(localStorage.getItem('english_spell_progress')) || {
    completedLessons: [], 
    currentLessonId: 1,   
    stars: 0,             
    coins: 0              
};

const container = document.getElementById('lesson-container');

// 3. Hàm cập nhật Thanh tiến độ & Điểm thưởng Gamification phía trên cùng
function updateTopProgressBar() {
    const totalLessons = defaultLessons.length;
    const completedCount = userProgress.completedLessons.length;
    const percent = Math.round((completedCount / totalLessons) * 100);
    
    document.getElementById('progress-percent').innerText = `${percent}% Hoàn thành`;
    document.querySelector('.progress-fill').style.width = `${percent}%`;
    
    userProgress.stars = completedCount * 3;
    userProgress.coins = completedCount * 20;
    
    document.getElementById('star-count').innerText = userProgress.stars;
    document.getElementById('coin-count').innerText = userProgress.coins;

    localStorage.setItem('english_spell_progress', JSON.stringify(userProgress));
}

// 4. Hàm Render danh sách bài học bằng các THẺ LINK (Thẻ <a>)
function renderLessons() {
    container.innerHTML = ""; 
    
    defaultLessons.forEach(lesson => {
        // TẠO THẺ THAY THẾ: Thay vì thẻ 'div', ta dùng thẻ 'a' để tạo link chuẩn SEO và trình duyệt
        const cardLink = document.createElement('a');
        
        // Cấu hình link trực tiếp đến trang bài học
        cardLink.href = lesson.linkUrl; 
        
        // Xác định trạng thái để gán màu sắc giao diện tương ứng
        let statusClass = 'not-started';
        let badgeHTML = `<div class="status-badge wait"><i class="far fa-circle"></i></div>`;
        let progressText = 'Chưa học';

        if (userProgress.completedLessons.includes(lesson.id)) {
            statusClass = 'completed';
            badgeHTML = `<div class="status-badge done"><i class="fas fa-check-circle"></i></div>`;
            progressText = 'Đã hoàn thành 🎉';
        } else if (lesson.id === userProgress.currentLessonId) {
            statusClass = 'in-progress';
            badgeHTML = `<div class="status-badge"><i class="fas fa-spinner fa-spin text-warning"></i></div>`;
            progressText = 'Đang học 📝';
        }

        cardLink.className = `lesson-card ${statusClass}`;

        // Cấu trúc nội dung hiển thị của Box bài học
        cardLink.innerHTML = `
            ${badgeHTML}
            <span class="lesson-icon">${lesson.icon}</span>
            <div class="lesson-number">Lesson ${lesson.id}</div>
            <p class="lesson-title-text">${lesson.type}<br><strong>${lesson.detail}</strong></p>
            <div class="mini-progress">${progressText}</div>
            <div class="card-actions">
                <span class="btn-action btn-practice">
                    <i class="fas fa-book-open"></i> Vào học
                </span>
                <button class="btn-action btn-listen" onclick="playAudio('${lesson.audioWord}', event, this)">
                    <i class="fas fa-volume-up"></i> Nghe âm
                </button>
            </div>
        `;
        
        // Sự kiện xử lý lưu và cập nhật tiến độ trước khi trình duyệt chuyển hướng đi sang link bài mới
        cardLink.addEventListener('click', (e) => {
            // Nếu bé bấm trúng nút nghe âm thanh thì không chuyển trang, không tính tiến độ bài học
            if (e.target.closest('.btn-listen')) {
                return; 
            }
            
            // Ngăn chặn chuyển trang ngay lập tức để kịp xử lý lưu dữ liệu tiến độ vào LocalStorage
            e.preventDefault();

            // Ghi nhận bài học này đã hoàn thành khi click
            if (!userProgress.completedLessons.includes(lesson.id)) {
                userProgress.completedLessons.push(lesson.id);
            }
            
            // Chuyển bài học hiện tại sang bài tiếp theo nếu phù hợp
            if (lesson.id === userProgress.currentLessonId && lesson.id < defaultLessons.length) {
                userProgress.currentLessonId = lesson.id + 1;
            }

            // Lưu lại bộ nhớ và chuyển trang thủ công an toàn
            updateTopProgressBar();
            window.location.href = lesson.linkUrl;
        });

        container.appendChild(cardLink);
    });
}

// 5. Hàm phát giọng đọc âm thanh
function playAudio(audioFile, event, buttonSrc) {
    event.preventDefault();  // Ngăn thẻ <a> chuyển trang khi bấm nút nghe âm
    event.stopPropagation(); // Ngăn sự kiện click lan truyền ra toàn bộ Box
    
    buttonSrc.style.transform = "scale(1.15)";
    setTimeout(() => { buttonSrc.style.transform = "scale(1)"; }, 200);

    const utterance = new SpeechSynthesisUtterance("Let's practice this sound");
    utterance.lang = "en-US";
    utterance.rate = 0.85; 
    window.speechSynthesis.speak(utterance);
}

// Khởi chạy ứng dụng khi load xong trang menu chủ
document.addEventListener("DOMContentLoaded", () => {
    updateTopProgressBar();
    renderLessons();
});