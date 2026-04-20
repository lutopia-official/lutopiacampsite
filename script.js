/* ==========================================
   0. 全域變數與設定
========================================== */
let currentLang = 'zh';
let selectedDates = []; 

let GLOBAL_BLOCKED_DATA = { full: [], starcraft: [], dt392: [], room: [] };

// ⚠️ 請確認這是您最新的網址
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwE4JzNMfmaLDF997ZphXIZklweAqwkKiij-jueG_AhQHGuiV1mAHaUG70zt2RLWpjo7g/exec";

// ==========================================
// 🛠️ 1. 系統優化工具函數 (Utility Functions)
// ==========================================
const hideElements = (ids) => ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
});

const showElements = (ids) => ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
});

let VISIT_TIME_ORIGINAL_OPTIONS = null;

function cacheVisitTimeOptions() {
  const sel = document.getElementById('visitTime');
  if (!sel || VISIT_TIME_ORIGINAL_OPTIONS) return;
  VISIT_TIME_ORIGINAL_OPTIONS = Array.from(sel.options).map(o => ({
    value: o.value, text: o.text
  }));
}

function restoreVisitTimeOptions() {
  const sel = document.getElementById('visitTime');
  if (!sel || !VISIT_TIME_ORIGINAL_OPTIONS) return;
  Array.from(sel.options).forEach(opt => {
    const found = VISIT_TIME_ORIGINAL_OPTIONS.find(x => x.value === opt.value);
    if (found) opt.text = found.text;
    opt.disabled = false; opt.hidden = false;
  });
}

function stripNightRushLabels() {
  const sel = document.getElementById('visitTime');
  if (!sel) return;
  const re = /\s*[\(\（]\s*(夜衝開始|夜衝結束|最晚入場|Night Rush Start|Night Rush End|Latest Entry|前泊開始|前泊終了)\s*[\)\）]\s*/g;
  Array.from(sel.options).forEach(opt => {
    opt.text = String(opt.text || '').replace(re, '');
  });
}

