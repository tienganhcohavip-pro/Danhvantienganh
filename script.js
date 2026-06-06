// 1. Dấu mốc dữ liệu gốc của 17 bài học (Đã cập nhật lên 17 bài theo cấu trúc file của bạn)
const defaultLessons = [
    { id: 1, type: "Nguyên âm ngắn", detail: "/æ/", icon: "🍎", audioWord: "apple.mp3" },
    { id: 2, type: "Nguyên âm ngắn", detail: "/e/, /ɪ/", icon: "🐘", audioWord: "elephant.mp3" },
    { id: 3, type: "Nguyên âm ngắn", detail: "/ɒ/, /ʌ/", icon: "🐙", audioWord: "octopus.mp3" },
    { id: 4, type: "Nguyên âm ngắn", detail: "/ʊ/", icon: "🦆", audioWord: "duck.mp3" },
    { id: 5, type: "Nguyên âm dài", detail: "/i:/, /ɑ:/", icon: "⭐", audioWord: "star.mp3" },
    { id: 6, type: "Nguyên âm dài", detail: "/ɔ:/, /u:/, /ɜ:/", icon: "🌙", audioWord: "moon.mp3" },
    { id: 7, type: "Nguyên âm đôi", detail: "/aɪ/, /eɪ/, /ɔɪ/", icon: "🚲", audioWord: "bike.mp3" },
    { id: 8, type: "Nguyên âm đôi", detail: "/aʊ/, /əʊ/, /eə/", icon: "🏠", audioWord: "home.mp3" },
    { id: 9, type: "Phụ âm ghép", detail: "/bl/, /cl/, /br/, /cr/", icon: "📘", audioWord: "blue.mp3" },
    { id: 10, type: "Phụ âm ghép", detail: "/sh/, /ch/, /ph/, /wh/", icon: "🐟", audioWord: "fish.mp3" },
    { id: 11, type: "Phụ âm ghép", detail: "/st/, /sk/, /sp/", icon: "🕷️", audioWord: "spider.mp3" },
    { id: 12, type: "Phụ âm ghép", detail: "/tr/, /dr/, /gr/", icon: "🌳", audioWord: "tree.mp3" },
    { id: 13, type: "Kết hợp chữ", detail: "/ar/, /er/, /ir/", icon: "🐦", audioWord: "bird.mp3" },
    { id: 14, type: "Kết hợp chữ", detail: "/or/, /ur/, /air/", icon: "🌽", audioWord: "corn.mp3" },
    { id: 15, type: "Kết hợp chữ", detail: "/ear/, /eer/, /our/", icon: "👂", audioWord: "ear.mp3" },
    { id: 16, type: "Âm câm & Cụm vần đặc biệt", detail: "Cụm đặc biệt", icon: "✨", audioWord: "ghost.mp3" },
    { id: 17, type: "Review ôn tập tổng hợp", detail: "Ôn tập tổng hợp", icon: "🏆", audioWord: "review.mp3" } // Thêm Bài 17
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

// 4. Hàm Render danh sách bài học bằng các THẺ LINK chuẩn format lesson01 -> lesson17
function renderLessons() {
    container.innerHTML = ""; 
    
    defaultLessons.forEach(lesson => {
        // MẸO XỬ LÝ SỐ 0: Nếu ID < 10 (1-9) thì thêm chữ "0" phía trước thành "01", "02"... 
        // Nếu ID từ 10 trở lên thì giữ nguyên.
        const formattedId = lesson.id < 10 ? '0' + lesson.id : lesson.id;
        const linkTarget = `lesson${formattedId}.html`; // Tạo ra link chuẩn: lesson01.html, lesson11.html

        const cardLink = document.createElement('a');
        cardLink.href = linkTarget; 
        
        // Xác định trạng thái hiển thị
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

        cardLink.innerHTML = `
            ${badgeHTML}
            <span class="lesson-icon">${lesson.icon}</span>
            <div class="lesson-number">Lesson ${formattedId}</div>
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
        
        // Sự kiện click xử lý logic lưu trạng thái trước khi chuyển hướng trang
        cardLink.addEventListener('click', (e) => {
            if (e.target.closest('.btn-listen')) {
                return; 
            }
            
            e.preventDefault();

            // Ghi nhận bài học này đã hoàn thành khi click vào link
            if (!userProgress.completedLessons.includes(lesson.id)) {
                userProgress.completedLessons.push(lesson.id);
            }
            
            // Chuyển bài học hiện tại sang bài tiếp theo
            if (lesson.id === userProgress.currentLessonId && lesson.id < defaultLessons.length) {
                userProgress.currentLessonId = lesson.id + 1;
            }

            updateTopProgressBar();
            
            // Chuyển hướng chính xác tới file có số 0 (ví dụ: lesson01.html)
            window.location.href = linkTarget;
        });

        container.appendChild(cardLink);
    });
}

// 5. Hàm phát giọng đọc âm thanh mẫu nhanh bằng AI trình duyệt
function playAudio(audioFile, event, buttonSrc) {
    event.preventDefault();  
    event.stopPropagation(); 
    
    buttonSrc.style.transform = "scale(1.15)";
    setTimeout(() => { buttonSrc.style.transform = "scale(1)"; }, 200);

    const utterance = new SpeechSynthesisUtterance("Let's practice this lesson");
    utterance.lang = "en-US";
    utterance.rate = 0.85; 
    window.speechSynthesis.speak(utterance);
}

// Khởi chạy ứng dụng
document.addEventListener("DOMContentLoaded", () => {
    updateTopProgressBar();
    renderLessons();
});