// theme change core logic 
import { initTheme, setupThemeToggle } from "./theme.js";

initTheme();
setupThemeToggle();

// ตัวแปรสำหรับเก็บคลังคำศัพท์ทั้งหมดไว้ในเครื่อง
let dictionaryData = [];

document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('searchInput');
    const resultsGrid = document.getElementById('resultsGrid');
    const cefrFilter = document.getElementById('cefrFilter');
    const typeFilter = document.getElementById('typeFilter');

    // ==========================================
    // 🥷 1. โหลดข้อมูลแบบพรางตา (Secure) แล้วถอดรหัสใน RAM
    // ==========================================
    try {
        resultsGrid.innerHTML = `<p class="text-tertiary text-center w-full col-span-full font-label tracking-widest animate-pulse">กำลังสแกนระบบรักษาความปลอดภัย...</p>`;
        
        const response = await fetch('/secure-core.dat'); 
        const securePackage = await response.json();

        // 🛠️ FIX: อัปเกรดระบบถอดรหัส (TextDecoder) อ่านภาษาไทยได้ไวและเสถียร 100% ไม่มีบั๊กต่างดาว
        const binaryStr = window.atob(securePackage.payload);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }
        const decodedString = new TextDecoder('utf-8').decode(bytes);
        
        dictionaryData = JSON.parse(decodedString);

    } catch (error) {
        console.error("Failed to load or decode dictionary:", error);
        resultsGrid.innerHTML = `<p class="text-error text-center w-full col-span-full">ระบบความปลอดภัยขัดข้อง กรุณาติดต่อผู้ดูแลระบบ</p>`;
        return;
    }

    const triggerSearch = () => {
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    };
    
    cefrFilter?.addEventListener('change', triggerSearch);
    typeFilter?.addEventListener('change', triggerSearch);

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // ==========================================
    // 🚨 2. ระบบค้นหาแบบ Offline (ปรับแก้เรื่องการกระพริบแล้ว)
    // ==========================================
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim().toLowerCase();
        const cefr = cefrFilter ? cefrFilter.value : '';
        const type = typeFilter ? typeFilter.value : '';

        const results = dictionaryData.filter(word => {
            // 🛠️ FIX: เติม .toLowerCase() ให้ word.meaning เพื่อแก้บั๊กค้นหาคำอังกฤษไม่เจอ
            const matchQuery = query === '' || 
                               (word.word && word.word.toLowerCase().includes(query)) || 
                               (word.meaning && word.meaning.toLowerCase().includes(query)) ||
                               (word.misspelled && word.misspelled.some(m => m.toLowerCase().includes(query))) ||
                               (word.tag && word.tag.some(t => t.toLowerCase().includes(query)));
            
            const matchCefr = cefr === '' || cefr === 'all' || word.cefr === cefr;
            const matchType = type === '' || type === 'all' || word.type === type;

            return matchQuery && matchCefr && matchType;
        });

        // 🛠️ FIX: เอา Timeout ดีเลย์หลอกๆ และข้อความ "กำลังสืบค้น" ออกเพื่อให้หน้าจอไม่กระพริบ
        renderCards(results);

    }, 250)); // ลดเวลา debounce ลงนิดนึงให้แอปตอบสนองนิ้วไวขึ้น (250ms)

    resultsGrid.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;

        if (action === 'expand') {
            toggleExpand(target);
        }

        if (action === 'favorite') {
            const itemId = target.dataset.id;
            toggleFavorite(
                itemId,
                target.dataset.word,
                target.dataset.meaning,
                target.dataset.cefr,
                target
            );
        }

        if (action === 'tag') {
            searchByTag(target.dataset.tag);
        }
    });

   // ==========================================
    // 🚨 3. ฟังก์ชันสร้างการ์ด 
    // ==========================================
    function renderCards(words) {
        resultsGrid.innerHTML = '';

        if (words.length === 0) {
            resultsGrid.innerHTML = `<p class="text-on-surface-variant text-center w-full col-span-full pt-10">ไม่พบคำศัพท์ที่คุณค้นหา</p>`;
            return;
        }

        const formatArr = (arr) => (arr && arr.length > 0) ? arr.join(', ') : '-';
        const formatTxt = (txt) => txt || '-';

        const currentFavs = JSON.parse(localStorage.getItem('trasus_favs')) || [];
        const checkFav = (id) => currentFavs.some(fav => fav.id == id);

        words.forEach(word => {
            const posText = word.pos && word.pos.length > 0 ? word.pos[0] : 'N/A';
            const synonyms = formatArr(word.related);
            const reference = formatTxt(word.section) !== '-' ? word.section : formatTxt(word.deka);

            let tagsHTML = '';
            if (word.tag && word.tag.length > 0) {
                tagsHTML = word.tag.map(t => {
                    return `<button data-action="tag" data-tag="${t.trim()}" class="inline-block bg-[var(--tag-bg)] hover:bg-[var(--tag-hover)] text-[var(--tag-text)] border border-[var(--tag-border)] text-[10px] xl:text-[11px] px-2 py-0.5 xl:px-2.5 xl:py-1 rounded-full transition-colors font-label mr-1.5 xl:mr-2 mb-1.5 xl:mb-2 focus:outline-none">
                                ${t.trim()}
                            </button>`;
                }).join('');
            }

            const wordId = word.id || word._id;
            const isFav = checkFav(wordId);

            const cardHTML = `
                <article class="relative bg-[var(--card-bg)] p-5 xl:p-8 rounded-xl flex flex-col group overflow-hidden transition-all duration-500 hover:bg-[var(--card-hover)] border border-[var(--card-border)] shadow-lg col-span-full mb-4 ease-in-out h-fit">
                    
                    <!-- ที่คั่นหนังสือ -->
                    <div class="absolute top-0 right-5 md:right-8 w-6 md:w-8 h-10 md:h-12 bg-error/90 rounded-b-sm flex items-end justify-center pb-1 shadow-sm z-10">
                        <div class="absolute -bottom-[1px] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[8px] md:border-l-[16px] md:border-r-[16px] md:border-b-[10px] border-b-[var(--bookmark-cut)] transition-colors duration-300"></div>
                    </div>

                    <div class="relative z-10 flex flex-col h-full w-full">
                        
                        <!-- ======================================= -->
                        <!-- 📱 ส่วนหัว: สำหรับมือถือ และ iPad แนวตั้ง -->
                        <!-- ======================================= -->
                        <div class="flex xl:hidden flex-col items-start mb-2 w-full relative z-20">
                            <!-- ⭐ ปุ่มดาว -->
                            <button data-action="favorite" data-id="${wordId}" data-word="${word.word}" data-meaning="${formatTxt(word.meaning)}" data-cefr="${formatTxt(word.cefr)}" class="focus:outline-none absolute right-7 md:right-20 top-0 transition-all ${isFav ? 'text-tertiary' : 'text-outline-variant'} z-30">
                                <span class="material-symbols-outlined text-[28px] md:text-[32px] fav-icon" style="font-variation-settings: 'FILL' ${isFav ? '1' : '0'};">star</span>
                            </button>

                            <h3 class="font-headline text-3xl md:text-4xl font-bold text-[var(--color-word)] tracking-tight capitalize w-full break-words pr-24 md:pr-32">${word.word}</h3>
                            <span class="font-headline text-xl md:text-2xl text-[var(--nav-active-text)] font-medium mt-1 leading-tight w-full break-words pr-24 md:pr-32">${formatTxt(word.meaning)}</span>
                            
                            <!-- ป้าย CEFR + POS (💡 ใส่กรอบ border ให้ POS ตรงนี้แล้วครับ) -->
                            <div class="flex items-center gap-2 mt-3 mb-1">
                                <span class="font-label text-[10px] md:text-[12px] uppercase tracking-widest bg-[var(--badge-bg)] px-2 py-0.5 rounded text-on-surface">${formatTxt(word.cefr)}</span>
                                <span class="font-label text-[11px] md:text-[13px] uppercase tracking-widest text-[var(--badge-text)] px-2 py-0.5 rounded border border-outline-variant/30">${posText}</span>
                            </div>
                        </div>

                        <!-- ======================================= -->
                        <!-- 💻 ส่วนหัว: สำหรับคอมพิวเตอร์ และ iPad แนวนอน -->
                        <!-- ======================================= -->
                        <div class="hidden xl:flex relative justify-between items-start pr-12 mb-4 z-20 w-full">
                            
                            <!-- ซ้าย: คำศัพท์ -->
                            <div class="flex justify-start w-[40%]">
                                <h3 class="font-headline text-5xl font-bold text-[var(--color-word)] tracking-tight capitalize break-words">${word.word}</h3>
                            </div>

                            <!-- กลาง: ปุ่มดาว และ ป้าย (ไม่มีกรอบตามเดิม) -->
                            <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 mt-2 px-2">
                                <button data-action="favorite" data-id="${wordId}" data-word="${word.word}" data-meaning="${formatTxt(word.meaning)}" data-cefr="${formatTxt(word.cefr)}" class="focus:outline-none transform hover:scale-110 transition-all ${isFav ? 'text-tertiary' : 'text-outline-variant hover:text-tertiary'}">
                                    <span class="material-symbols-outlined text-[32px] fav-icon" style="font-variation-settings: 'FILL' ${isFav ? '1' : '0'};">star</span>
                                </button>
                                <div class="flex items-center gap-2 ml-2">
                                    <span class="font-label text-[12px] uppercase tracking-widest bg-[var(--badge-bg)] px-3 py-1 rounded whitespace-nowrap">${formatTxt(word.cefr)}</span>
                                    <span class="font-label text-[14px] uppercase tracking-widest text-[var(--badge-text)] px-3 py-1 rounded whitespace-nowrap">${posText}</span>
                                </div>
                            </div>

                            <!-- ขวา: ความหมาย -->
                            <div class="flex justify-end text-right w-[40%]">
                                <span class="font-headline text-3xl text-[var(--nav-active-text)] font-medium mt-1 leading-tight break-words">${formatTxt(word.meaning)}</span>
                            </div>

                        </div>
                        <!-- ======================================= -->

                        <!-- IPA & Tags -->
                        <div class="mb-4 xl:mb-5">
                            <span class="font-label text-sm xl:text-lg text-primary/70 italic tracking-wide block mb-2">/${formatTxt(word.ipa)}/</span>
                            <div class="flex flex-wrap items-center">
                                ${tagsHTML}
                            </div>
                        </div>

                        <!-- Definition -->
                        <div class="bg-[var(--context-bg)] rounded-lg p-4 xl:p-5 border border-[var(--context-border)] relative mb-4 xl:mb-5">
                            <span class="absolute -top-2.5 xl:-top-3 left-3 xl:left-4 bg-surface-container-low px-1.5 xl:px-2 font-label text-[9px] xl:text-[10px] text-tertiary uppercase tracking-widest font-semibold">DEFINITION</span>
                            <p class="expandable-text font-body text-[16px] xl:text-[20px] text-on-surface leading-snug xl:leading-relaxed pt-1 transition-all duration-300">
                                ${formatTxt(word.define)}
                            </p>
                        </div>

                        <!-- Context Usage -->
                        <div class="bg-[var(--context-bg)] rounded-lg p-4 xl:p-5 border border-[var(--context-border)] relative mb-2">
                            <span class="absolute -top-2.5 xl:-top-3 left-3 xl:left-4 bg-surface-container-low px-1.5 xl:px-2 font-label text-[9px] xl:text-[10px] text-tertiary uppercase tracking-widest font-semibold">CONTEXT USAGE</span>
                            <p class="expandable-text font-body text-[15px] xl:text-[16px] leading-snug xl:leading-relaxed pt-1 italic transition-all duration-300 text-on-surface">
                                ${formatTxt(word.how_to_use || word.howToUse)}
                            </p>
                        </div>
                        
                        <!-- แถบด้านล่าง: มีแค่ Reference -->
                        <div class="mt-auto flex justify-end xl:grid xl:grid-cols-3 items-center pt-4 xl:pt-5 mt-4 border-t border-outline-variant/15">
                            <div class="hidden xl:block text-left overflow-hidden pr-2"></div>
                            <div class="hidden xl:flex justify-center"></div>
                            <div class="text-right overflow-hidden pl-0 xl:pl-2">
                                <span class="font-label text-[11px] xl:text-[13px] text-on-surface-variant truncate block" title="${reference}">
                                    <strong class="text-on-surface font-bold tracking-wide uppercase">Ref:</strong> <span class="text-[var(--nav-active-text)]">${reference}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
            `;

            resultsGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const incomingSearch = urlParams.get('search');

    if (incomingSearch) {
        searchInput.value = incomingSearch;
        triggerSearch();
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        triggerSearch();
    }
});

function searchByTag(tag) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = tag;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function toggleExpand(button) {
    const card = button.closest('article');
    const textElements = card.querySelectorAll('.expandable-text');
    const expandedData = card.querySelector('.expanded-data');
    const btnText = button.querySelector('.btn-text');
    const btnIcon = button.querySelector('.btn-icon');

    const isExpanded = btnText.innerText.trim() === 'ย่อลง';

    if (isExpanded) {
        expandedData.classList.add('hidden');
        expandedData.classList.remove('opacity-100');

        textElements.forEach(el => {
            el.classList.add('line-clamp-2');
            el.classList.remove('line-clamp-none');
        });

        btnText.innerText = 'อ่านทั้งหมด';
        btnIcon.innerText = 'expand_more';
        btnIcon.classList.add('group-hover:translate-y-[2px]');
        btnIcon.classList.remove('group-hover:-translate-y-[2px]');

        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        textElements.forEach(el => {
            el.classList.remove('line-clamp-2');
            el.classList.add('line-clamp-none');
        });

        expandedData.classList.remove('hidden');
        setTimeout(() => expandedData.classList.add('opacity-100'), 50);

        btnText.innerText = 'ย่อลง';
        btnIcon.innerText = 'expand_less';
        btnIcon.classList.remove('group-hover:translate-y-[2px]');
        btnIcon.classList.add('group-hover:-translate-y-[2px]');
    }
}

// เช็คความซ้ำซ้อนเอาไว้นอกลูปตอนเรนเดอร์แล้ว ตัวนี้ปล่อยไว้ได้เลยครับ
function isFavorited(id) {
    const favs = JSON.parse(localStorage.getItem('trasus_favs')) || [];
    return favs.some(fav => fav.id == id); 
}

function toggleFavorite(id, word, meaning, cefr, btnElement) {
    const icon = btnElement.querySelector('.fav-icon');
    let favs = JSON.parse(localStorage.getItem('trasus_favs')) || [];
    
    const index = favs.findIndex(f => f.id == id);

    if (index === -1) {
        favs.push({ id, word, meaning, cefr }); 
        
        icon.style.fontVariationSettings = "'FILL' 1";
        btnElement.classList.add('text-tertiary');
        btnElement.classList.remove('text-outline-variant');
    } else {
        favs.splice(index, 1);
        
        icon.style.fontVariationSettings = "'FILL' 0";
        btnElement.classList.remove('text-tertiary');
        btnElement.classList.add('text-outline-variant');
    }

    localStorage.setItem('trasus_favs', JSON.stringify(favs));
}