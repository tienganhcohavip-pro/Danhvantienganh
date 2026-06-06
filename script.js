// 1. Dấu mốc dữ liệu gốc của 16 bài học
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
    { id: 16, type: "Âm câm & Cụm vần đặc biệt", detail: "Cụm đặc biệt", icon: "✨", audioWord: "ghost.mp3" }
];

// 2. Khởi tạo dữ liệu từ LocalStorage (để giữ lại tiến độ khi ép-năm hoặc tắt trang đi bật lại)
let userProgress = JSON.parse(localStorage.getItem('english_spell_progress')) || {
    completedLessons: [], // Mảng chứa ID các bài đã học xong
    currentLessonId: 1,   // Bài học hiện tại đang làm dở
    stars: 0,             // Số sao tích lũy
    coins: 0              // Số xu tích lũy
};

const container = document.getElementById('lesson-container');

// 3. Hàm tính toán và cập nhật Thanh tiến độ Gamification phía trên cùng
function updateTopProgressBar() {
    const totalLessons = defaultLessons.length;
    const completedCount = userProgress.completedLessons.length;
    
    // Tính phần trăm hoàn thành
    const percent = Math.round((completedCount / totalLessons) * 100);
    
    // Cập nhật lên giao diện HTML
    document.getElementById('progress-percent').innerText = `${percent}% Hoàn thành`;
    document.querySelector('.progress-fill').style.width = `${percent}%`;
    
    // Giả lập tặng sao và xu dựa trên số bài đã hoàn thành (mỗi bài hoàn thành được 3 sao, 20 xu)
    userProgress.stars = completedCount * 3;
    userProgress.coins = completedCount * 20;
    
    document.getElementById('star-count').innerText = userProgress.stars;
    document.getElementById('coin-count').innerText = userProgress.coins;

    // Lưu lại trạng thái mới nhất vào bộ nhớ trình duyệt
    localStorage.setItem('english_spell_progress', JSON.stringify(userProgress));
}

// 4. Hàm Render (Vẽ) danh sách các Box Bài học
function renderLessons() {
    container.innerHTML = ""; 
    
    defaultLessons.forEach(lesson => {
        const card = document.createElement('div');
        
        // Xác định trạng thái của từng bài học để gán Class CSS tương ứng
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

        card.className = `lesson-card ${statusClass}`;

        // Cấu trúc HTML của Box bài học: Toàn bộ vùng hộp hoặc nút "Luyện tập" đều dẫn link tới bài học
        card.innerHTML = `
            ${badgeHTML}
            <span class="lesson-icon">${lesson.icon}</span>
            <div class="lesson-number">Lesson ${lesson.id}</div>
            <p class="lesson-title-text">${lesson.type}<br><strong>${lesson.detail}</strong></p>
            <div class="mini-progress">${progressText}</div>
            <div class="card-actions">
                <button class="btn-action btn-practice" onclick="goToLesson(${lesson.id})">
                    <i class="fas fa-book-open"></i> Vào học
                </button>
                <button class="btn-action btn-listen" onclick="playAudio('${lesson.audioWord}', event, this)">
                    <i class="fas fa-volume-up"></i> Nghe âm
                </button>
            </div>
        `;
        
        // Giúp các bé có thể bấm vào bất kỳ đâu trên hộp bài học (trừ nút nghe âm) đều có thể kích hoạt vào học
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-listen')) {
                goToLesson(lesson.id);
            }
        });

        container.appendChild(card);
    });
}

// 5. Hàm xử lý khi click LINK vào học bài
function goToLesson(id) {
    console.log(`Đang chuyển hướng học sinh tới bài học số: ${id}`);
    
    // Giả lập hành vi: Khi bé click vào học, hệ thống tự động ghi nhận bài này hoàn thành
    if (!userProgress.completedLessons.includes(id)) {
        userProgress.completedLessons.push(id);
    }
    
    // Tự động đặt bài tiếp theo làm bài "Đang học" nếu bài tiếp theo chưa hoàn thành
    if (id === userProgress.currentLessonId && id < defaultLessons.length) {
        userProgress.currentLessonId = id + 1;
    }

    // Cập nhật lại thanh tiến độ và vẽ lại giao diện trước khi chuyển trang
    updateTopProgressBar();
    renderLessons();

    // LINK THẬT ĐẾN BÀI HỌC: Bạn hãy tạo các file bài học tương ứng như `lesson1.html`, `lesson2.html`...
    // Đoạn code dưới đây sẽ tự động chuyển hướng trang web sang bài học đó sau 300ms (tạo độ trễ để thấy hiệu ứng cập nhật)
    setTimeout(() => {
        window.location.href = `lesson${id}.html`; 
    }, 300);
}

// 6. Hàm phát giọng đọc mẫu âm thanh nhanh
function playAudio(audioFile, event, buttonSrc) {
    event.stopPropagation(); // Ngăn chặn sự kiện click vào hộp bài học khi bé chỉ muốn nghe thử âm
    
    // Tạo hiệu ứng nảy nút sinh động cho trẻ em
    buttonSrc.style.transform = "scale(1.15)";
    setTimeout(() => { buttonSrc.style.transform = "scale(1)"; }, 200);

    // Sử dụng Text-to-Speech của trình duyệt đọc trực tiếp ký tự âm để test nhanh
    const utterance = new SpeechSynthesisUtterance("Let's learn this sound");
    utterance.lang = "en-US";
    utterance.rate = 0.85; 
    window.speechSynthesis.speak(utterance);
}

// Khởi chạy ứng dụng lần đầu khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    updateTopProgressBar();
    renderLessons();
});