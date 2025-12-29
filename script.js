// ==========================================
// 0. 全域變數與設定
// ==========================================
let currentLang = 'zh'; // 預設語言

// 🔥 修正重點：selectedDates 只在這裡宣告一次
let selectedDates = []; 

// 用來儲存從後端抓回來的「各類別忙碌日期」
let GLOBAL_BLOCKED_DATA = {
    full: [],
    starcraft: [],
    dt392: [],
    room: []
};

// ⚠️ 請確認這是您最新的網址 (結尾是 /exec)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpiqltgo7ewZnP3fGJWV0fgszW5OMmBsDWBH0pIbh3sFzDwyOqYEx3WdYgkXRJxBS2/exec"; 

const TRANSLATIONS = {
    zh: {
        loading: "資料載入中...",
        calc_title: "🌲 露營/場地/周邊服務費用試算",
        basic_unit: "基本單位：4人 / 1車 / 1帳 / 1車邊帳or車尾帳",
        important_notice: "重要提醒：",
        checkin_time_label: "", 
        checkin_time_val: "⛺️ 紮營時間：下午 14:00 以後 (請勿提早)",
        checkin_time_val_room: "🏡 錄托邦住宿入住時間：下午 15:00 以後 (請勿提早，可以提早放置行李，請先告知)",
        dont_early: "(請勿提早)",
        eco_policy_label: "環保旅宿：",
        eco_policy_desc: "♻️ 環保旅宿：不提供一次性備品 (請自備毛巾、牙刷)",
        label_type: "類型選擇：",
        select_placeholder: "請選擇類型...",
        label_unit_qty: "預訂數量 (帳/車/間)：",
        guest_name_label: "第 {n} 位代表姓名：",
        group_camping: "⛺ 露營住宿",
        group_rental: "🚐 免裝備租賃/民宿",
        group_full: "🎉 包場住宿",
        group_venue: "🎪 場地活動租借",
        group_bike: "🚲 周邊服務",
        opt_tent: "自搭帳篷", opt_moto: "機車、單車露營", opt_solo: "單人小帳棚", opt_car: "車泊、車露", opt_camper: "自備露營車/拖車",
        opt_starcraft: "StarCraft 美式復古拖車", opt_dt392: "大馳 DT392 露營車", opt_room: "錄托邦民宿房間",
        opt_full_basic: "純場地包場", opt_full_vans: "包場+2台露營車", opt_full_all: "包場+2台露營車+房間",
        opt_venue_hourly: "場地租借 (按時數計費)", opt_bicycle: "單車租借",
        label_date: "預約日期：", date_placeholder: "請點擊選擇日期...",
        rush_notice_title: "⚠️ 夜衝日期選擇教學：", rush_notice_desc: "請將「夜衝當晚」設為第一天。",
        label_time: "預計抵達/取車時間：", time_placeholder: "請選擇時間...",
        label_nights: "住宿晚數 (自動)：", label_rental_scheme: "租借時數方案：",
        label_bike_qty: "租借數量 (台)：", label_bike_scheme: "租借方案：",
        addon_title: "➕ 加購選項 (人/車/訪客)", label_extra_people: "加人 ($200/人/晚)", label_kid_free: "*小一以下免費",
        label_extra_car: "加車 ($300/車，拖車不在此限)", label_visitor: "訪客 ($100/人，23:00離場)",
        cb_night_rush: "我要夜衝 (21:00-23:00入場)", 
        cb_ac: "使用冷氣 (+100元/晚)",
        btn_calc: "更新費用", btn_reset: "重新填寫",
        result_title: "試算結果", res_base: "基本費用：", res_addon: "加購費用：", res_rush: "夜衝費用：",
        res_ac: "冷氣加價：", res_discount: "符合折扣：", res_total: "總計金額：",
        customer_info_title: "📝 預訂資料填寫", ph_name: "您的姓名 (必填)", ph_phone: "聯絡電話 (必填)",
        ph_note: "其他備註需求 (例如：露營相關、租單車者身高...)", btn_submit: "🚀 確認預訂並送出",
        alert_fill: "請務必填寫「姓名」與「電話」才能送出訂單喔！",
        confirm_room_policy: "🛑【訂位前請確認】\n\n1. 🏡 錄托邦住宿入住時間：下午 15:00 以後。\n   (請勿提早，可以提早放置行李，請先告知)\n\n2. ♻️ 環保旅宿：不提供一次性備品。\n   (請自備毛巾、牙刷)\n\n請問您是否接受並繼續訂位？",
        sent_success: "🎉 預訂成功！\n\n營主已收到您的訂單，將盡快與您聯繫確認。\n(您無需再進行其他操作)",
        rule_title_basic: "🔷 收費標準與營區規定", rule_sub_price: "💰 營位計費標準",
        rule_li_unit: "基本單位：4人 / 1車 / 1帳 / 1炊事帳。", rule_li_add_person: "加人：多1人加 $200 (國小一年級以下免費)。",
        rule_li_add_car: "加車：多停一台車加收 $300 (拖車不在此限)。", rule_li_visitor: "訪客：每人 $100，需於 23:00 前離場。",
        rule_sub_tent: "⛺ 搭帳與冷氣規範", rule_li_big_tent: "大型帳篷：神殿、怪獸、5x8天幕等請訂2個營位。",
        rule_li_ac_fee: "冷氣使用：車上/帳內使用冷氣接電，酌收 $100/晚。", rule_li_warning: "未告知搭設大帳者，現場將禁止搭設。",
        rule_sub_rush: "🌙 夜衝服務 (限自搭帳)", rule_li_rush_time: "時間：22:00 後入場，23:30 前搭完。",
        rule_li_rush_price: "費用：平日 500元 / 假日 600元 / 連假 800元。", rule_li_rush_rv: "🚐 自備露營車夜衝依金額打 8 折。",
        rule_title_policy: "⚠️ 住宿取消政策與付款", rule_sub_refund: "📅 取消退費標準",
        ref_14: "14天前", ref_desc_14: "退 100% (扣手續費) 或改期", ref_10: "10-13天前", ref_desc_10: "退 70% (2日內補差額)",
        ref_7: "7-9天前", ref_desc_7: "退 50%", ref_4: "4-6天前", ref_desc_4: "退 30%", ref_0: "0-3天前", ref_desc_0: "視同取消，不退費",
        rule_sub_bank: "💰 付款資訊 (完成訂位後請全額匯款)", rule_bank_note: "請保留轉帳證明並回傳。",
        pricing_title: "全區獨享包場方案", pricing_desc: "選擇適合您的規模，平日/假日/連假皆有不同優惠",
        plan_a_title: "方案 A：純場地自由配", plan_a_desc: "自備裝備者最愛，CP值最高",
        plan_b_title: "方案 B：場地 + 露營車", plan_b_desc: "輕裝備首選，長輩小孩都開心",
        plan_c_title: "方案 C：豪華全配版", plan_c_desc: "露營車 + 民宿房間，懶人極致享受",
        th_period: "時段", tag_lite: "微包場 (10帳內)", tag_full: "全包場 (20帳)",
        td_weekday: "平日", td_weekend: "假日", td_holiday: "連假",
        feat_a_1: "全區草地營位使用", feat_a_2: "適合：純露營團體、車隊", feat_a_3: "假日滿帳平均僅 $500/帳",
        feat_b_1: "包含 2 台露營車 住宿", feat_b_2: "適合：新手混合團、三代同堂", feat_b_3: "免搭帳也能享受露營樂趣",
        feat_c_1: "含 2 台露營車 + 民宿房間", feat_c_2: "適合：重視睡眠品質、家族大聚會", feat_c_3: "長輩住民宿，年輕人睡帳篷",
        btn_book_a: "預約方案 A", btn_book_b: "預約方案 B", btn_book_c: "預約方案 C",
        note_title: "💡 價格說明與彈性升級：",
        note_1: "微包場 (Level 1)：適用於 10 帳/車以內之團體，保證不接散客，獨享全區。",
        note_2: "全包場 (Level 2)：適用於 20 帳/車以內之團體，享有人均最優惠價格。",
        note_3: "彈性機制：若訂微包場後人數增加，第 11 帳起每帳僅需補 $600 元，達全包場總價上限即不再加收。",
        bar_title: "🍹 吐煙怪獸酒吧 (Toen Kaijyu Bar)",
        bar_desc: "夜の帳が下りると、キャンプ場は都蘭で最もチルな場所に。ここには怪獣はいません、あるのは笑いと物語だけ。",
        bar_feat_1: "🦖 <strong>怪獸特調：</strong>只有這裡喝得到的獨家風味。",
        bar_feat_2: "🍺 <strong>冷えた生ビール：</strong>豪快に飲んで、語り合って、最高の気分で。",
        bar_feat_3: "🎵 <strong>音楽の雰囲気：</strong>夜に浮かぶ厳選されたプレイリスト。",
        bar_promo: "✨ <em>宿泊者限定：予約提示で専用割引あり！</em>",
        bar_info: "📍 場所：キャンプ場横 / 営業：金・土・日 21:00〜 (詳細はIGにて)",
        bar_btn_ig: "IGをフォロー",
    }
};