const TRANSLATIONS = {
  zh: {
    loading: "資料載入中...", calc_title: "🌲 露營/場地/周邊服務費用試算", basic_unit: "基本單位：4人 / 1車 / 1帳 / 1車邊帳or車尾帳",
    important_notice: "重要提醒：", checkin_time_val: "⏰ 紮營時間：下午 14:00 以後 (請勿提早)", checkin_time_val_room: "🏡 錄托邦住宿入住時間：下午 15:00 以後 (請勿提早，可以提早放置行李，請先告知)",
    dont_early: "(請勿提早)", eco_policy_label: "環保旅宿：", eco_policy_desc: "♻️ 環保旅宿：不提供一次性備品 (請自備毛巾、牙刷)", checkin_time_label: "入住時間：",
    label_type: "類型選擇：", select_placeholder: "請選擇類型...", label_unit_qty: "預訂數量 (帳/車/間)：",
    group_camping: "⛺ 露營模式", group_rental: "🚐 免裝備租賃/民宿", group_full: "🎉 包場住宿", group_venue: "🎪 場地活動租借", group_bike: "🚲 周邊服務",
    opt_tent: "自搭帳篷", opt_moto: "機車、單車露營", opt_solo: "單人小帳棚", opt_car: "車泊、車露", opt_camper: "自備露營車/拖車",
    opt_starcraft: "StarCraft 美式復古拖車", opt_dt392: "大馳 DT392 露營車", opt_room: "錄托邦民宿房間",
    opt_full_basic: "純場地包場", opt_full_vans: "包場+2台露營車", opt_full_all: "包場+2台露營車+房間", opt_venue_hourly: "場地租借 (按時數計費)", opt_bicycle: "單車租借",
    label_date: "預約日期：", date_placeholder: "請點擊選擇日期...", label_time: "預計抵達/取車時間：", time_placeholder: "請選擇時間...",
    label_nights: "住宿晚數 (自動)：", label_rental_scheme: "租借時數方案：", label_bike_qty: "租借數量 (台)：", label_bike_scheme: "租借方案：",
    addon_title: "➕ 一般加購 (人/訪客)", label_extra_people: "加人 ($300/人/晚)", label_kid_free: "*小一以下免費", label_visitor: "訪客 ($100/人，23:00離場)：",
    cb_night_rush: "我要夜衝 (20:00-23:00入場)", cb_ac: "使用冷氣 (+100元/晚)", cb_pet: "攜帶寵物 (+100元/晚)",
    btn_calc: "更新費用", btn_reset: "重新填寫", result_title: "試算結果", res_base: "基本費用：", res_addon: "加購費用：", res_rush: "夜衝費用：", res_ac: "冷氣加價：", res_discount: "符合折扣：", res_total: "總計金額：",
    customer_info_title: "📝 預訂資料填寫", ph_name: "您的姓名 (必填)", ph_phone: "聯絡電話 (必填)", ph_note: "其他備註需求 (例如：露營相關、租單車者身高...)", btn_submit: "🚀 確認預訂並送出", alert_fill: "請務必填寫「姓名」與「電話」才能送出訂單喔！",
    confirm_room_policy: "🛑【訂位前請確認】\n\n1. 🏡 錄托邦住宿入住時間：下午 15:00 以後。\n   (請勿提早，可以提早放置行李，請先告知)\n\n2. ♻️ 環保旅宿：不提供一次性備品。\n   (請自備毛巾、牙刷)\n\n請問您是否接受並繼續訂位？",
    rule_title_basic: "🔷 收費標準與營區規定", rule_sub_price: "💰 營位計費標準", rule_li_unit: "基本單位：4人 / 1車 / 1帳 / 1炊事帳。", rule_li_add_person: "加人：多1人加 $300 (國小一年級以下免費)。", rule_li_add_car: "加車：多停一台車加收 $300 (拖車不在此限)。", rule_li_visitor: "訪客：每人 $100，需於 23:00 前離場。", rule_sub_tent: "⛺ 搭帳與冷氣規範", rule_li_big_tent: "大型帳篷：神殿、怪獸、5x8天幕等請訂2個營位。", rule_li_ac_fee: "冷氣使用：車上/帳內使用冷氣接電，酌收 $100/晚。", rule_li_warning: "未告知搭設大帳者，現場將禁止搭設。", rule_sub_rush: "🌙 夜衝服務 (限自搭帳)", rule_li_rush_time: "時間：20:00 後入場，23:30 前搭完。", rule_li_rush_price: "費用：夜衝價格依各營位有所不同，請以系統試算為準。", rule_li_rush_rv: "🚐 自備露營車夜衝依金額打 8 折。",
    rule_noise_title: "🚫 噪音管制 (嚴格執行)", rule_noise_head: "⚠️ 晚間 10:30 過後<br>非常嚴厲禁止使用：", rule_noise_list: "❌ 卡啦OK唱歌<br>❌ 放音樂<br>❌ 大聲喧嘩", rule_noise_punish: "‼️ 違者將強制要求離場 ‼️<br>🚫 並且不會退費",
    rule_title_policy: "⚠️ 住宿取消政策與付款", rule_sub_refund: "📅 取消退費標準", ref_14: "14天前", ref_desc_14: "退 100% (扣手續費) 或改期", ref_10: "10-13天前", ref_desc_10: "退 70% (2日內補差額)", ref_7: "7-9天前", ref_desc_7: "退 50%",
    pricing_title: "全區獨享包場方案", pricing_desc: "選擇適合您的規模，平日/假日/連假皆有不同優惠", plan_a_title: "方案 A：純場地自由配", plan_b_title: "方案 B：場地 + 露營車", plan_c_title: "方案 C：豪華全配版", btn_book_a: "預約方案 A", btn_book_b: "預約方案 B", btn_book_c: "預約方案 C",
    opt_inc_dt392: "(含 大馳 DT392)", opt_inc_starcraft: "(含 StarCraft 美式復古拖車)", opt_inc_room: "(含 錄托邦民宿房間)", opt_inc_both_rv: "(含 StarCraft + DT392)", opt_inc_room_starcraft: "(含 StarCraft + 民宿房間)", opt_inc_room_dt392: "(含 DT392 + 民宿房間)", opt_group_contact: "(團體請洽官方)"
  },
  en: {
    loading: "Loading...", calc_title: "🌲 Camping Calculator", basic_unit: "Unit: 4 pax / 1 car / 1 tent",
    important_notice: "Important Notice:", checkin_time_val: "⏰ Check-in: After 14:00", checkin_time_val_room: "🏡 Check-in: After 15:00",
    dont_early: "(No early check-in)", eco_policy_label: "Eco-friendly:", eco_policy_desc: "No disposable amenities.",
    label_type: "Type:", select_placeholder: "Select...", label_unit_qty: "Quantity:",
    group_camping: "⛺ Camping", group_rental: "🚐 Rental", group_full: "🎉 Full Booking", group_venue: "🎪 Venue", group_bike: "🚲 Services",
    label_date: "Date:", date_placeholder: "Select dates...", label_time: "Time:", time_placeholder: "Select time...",
    label_nights: "Nights:", addon_title: "➕ Add-ons",
    btn_calc: "Calculate", btn_reset: "Reset", result_title: "Result",
    res_base: "Base Price:", res_addon: "Add-ons:", res_rush: "Night Rush:", res_ac: "AC Fee:", res_discount: "Discount:", res_total: "Total:",
    customer_info_title: "📝 Customer Info", btn_submit: "Submit Order",
    confirm_room_policy: "🛑【Please Confirm】\n\n1. Check-in: After 15:00.\n2. Eco-friendly: No disposable amenities.\n\nDo you accept and wish to proceed?"
  },
  jp: {
    loading: "読み込み中...", calc_title: "🌲 キャンプ料金計算", basic_unit: "単位：4人 / 1車 / 1テント",
    important_notice: "重要なお知らせ：", checkin_time_val: "⏰ チェックイン：14:00以降", checkin_time_val_room: "🏡 チェックイン：15:00以降",
    dont_early: "(アーリーチェックイン不可)", eco_policy_label: "エコポリシー：", eco_policy_desc: "使い捨てアメニティなし",
    label_type: "タイプ：", select_placeholder: "選択...", label_unit_qty: "数量：",
    group_camping: "⛺ キャンプ", group_rental: "🚐 レンタル", group_full: "🎉 貸切", group_venue: "🎪 会場", group_bike: "🚲 サービス",
    label_date: "日付：", date_placeholder: "日付を選択...", label_time: "時間：", time_placeholder: "時間を選択...",
    label_nights: "宿泊数：", addon_title: "➕ 追加オプション",
    btn_calc: "計算する", btn_reset: "リセット", result_title: "計算結果",
    res_base: "基本料金：", res_addon: "追加料金：", res_rush: "前泊料金：", res_ac: "エアコン：", res_discount: "割引：", res_total: "合計金額：",
    customer_info_title: "📝 予約情報", btn_submit: "予約を確定する",
    confirm_room_policy: "🛑【ご確認ください】\n\n1. チェックイン: 15:00以降。\n2. エコポリシー: 使い捨てアメニティなし。\n\n同意して予約を続行しますか？"
  }
};

const HOLIDAYS = [
    "2026-01-01", "2026-02-14", "2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22", 
    "2026-02-27", "2026-02-28", "2026-03-01", "2026-04-03", "2026-04-04", "2026-04-05", "2026-04-06", "2026-05-01", "2026-05-02", "2026-05-03",
    "2026-06-19", "2026-06-20", "2026-06-21", "2026-09-25", "2026-09-26", "2026-09-27", "2026-10-09", "2026-10-10", "2026-10-11", "2026-12-31"
];
const MAKEUP_DAYS = [ "2026-02-07", "2026-02-21" ];
const CNY_DAYS = [ "2026-02-14", "2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22" ];
const HOLIDAY_BLOCKS = [
    ["2026-02-14", "2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21"], 
    ["2026-02-27", "2026-02-28"], ["2026-04-03", "2026-04-04", "2026-04-05"], ["2026-05-01", "2026-05-02"], 
    ["2026-06-19", "2026-06-20"], ["2026-09-25", "2026-09-26"], ["2026-10-09", "2026-10-10"]  
];

function changeLanguage(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang] || TRANSLATIONS['zh'];
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (t && t[key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') element.placeholder = t[key];
      else element.innerHTML = t[key];
    }
  });
  toggleInputs(); calculateTotal();
}
window.changeLanguage = changeLanguage;

