/* =========================================
   1. 初始化與資料定義
   ========================================= */

// 定義國定連假日期 (格式: YYYY-MM-DD)
// 此處包含常見連續假期，需定期更新
const holidayDates = [
    // 2024
    "2024-01-01", "2024-02-08", "2024-02-09", "2024-02-10", "2024-02-11", "2024-02-12", "2024-02-13", "2024-02-14", 
    "2024-04-04", "2024-04-05", "2024-04-06", "2024-04-07", "2024-06-08", "2024-06-09", "2024-06-10", 
    "2024-09-17", "2024-10-10",
    // 2025 範例
    "2025-01-01", "2025-01-25", "2025-01-26", "2025-01-27", "2025-01-28", "2025-01-29", "2025-01-30", "2025-01-31", "2025-02-01", "2025-02-02",
    "2025-02-28", "2025-03-01", "2025-03-02", "2025-04-03", "2025-04-04", "2025-04-05", "2025-04-06"
];

// 價格表定義
const prices = {
    // ⛺ 露營模式 (Camping Mode)
    // 國定連假皆調整 +200 元
    "tent": { weekday: 800, weekend: 1000, holiday: 1400 }, // 一般假日1200 -> 連假1400
    "moto": { weekday: 800, weekend: 1000, holiday: 1400 },
    "solo": { weekday: 800, weekend: 1000, holiday: 1400 },
    "car":  { weekday: 800, weekend: 1000, holiday: 1400 },
    
    // 自備露營拖車 (Camper)
    "camper": { weekday: 1000, weekend: 1200, holiday: 1800 }, // 一般假日1600 -> 連假1800

    // 🚐 錄托邦租賃 (Rental) - 維持原價
    "starcraft": { weekday: 2800, weekend: 3800, holiday: 4800 },
    "dt392":     { weekday: 2500, weekend: 3500, holiday: 4500 },
    "room":      { weekday: 2000, weekend: 2800, holiday: 3600 },

    // 🎉 包場 (Full Booking) - 顯示用，實際邏輯依選單跳轉
    "full_basic": { weekday: 5000, weekend: 6500, holiday: 10000 },
    "full_vans":  { weekday: 7500, weekend: 8500, holiday: 12000 },
    "full_all":   { weekday: 10500, weekend: 13500, holiday: 16500 },

    // 🎪 場地租借 (Hourly)
    "venue_hourly": { weekday: 1000, weekend: 1500, holiday: 2000 }
};

let datePicker;
let currentLang = 'zh';

// 翻譯字典 (i18n)
const i18n = {
    zh: {
        loading: "資料載入中...",
        calc_title: "🌲 露營/場地/周邊服務費用試算",
        basic_unit: "基本單位：4人 / 1車 / 1帳 / 1車邊帳or車尾帳",
        important_notice: "重要提醒：",
        checkin_time_label: "入住時間：",
        checkin_time_val: "下午 14:00 以後",
        dont_early: "(請勿提早)",
        eco_policy_label: "環保旅宿：",
        eco_policy_desc: "不提供一次性備品 (請自備毛巾、牙刷)",
        label_type: "類型選擇：",
        select_placeholder: "請選擇類型...",
        // ... (其他翻譯可依需求擴充)
    },
    en: {
        loading: "Loading...",
        calc_title: "🌲 Price Calculator",
        basic_unit: "Basic Unit: 4 pax / 1 car / 1 tent / 1 tarp",
        important_notice: "Important Notice:",
        checkin_time_label: "Check-in:",
        checkin_time_val: "After 14:00",
        dont_early: "(Do not arrive early)",
        eco_policy_label: "Eco-friendly:",
        eco_policy_desc: "No disposable amenities provided (Bring your own towel/toothbrush)",
        label_type: "Select Type:",
        select_placeholder: "Please select...",
        // ...
    },
    jp: {
        loading: "読み込み中...",
        calc_title: "🌲 料金計算",
        basic_unit: "基本単位：4名 / 車1台 / テント1張 / タープ1張",
        important_notice: "重要なお知らせ：",
        checkin_time_label: "チェックイン：",
        checkin_time_val: "14:00 以降",
        dont_early: "(早着厳禁)",
        eco_policy_label: "エコポリシー：",
        eco_policy_desc: "使い捨てアメニティなし (タオル・歯ブラシ持参)",
        label_type: "タイプ選択：",
        select_placeholder: "選択してください...",
        // ...
    }
};