const HOLIDAYS = [
    "2025-01-01", "2025-01-25", "2025-01-26", "2025-01-27", "2025-01-28", "2025-01-29",
    "2025-01-30", "2025-01-31", "2025-02-01", "2025-02-02", "2025-02-28", "2025-03-01",
    "2025-03-02", "2025-04-03", "2025-04-04", "2025-04-05", "2025-04-06", "2025-05-30",
    "2025-05-31", "2025-06-01", "2025-10-04", "2025-10-05", "2025-10-06", "2025-10-10",
    "2025-10-11", "2025-10-12", "2025-12-31",
    "2026-01-01", "2026-01-02", "2026-01-03", "2026-02-14", "2026-02-15", "2026-02-16",
    "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22",
    "2026-02-27", "2026-02-28", "2026-03-01", "2026-04-03", "2026-04-04", "2026-04-05",
    "2026-04-06", "2026-06-19", "2026-06-20", "2026-06-21", "2026-09-25", "2026-09-26",
    "2026-09-27", "2026-10-09", "2026-10-10", "2026-10-11", "2026-12-31"
];
const MAKEUP_DAYS = ["2025-02-08"];

window.onload = function() {
    if(!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "") {
        console.warn("GAS 網址未設定");
        return;
    }
    
    const visitTimeSelect = document.getElementById('visitTime');
    if (visitTimeSelect) {
        visitTimeSelect.addEventListener('change', calculateTotal);
    }

    fetch(GOOGLE_SCRIPT_URL)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            if (data.msg && data.msg !== "") {
                const marquee = document.getElementById('marquee-text');
                if(marquee) marquee.innerText = data.msg;
            }
            if (data.vacancy && data.vacancy.length > 1) {
                renderVacancyTable(data.vacancy);
            }
            if (data.blockedDates) {
                GLOBAL_BLOCKED_DATA = data.blockedDates;
                updateCalendarBlocking();
            }
        })
        .catch(error => {
            console.error('資料讀取失敗:', error);
        });
};

