import { initTheme, setupThemeToggle } from "./theme.js";

initTheme();
setupThemeToggle();

document.addEventListener('DOMContentLoaded', () => {
    window.loadFavorites(); 
});

window.loadFavorites = function(showAll = false) { 
    const favoriteGrid = document.getElementById('favoriteGrid');
    const favs = JSON.parse(localStorage.getItem('trasus_favs')) || [];

    favoriteGrid.innerHTML = '';

    if (favs.length === 0) {
        favoriteGrid.innerHTML = `
            <div class="col-span-full p-8 rounded-lg bg-[var(--container-bg)] border border-dashed border-[var(--card-border)] flex flex-col items-center justify-center opacity-70">
                <span class="material-symbols-outlined text-4xl mb-2 text-outline-variant">star_half</span>
                <p class="font-body text-on-surface-variant text-sm">ยังไม่มีคำศัพท์ที่บันทึกไว้</p>
                <a href="../homepage/explorer.html" class="text-tertiary font-label text-xs mt-2 hover:underline">ไปหาคำศัพท์กันเลย!</a>
            </div>
        `;
        return;
    }

    const limit = 4;
    const displayFavs = showAll ? favs : favs.slice(0, limit);

   displayFavs.forEach(fav => {
        const cardHTML = `
            <div onclick="goToExplorer('${fav.word}')" class="p-4 rounded-lg bg-[var(--container-bg)] border border-[var(--card-border)] relative group/card hover:bg-[var(--container-hover)] hover:border-tertiary/30 transition-all cursor-pointer">
                
                <div class="mb-3 pr-10">
                    <span class="inline-block px-2 py-0.5 rounded text-[10px] font-label font-bold bg-[var(--tag-bg)] hover:bg-[var(--tag-hover)] text-[var(--tag-text)]">
                        ${fav.cefr && fav.cefr !== '-' ? fav.cefr : 'N/A'}
                    </span>
                </div>
                
                <h4 class="font-headline text-lg text-on-surface mb-1 capitalize pr-10">${fav.word}</h4>
                <p class="font-label text-on-surface-variant text-s line-clamp-2">${fav.meaning}</p>
                
                <button onclick="event.stopPropagation(); removeFav('${fav.id}', '${fav.word}')" 
                        class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-error/10 text-error hover:bg-error hover:text-[var(--card-bg)] transition-all outline-none z-10">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
            </div>
        `;
        favoriteGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    if (!showAll && favs.length > limit) {
        favoriteGrid.insertAdjacentHTML('beforeend', `
            <div class="col-span-full mt-2 flex justify-center">
                <button onclick="loadFavorites(true)" class="bg-surface-container-low hover:bg-surface-container-high border border-tertiary/20 text-tertiary text-xs font-label py-2 px-6 rounded-full flex items-center gap-2 transition-all outline-none">
                    ดูทั้งหมด (${favs.length} คำ) <span class="material-symbols-outlined text-[16px]">expand_more</span>
                </button>
            </div>
        `);
    } else if (showAll && favs.length > limit) {
        favoriteGrid.insertAdjacentHTML('beforeend', `
            <div class="col-span-full mt-2 flex justify-center">
                <button onclick="loadFavorites(false)" class="text-on-surface-variant text-xs font-label flex items-center gap-1 hover:text-on-surface transition-colors outline-none">
                    ย่อเก็บ <span class="material-symbols-outlined text-[16px]">expand_less</span>
                </button>
            </div>
        `);
    }
}

window.goToExplorer = function(wordText) {
    window.location.href = `../homepage/explorer.html?search=${encodeURIComponent(wordText)}`;
};

// 🚨 ลบ API ทิ้ง ใช้ LocalStorage เพียวๆ
window.removeFav = function(id, wordText) {
    const confirmDelete = confirm(`คุณต้องการลบ "${wordText}" ออกจากคลังคำศัพท์ใช่ไหม?`);
    if (!confirmDelete) return;

    let favs = JSON.parse(localStorage.getItem('trasus_favs')) || [];
    favs = favs.filter(fav => fav.id !== id);
    localStorage.setItem('trasus_favs', JSON.stringify(favs));
            
    const isShowingAll = document.querySelector('button[onclick="loadFavorites(false)"]') !== null;
    window.loadFavorites(isShowingAll);
};