/* =========================================
   2. DOM 載入後執行
   ========================================= */
document.addEventListener("DOMContentLoaded", function() {
    // 初始化跑馬燈
    const marqueeTexts = [
        "歡迎來到 Lutopia 都蘭錄托邦！請愛護環境，垃圾自行帶走。",
        "夜間 10:30 後請降低音量，享受蟲鳴鳥叫。",
        "連假期間露營模式費用已調整，請留意試算結果。",
        "吐煙怪獸酒吧每週五六日開放！"
    ];
    let mqIdx = 0;
    const mqEl = document.getElementById("marquee-text");
    setInterval(() => {
        mqEl.style.opacity = 0;
        setTimeout(() => {
            mqIdx = (mqIdx + 1) % marqueeTexts.length;
            mqEl.innerText = marqueeTexts[mqIdx];
            mqEl.style.opacity = 1;
        }, 500);
    }, 5000);
    mqEl.innerText = marqueeTexts[0];

    // 初始化日期選擇器 (Flatpickr)
    datePicker = flatpickr("#dateRange", {
        mode: "range",
        minDate: "today",
        dateFormat: "Y-m-d",
        locale: "zh", // 預設中文
        onChange: function(selectedDates, dateStr, instance) {
            calculateNights(selectedDates);
            calculateTotal();
            checkRushDate(selectedDates);
        }
    });

    // 預設語言
    changeLanguage('zh');
});

/* =========================================
   3. 核心功能函式
   ========================================= */

// 切換語言
function changeLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'jp' ? 'ja' : (lang === 'en' ? 'en' : 'zh-TW');

    // 更新按鈕狀態
    document.querySelectorAll('.lang-btn').forEach(btn => btn.style.opacity = '0.6');
    document.getElementById('btn-' + lang).style.opacity = '1';

    // 簡單替換 (如有完整翻譯字典可取消註解)
    /*
    const dict = i18n[lang];
    document.querySelector('[data-i18n="calc_title"]').innerText = dict.calc_title;
    // ... 更多 DOM 替換
    */
    
    // 更新 Flatpickr 語言
    if (datePicker) {
        const localeCode = lang === 'jp' ? 'ja' : (lang === 'en' ? 'en' : 'zh');
        // flatpickr 需引入對應語言包，此處簡化處理
    }
}

// 根據選擇的類型，顯示/隱藏對應欄位
function toggleInputs() {
    const type = document.getElementById("campType").value;
    
    // 隱藏所有選填區塊
    document.getElementById("qtyBlock").classList.add("hidden");
    document.getElementById("nightsBlock").classList.remove("hidden"); // 預設顯示
    document.getElementById("rentalDurationBlock").classList.add("hidden");
    document.getElementById("bikeBlock").classList.add("hidden");
    document.getElementById("addonBlock").classList.add("hidden");
    document.getElementById("extraOptions").classList.add("hidden");
    document.getElementById("guestListBlock").classList.add("hidden");
    document.getElementById("policyNotice").classList.remove("hidden");

    // 重置選單
    document.getElementById("unitQty").value = "1";
    document.getElementById("rentalScheme").selectedIndex = 0;
    
    // 依類型判斷
    if (["tent", "moto", "solo", "car", "camper", "starcraft", "dt392", "room"].includes(type)) {
        // 住宿類
        document.getElementById("qtyBlock").classList.remove("hidden");
        document.getElementById("addonBlock").classList.remove("hidden");
        document.getElementById("extraOptions").classList.remove("hidden");
        document.getElementById("guestListBlock").classList.remove("hidden");
        
        // 只有自搭帳可以夜衝 (Tent/Car/Moto/Solo) + Camper(拖車)
        const canRush = ["tent", "moto", "solo", "car", "camper"].includes(type);
        document.getElementById("isNightRush").parentElement.style.display = canRush ? "block" : "none";
        document.getElementById("isNightRush").checked = false;

    } else if (type === "venue_hourly") {
        // 場地租借
        document.getElementById("rentalDurationBlock").classList.remove("hidden");
        document.getElementById("nightsBlock").classList.add("hidden");
        document.getElementById("policyNotice").classList.add("hidden");

    } else if (type === "bicycle") {
        // 單車
        document.getElementById("bikeBlock").classList.remove("hidden");
        document.getElementById("nightsBlock").classList.add("hidden");
        document.getElementById("policyNotice").classList.add("hidden");

    } else if (type.startsWith("full_")) {
        // 包場
        document.getElementById("nightsBlock").classList.remove("hidden");
        // 包場通常不走此試算表，建議跳轉或顯示聯絡資訊
        alert("包場方案請參考下方說明，或直接聯繫官方 LINE 預約！");
    }

    onQtyChange(); // 產生姓名欄位
    calculateTotal();
}