flatpickr("#dateRange", {
    mode: "range",
    minDate: "today",
    dateFormat: "Y-m-d (D)",
    locale: "zh",
    onChange: function(dates) {
        updateNights(dates);
        calculateTotal();
    }
});

const CAMPING_CONFIG = {
    tent: { rates: { weekday: 700, weekend: 800, holiday: 1000 }, nightRush: { weekday: 500, weekend: 600, holiday: 700 }, discountType: "fixed_amount" },
    moto: { rates: { weekday: 500, weekend: 600, holiday: 800 }, nightRush: { weekday: 200, weekend: 300, holiday: 400 }, discountType: "fixed_amount" },
    solo: { rates: { weekday: 500, weekend: 600, holiday: 800 }, nightRush: { weekday: 200, weekend: 300, holiday: 400 }, discountType: "fixed_amount" },
    car: { rates: { weekday: 600, weekend: 800, holiday: 1000 }, nightRush: { weekday: 500, weekend: 600, holiday: 700 }, discountType: "fixed_amount" },
    camper: { rates: { weekday: 800, weekend: 1000, holiday: 1200 }, nightRush: { weekday: 600, weekend: 700, holiday: 800 }, discountType: "fixed_amount_premium" },
    starcraft: { rates: { weekday: 1800, weekend: 2000, holiday: 2200 }, discountType: "percentage" },
    dt392: { rates: { weekday: 1800, weekend: 2000, holiday: 2200 }, discountType: "percentage" },
    room: { rates: { weekday: 2000, weekend: 2500, holiday: 2800 }, discountType: "percentage" },
    full_basic: { rates: { weekday: 7000, weekend: 10000, holiday: 15000 }, discountType: "full_venue_promo" },
    full_vans: { rates: { weekday: 10000, weekend: 16000, holiday: 18000 }, discountType: "full_venue_promo" },
    full_all: { rates: { weekday: 13000, weekend: 18000, holiday: 20000 }, discountType: "full_venue_promo" },
    venue_hourly: { type: "venue_hourly", weekdayRates: { '3hr': 3000, '5hr': 4500, '6hr': 6000, '8hr': 7500, 'day': 12000 }, holidayRates: { '3hr': 4500, '5hr': null, '6hr': 5500, '8hr': 7000, 'day': 15000 } },
    bicycle: { type: "bicycle", rates: { '2hr': 150, '4hr': 250, 'day': 400, '24hr': 600, '15day': 2500, '30day': 3500 } }
};