// 修復 3: 移除 window.onload 內多餘的語言綁定
window.onload = function () {
  const visitTimeSelect = document.getElementById('visitTime');
  if (visitTimeSelect) { cacheVisitTimeOptions(); visitTimeSelect.addEventListener('change', calculateTotal); }

  fetch(GOOGLE_SCRIPT_URL)
    .then(response => { if (!response.ok) throw new Error("Network response was not ok"); return response.json(); })
    .then(data => {
      if (data.msg && data.msg !== "") { const marquee = document.getElementById('marquee-text'); if (marquee) marquee.innerText = data.msg; }
      if (data.blockedDates) { GLOBAL_BLOCKED_DATA = data.blockedDates; updateCalendarBlocking(); }
    })
    .catch(error => { console.error('資料讀取失敗:', error); });
};

let hasShownDateNotice = false;
try {
    // 修復 2: 呼叫 zh 語言包設定
    flatpickr("#dateRange", {
      mode: "range", minDate: "today", dateFormat: "Y-m-d (D)", locale: "zh",
      onOpen: function() {
        if (!hasShownDateNotice) { alert("⚠️ 【預約日期選擇提醒】\n\n請務必點選「進場日期」與「退場日期」！\n(不然無法算出價格唷，請點選出進、退場時間)"); hasShownDateNotice = true; }
      },
      onChange: function (dates) { updateNights(dates); checkCarBedVipAvailability(); calculateTotal(); }
    });
} catch(e) { console.error("Flatpickr 初始化失敗", e); }

