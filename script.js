// 1. Dữ liệu cấu trúc cấu hình 16 bài học (Dễ dàng mở rộng thêm)
const lessonsData = [
    { id: 1, type: "Nguyên âm ngắn", detail: "/æ/", icon: "🍎", status: "completed", progress: "4/5 completed", audioWord: "apple.mp3", audioSentence: "sentence1.mp3" },
    { id: 2, type: "Nguyên âm ngắn", detail: "/e/, /ɪ/", icon: "🐘", status: "completed", progress: "5/5 completed", audioWord: "elephant.mp3", audioSentence: "sentence2.mp3" },
    { id: 3, type: "Nguyên âm ngắn", detail: "/ɒ/, /ʌ/", icon: "🐙", status: "completed", progress: "4/5 completed", audioWord: "octopus.mp3", audioSentence: "sentence3.mp3" },
    { id: 4, type: "Nguyên âm ngắn", detail: "/ʊ/", icon: "🦆", status: "in-progress", progress: "In Progress", audioWord: "duck.mp3", audioSentence: "sentence4.mp3" },
    { id: 5, type: "Nguyên âm dài", detail: "/i:/, /ɑ:/", icon: "⭐", status: "not-started", progress: "0% completed", audioWord: "star.mp3", audioSentence: "sentence5.mp3" },
    { id: 6, type: "Nguyên âm dài", detail: "/ɔ:/, /u:/, /ɜ:/", icon: "🌙", status: "not-started", progress: "0% completed", audioWord: "moon.mp3", audioSentence: "sentence6.mp3" },
    { id: 7, type: "Nguyên âm đôi", detail: "/aɪ/, /eɪ/, /ɔɪ/", icon: "🚲", status: "not-started", progress: "0% completed", audioWord: "bike.mp3", audioSentence: "sentence7.mp3" },
    { id: 8, type: "Nguyên âm đôi", detail: "/aʊ/, /əʊ/, /eə/", icon: "🏠", status: "not-started", progress: "0% completed", audioWord: "home.mp3", audioSentence: "sentence8.mp3" },
    { id: 9, type: "Phụ âm ghép", detail: "/bl/, /cl/, /br/, /cr/", icon: "📘", status: "not-started", progress: "0% completed", audioWord: "blue.mp3", audioSentence: "sentence9.mp3" },
    { id: 10, type: "Phụ âm ghép", detail: "/sh/, /ch/, /ph/, /wh/", icon: "🐟", status: "not-started", progress: "0% completed", audioWord: "fish.mp3", audioSentence: "sentence10.mp3" },
    { id: 11, type: "Phụ âm ghép", detail: "/st/, /sk/, /sp/", icon: "🕷️", status: "not-started", progress: "0% completed", audioWord: "spider.mp3", audioSentence: "sentence11.mp3" },
    { id: 12, type: "Phụ âm ghép", detail: "/tr/, /dr/, /gr/", icon: "🌳", status: "not-started", progress: "0% completed", audioWord: "tree.mp3", audioSentence: "sentence12.mp3" },
    { id: 13, type: "Kết hợp chữ", detail: "/ar/, /er/, /ir/", icon: "🐦", status: "not-started", progress: "0% completed", audioWord: "bird.mp3", audioSentence: "sentence13.mp3" },
    { id: 14, type: "Kết hợp chữ", detail: "/or/, /ur/, /air/", icon: "🌽", status: "not-started", progress: "0% completed", audioWord: "corn.mp3", audioSentence: "sentence14.mp3" },
    { id: 15, type: "Kết hợp chữ", detail: "/ear/, /eer/, /our/", icon: "👂", status: "not-started", progress: "0% completed", audioWord: "ear.mp3", audioSentence: "sentence15.mp3" },
    { id: 16, type: "Âm câm & Cụm vần đặc biệt", detail: "Cụm đặc biệt", icon: "✨", status: "not-started", progress: "0% completed", audioWord: "ghost.mp3", audioSentence: "sentence16.mp3" }
];

// 2. Render Danh sách bài học ra giao diện
const container = document.getElementById('lesson-container');
const audioPlayer = document.getElementById('app-audio');

function renderLessons() {
    container.innerHTML = ""; // Xóa dữ liệu cũ (nếu có)
    
    lessonsData.forEach(lesson => {
        // Khởi tạo thẻ card
        const card = document.createElement('div');
        card.classList.add('lesson-card', lesson.status);

        // Huy hiệu tích trạng thái (Đã hoàn thành vs chưa)
        let badgeHTML = `<div class="status-badge wait"><i class="far fa-circle"></i></div>`;
        if (lesson.status === 'completed') {
            badgeHTML = `<div class="status-badge done"><i class="fas fa-check-circle"></i></div>`;
        } else if (lesson.status === 'in-progress') {
            badgeHTML = `<div class="status-badge"><i class="fas fa-spinner fa-spin text-warning"></i></div>`;
        }

        // Nội dung HTML bên trong Card bài học
        card.innerHTML = `
            ${badgeHTML}
            <span class="lesson-icon">${lesson.icon}</span>
            <div class="lesson-number">Lesson ${lesson.id}</div>
            <p class="lesson-title-text">${lesson.type}<br><strong>${lesson.detail}</strong></p>
            <div class="mini-progress">${lesson.progress}</div>
            <div class="card-actions">
                <button class="btn-action btn-practice" onclick="goPractice(${lesson.id})">
                    <i class="fas fa-book-open"></i> Luyện tập
                </button>
                <button class="btn-action btn-listen" onclick="playAudio('${lesson.audioWord}', this)">
                    <i class="fas fa-volume-up"></i> Nghe đọc
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// 3. Hàm xử lý Phát âm thanh (Phát từ -> sau đó phát cả câu)
function playAudio(audioFile, buttonSrc) {
    // Để chạy thực tế, bạn cần thay đường dẫn audio bằng file thật trên hosting/github của bạn
    // Ví dụ tạm thời sử dụng API Text-to-Speech miễn phí nếu không có file sẵn
    console.log("Đang phát âm thanh cho file: " + audioFile);
    
    // Tạo hiệu ứng nhảy nhảy sinh động cho nút khi nghe đọc
    buttonSrc.style.transform = "scale(1.1)";
    setTimeout(() => { buttonSrc.style.transform = "scale(1)"; }, 300);

    // Bạn có thể đổi sang link file audio thật: audioPlayer.src = `./audio/${audioFile}`;
    // Demo sử dụng giọng đọc tự động bằng Web Speech API có sẵn trên mọi trình duyệt:
    const utterance = new SpeechSynthesisUtterance("Lesson sound practicing");
    utterance.lang = "en-US";
    utterance.rate = 0.8; // Đọc chậm một chút cho bé dễ nghe
    window.speechSynthesis.speak(utterance);
}

// 4. Hàm điều hướng khi bấm Luyện tập
function goPractice(id) {
    alert(`Mở màn hình Luyện Tập / Kiểm tra tương tác của Lesson ${id}!\nTính năng này sẽ chuyển hướng bé tới trang làm bài.`);
    // Thực tế: window.location.href = `lesson-${id}.html`;
}

// Chạy khởi tạo ứng dụng khi load trang
document.addEventListener("DOMContentLoaded", () => {
    renderLessons();
});