function toggleInputs() {
    const type = document.getElementById('campType').value;
    const nightsBlock = document.getElementById('nightsBlock');
    const rentalBlock = document.getElementById('rentalDurationBlock');
    const bikeBlock = document.getElementById('bikeBlock');
    const extraOptions = document.getElementById('extraOptions');
    const addonBlock = document.getElementById('addonBlock');
    const unitNotice = document.getElementById('unitNotice');
    const rushNotice = document.getElementById('rushNotice');
    const policyNotice = document.getElementById('policyNotice');
    const campingRules = document.getElementById('campingRules');
    const venueRules = document.getElementById('venueRules');
    const bikeRules = document.getElementById('bikeRules');
    const unitQtyBlock = document.getElementById('qtyBlock');
    const guestListBlock = document.getElementById('guestListBlock');
    const unitQtySelect = document.getElementById('unitQty');
    
    // === 1. 下拉選單選項邏輯 (針對免裝備住宿的混搭) ===
    let newOptions = "";
    if (type === 'starcraft') {
        // StarCraft + DT392 + 民宿
        newOptions = `
            <option value="1">1</option>
            <option value="2">2 (含 DT392 露營車)</option>
            <option value="3">3 (含 DT392 + 民宿房間)</option>`;
    } else if (type === 'dt392') {
        // DT392 + StarCraft + 民宿
        newOptions = `
            <option value="1">1</option>
            <option value="2">2 (含 StarCraft 美式復古拖車)</option>
            <option value="3">3 (含 StarCraft + 民宿房間)</option>`;
    } else if (type === 'room') {
        // 民宿 + 2台露營車
        newOptions = `
            <option value="1">1</option>
            <option value="2">2 (含 1台露營車)</option>
            <option value="3">3 (含 2台露營車)</option>`;
    } else {
        newOptions = `<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10 (團體請洽官方)</option>`;
    }
    unitQtySelect.innerHTML = newOptions;
    
    // 防呆：切換類型後，如果當前數量在選項裡不存在，重置為1
    // (例如從帳篷選了5，切換到露營車只有3個選項，要跳回1)
    if ((type === 'starcraft' || type === 'dt392' || type === 'room') && parseInt(unitQtySelect.value) > 3) {
        unitQtySelect.value = 1;
    } else if (!unitQtySelect.value) {
        unitQtySelect.value = 1;
    }

    // === 2. 顯示/隱藏區塊 ===
    nightsBlock.classList.add('hidden');
    rentalBlock.classList.add('hidden');
    bikeBlock.classList.add('hidden');
    extraOptions.classList.add('hidden'); 
    if(addonBlock) addonBlock.classList.add('hidden'); 
    if(unitNotice) unitNotice.classList.add('hidden'); 
    if(rushNotice) rushNotice.classList.add('hidden');
    if(policyNotice) policyNotice.classList.add('hidden'); 
    campingRules.classList.add('hidden');
    venueRules.classList.add('hidden');
    if(bikeRules) bikeRules.classList.add('hidden');
    
    document.getElementById('rowRush').classList.add('hidden');
    document.getElementById('rowAC').classList.add('hidden');
    const rowAddons = document.getElementById('rowAddons');
    if(rowAddons) rowAddons.classList.add('hidden');

    if (!type || type === "") {
        hideResult();
        campingRules.classList.remove('hidden'); 
        return;
    }

    if (type === 'venue_hourly') {
        rentalBlock.classList.remove('hidden');
        venueRules.classList.remove('hidden');
    } else if (type === 'bicycle') {
        bikeBlock.classList.remove('hidden');
        if(bikeRules) bikeRules.classList.remove('hidden');
    } else {
        // === 住宿/露營類 ===
        nightsBlock.classList.remove('hidden');
        campingRules.classList.remove('hidden');
        if(addonBlock) addonBlock.classList.remove('hidden');
        const isFullBooking = (type === 'full_basic' || type === 'full_vans' || type === 'full_all');
        if(unitNotice) {
            if (isFullBooking) {
                unitNotice.classList.add('hidden');
            } else {
                unitNotice.classList.remove('hidden');
            }
        }
        if(policyNotice) policyNotice.classList.remove('hidden');
        
        // --- 處理入住時間文字 ---
        const checkInText = document.getElementById('checkInTimeText');
        const visitTimeSelect = document.getElementById('visitTime');
        for (let i = 0; i < visitTimeSelect.options.length; i++) {
            let opt = visitTimeSelect.options[i];
            opt.disabled = false;
            opt.hidden = false;
            if (opt.value === "15:00") { opt.text = "15:00"; }
        }
        
        if (type === 'room' || type === 'starcraft' || type === 'dt392') {
            if(checkInText) {
                checkInText.innerText = TRANSLATIONS[currentLang].checkin_time_val_room;
                checkInText.style.color = "#800080"; checkInText.style.fontWeight = "bold";
            }
            let opt1400 = visitTimeSelect.querySelector('option[value="14:00"]');
            let opt1430 = visitTimeSelect.querySelector('option[value="14:30"]');
            if(opt1400) { opt1400.disabled = true; opt1400.hidden = true; } 
            if(opt1430) { opt1430.disabled = true; opt1430.hidden = true; }
            let opt1500 = visitTimeSelect.querySelector('option[value="15:00"]');
            if(opt1500) { opt1500.text = "15:00 (check in time)"; }
            if(visitTimeSelect.value === "14:00" || visitTimeSelect.value === "14:30") { visitTimeSelect.value = ""; }
        } else {
            if(checkInText) {
                checkInText.innerText = TRANSLATIONS[currentLang].checkin_time_val;
                checkInText.style.color = ""; checkInText.style.fontWeight = "";
            }
        }

        // --- 民宿 vs 露營 的加購邏輯 ---
        const extraPeopleLabel = document.querySelector('[data-i18n="label_extra_people"]');
        const extraPeopleInput = document.getElementById('extraPeople');
        const basicUnitDesc = document.querySelector('[data-i18n="basic_unit"]');

        if (type === 'room') {
            if(basicUnitDesc) basicUnitDesc.innerText = "基本單位：2人 / 1間 (第三人起需加購)";
            if(extraPeopleLabel) extraPeopleLabel.innerText = "➕ 加購選項 (第三/人) 加人 ($300/人)";
            if(extraPeopleInput) {
                extraPeopleInput.max = 2; 
                extraPeopleInput.placeholder = "最多加 2 人";
                if(extraPeopleInput.value > 2) extraPeopleInput.value = 2;
            }
        } else {
            if(basicUnitDesc) basicUnitDesc.innerText = TRANSLATIONS[currentLang].basic_unit;
            if(extraPeopleLabel) extraPeopleLabel.innerText = TRANSLATIONS[currentLang].label_extra_people;
            if(extraPeopleInput) {
                extraPeopleInput.removeAttribute('max'); 
                extraPeopleInput.placeholder = "0";
            }
        }

        // 露營類顯示夜衝(自動)與冷氣
        if (type === 'tent' || type === 'car' || type === 'camper' || type === 'moto' || type === 'solo') {
            extraOptions.classList.remove('hidden');
            document.getElementById('rowAC').classList.remove('hidden');
        } else {
            document.getElementById('isNightRush').checked = false;
            document.getElementById('useAC').checked = false;
        }
    }

    if (type.includes('full') || type === 'bicycle' || type === 'venue_hourly') {
        if(unitQtyBlock) unitQtyBlock.classList.add('hidden');
        if(guestListBlock) guestListBlock.classList.add('hidden');
        document.getElementById('unitQty').value = 1; 
    } else {
        if(unitQtyBlock) unitQtyBlock.classList.remove('hidden');
        generateGuestInputs(); 
    }
    updateCalendarBlocking();
    calculateTotal();
}