// 計算晚數
function calculateNights(dates) {
    if (dates.length === 2) {
        const diffTime = Math.abs(dates[1] - dates[0]);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        document.getElementById("nights").value = diffDays;
    } else {
        document.getElementById("nights").value = 0;
    }
}

// 產生同行人姓名欄位
function onQtyChange() {
    const qty = parseInt(document.getElementById("unitQty").value);
    const container = document.getElementById("guestInputsContainer");
    container.innerHTML = ""; // 清空

    // 假設每帳/每車主要填寫一位代表，或依人數填寫? 
    // 這裡示範產生 "帳數/車數" 對應的欄位
    for (let i = 1; i <= qty; i++) {
        const div = document.createElement("div");
        div.style.marginBottom = "5px";
        div.innerHTML = `<label>第 ${i} 帳/間代表人：</label><input type="text" class="guest-name" placeholder="姓名" style="padding:5px; border:1px solid #ccc; border-radius:4px;">`;
        container.appendChild(div);
    }
    calculateTotal();
}

// 檢查夜衝日期 (提醒用)
function checkRushDate(dates) {
    const warning = document.getElementById("rushWarningText");
    const isRush = document.getElementById("isNightRush").checked;
    warning.classList.add("hidden");

    if (isRush && dates.length > 0) {
        // 簡單邏輯：夜衝通常是第一天晚上的前一晚，或第一天晚上?
        // 這裡僅作文字提示
        warning.innerText = "您已勾選夜衝，請確認日期包含夜衝當晚。";
        warning.classList.remove("hidden");
    }
}

// 判斷日期類型 (平日/假日/連假)
function getDayType(dateObj) {
    // 格式化日期字串 YYYY-MM-DD
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    // 1. 優先檢查是否為國定連假
    if (holidayDates.includes(dateStr)) {
        return 'holiday';
    }

    // 2. 檢查星期 (週五、週六為假日)
    const day = dateObj.getDay(); // 0=Sun, 6=Sat, 5=Fri
    if (day === 5 || day === 6) {
        return 'weekend';
    }

    // 3. 其餘為平日
    return 'weekday';
}

/* =========================================
   4. 主要計算邏輯
   ========================================= */