function checkCarBedVipAvailability() {
    const carBedOption = document.querySelector('option[value="car_bed_vip"]');
    if (!carBedOption) return;
    let hasHoliday = false;
    if (selectedDates.length >= 2) {
        let currentDate = new Date(selectedDates[0]);
        const endDate = new Date(selectedDates[1]);
        while (currentDate < endDate) {
            const dateStr = formatDate(currentDate);
            if ((HOLIDAYS.includes(dateStr) || CNY_DAYS.includes(dateStr)) && !MAKEUP_DAYS.includes(dateStr)) { hasHoliday = true; break; }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    const campTypeSelect = document.getElementById('campType');
    if (hasHoliday) {
        carBedOption.disabled = true; carBedOption.text = "🚙 車床天地特約 (連假不適用)";
        if (campTypeSelect.value === 'car_bed_vip') { alert("⚠️ 抱歉，車床天地特約方案「連假期間」不適用，請改選一般車泊或其他方案。"); campTypeSelect.value = ""; toggleInputs(); }
    } else {
        carBedOption.disabled = false; carBedOption.text = "🚙 車床天地特約會員 (需驗證編號)";
    }
}

const CAMPING_CONFIG = {
  tent: { rates: { weekday: 700, weekend: 800, holiday: 1000, cny: 1200 }, nightRush: { weekday: 500, weekend: 600, holiday: 600, cny: 800 }, discountType: "fixed_amount" },
  moto: { rates: { weekday: 400, weekend: 500, holiday: 600, cny: 800 }, nightRush: { weekday: 300, weekend: 400, holiday: 500, cny: 500 }, discountType: "fixed_amount" },
  solo: { rates: { weekday: 400, weekend: 500, holiday: 600, cny: 800 }, nightRush: { weekday: 300, weekend: 400, holiday: 500, cny: 500 }, discountType: "fixed_amount" },
  car: { rates: { weekday: 600, weekend: 700, holiday: 800, cny: 1100 }, nightRush: { weekday: 500, weekend: 600, holiday: 600, cny: 800 }, discountType: "fixed_amount" },
  car_bed_vip: { people_rates: { 1: { weekday: 250, weekend: 350, holiday: 350, cny: 350 }, 2: { weekday: 300, weekend: 400, holiday: 400, cny: 400 }, 3: { weekday: 400, weekend: 500, holiday: 500, cny: 500 }, 4: { weekday: 500, weekend: 600, holiday: 600, cny: 600 } }, tent_add_on: { weekday: 50, weekend: 50, holiday: 50, cny: 50 }, ac_fee: 50, nightRush: { weekday: 300, weekend: 400, holiday: 500, cny: 500 }, discountType: "none" },
  camper: { rates: { weekday: 800, weekend: 1000, holiday: 1200, cny: 1500 }, nightRush: { weekday: 600, weekend: 700, holiday: 800, cny: 800 }, discountType: "fixed_amount_premium" },
  starcraft: { rates: { weekday: 1800, weekend: 2000, holiday: 2600, cny: 2800 }, discountType: "percentage" },
  dt392: { rates: { weekday: 1600, weekend: 1800, holiday: 2000, cny: 2400 }, discountType: "percentage" },
  room: { rates: { weekday: 2200, weekend: 2400, holiday: 2500, cny: 2600 }, discountType: "percentage" },
  full_basic: { rates: { weekday: 7000, weekend: 10000, holiday: 15000, cny: 15000 }, discountType: "full_venue_promo" },
  full_vans: { rates: { weekday: 10000, weekend: 16000, holiday: 18000, cny: 18000 }, discountType: "full_venue_promo" },
  full_all: { rates: { weekday: 13000, weekend: 18000, holiday: 20000, cny: 20000 }, discountType: "full_venue_promo" },
  venue_hourly: { type: "venue_hourly", weekdayRates: { '3hr': 3000, '5hr': 4500, '6hr': 6000, '8hr': 7500, 'day': 12000 }, holidayRates: { '3hr': 4500, '5hr': null, '6hr': 5500, '8hr': 7000, 'day': 15000 } },
  bicycle: { type: "bicycle", rates: { '2hr': 150, '4hr': 250, 'day': 400, '24hr': 600, '15day': 2500, '30day': 3500 } }
};

const TYPE_RULES = {
    room: { unitText: "基本單位：2人 / 1間 (第三人起需加購)", extraLabel: "加人 ($300/人)", maxExtra: 2 },
    starcraft: { unitText: "基本單位：2人 / 1車 (最多可加2人)", extraLabel: "加人 ($200/人)", maxExtra: 2 },
    dt392: { unitText: "基本單位：2人 / 1車 (最多可加1人)", extraLabel: "加人 ($200/人)", maxExtra: 1 }
};

function toggleInputs() {
  const type = document.getElementById('campType').value;
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS['zh'];
  const unitQtySelect = document.getElementById('unitQty');

  let newOptions = "";
  if (type === 'room') { newOptions = `<option value="1">1</option><option value="2">2 ${t.opt_inc_starcraft}</option><option value="3">3 ${t.opt_inc_dt392}</option><option value="4">4 ${t.opt_inc_both_rv}</option>`; } 
  else if (type === 'starcraft') { newOptions = `<option value="1">1</option><option value="2">2 ${t.opt_inc_room}</option><option value="3">3 ${t.opt_inc_dt392}</option><option value="4">4 ${t.opt_inc_room_dt392}</option>`; } 
  else if (type === 'dt392') { newOptions = `<option value="1">1</option><option value="2">2 ${t.opt_inc_room}</option><option value="3">3 ${t.opt_inc_starcraft}</option><option value="4">4 ${t.opt_inc_room_starcraft}</option>`; } 
  else { newOptions = `<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10 ${t.opt_group_contact}</option>`; }
  unitQtySelect.innerHTML = newOptions;

  if ((['starcraft', 'dt392', 'room'].includes(type)) && parseInt(unitQtySelect.value) > 4) { unitQtySelect.value = 1; } 
  else if (!unitQtySelect.value) { unitQtySelect.value = 1; }

  // 隱藏區塊
  hideElements([
      'nightsBlock', 'rentalDurationBlock', 'bikeBlock', 'extraOptions',
      'addonBlock', 'premiumAddonBlock', 'unitNotice', 'policyNotice', 'campingRules',
      'carBedBlock', 'rowRush', 'rowAC', 'rowAddons', 'rowPremium'
  ]);

  if (!type || type === "") { hideResult(); showElements(['campingRules']); return; }

  if (type === 'venue_hourly') { showElements(['rentalDurationBlock']); } 
  else if (type === 'bicycle') { showElements(['bikeBlock']); } 
  else {
    showElements(['nightsBlock', 'campingRules', 'policyNotice']);
    
    if (type === 'car_bed_vip') {
        showElements(['carBedBlock', 'extraOptions']);
        const acSpan = document.querySelector('[data-i18n="cb_ac"]'); if(acSpan) acSpan.innerText = "使用冷氣 (+50元/晚)";
    } else {
        // ✅ 顯示 VVIP 聯名加購與一般加購
        showElements(['addonBlock', 'premiumAddonBlock']); 
        const acSpan = document.querySelector('[data-i18n="cb_ac"]'); if(acSpan) acSpan.innerText = TRANSLATIONS[currentLang].cb_ac || "使用冷氣 (+100元/晚)";
    }

    if (!type.includes('full')) showElements(['unitNotice']);

    const checkInText = document.getElementById('checkInTimeText');
    const visitTimeSelect = document.getElementById('visitTime');
    restoreVisitTimeOptions();

    if (['room', 'starcraft', 'dt392'].includes(type)) {
      if (checkInText) { checkInText.innerText = TRANSLATIONS[currentLang].checkin_time_val_room; checkInText.style.color = "#800080"; checkInText.style.fontWeight = "bold"; }
      if (visitTimeSelect) {
        let opt1400 = visitTimeSelect.querySelector('option[value="14:00"]'); let opt1430 = visitTimeSelect.querySelector('option[value="14:30"]');
        if (opt1400) { opt1400.disabled = true; opt1400.hidden = true; } if (opt1430) { opt1430.disabled = true; opt1430.hidden = true; }
        let opt1500 = visitTimeSelect.querySelector('option[value="15:00"]'); if (opt1500) opt1500.text = "15:00 (check in time)";
        if (visitTimeSelect.value === "14:00" || visitTimeSelect.value === "14:30") visitTimeSelect.value = "";
      }
      stripNightRushLabels();
    } else {
      if (checkInText) { checkInText.innerText = TRANSLATIONS[currentLang].checkin_time_val; checkInText.style.color = ""; checkInText.style.fontWeight = ""; }
    }

    const extraPeopleLabel = document.getElementById('extraPeopleLabel');
    const extraPeopleInput = document.getElementById('extraPeople');
    const basicUnitDesc = document.getElementById('basicUnitDesc');

    if (TYPE_RULES[type]) {
        if (basicUnitDesc) basicUnitDesc.innerText = TYPE_RULES[type].unitText;
        if (extraPeopleLabel) extraPeopleLabel.innerHTML = `${TYPE_RULES[type].extraLabel} <br><small style='color:#888;'>*小一以下免費</small>`;
        if (extraPeopleInput) { extraPeopleInput.max = TYPE_RULES[type].maxExtra; extraPeopleInput.placeholder = `最多加 ${TYPE_RULES[type].maxExtra} 人`; if (parseInt(extraPeopleInput.value) > TYPE_RULES[type].maxExtra) extraPeopleInput.value = TYPE_RULES[type].maxExtra; }
    } else {
        if (basicUnitDesc) basicUnitDesc.innerText = t.basic_unit;
        if (extraPeopleLabel) extraPeopleLabel.innerHTML = `${t.label_extra_people} <br><small style='color:#888;'>*小一以下免費</small>`;
        if (extraPeopleInput) { extraPeopleInput.removeAttribute('max'); extraPeopleInput.placeholder = "0"; }
    }

    if (['tent', 'car', 'camper', 'moto', 'solo', 'car_bed_vip'].includes(type)) { showElements(['extraOptions']); } 
    else { ['useAC', 'bringPet'].forEach(id => { const box = document.getElementById(id); if (box) box.checked = false; }); }
  }

  if (type.includes('full') || ['bicycle', 'venue_hourly'].includes(type)) {
    hideElements(['qtyBlock', 'guestListBlock']); document.getElementById('unitQty').value = 1;
  } else {
    showElements(['qtyBlock']); generateGuestInputs();
  }

  updateCalendarBlocking(); calculateTotal();
}

function updateCalendarBlocking() {
  const type = document.getElementById('campType').value;
  const pickerElement = document.querySelector("#dateRange");
  if (!pickerElement || !pickerElement._flatpickr) return;
  const picker = pickerElement._flatpickr;

  let datesToDisable = [...(GLOBAL_BLOCKED_DATA.full || [])];
  if (type === 'starcraft' && GLOBAL_BLOCKED_DATA.starcraft) datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.starcraft);
  else if (type === 'dt392' && GLOBAL_BLOCKED_DATA.dt392) datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.dt392);
  else if (type === 'room' && GLOBAL_BLOCKED_DATA.room) datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.room);
  else if (type && type.includes('full')) datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.starcraft || [], GLOBAL_BLOCKED_DATA.dt392 || [], GLOBAL_BLOCKED_DATA.room || []);
  picker.set('disable', datesToDisable);
}