function updateCalendarBlocking() {
    const type = document.getElementById('campType').value;
    const picker = document.querySelector("#dateRange")._flatpickr;
    if (!picker) return;
    let datesToDisable = [...(GLOBAL_BLOCKED_DATA.full || [])];
    if (type === 'starcraft') {
        if(GLOBAL_BLOCKED_DATA.starcraft) datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.starcraft);
    } else if (type === 'dt392') {
        if(GLOBAL_BLOCKED_DATA.dt392) datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.dt392);
    } else if (type === 'room') {
        if(GLOBAL_BLOCKED_DATA.room) datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.room);
    } else if (type && type.includes('full')) {
        datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.starcraft || []).concat(GLOBAL_BLOCKED_DATA.dt392 || []).concat(GLOBAL_BLOCKED_DATA.room || []);
    }
    picker.set('disable', datesToDisable);
}

function onQtyChange() {
    generateGuestInputs(); 
    calculateTotal();      
}

function generateGuestInputs() {
    const qty = parseInt(document.getElementById('unitQty').value);
    const container = document.getElementById('guestInputsContainer');
    const block = document.getElementById('guestListBlock');
    if(!container || !block) return;
    container.innerHTML = "";
    if (qty > 1) {
        block.classList.remove('hidden');
        for (let i = 2; i <= qty; i++) {
            const div = document.createElement('div');
            div.style.marginBottom = "10px";
            const label = document.createElement('label');
            label.style.fontSize = "0.9rem"; label.style.color = "#555";
            label.innerText = `第 ${i} 位代表姓名：`; 
            const input = document.createElement('input');
            input.type = "text"; input.className = "guest-name-input"; 
            input.placeholder = `請輸入第 ${i} 帳/車的代表姓名`;
            input.style.width = "100%"; input.style.padding = "8px";
            input.style.border = "1px solid #ddd"; input.style.borderRadius = "4px";
            div.appendChild(label); div.appendChild(input); container.appendChild(div);
        }
    } else {
        block.classList.add('hidden');
    }
}