function calculateTotal() {
    // 取得表單數值
    const type = document.getElementById("campType").value;
    if (!type) return;

    const qty = parseInt(document.getElementById("unitQty").value) || 1;
    const nights = parseInt(document.getElementById("nights").value) || 0;
    
    // 加購項目
    const extraPeople = parseInt(document.getElementById("extraPeople").value) || 0;
    const extraCars = parseInt(document.getElementById("extraCars").value) || 0;
    const visitors = parseInt(document.getElementById("visitors").value) || 0;
    
    // 選項
    const isRush = document.getElementById("isNightRush").checked;
    const useAC = document.getElementById("useAC").checked;

    let baseTotal = 0;
    let rushTotal = 0;
    let acTotal = 0;
    let addonTotal = 0;
    let discount = 0;

    // --- 計算基本住宿費 (逐日計算) ---
    const dateRange = datePicker.selectedDates;
    
    if (["tent", "moto", "solo", "car", "camper", "starcraft", "dt392", "room"].includes(type)) {
        if (dateRange.length === 2 && nights > 0) {
            let currentDate = new Date(dateRange[0]);
            
            // 迴圈每一晚
            for (let i = 0; i < nights; i++) {
                // 如果勾選夜衝，且是第一晚 -> 使用夜衝價
                // 這裡假設夜衝是發生在「選定日期的第一晚」 (通常使用者會選五六日，週五算夜衝?)
                // 為簡化，若勾選夜衝，則第一晚計算夜衝費，剩餘晚數計算房價
                
                let dayPrice = 0;
                let dayType = getDayType(currentDate);

                // 取得當日單價
                if (prices[type]) {
                    dayPrice = prices[type][dayType];
                }

                if (i === 0 && isRush) {
                    // 第一晚是夜衝，基本費改由夜衝費計算(下方處理)，或者夜衝是"加價"?
                    // 營區邏輯通常是：夜衝當晚費用 = 夜衝價 (例如 500)，而不是 房價+夜衝
                    // 所以如果第一晚是夜衝，BasePrice 這一晚應該是 0 (移到 RushTotal 計算) 或 直接算夜衝價
                    
                    // 根據規則：夜衝費用 平日500/假日600/連假800 (露營車打8折)
                    // 這裡先不加進 baseTotal，在 rushTotal 算
                } else {
                    baseTotal += dayPrice * qty;
                }

                // 日期 +1
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    } else if (type === "venue_hourly") {
        // 場地租借 (以次/小時計，這裡簡化為單一費率示例)
        baseTotal = 1000; 
    } else if (type === "bicycle") {
        const bikeQty = parseInt(document.getElementById("bikeQty").value) || 1;
        const scheme = document.getElementById("bikeScheme").value;
        const bikePrices = { "2hr": 150, "4hr": 250, "day": 400, "24hr": 600, "15day": 2500, "30day": 3500 };
        baseTotal = (bikePrices[scheme] || 0) * bikeQty;
    }

    // --- 計算夜衝費 ---
    if (isRush && ["tent", "moto", "solo", "car", "camper"].includes(type)) {
        // 判斷第一晚是什麼日子
        if (dateRange.length > 0) {
            const rushDateType = getDayType(dateRange[0]);
            let rushFee = 0;
            
            if (rushDateType === 'holiday') rushFee = 800;
            else if (rushDateType === 'weekend') rushFee = 600;
            else rushFee = 500;

            // 露營車打8折
            if (type === "camper") {
                rushFee = rushFee * 0.8;
            }
            
            rushTotal = rushFee * qty;
        }
    }

    // --- 計算加購費 ---
    // 加人: 200 * 人數 * 晚數 (夜衝那晚通常不收加人費? 假設收)
    // 簡單算：每晚都收
    // 實際邏輯需依營主，這裡假設 加人/加車 是算次還是算晚? 通常算晚。
    let chargeNights = nights;
    if (isRush) chargeNights = Math.max(1, nights - 1) + 1; // 夜衝也算一晚

    addonTotal += (extraPeople * 200 * chargeNights); 
    
    // 加車: 300 * 車數 * 晚數
    addonTotal += (extraCars * 300 * chargeNights);

    // 訪客: 100 * 人數 (算次)
    addonTotal += (visitors * 100);

    // --- 冷氣費 ---
    if (useAC) {
        // 200 * 數量 * 晚數
        acTotal = 200 * qty * chargeNights;
    }

    // --- 總計 ---
    const finalPrice = baseTotal + rushTotal + acTotal + addonTotal - discount;

    // --- 更新 UI ---
    document.getElementById("resultBox").classList.remove("hidden");
    document.getElementById("basePrice").innerText = baseTotal.toLocaleString();
    document.getElementById("addonPrice").innerText = addonTotal.toLocaleString();
    document.getElementById("rushPrice").innerText = rushTotal.toLocaleString();
    document.getElementById("acPrice").innerText = acTotal.toLocaleString();
    document.getElementById("finalTotal").innerText = finalPrice.toLocaleString();
    
    // 顯示/隱藏細項
    document.getElementById("rowRush").style.display = isRush ? "block" : "none";
    document.getElementById("rowAC").style.display = useAC ? "block" : "none";
}

function resetForm() {
    document.getElementById("campType").selectedIndex = 0;
    toggleInputs();
    if (datePicker) datePicker.clear();
    document.getElementById("resultBox").classList.add("hidden");
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
}

function submitOrder() {
    alert("訂單已送出！(此為試算演示，請結合後端 API)");
}

// 跳轉包場方案
function selectPlan(plan) {
    document.getElementById("campType").value = plan;
    toggleInputs();
    document.getElementById("calculatorSection").scrollIntoView({ behavior: 'smooth' });
}