function onQtyChange() { generateGuestInputs(); calculateTotal(); }

function generateGuestInputs() {
  const qty = parseInt(document.getElementById('unitQty').value);
  const container = document.getElementById('guestInputsContainer');
  const block = document.getElementById('guestListBlock');
  if (!container || !block) return;

  container.innerHTML = "";
  if (qty > 1) {
    block.classList.remove('hidden');
    for (let i = 2; i <= qty; i++) {
      const div = document.createElement('div'); div.style.marginBottom = "10px";
      div.innerHTML = `<label style="font-size:0.9rem; color:#555;">第 ${i} 位代表姓名：</label><input type="text" class="guest-name-input" placeholder="請輸入第 ${i} 帳/車的代表姓名" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">`;
      container.appendChild(div);
    }
  } else { block.classList.add('hidden'); }
}

function updateNights(dates) {
  selectedDates = Array.isArray(dates) ? dates : [];
  if (dates.length === 2) {
    const diffDays = Math.ceil(Math.abs(dates[1] - dates[0]) / (1000 * 60 * 60 * 24));
    document.getElementById('nights').value = diffDays;
  } else { document.getElementById('nights').value = 0; }
}

function formatDate(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }

// 修復 1: 補齊所有未定義的 UI 互動函式
function verifyVendor(checkbox) {
    if (checkbox.checked) {
        const code = prompt("請輸入『攤商專屬解鎖碼』🔒\n(提示：填寫完報名表單後會顯示！)");
        if (code === "BOSS888") { 
            alert("✅ 解鎖成功！已套用攤商專屬優惠報價。");
            calculateTotal(); return true;
        } else {
            alert("❌ 解鎖碼錯誤！請先完成報名表單獲取密碼。");
            checkbox.checked = false; return false;
        }
    } else { calculateTotal(); return true; }
}
function openTribalModal() { document.getElementById('tribalModal').classList.remove('hidden'); document.getElementById('tribalModal').style.display = 'flex'; }
function closeTribalModal() { document.getElementById('tribalModal').classList.add('hidden'); document.getElementById('tribalModal').style.display = 'none'; }
function bookTribalPackage() {
    closeTribalModal();
    const cb = document.getElementById('enableTribal'); if(cb) cb.checked = true;
    toggleTribal(); calculateTotal();
    document.getElementById('calculatorSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function toggleTribal() {
    const isChecked = document.getElementById('enableTribal').checked;
    const block = document.getElementById('tribalInputBlock');
    if (isChecked) { block.classList.remove('hidden'); validateTribalPeople(); } else { block.classList.add('hidden'); }
}
function validateTribalPeople() {
    const input = document.getElementById('tribalPeople');
    if (!input.value || parseInt(input.value) < 4) { alert("⚠️ 部落慢活體驗包最低需 4 人成行！"); input.value = 4; }
}
function scrollToAddonAndAddPass() {
    const type = document.getElementById('campType').value;
    if (!type || type === "") { alert("💡 請先在上方選擇您的「預約日期」與「營位類型」，系統才能幫您加入喔！"); document.getElementById('calculatorSection').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const passQtyInput = document.getElementById('dulanPassQty');
    if (passQtyInput) { passQtyInput.value = parseInt(passQtyInput.value || 0) + 1; calculateTotal(); }
    const addonBlock = document.getElementById('premiumAddonBlock');
    if (addonBlock) {
        addonBlock.classList.remove('hidden'); addonBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        addonBlock.style.transition = "background-color 0.5s"; addonBlock.style.backgroundColor = "#f3e5f5";
        setTimeout(() => { addonBlock.style.background = "linear-gradient(to right, #fdfbfb, #ebedee)"; }, 800);
    }
}

function calculateTotal() {
  const type = document.getElementById('campType').value;
  if (!type || type === "") { hideResult(); return; }
  const config = CAMPING_CONFIG[type];
  if (!config) { hideResult(); return; }

  // 修復 8: isNightRush 的正確判斷邏輯
  const visitTime = document.getElementById('visitTime').value;
  const rushCheckbox = document.getElementById('isNightRush');
  let isNightRush = false;
  if (rushCheckbox && rushCheckbox.checked && !document.getElementById('extraOptions').classList.contains('hidden')) {
      isNightRush = true;
  }
  if (visitTime && !document.getElementById('extraOptions').classList.contains('hidden')) {
      const hour = parseInt(visitTime.split(':')[0]);
      if (hour >= 20 && !rushCheckbox.checked) { rushCheckbox.checked = true; isNightRush = true; }
  }

  hideElements(['rowAddons', 'rowPremium', 'rowRush', 'rowAC', 'rowCoupon', 'rowTribal']);
  const discountRow = document.getElementById('discountPrice')?.parentElement;
  if (discountRow) discountRow.classList.remove('hidden');

  if (type === 'bicycle' || type === 'venue_hourly') {
    if (selectedDates.length < 1) { hideResult(); return; }
    ['useAC', 'bringPet'].forEach(id => { const b = document.getElementById(id); if(b) b.checked = false; });
    
    let finalPrice = 0;
    if (type === 'bicycle') {
        const qty = parseInt(document.getElementById('bikeQty').value) || 1;
        const scheme = document.getElementById('bikeScheme').value;
        finalPrice = (config.rates[scheme] || 0) * qty;
    } else {
        const scheme = document.getElementById('rentalScheme').value;
        const checkInDate = new Date(selectedDates[0]);
        let isVenueHoliday = ([0,5,6].includes(checkInDate.getDay()) || HOLIDAYS.includes(formatDate(checkInDate))) && !MAKEUP_DAYS.includes(formatDate(checkInDate));
        if (isVenueHoliday && scheme === '5hr') { alert("假日無 5 小時方案，將為您切換為 3 小時方案。"); document.getElementById('rentalScheme').value = '3hr'; finalPrice = config.holidayRates['3hr']; } 
        else { finalPrice = isVenueHoliday ? config.holidayRates[scheme] : config.weekdayRates[scheme]; }
    }
    
    document.getElementById('basePrice').innerText = finalPrice;
    ['addonPrice', 'premiumPrice', 'rushPrice', 'acPrice', 'discountPrice'].forEach(id => document.getElementById(id).innerText = 0);
    document.getElementById('finalTotal').innerText = finalPrice;
    if (discountRow) discountRow.classList.add('hidden');
    showElements(['resultBox']);
    return;
  }

  if (selectedDates.length < 2) { hideResult(); return; }
  const nights = parseInt(document.getElementById('nights').value);
  if (nights < 1) { hideResult(); return; }

  let qty = 1;
  const qtyBlock = document.getElementById('qtyBlock');
  if (qtyBlock && !qtyBlock.classList.contains('hidden')) qty = parseInt(document.getElementById('unitQty').value) || 1;

  const useAC = document.getElementById('useAC')?.checked || false;
  const bringPet = document.getElementById('bringPet')?.checked || false;
  const isVendorMode = document.getElementById('isVendor') && document.getElementById('isVendor').checked;

  let basePrice = 0, rushPrice = 0, acPrice = 0, hasSaturday = false, isHolidayForDiscount = false, hasTuesday = false;
  let currentDate = new Date(selectedDates[0]);

  // 修復 6: 長住 7 天自動升級邏輯
  let isLongStay = false;
  if (nights >= 7 && !type.includes('full') && type !== 'car_bed_vip') {
      let lsConfig = { 'tent': {7: 3000, 14: 5000, 30: 6000}, 'car': {7: 3000, 14: 5000, 30: 6000}, 'solo': {7: 3000, 14: 5000, 30: 6000}, 'moto': {7: 3000, 14: 5000, 30: 6000},
                       'camper': {7: 4000, 14: 6500, 30: 9000}, 'starcraft': {7: 6500, 14: 10000}, 'dt392': {7: 6000, 14: 9000}, 'room': {7: 7500, 14: 11200} };
      
      if (lsConfig[type]) {
          isLongStay = true;
          let pricingTier = nights >= 30 && lsConfig[type][30] ? 30 : (nights >= 14 && lsConfig[type][14] ? 14 : 7);
          let extraNights = nights % pricingTier;
          let tierCount = Math.floor(nights / pricingTier);
          
          basePrice = (lsConfig[type][pricingTier] * tierCount) * qty;
          
          // 如果有無法被長住專案整除的天數，剩餘天數依平日價計算
          if (extraNights > 0) {
              basePrice += (extraNights * (config.rates['weekday'] || 0)) * qty;
          }
      }
  }

  // 若非長住專案，執行每日累加計算
  if (!isLongStay) {
      for (let i = 0; i < nights; i++) {
        const dateStr = formatDate(currentDate);
        const dayOfWeek = currentDate.getDay();
        const isMakeup = MAKEUP_DAYS.includes(dateStr);
        let rateType = CNY_DAYS.includes(dateStr) ? 'cny' : (isMakeup ? 'weekday' : (HOLIDAYS.includes(dateStr) ? 'holiday' : ([5,6].includes(dayOfWeek) ? 'weekend' : 'weekday')));

        if (dayOfWeek === 6 && !isMakeup) hasSaturday = true;
        if (dayOfWeek === 2 && !isMakeup) hasTuesday = true;
        if (HOLIDAYS.includes(dateStr) || CNY_DAYS.includes(dateStr)) isHolidayForDiscount = true;

        if (i === 0 && isNightRush && config.nightRush) {
            let rushRate = config.nightRush[rateType] || config.nightRush['holiday'] || config.nightRush['weekday'];
            if (type === 'camper') rushRate = rushRate * 0.8;
            basePrice += rushRate * qty; rushPrice = rushRate * qty; 
        } else {
            let dailyBase = 0;
            let rate_room = config.rates && config.rates[rateType] !== undefined ? config.rates[rateType] : (config.rates ? config.rates['holiday'] : 0);
            let rate_star = CAMPING_CONFIG.starcraft.rates[rateType] || CAMPING_CONFIG.starcraft.rates['holiday'];
            let rate_dt = CAMPING_CONFIG.dt392.rates[rateType] || CAMPING_CONFIG.dt392.rates['holiday'];
            let rate_grass = config.rates && config.rates[rateType] !== undefined ? config.rates[rateType] : 0;

            if (dayOfWeek === 2 && !isMakeup) {
                // 免裝備住宿週二價
                rate_room = 2400; 
                rate_star = 2200; 
                rate_dt = 2000; 
                
                // ⛺ 露營模式週二精準報價
                if (type === 'tent') rate_grass = 1000;
                else if (type === 'moto' || type === 'solo') rate_grass = 600;
                else if (type === 'car') rate_grass = 1000;
                else if (type === 'camper') rate_grass = 1200;
                else rate_grass = 800; // 預設防呆

                // 攤商模式覆蓋 (攤商的大馳、StarCraft、以及攤商營位500元優惠)
                if (isVendorMode) { 
                    rate_dt = 1400; 
                    rate_star = 1500; 
                    rate_grass = 500; 
                }
            }
            
            if (type === 'car_bed_vip') {
                const pQty = parseInt(document.getElementById('carBedPeople').value) || 2;
                let personPrice = config.people_rates[pQty][rateType] !== undefined ? config.people_rates[pQty][rateType] : config.people_rates[pQty]['weekend'];
                
                // ✨ 車床週二價：不管幾人，一律 600 元
                if (dayOfWeek === 2 && !isMakeup) {
                    personPrice = 600;
                }

                let tentFee = document.getElementById('carBedTent').checked ? (config.tent_add_on[rateType] || 50) : 0;
                dailyBase = (personPrice + tentFee) * qty;
            } else if (type === 'room') {
                if (qty === 1) dailyBase = rate_room; else if (qty === 2) dailyBase = rate_room + rate_star; else if (qty === 3) dailyBase = rate_room + rate_dt; else if (qty === 4) dailyBase = rate_room + rate_star + rate_dt;
            } else if (type === 'starcraft') {
                if (qty === 1) dailyBase = rate_star; else if (qty === 2) dailyBase = rate_star + rate_room; else if (qty === 3) dailyBase = rate_star + rate_dt; else if (qty === 4) dailyBase = rate_star + rate_room + rate_dt;
            } else if (type === 'dt392') {
                if (qty === 1) dailyBase = rate_dt; else if (qty === 2) dailyBase = rate_dt + rate_room; else if (qty === 3) dailyBase = rate_dt + rate_star; else if (qty === 4) dailyBase = rate_dt + rate_room + rate_star;
            } else {
                dailyBase = rate_grass * qty;
            }
            basePrice += dailyBase;
        }

        if (useAC) acPrice += (type === 'car_bed_vip' ? 50 : 200) * qty; 
        currentDate.setDate(currentDate.getDate() + 1);
      }
  } else {
      // 若為長住專案，依舊需計算冷氣費用
      if (useAC) acPrice += 200 * qty * nights;
  }

  let extraPersonPrice = ['starcraft', 'dt392'].includes(type) ? 200 : 300;
  const extraPeople = parseInt(document.getElementById('extraPeople').value) || 0;
  const visitors = parseInt(document.getElementById('visitors').value) || 0;
  const totalAddonCost = (extraPeople * extraPersonPrice * nights) + (visitors * 100) + (bringPet ? 100 * qty * nights : 0);

  const barPackageQty = parseInt(document.getElementById('barPackageQty')?.value) || 0;
  const dulanPassQty = parseInt(document.getElementById('dulanPassQty')?.value) || 0;
  const premiumCost = (barPackageQty * 699) + (dulanPassQty * 199);
  
  let tribalPrice = 0;
  const enableTribal = document.getElementById('enableTribal');
  if (enableTribal && enableTribal.checked) {
      const tp = parseInt(document.getElementById('tribalPeople').value) || 4;
      tribalPrice = tp * 1200;
  }

  if (totalAddonCost > 0) { showElements(['rowAddons']); document.getElementById('addonPrice').innerText = totalAddonCost; } 
  else { document.getElementById('addonPrice').innerText = 0; }

  if (premiumCost > 0) { showElements(['rowPremium']); document.getElementById('premiumPrice').innerText = premiumCost; }
  else { document.getElementById('premiumPrice').innerText = 0; }
  
  if (tribalPrice > 0) { showElements(['rowTribal']); document.getElementById('tribalTotal').innerText = tribalPrice; }
  else { document.getElementById('tribalTotal').innerText = 0; }

  let isFullHoliday = false;
  const stayDatesStr = [];
  let tempDate = new Date(selectedDates[0]);
  for (let i = 0; i < nights; i++) { stayDatesStr.push(formatDate(tempDate)); tempDate.setDate(tempDate.getDate() + 1); }
  for (let block of HOLIDAY_BLOCKS) { if (block.every(d => stayDatesStr.includes(d))) { isFullHoliday = true; break; } }

  let discount = 0;
  const totalPriceForDiscount = basePrice + acPrice;
  let hasCoupon = false;
  let couponText = "";

  if (type === 'car_bed_vip' || isLongStay) { 
      // 車床天地與長住專案不疊加一般折扣
      discount = 0; 
      if (isLongStay) { hasCoupon = true; couponText = "已為您套用最優惠之長住專案價！"; }
  } 
  else if (config.discountType === 'full_venue_promo') {
      if (nights >= 2) discount = totalPriceForDiscount * 0.15;
  } else if (config.discountType === 'percentage') {
      if (isHolidayForDiscount && nights >= 3) discount = totalPriceForDiscount * 0.15;
      else if (nights >= 2) discount = totalPriceForDiscount * 0.10;
  } else if (config.discountType === 'fixed_amount' || config.discountType === 'fixed_amount_premium') {
      // 修復 4: 連住折扣計算邏輯對齊文案
      if (nights >= 2) {
          discount = Math.min(nights * 100, 500) * qty;
      }
  }
  
  if (isFullHoliday && type !== 'car_bed_vip') discount += (totalPriceForDiscount * 0.05);

  // 修復 5: 實作贈品/優惠券顯示邏輯
  if (!isLongStay && type !== 'car_bed_vip' && !type.includes('full')) {
      if (isVendorMode && hasTuesday) {
          hasCoupon = true; couponText = "🤝 攤商專屬優惠已套用，恕不疊加其他折價券";
      } else if (hasTuesday) {
          const isCampingType = ['tent', 'moto', 'solo', 'car', 'camper'].includes(type);
          hasCoupon = true; couponText = isCampingType ? `贈 $100 週二夜市折價券🎫 x ${qty}張` : `贈 $200 週二夜市折價券🎫 x ${qty}張`;
      } else if (nights >= 2) {
          hasCoupon = true; couponText = `贈 $200 水煙酒吧微醺券🍹 x ${qty}張`;
      }
  }

  const total = Math.round(basePrice + acPrice + totalAddonCost + premiumCost + tribalPrice - discount);

  document.getElementById('basePrice').innerText = Math.round(basePrice);
  document.getElementById('rushPrice').innerText = isNightRush ? " (已含)" : 0;
  document.getElementById('acPrice').innerText = Math.round(acPrice);
  document.getElementById('discountPrice').innerText = Math.round(discount);
  document.getElementById('finalTotal').innerText = total;

  if (hasCoupon && couponText !== "") {
      showElements(['rowCoupon']);
      document.getElementById('couponText').innerText = couponText;
  }

  if (!document.getElementById('extraOptions').classList.contains('hidden')) {
    if (isNightRush) showElements(['rowRush']);
    if (Math.round(acPrice) > 0) showElements(['rowAC']);
  }

  showElements(['resultBox']);
}

function submitOrder() {
  // 修復 9: 驗證日期是否已選取
  if (selectedDates.length < 1 && !['bicycle', 'venue_hourly'].includes(document.getElementById('campType').value)) {
      alert("⚠️ 請先選擇預約日期！"); return;
  }
    
  // 修復 7: 確保 Confirm 翻譯存在預設值
  const currentTranslations = TRANSLATIONS[currentLang] || TRANSLATIONS['zh'];
  const confirmMsg = currentTranslations.confirm_room_policy || TRANSLATIONS['zh'].confirm_room_policy;

  if (!confirm("⚠️抵達營區入口時，請勿直接入場，請先撥電話告知營主！非常重要❗️感謝配合🙏\n\n確認送出訂單？")) return;

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const line = document.getElementById('customerLine').value.trim();
  const note = document.getElementById('customerNote').value.trim();
  const visitTime = document.getElementById('visitTime').value;

  if (!name || !phone) { alert(currentTranslations.alert_fill || TRANSLATIONS['zh'].alert_fill); return; }

  const typeSelect = document.getElementById('campType');
  const typeValue = typeSelect.value;
  if (['room', 'starcraft', 'dt392'].includes(typeValue) && !confirm(confirmMsg)) return;

  let details = `【${typeSelect.options[typeSelect.selectedIndex].text}】`;

  let qty = 1;
  if (!document.getElementById('qtyBlock').classList.contains('hidden')) {
    qty = parseInt(document.getElementById('unitQty').value);
    details += ` / 數量:${document.getElementById('unitQty').options[document.getElementById('unitQty').selectedIndex].text}`;
  }

  if (['bicycle', 'venue_hourly'].includes(typeValue)) {
    const schemeId = typeValue === 'bicycle' ? 'bikeScheme' : 'rentalScheme';
    details += ` / 方案:${document.getElementById(schemeId).options[document.getElementById(schemeId).selectedIndex].text}`;
  } else {
    details += ` / ${document.getElementById('nights').value}晚`;
    const ep = parseInt(document.getElementById('extraPeople').value) || 0;
    const vs = parseInt(document.getElementById('visitors').value) || 0;
    if (ep > 0) details += ` / 加人:${ep}`; if (vs > 0) details += ` / 訪客:${vs}`;

    const passQty = parseInt(document.getElementById('dulanPassQty')?.value) || 0;
    const barQty = parseInt(document.getElementById('barPackageQty')?.value) || 0;
    if (passQty > 0) details += ` / 🎟️通行證:${passQty}本`;
    if (barQty > 0) details += ` / 🍹微醺套餐:${barQty}組`;

    if (document.getElementById('enableTribal') && document.getElementById('enableTribal').checked) {
        details += ` / 🌿部落體驗:${document.getElementById('tribalPeople').value}人`;
    }

    if (typeValue === 'car_bed_vip') {
        const carBedId = document.getElementById('carBedId').value.trim();
        if (!carBedId) { alert("⚠️ 請輸入「車床天地會員編號」才能享優惠價格喔！"); return; }
        details += ` / 🆔車床編號:${carBedId} / ${document.getElementById('carBedPeople').value}人` + (document.getElementById('carBedTent').checked ? " (有搭帳)" : "");
    }

    if (!document.getElementById('extraOptions').classList.contains('hidden')) {
      const isNightRush = document.getElementById('isNightRush').checked;
      if ((visitTime && parseInt(visitTime.split(':')[0]) >= 20) || isNightRush) details += " (含夜衝)";
      if (document.getElementById('useAC').checked) details += " (含冷氣)";
      if (document.getElementById('bringPet').checked) details += " (含寵物)";
    }

    const guestInputs = document.querySelectorAll('.guest-name-input');
    let guestNames = [];
    guestInputs.forEach((input, index) => {
      if (input.value.trim() !== "") { guestNames.push(`(第${index + 2}位: ${input.value.trim()})`); }
    });
    if (guestNames.length > 0) { details += `\n同行：${guestNames.join('、')}`; }
  }

  if (visitTime) details += ` / 預計時間:${visitTime}`;

  const btn = document.getElementById('submitBtn');
  const originalText = btn.innerText; btn.innerText = "⏳ 處理中..."; btn.disabled = true;
  const last5 = document.getElementById('last5').value.trim(); 
  const noteCombined = (last5 ? `[末五碼:${last5}] ` : "") + note;

  const orderData = {
    name: name, phone: phone, line: line, dateRange: document.getElementById('dateRange').value,
    itemDetails: details, totalPrice: document.getElementById('finalTotal').innerText, note: noteCombined, last5: last5 
  };

  fetch(GOOGLE_SCRIPT_URL, { method: "POST", body: JSON.stringify(orderData), headers: { "Content-Type": "text/plain" } })
    .then(() => {
        alert("🎉 預訂資料已送出！\n\n【請務必完成匯款以保留營位】\n🏦 合作金庫 (006)\n💰 帳號：5492988007780\n\n⚠️ 系統將自動開啟 LINE，請務必「貼上」剛剛複製的帳號或截圖回傳給營主確認！");
        openLineApp(orderData); 
        ['customerName', 'customerPhone', 'customerLine', 'customerNote', 'last5'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
        btn.innerText = "✅ 完成"; setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 3000);
    }).catch(error => { console.error('Error:', error); alert("連線忙碌中，請稍後再試。"); btn.innerText = originalText; btn.disabled = false; });
}

function openLineApp(formData) {
  const BANK_INFO = `【匯款資訊】\n銀行代碼：006 (合作金庫)\n銀行帳號：5492-9880-07780\n戶名：錄托邦露營區`;
  const message = `Hi 錄托邦，我剛剛在官網下單了！\n\n👤 姓名：${formData.name}\n📞 電話：${formData.phone}\n📅 日期：${formData.dateRange}\n⛺ 項目：${formData.itemDetails}\n💰 總金額：$${formData.totalPrice}\n🏧 帳號末五碼：${formData.last5 || "尚未匯款"}\n📝 備註：${formData.note || "無"}\n\n${BANK_INFO}\n\n請幫我保留營位，謝謝！`;
  window.location.href = `https://line.me/R/oaMessage/@lutopia/?${encodeURIComponent(message)}`;
}

function hideResult() { hideElements(['resultBox']); }

function resetForm() {
  const flatpickrEl = document.querySelector("#dateRange");
  if (flatpickrEl && flatpickrEl._flatpickr) flatpickrEl._flatpickr.clear(); 
  selectedDates = [];
  document.getElementById('campType').value = ""; toggleInputs();
  document.getElementById('nights').value = '0';
  ['useAC', 'bringPet', 'carBedTent', 'isNightRush', 'enableTribal', 'isVendor'].forEach(id => { const el = document.getElementById(id); if(el) el.checked = false; });
  
  ['bikeQty', 'extraPeople', 'visitors', 'barPackageQty', 'dulanPassQty'].forEach(id => { const el = document.getElementById(id); if(el) el.value = (id==='bikeQty'?1:0); });
  if (document.getElementById('tribalPeople')) document.getElementById('tribalPeople').value = 4;
  if (document.getElementById('tribalInputBlock')) document.getElementById('tribalInputBlock').classList.add('hidden');

  document.getElementById('visitTime').selectedIndex = 0;
  ['carBedId', 'last5'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
  hideResult();
}

function selectPlan(planValue) {
  document.getElementById('campType').value = planValue; toggleInputs();
  const target = document.getElementById('calculatorSection'); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copyBankInfo() {
    const account = document.getElementById('bankAccount').innerText;
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(account).then(() => alert("✅ 帳號已複製！\n請開啟您的銀行 APP 進行轉帳。")).catch(() => prompt("請長按複製帳號：", account));
    else prompt("請長按複製帳號：", account);
}