function updateNights(dates) {
    if (dates.length === 2) {
        const diffTime = Math.abs(dates[1] - dates[0]);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        document.getElementById('nights').value = diffDays;
        selectedDates = dates;
    } else {
        document.getElementById('nights').value = 0;
        selectedDates = [];
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function calculateTotal() {
    const type = document.getElementById('campType').value;
    if (!type || type === "") { hideResult(); return; }
    const config = CAMPING_CONFIG[type];
    if (selectedDates.length === 0) { hideResult(); return; }
    let finalPrice = 0;
    
    if (type === 'bicycle') {
        const qty = parseInt(document.getElementById('bikeQty').value) || 1;
        const scheme = document.getElementById('bikeScheme').value;
        finalPrice = config.rates[scheme] * qty;
        document.getElementById('basePrice').innerText = finalPrice;
        document.getElementById('finalTotal').innerText = finalPrice;
        document.getElementById('discountPrice').parentElement.classList.add('hidden');
        document.getElementById('resultBox').classList.remove('hidden');
        return;
    }

    if (type === 'venue_hourly') {
        const scheme = document.getElementById('rentalScheme').value;
        const checkInDate = new Date(selectedDates[0]);
        const dateStr = formatDate(checkInDate);
        const dayOfWeek = checkInDate.getDay(); 
        let isVenueHoliday = (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0 || HOLIDAYS.includes(dateStr));
        if (MAKEUP_DAYS.includes(dateStr)) { isVenueHoliday = false; }
        if (isVenueHoliday) {
            if (scheme === '5hr') {
                alert("假日無 5 小時方案，將為您切換為 3 小時方案。");
                document.getElementById('rentalScheme').value = '3hr';
                finalPrice = config.holidayRates['3hr'];
            } else { finalPrice = config.holidayRates[scheme]; }
        } else { finalPrice = config.weekdayRates[scheme]; }
        document.getElementById('basePrice').innerText = finalPrice;
        document.getElementById('finalTotal').innerText = finalPrice;
        document.getElementById('discountPrice').parentElement.classList.add('hidden');
        document.getElementById('resultBox').classList.remove('hidden');
        return;
    }

    const nights = parseInt(document.getElementById('nights').value);
    if (nights < 1) { hideResult(); return; }
    
    let qty = 1;
    const qtyBlock = document.getElementById('qtyBlock');
    if (qtyBlock && !qtyBlock.classList.contains('hidden')) {
        qty = parseInt(document.getElementById('unitQty').value) || 1;
    }

    // 自動判定是否為夜衝（看時間是否 >= 21:00）
    let isNightRush = false;
    const visitTime = document.getElementById('visitTime').value;
    if (visitTime && config.nightRush) {
        const hour = parseInt(visitTime.split(':')[0]);
        if (hour >= 21) {
            isNightRush = true;
        }
    }
    document.getElementById('isNightRush').checked = isNightRush;
    
    const useAC = document.getElementById('useAC').checked;
    
    let rushWarning = document.getElementById('rushWarningText');
    if (!rushWarning) {
        const rushOption = document.getElementById('isNightRush').parentElement;
        rushWarning = document.createElement('div');
        rushWarning.id = 'rushWarningText';
        rushWarning.style.color = 'red'; rushWarning.style.fontSize = '0.9rem';
        rushWarning.style.marginTop = '5px'; rushWarning.style.fontWeight = 'bold';
        rushOption.parentElement.appendChild(rushWarning);
    }
    if (isNightRush && nights === 1) {
        rushWarning.innerText = "💡 提醒：您只選了 1 晚，系統將僅計算「純夜衝」費用。若您是要「夜衝+續住露營」，請務必選擇 2 晚 (例如週五~週日)。";
        rushWarning.classList.remove('hidden');
    } else {
        rushWarning.classList.add('hidden');
    }

    let basePrice = 0; let rushPrice = 0; let acPrice = 0;
    let hasWeekend = false;
    let currentDate = new Date(selectedDates[0]);

    for (let i = 0; i < nights; i++) {
        let dateStr = formatDate(currentDate);
        let dayOfWeek = currentDate.getDay();
        let rateType = 'weekday';
        if (MAKEUP_DAYS.includes(dateStr)) { rateType = 'weekday'; } 
        else if (HOLIDAYS.includes(dateStr)) { rateType = 'holiday'; } 
        else if (dayOfWeek === 5 || dayOfWeek === 6) { rateType = 'weekend'; hasWeekend = true; }

        // 🔥 核心邏輯：計算混合住宿的房價
        // 因為 "民宿" (Room) 和 "露營車" (RV) 價格不同，必須分開計算
        let dailyBase = 0;
        let rvRate = CAMPING_CONFIG.starcraft.rates[rateType]; // 露營車價格 (Starcraft/DT392 價格相同)
        let roomRate = CAMPING_CONFIG.room.rates[rateType];   // 民宿價格

        if (type === 'starcraft' || type === 'dt392') {
            // 主選：露營車
            if (qty === 1) {
                dailyBase = rvRate; 
            } else if (qty === 2) {
                dailyBase = rvRate * 2; // 兩台露營車
            } else if (qty === 3) {
                dailyBase = (rvRate * 2) + roomRate; // 兩台車 + 一間房
            }
        } else if (type === 'room') {
            // 主選：民宿
            if (qty === 1) {
                dailyBase = roomRate;
            } else if (qty === 2) {
                dailyBase = roomRate + rvRate; // 一間房 + 一台車
            } else if (qty === 3) {
                dailyBase = roomRate + (rvRate * 2); // 一間房 + 兩台車
            }
        } else {
            // 其他類型 (帳篷等)，單純相乘
            dailyBase = config.rates[rateType] * qty;
        }
        
        // 累加每日房價
        basePrice += dailyBase;

        // 計算夜衝 (只在第一晚且符合資格時)
        if (i === 0 && isNightRush && config.nightRush) {
            let rushType = rateType; 
            // 注意：這裡夜衝如果是混搭，簡單起見我們用主選類型的夜衝規則 x 數量
            // 露營車夜衝目前是平日$600/假日$700... (待確認民宿夜衝規則，目前沿用主選單位的邏輯)
            if(type === 'camper') { rushPrice += config.nightRush[rushType] * 0.8 * qty; } 
            else { rushPrice += config.nightRush[rushType] * qty; }
        } 
        
        if (useAC) { acPrice += 100 * qty; }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // 注意：上面的迴圈已經把 qty 乘進去了 (針對混搭房型)，所以這裡不需要再乘 qty
    // 但是對於普通帳篷 (type='tent')，上面的邏輯還是 basePrice += unitPrice * qty
    // 為了保險起見，我們檢查一下是否為混搭類型
    // 如果是混搭類型 (rv/room)，basePrice 已經在迴圈內處理好總價了，不用再乘 qty
    // 如果是普通類型，basePrice 也是在迴圈內乘好 qty 了
    // 所以這裡不需要再做 basePrice = basePrice * qty;

    const extraPeople = parseInt(document.getElementById('extraPeople').value) || 0;
    const extraCars = parseInt(document.getElementById('extraCars').value) || 0;
    const visitors = parseInt(document.getElementById('visitors').value) || 0;
    
    let extraPersonRate = 200; 
    if (type === 'room') {
        extraPersonRate = 300; 
    }
    const extraPeopleCost = extraPeople * extraPersonRate * nights;
    
    const extraCarsCost = extraCars * 300 * nights;
    const visitorsCost = visitors * 100;
    const totalAddonCost = extraPeopleCost + extraCarsCost + visitorsCost;

    const rowAddons = document.getElementById('rowAddons');
    if (totalAddonCost > 0) {
        rowAddons.classList.remove('hidden');
        document.getElementById('addonPrice').innerText = totalAddonCost;
    } else { rowAddons.classList.add('hidden'); }

    let discount = 0;
    document.getElementById('discountPrice').parentElement.classList.remove('hidden');
    let isHolidayForDiscount = false;
    let checkDate = new Date(selectedDates[0]);
    for(let k=0; k<nights; k++) {
        if (HOLIDAYS.includes(formatDate(checkDate))) { isHolidayForDiscount = true; break; }
        checkDate.setDate(checkDate.getDate() + 1);
    }
    
    // 計算折扣用的基準總價 (不含加購)
    let totalPriceForDiscount = basePrice + rushPrice + acPrice; 
    
    if (config.discountType === 'full_venue_promo') {
        if (nights >= 2) { discount = totalPriceForDiscount * 0.15; }
    } else if (config.discountType === 'percentage') {
        if (isHolidayForDiscount && nights >= 3) discount = totalPriceForDiscount * 0.15;
        else if (nights >= 2) discount = totalPriceForDiscount * 0.10;
    } else if (config.discountType === 'fixed_amount' || config.discountType === 'fixed_amount_premium') {
        let perUnitDiscount = 0;
        if (isHolidayForDiscount && nights >= 3) perUnitDiscount = 500;
        else if (hasWeekend && nights === 3) perUnitDiscount = (config.discountType === 'fixed_amount_premium') ? 500 : 200;
        else if (!hasWeekend && !isHolidayForDiscount && nights >= 3) perUnitDiscount = 100 * nights;
        discount = perUnitDiscount * qty;
    }

    let total = Math.round(basePrice + rushPrice + acPrice + totalAddonCost - discount);
    document.getElementById('basePrice').innerText = basePrice;
    document.getElementById('rushPrice').innerText = Math.round(rushPrice); 
    document.getElementById('acPrice').innerText = acPrice;
    document.getElementById('discountPrice').innerText = Math.round(discount);
    document.getElementById('finalTotal').innerText = total;
    
    if (document.getElementById('extraOptions').classList.contains('hidden')) {
        document.getElementById('rowRush').classList.add('hidden');
        document.getElementById('rowAC').classList.add('hidden');
    }
    document.getElementById('resultBox').classList.remove('hidden');
}

function submitOrder() {
    const warningMsg = "⚠️抵達營區入口時，請勿直接入場，請先撥電話告知營主！非常重要❗️感謝配合🙏";
    if (!confirm(warningMsg + "\n\n確認送出訂單？")) {
        return; 
    }

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const line = document.getElementById('customerLine').value.trim();
    const note = document.getElementById('customerNote').value.trim();
    const visitTime = document.getElementById('visitTime').value; 
    if (!name || !phone) { alert(TRANSLATIONS[currentLang].alert_fill); return; }
    const typeSelect = document.getElementById('campType');
    const typeText = typeSelect.options[typeSelect.selectedIndex].text;
    const typeValue = typeSelect.value; 
    if (typeValue === 'room' || typeValue === 'starcraft' || typeValue === 'dt392') {
        const confirmMsg = TRANSLATIONS[currentLang].confirm_room_policy; 
        if (!confirm(confirmMsg)) { return; }
    }
    const dateRange = document.getElementById('dateRange').value;
    const total = document.getElementById('finalTotal').innerText;
    
    // 🔥 修改：訂單詳情也要顯示具體的選擇 (例如 "數量: 3 (含民宿)")
    let details = `【${typeText}】`;
    
    let qty = 1;
    const qtyBlock = document.getElementById('qtyBlock');
    if (qtyBlock && !qtyBlock.classList.contains('hidden')) {
        const unitQtySelect = document.getElementById('unitQty');
        qty = parseInt(unitQtySelect.value);
        // 取得下拉選單選中的文字 (例如 "2 (含 DT392)")
        const qtyText = unitQtySelect.options[unitQtySelect.selectedIndex].text;
        details += ` / 數量:${qtyText}`; 
    }
    
    if (typeValue === 'bicycle') {
        const schemeSelect = document.getElementById('bikeScheme');
        const schemeText = schemeSelect.options[schemeSelect.selectedIndex].text;
        details += ` / 方案:${schemeText}`;
    } else if (typeValue === 'venue_hourly') {
        const schemeSelect = document.getElementById('rentalScheme');
        const schemeText = schemeSelect.options[schemeSelect.selectedIndex].text;
        details += ` / 方案:${schemeText}`;
    } else {
        const nights = document.getElementById('nights').value;
        details += ` / ${nights}晚`;
        
        const extraPeople = document.getElementById('extraPeople').value;
        const extraCars = document.getElementById('extraCars').value;
        const visitors = document.getElementById('visitors').value;
        if(parseInt(extraPeople) > 0) { details += ` / 加人:${extraPeople}`; }
        if(parseInt(extraCars) > 0) { details += ` / 加車:${extraCars}`; }
        if(parseInt(visitors) > 0) { details += ` / 訪客:${visitors}`; }
        if (!document.getElementById('extraOptions').classList.contains('hidden')) {
            if(document.getElementById('isNightRush').checked) { details += " (含夜衝)"; }
            if(document.getElementById('useAC').checked) { details += " (含冷氣)"; }
        }
        const guestInputs = document.querySelectorAll('.guest-name-input');
        let guestNames = [];
        guestInputs.forEach((input, index) => {
            if(input.value.trim() !== "") { guestNames.push(`(第${index+2}位: ${input.value.trim()})`); }
        });
        if (guestNames.length > 0) { details += `\n同行：${guestNames.join('、')}`; }
    }
    if(visitTime) { details += ` / 預計時間:${visitTime}`; }

    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerText;
    btn.innerText = "⏳ 處理中..."; btn.disabled = true;
    const orderData = { name: name, phone: phone, line: line, dateRange: dateRange, itemDetails: details, totalPrice: total, note: note };
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST", body: JSON.stringify(orderData), headers: { "Content-Type": "text/plain" }
    })
    .then(response => {
        alert(TRANSLATIONS[currentLang].sent_success);
        document.getElementById('customerName').value = ''; document.getElementById('customerPhone').value = '';
        document.getElementById('customerLine').value = ''; document.getElementById('customerNote').value = '';
        btn.innerText = "✅ 完成";
        setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 3000);
    })
    .catch(error => {
        console.error('Error:', error); alert("連線忙碌中，請稍後再試，或直接私訊官方 LINE。");
        btn.innerText = originalText; btn.disabled = false;
    });
}

function hideResult() { document.getElementById('resultBox').classList.add('hidden'); }
function resetForm() {
    const picker = document.querySelector("#dateRange")._flatpickr; picker.clear();
    document.getElementById('campType').value = ""; toggleInputs(); 
    document.getElementById('nights').value = '0';
    document.getElementById('isNightRush').checked = false; document.getElementById('useAC').checked = false;
    document.getElementById('bikeQty').value = 1; document.getElementById('extraPeople').value = 0;
    document.getElementById('extraCars').value = 0; document.getElementById('visitors').value = 0;
    document.getElementById('visitTime').selectedIndex = 0; hideResult();
}
function showModal(title, desc) {
    document.getElementById('modalTitle').innerText = title; document.getElementById('modalDesc').innerText = desc;
    const modal = document.getElementById('infoModal'); if(modal) { modal.classList.remove('hidden'); setTimeout(() => { modal.classList.add('show'); }, 10); }
}
function closeModal() {
    const modal = document.getElementById('infoModal'); if(modal) { modal.classList.remove('show'); setTimeout(() => { modal.classList.add('hidden'); }, 300); }
}
function renderVacancyTable(rows) {
    const tableDiv = document.getElementById('dynamic-vacancy-table'); if (!tableDiv) return;
    let html = '<table style="width:100%; border-collapse:collapse; font-size:0.9rem; text-align:center;">';
    html += '<thead style="background-color:#f1f8f6; color:#2c5e50;"><tr>';
    rows[0].forEach(cell => { html += `<th style="border:1px solid #ddd; padding:10px;">${cell}</th>`; });
    html += '</tr></thead><tbody>';
    for (let i = 1; i < rows.length; i++) {
        html += '<tr>';
        rows[i].forEach(cell => {
            let style = 'border:1px solid #ddd; padding:10px;';
            let cellText = cell.toString();
            if (cellText.includes('滿') || cellText.includes('X') || cellText.includes('包場')) { style += 'background-color:#ffebee; color:#d32f2f; font-weight:bold;'; } 
            else if (cellText.includes('O') || cellText.includes('⭕')) { style += 'color:#2c5e50;'; }
            if (cellText.includes('T00:00:00')) {
                let dateObj = new Date(cellText); cellText = `${dateObj.getMonth()+1}/${dateObj.getDate()}`;
            }
            html += `<td style="${style}">${cellText}</td>`;
        });
        html += '</tr>';
    }
    html += '</tbody></table>';
    tableDiv.innerHTML = html;
}
function selectPlan(planValue) {
    const select = document.getElementById('campType'); select.value = planValue;
    toggleInputs(); const target = document.getElementById('calculatorSection');
    if(target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    
}