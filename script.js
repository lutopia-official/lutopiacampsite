/* ==========================================
   0. 全域變數與設定
========================================== */
let currentLang = 'zh';
let selectedDates = []; // ✅ 允許 [單日] or [起訖兩日]

let GLOBAL_BLOCKED_DATA = { full: [], starcraft: [], dt392: [], room: [] };

// ⚠️ 請確認這是您最新的網址
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpiqltgo7ewZnP3fGJWV0fgszW5OMmBsDWBH0pIbh3sFzDwyOqYEx3WdYgkXRJxBS2/exec";

// ✅ 記住「預計抵達/取車時間」原始選項文字（用於切換類型時還原）
let VISIT_TIME_ORIGINAL_OPTIONS = null;

function cacheVisitTimeOptions() {
  const sel = document.getElementById('visitTime');
  if (!sel || VISIT_TIME_ORIGINAL_OPTIONS) return;
  VISIT_TIME_ORIGINAL_OPTIONS = Array.from(sel.options).map(o => ({
    value: o.value,
    text: o.text
  }));
}

function restoreVisitTimeOptions() {
  const sel = document.getElementById('visitTime');
  if (!sel || !VISIT_TIME_ORIGINAL_OPTIONS) return;

  Array.from(sel.options).forEach(opt => {
    const found = VISIT_TIME_ORIGINAL_OPTIONS.find(x => x.value === opt.value);
    if (found) opt.text = found.text;
    opt.disabled = false;
    opt.hidden = false;
  });
}

// ✅ 免裝備住宿：移除選項文字中的夜衝提示（不刪除時間，只刪括號文字）
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
    loading: "資料載入中...",
    calc_title: "🌲 露營/場地/周邊服務費用試算",
    basic_unit: "基本單位：4人 / 1車 / 1帳 / 1車邊帳or車尾帳",
    important_notice: "重要提醒：",
    checkin_time_val: "⏰ 紮營時間：下午 14:00 以後 (請勿提早)",
    checkin_time_val_room: "🏡 錄托邦住宿入住時間：下午 15:00 以後 (請勿提早，可以提早放置行李，請先告知)",
    dont_early: "(請勿提早)",
    eco_policy_label: "環保旅宿：",
    eco_policy_desc: "♻️ 環保旅宿：不提供一次性備品 (請自備毛巾、牙刷)",
    label_type: "類型選擇：",
    select_placeholder: "請選擇類型...",
    label_unit_qty: "預訂數量 (帳/車/間)：",
    group_camping: "⛺ 露營模式",
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
    addon_title: "➕ 加購選項 (人/車/訪客)",
    label_extra_people: "加人 ($300/人/晚)",
    label_kid_free: "*小一以下免費",
    label_extra_car: "加車 ($300/車，拖車不在此限)",
    label_visitor: "訪客 ($100/人，23:00離場)",

    cb_night_rush: "我要夜衝 (21:00-23:00入場)",
    cb_ac: "使用冷氣 (+200元/晚)",
    cb_pet: "攜帶寵物 (+50元/晚)",

    btn_calc: "更新費用", btn_reset: "重新填寫",
    result_title: "試算結果", res_base: "基本費用：", res_addon: "加購費用：", res_rush: "夜衝費用：",
    res_ac: "冷氣加價：", res_discount: "符合折扣：", res_total: "總計金額：",
    customer_info_title: "📝 預訂資料填寫", ph_name: "您的姓名 (必填)", ph_phone: "聯絡電話 (必填)",
    ph_note: "其他備註需求 (例如：露營相關、租單車者身高...)", btn_submit: "🚀 確認預訂並送出",
    alert_fill: "請務必填寫「姓名」與「電話」才能送出訂單喔！",
    confirm_room_policy: "🛑【訂位前請確認】\n\n1. 🏡 錄托邦住宿入住時間：下午 15:00 以後。\n   (請勿提早，可以提早放置行李，請先告知)\n\n2. ♻️ 環保旅宿：不提供一次性備品。\n   (請自備毛巾、牙刷)\n\n請問您是否接受並繼續訂位？",
    sent_success: "🎉 預訂成功！\n\n全額匯款後才算預訂完成唷，退費標準請詳見網頁下方。",

    rule_title_basic: "🔷 收費標準與營區規定", rule_sub_price: "💰 營位計費標準",
    rule_li_unit: "基本單位：4人 / 1車 / 1帳 / 1炊事帳。",
    rule_li_add_person: "加人：多1人加 $300 (國小一年級以下免費)。",
    rule_li_add_car: "加車：多停一台車加收 $300 (拖車不在此限)。", rule_li_visitor: "訪客：每人 $100，需於 23:00 前離場。",
    rule_sub_tent: "⛺ 搭帳與冷氣規範", rule_li_big_tent: "大型帳篷：神殿、怪獸、5x8天幕等請訂2個營位。",
    rule_li_ac_fee: "冷氣使用：車上/帳內使用冷氣接電，酌收 $200/晚。",
    rule_li_warning: "未告知搭設大帳者，現場將禁止搭設。",
    rule_sub_rush: "🌙 夜衝服務 (限自搭帳)", rule_li_rush_time: "時間：22:00 後入場，23:30 前搭完。",
    rule_li_rush_price: "費用：平日 500元 / 假日 600元 / 連假 800元。", rule_li_rush_rv: "🚐 自備露營車夜衝依金額打 8 折。",
    rule_title_policy: "⚠️ 住宿取消政策與付款", rule_sub_refund: "📅 取消退費標準",
    ref_14: "14天前", ref_desc_14: "退 100% (扣手續費) 或改期", ref_10: "10-13天前", ref_desc_10: "退 70% (2日內補差額)",
    ref_7: "7-9天前", ref_desc_7: "退 50%", ref_4: "4-6天前", ref_desc_4: "退 30%", ref_0: "0-3天前", ref_desc_0: "視同取消，不退費",
    rule_sub_bank: "💰 付款資訊 (完成訂位後請全額匯款)", rule_bank_note: "請保留轉帳證明並回傳。",

    opt_inc_dt392: "(含 大馳 DT392)", opt_inc_starcraft: "(含 StarCraft 美式復古拖車)",
    opt_inc_room: "(含 錄托邦民宿房間)", opt_inc_both_rv: "(含 StarCraft + DT392)",
    opt_inc_room_starcraft: "(含 StarCraft + 民宿房間)", opt_inc_room_dt392: "(含 DT392 + 民宿房間)",
    opt_inc_all_three: "(含 StarCraft + DT392 + 民宿房間)", opt_group_contact: "(團體請洽官方)"
  },
  en: { /* ... En ... */ },
  jp: { /* ... Jp ... */ }
};

// ==========================================
// 📅 設定假日與補班日 (2026 年版)
// ==========================================
const HOLIDAYS = [
    // --- 2026 年 (民國115年) ---
    "2026-01-01", // 元旦
    
    // 農曆過年 (預估 2/14-2/22)
    "2026-02-14", "2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18", 
    "2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22", 

    // 228
    "2026-02-27", "2026-02-28", "2026-03-01", 

    // 清明
    "2026-04-03", "2026-04-04", "2026-04-05", "2026-04-06",

    // 勞動
    "2026-05-01", "2026-05-02", "2026-05-03",

    // 端午
    "2026-06-19", "2026-06-20", "2026-06-21",

    // 中秋
    "2026-09-25", "2026-09-26", "2026-09-27",

    // 國慶
    "2026-10-09", "2026-10-10", "2026-10-11",

    // 跨年
    "2026-12-31",

    // --- 2027 年預估 ---
    "2027-01-01",
    "2027-02-05", "2027-02-06", "2027-02-07", "2027-02-08", "2027-02-09"
];

// 定義補班日
const MAKEUP_DAYS = [
    "2026-02-07", 
    "2026-02-21"
];

function changeLanguage(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang] || TRANSLATIONS['zh'];
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (t && t[key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = t[key];
      } else {
        element.innerHTML = t[key];
      }
    }
  });
  toggleInputs();
  calculateTotal();
}
window.changeLanguage = changeLanguage;

window.onload = function () {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "") {
    console.warn("GAS 網址未設定");
    return;
  }

  const visitTimeSelect = document.getElementById('visitTime');
  if (visitTimeSelect) {
    cacheVisitTimeOptions(); 
    visitTimeSelect.addEventListener('change', calculateTotal);
  }

  const btnZh = document.getElementById('btn-zh');
  const btnEn = document.getElementById('btn-en');
  const btnJp = document.getElementById('btn-jp');
  if (btnZh) btnZh.addEventListener('click', () => changeLanguage('zh'));
  if (btnEn) btnEn.addEventListener('click', () => changeLanguage('en'));
  if (btnJp) btnJp.addEventListener('click', () => changeLanguage('jp'));

  fetch(GOOGLE_SCRIPT_URL)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      if (data.msg && data.msg !== "") {
        const marquee = document.getElementById('marquee-text');
        if (marquee) marquee.innerText = data.msg;
      }
      if (data.blockedDates) {
        GLOBAL_BLOCKED_DATA = data.blockedDates;
        updateCalendarBlocking();
      }
    })
    .catch(error => { console.error('資料讀取失敗:', error); });
};

flatpickr("#dateRange", {
  mode: "range",
  minDate: "today",
  dateFormat: "Y-m-d (D)",
  locale: "zh",
  onChange: function (dates) {
    updateNights(dates);
    calculateTotal();
  }
});

const CAMPING_CONFIG = {
  tent: { rates: { weekday: 700, weekend: 800, holiday: 1200 }, nightRush: { weekday: 500, weekend: 600, holiday: 800 }, discountType: "fixed_amount" },
  moto: { rates: { weekday: 500, weekend: 600, holiday: 1200 }, nightRush: { weekday: 300, weekend: 400, holiday: 500 }, discountType: "fixed_amount" },
  solo: { rates: { weekday: 500, weekend: 600, holiday: 1200 }, nightRush: { weekday: 300, weekend: 400, holiday: 500 }, discountType: "fixed_amount" },
  car: { rates: { weekday: 600, weekend: 800, holiday: 1200 }, nightRush: { weekday: 500, weekend: 600, holiday: 800 }, discountType: "fixed_amount" },
  
  // 🔥 車床天地會員的價格設定
  car_bed_vip: { 
      // 改用陣列/物件存不同人數的價格
      // 格式：people_rates[人數] = { weekday: 平日價, weekend: 假日價 }
      people_rates: {
          1: { weekday: 250, weekend: 350 },
          2: { weekday: 300, weekend: 400 },
          3: { weekday: 400, weekend: 500 },
          4: { weekday: 500, weekend: 600 }
      },
      // 搭帳篷(車邊/車尾)的加價
      tent_add_on: { weekday: 50, weekend: 50 }, 
      
      // 🔥 車床VIP冷氣加購價設定為 50
      ac_fee: 50,

      // 夜衝價格
      nightRush: { weekday: 300, weekend: 400, holiday: 500 }, 
      discountType: "none" 
  },

  camper: { rates: { weekday: 800, weekend: 1000, holiday: 1500 }, nightRush: { weekday: 600, weekend: 700, holiday: 800 }, discountType: "fixed_amount_premium" },
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
  const policyNotice = document.getElementById('policyNotice');
  const campingRules = document.getElementById('campingRules');
  const unitQtyBlock = document.getElementById('qtyBlock');
  const guestListBlock = document.getElementById('guestListBlock');
  const unitQtySelect = document.getElementById('unitQty');
  
  // 🔥 車床天地專屬區塊
  const carBedBlock = document.getElementById('carBedBlock');

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS['zh'];

  let newOptions = "";
  if (type === 'room') {
    newOptions = `<option value="1">1</option><option value="2">2 ${t.opt_inc_starcraft}</option><option value="3">3 ${t.opt_inc_dt392}</option><option value="4">4 ${t.opt_inc_both_rv}</option>`;
  } else if (type === 'starcraft') {
    newOptions = `<option value="1">1</option><option value="2">2 ${t.opt_inc_room}</option><option value="3">3 ${t.opt_inc_dt392}</option><option value="4">4 ${t.opt_inc_room_dt392}</option>`;
  } else if (type === 'dt392') {
    newOptions = `<option value="1">1</option><option value="2">2 ${t.opt_inc_room}</option><option value="3">3 ${t.opt_inc_starcraft}</option><option value="4">4 ${t.opt_inc_room_starcraft}</option>`;
  } else {
    newOptions = `<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10 ${t.opt_group_contact}</option>`;
  }
  unitQtySelect.innerHTML = newOptions;

  if ((type === 'starcraft' || type === 'dt392' || type === 'room') && parseInt(unitQtySelect.value) > 4) {
    unitQtySelect.value = 1;
  } else if (!unitQtySelect.value) {
    unitQtySelect.value = 1;
  }

  // 先隱藏所有動態區塊
  nightsBlock.classList.add('hidden');
  rentalBlock.classList.add('hidden');
  bikeBlock.classList.add('hidden');
  extraOptions.classList.add('hidden');
  if (addonBlock) addonBlock.classList.add('hidden');
  if (unitNotice) unitNotice.classList.add('hidden');
  if (policyNotice) policyNotice.classList.add('hidden');
  if (campingRules) campingRules.classList.add('hidden');
  if (carBedBlock) carBedBlock.classList.add('hidden');

  document.getElementById('rowRush').classList.add('hidden');
  document.getElementById('rowAC').classList.add('hidden');
  const rowAddons = document.getElementById('rowAddons');
  if (rowAddons) rowAddons.classList.add('hidden');

  if (!type || type === "") {
    hideResult();
    if (campingRules) campingRules.classList.remove('hidden');
    return;
  }

  if (type === 'venue_hourly') {
    rentalBlock.classList.remove('hidden');
  } else if (type === 'bicycle') {
    bikeBlock.classList.remove('hidden');
  } else {
    // 住宿類共同顯示
    nightsBlock.classList.remove('hidden');
    if (campingRules) campingRules.classList.remove('hidden');
    
    // 🔥【關鍵邏輯】如果是車床會員，顯示專屬區塊；並將冷氣選項文字改為 $50
    if (type === 'car_bed_vip') {
        if(carBedBlock) carBedBlock.classList.remove('hidden');
        // 車床天地仍需要顯示冷氣與寵物選項
        extraOptions.classList.remove('hidden'); 
        
        // 🔥 動態修改文字：讓客人看到是 +50
        const acSpan = document.querySelector('[data-i18n="cb_ac"]');
        if(acSpan) acSpan.innerText = "使用冷氣 (+50元/晚)";
        
    } else {
        if(addonBlock) addonBlock.classList.remove('hidden');
        
        // 恢復正常文字
        const acSpan = document.querySelector('[data-i18n="cb_ac"]');
        if(acSpan) acSpan.innerText = TRANSLATIONS[currentLang].cb_ac || "使用冷氣 (+200元/晚)";
    }

    const isFullBooking = (type === 'full_basic' || type === 'full_vans' || type === 'full_all');
    if (unitNotice) {
      if (isFullBooking) unitNotice.classList.add('hidden');
      else unitNotice.classList.remove('hidden');
    }
    if (policyNotice) policyNotice.classList.remove('hidden');

    const checkInText = document.getElementById('checkInTimeText');
    const visitTimeSelect = document.getElementById('visitTime');

    // ✅ 每次切換類型先還原(包含夜衝字樣)
    restoreVisitTimeOptions();

    if (type === 'room' || type === 'starcraft' || type === 'dt392') {
      if (checkInText) {
        checkInText.innerText = TRANSLATIONS[currentLang].checkin_time_val_room;
        checkInText.style.color = "#800080";
        checkInText.style.fontWeight = "bold";
      }
      if (visitTimeSelect) {
        let opt1400 = visitTimeSelect.querySelector('option[value="14:00"]');
        let opt1430 = visitTimeSelect.querySelector('option[value="14:30"]');
        if (opt1400) { opt1400.disabled = true; opt1400.hidden = true; }
        if (opt1430) { opt1430.disabled = true; opt1430.hidden = true; }

        let opt1500 = visitTimeSelect.querySelector('option[value="15:00"]');
        if (opt1500) { opt1500.text = "15:00 (check in time)"; }

        if (visitTimeSelect.value === "14:00" || visitTimeSelect.value === "14:30") {
          visitTimeSelect.value = "";
        }
      }

      // ✅ 免裝備：移除 (夜衝開始)/(夜衝結束)/(最晚入場)
      stripNightRushLabels();

    } else {
      if (checkInText) {
        checkInText.innerText = TRANSLATIONS[currentLang].checkin_time_val;
        checkInText.style.color = "";
        checkInText.style.fontWeight = "";
      }
    }

    const extraPeopleLabel = document.querySelector('[data-i18n="label_extra_people"]');
    const extraPeopleInput = document.getElementById('extraPeople');
    const basicUnitDesc = document.querySelector('[data-i18n="basic_unit"]');

    if (type === 'room') {
      if (basicUnitDesc) basicUnitDesc.innerText = "基本單位：2人 / 1間 (第三人起需加購)";
      if (extraPeopleLabel) extraPeopleLabel.innerText = "➕ 加購選項 (第三/人) 加人 ($300/人)";
      if (extraPeopleInput) {
        extraPeopleInput.max = 2;
        extraPeopleInput.placeholder = "最多加 2 人";
        if (parseInt(extraPeopleInput.value) > 2) extraPeopleInput.value = 2;
      }
    } else {
      if (basicUnitDesc) basicUnitDesc.innerText = t.basic_unit;
      if (extraPeopleLabel) extraPeopleLabel.innerText = t.label_extra_people;
      if (extraPeopleInput) {
        extraPeopleInput.removeAttribute('max');
        extraPeopleInput.placeholder = "0";
      }
    }

    // 露營類 (含車床VIP) 顯示選項
    if (type === 'tent' || type === 'car' || type === 'camper' || type === 'moto' || type === 'solo' || type === 'car_bed_vip') {
      extraOptions.classList.remove('hidden');
    } else {
      const acBox = document.getElementById('useAC');
      const petBox = document.getElementById('bringPet');
      if (acBox) acBox.checked = false;
      if (petBox) petBox.checked = false;
    }
  }

  // 隱藏不需要數量的類型
  if (type.includes('full') || type === 'bicycle' || type === 'venue_hourly') {
    if (unitQtyBlock) unitQtyBlock.classList.add('hidden');
    if (guestListBlock) guestListBlock.classList.add('hidden');
    document.getElementById('unitQty').value = 1;
  } else {
    // 車床VIP也需要選車數(預設1)，所以顯示
    if (unitQtyBlock) unitQtyBlock.classList.remove('hidden');
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
    if (GLOBAL_BLOCKED_DATA.starcraft) datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.starcraft);
  } else if (type === 'dt392') {
    if (GLOBAL_BLOCKED_DATA.dt392) datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.dt392);
  } else if (type === 'room') {
    if (GLOBAL_BLOCKED_DATA.room) datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.room);
  } else if (type && type.includes('full')) {
    datesToDisable = datesToDisable
      .concat(GLOBAL_BLOCKED_DATA.starcraft || [])
      .concat(GLOBAL_BLOCKED_DATA.dt392 || [])
      .concat(GLOBAL_BLOCKED_DATA.room || []);
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
  if (!container || !block) return;

  container.innerHTML = "";
  if (qty > 1) {
    block.classList.remove('hidden');
    for (let i = 2; i <= qty; i++) {
      const div = document.createElement('div');
      div.style.marginBottom = "10px";
      const label = document.createElement('label');
      label.style.fontSize = "0.9rem";
      label.style.color = "#555";
      label.innerText = `第 ${i} 位代表姓名：`;
      const input = document.createElement('input');
      input.type = "text";
      input.className = "guest-name-input";
      input.placeholder = `請輸入第 ${i} 帳/車的代表姓名`;
      input.style.width = "100%";
      input.style.padding = "8px";
      input.style.border = "1px solid #ddd";
      input.style.borderRadius = "4px";
      div.appendChild(label);
      div.appendChild(input);
      container.appendChild(div);
    }
  } else {
    block.classList.add('hidden');
  }
}

function updateNights(dates) {
  selectedDates = Array.isArray(dates) ? dates : [];

  if (dates.length === 2) {
    const diffTime = Math.abs(dates[1] - dates[0]);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('nights').value = diffDays;
  } else {
    document.getElementById('nights').value = 0;
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
  if (!config) { hideResult(); return; }

  const rowAddons = document.getElementById('rowAddons');
  if (rowAddons) rowAddons.classList.add('hidden');
  document.getElementById('rowRush').classList.add('hidden');
  document.getElementById('rowAC').classList.add('hidden');
  const discountRow = document.getElementById('discountPrice')?.parentElement;
  if (discountRow) discountRow.classList.remove('hidden');

  // 1) 單車
  if (type === 'bicycle') {
    if (selectedDates.length < 1) { hideResult(); return; }

    const acBox = document.getElementById('useAC');
    const petBox = document.getElementById('bringPet');
    if (acBox) acBox.checked = false;
    if (petBox) petBox.checked = false;

    const qty = parseInt(document.getElementById('bikeQty').value) || 1;
    const scheme = document.getElementById('bikeScheme').value;
    const finalPrice = (config.rates[scheme] || 0) * qty;

    document.getElementById('basePrice').innerText = finalPrice;
    document.getElementById('addonPrice').innerText = 0;
    document.getElementById('rushPrice').innerText = 0;
    document.getElementById('acPrice').innerText = 0;
    document.getElementById('discountPrice').innerText = 0;
    document.getElementById('finalTotal').innerText = finalPrice;

    if (discountRow) discountRow.classList.add('hidden');
    document.getElementById('resultBox').classList.remove('hidden');
    return;
  }

  // 2) 場地
  if (type === 'venue_hourly') {
    if (selectedDates.length < 1) { hideResult(); return; }

    const scheme = document.getElementById('rentalScheme').value;
    const checkInDate = new Date(selectedDates[0]);
    const dateStr = formatDate(checkInDate);
    const dayOfWeek = checkInDate.getDay();

    let isVenueHoliday = (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0 || HOLIDAYS.includes(dateStr));
    if (MAKEUP_DAYS.includes(dateStr)) { isVenueHoliday = false; }

    let finalPrice = 0;
    if (isVenueHoliday) {
      if (scheme === '5hr') {
        alert("假日無 5 小時方案，將為您切換為 3 小時方案。");
        document.getElementById('rentalScheme').value = '3hr';
        finalPrice = config.holidayRates['3hr'];
      } else {
        finalPrice = config.holidayRates[scheme];
      }
    } else {
      finalPrice = config.weekdayRates[scheme];
    }

    document.getElementById('basePrice').innerText = finalPrice;
    document.getElementById('addonPrice').innerText = 0;
    document.getElementById('rushPrice').innerText = 0;
    document.getElementById('acPrice').innerText = 0;
    document.getElementById('discountPrice').innerText = 0;
    document.getElementById('finalTotal').innerText = finalPrice;

    if (discountRow) discountRow.classList.add('hidden');
    document.getElementById('resultBox').classList.remove('hidden');
    return;
  }

  // 3) 住宿/露營
  if (selectedDates.length < 2) { hideResult(); return; }

  const nights = parseInt(document.getElementById('nights').value);
  if (nights < 1) { hideResult(); return; }

  let qty = 1;
  const qtyBlock = document.getElementById('qtyBlock');
  if (qtyBlock && !qtyBlock.classList.contains('hidden')) {
    qty = parseInt(document.getElementById('unitQty').value) || 1;
  }

  let isNightRush = false;
  const visitTime = document.getElementById('visitTime').value;
  if (visitTime && config.nightRush) {
    const hour = parseInt(visitTime.split(':')[0]);
    if (hour >= 21) isNightRush = true;
  }
  
  const useAC = document.getElementById('useAC')?.checked || false;
  const bringPet = document.getElementById('bringPet')?.checked || false;

  let basePrice = 0;
  let rushPrice = 0;
  let acPrice = 0;
  let hasSaturday = false;
  let isHolidayForDiscount = false;

  let currentDate = new Date(selectedDates[0]);

  for (let i = 0; i < nights; i++) {
    const dateStr = formatDate(currentDate);
    const dayOfWeek = currentDate.getDay();
    const isMakeup = MAKEUP_DAYS.includes(dateStr);

    let rateType = 'weekday';
    if (isMakeup) rateType = 'weekday';
    else if (HOLIDAYS.includes(dateStr)) rateType = 'holiday';
    else if (dayOfWeek === 5 || dayOfWeek === 6) rateType = 'weekend';

    if (dayOfWeek === 6 && !isMakeup) hasSaturday = true;
    if (HOLIDAYS.includes(dateStr)) isHolidayForDiscount = true;

    let dailyBase = 0;
    const rate_room = CAMPING_CONFIG.room.rates[rateType];
    const rate_star = CAMPING_CONFIG.starcraft.rates[rateType];
    const rate_dt = CAMPING_CONFIG.dt392.rates[rateType];

    // 🔥🔥🔥 車床天地專屬計算邏輯 (開始) 🔥🔥🔥
    if (type === 'car_bed_vip') {
        // 1. 取得選擇的人數
        const pQty = parseInt(document.getElementById('carBedPeople').value) || 2;
        
        // 2. 查表取得基礎價格
        // 注意：如果遇到連假(holiday)，圖片說「無特約」，這裡示範用原價(假日價)+100
        let personPrice = 0;
        if (rateType === 'holiday') {
            // 連假無特約，暫時邏輯：比照假日價 + 200 (或設為原價)
            personPrice = (config.people_rates[pQty]['weekend']) + 200; 
        } else {
            personPrice = config.people_rates[pQty][rateType];
        }

        // 3. 判斷是否搭帳 (車邊帳/車尾帳)
        const hasTent = document.getElementById('carBedTent').checked;
        let tentFee = 0;
        if (hasTent) {
            tentFee = config.tent_add_on[rateType] || 50; 
        }

        dailyBase = (personPrice + tentFee) * qty; // qty 是車數
    
    // 🔥🔥🔥 車床天地邏輯 (結束) 🔥🔥🔥

    } else if (type === 'room') {
      if (qty === 1) dailyBase = rate_room;
      else if (qty === 2) dailyBase = rate_room + rate_star;
      else if (qty === 3) dailyBase = rate_room + rate_dt;
      else if (qty === 4) dailyBase = rate_room + rate_star + rate_dt;
    } else if (type === 'starcraft') {
      if (qty === 1) dailyBase = rate_star;
      else if (qty === 2) dailyBase = rate_star + rate_room;
      else if (qty === 3) dailyBase = rate_star + rate_dt;
      else if (qty === 4) dailyBase = rate_star + rate_room + rate_dt;
    } else if (type === 'dt392') {
      if (qty === 1) dailyBase = rate_dt;
      else if (qty === 2) dailyBase = rate_dt + rate_room;
      else if (qty === 3) dailyBase = rate_dt + rate_star;
      else if (qty === 4) dailyBase = rate_dt + rate_room + rate_star;
    } else {
      dailyBase = (config.rates[rateType] || 0) * qty;
    }

    basePrice += dailyBase;

    if (i === 0 && isNightRush && config.nightRush) {
      const rushType = rateType;
      if (type === 'camper') {
        rushPrice += (config.nightRush[rushType] || 0) * 0.8 * qty;
      } else if (type === 'car_bed_vip') {
        // 車床VIP夜衝暫時比照一般
        rushPrice += (config.nightRush[rushType] || 0) * qty;
      } else if (type === 'starcraft' || type === 'dt392' || type === 'room') {
        // 不計算
      } else {
        rushPrice += (config.nightRush[rushType] || 0) * qty;
      }
    }

    if (useAC) {
        // 🔥【修改重點】車床天地會員冷氣費只要 50
        if (type === 'car_bed_vip') {
            acPrice += 50 * qty; 
        } else {
            acPrice += 200 * qty;
        }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // 加人/加車/訪客 計算
  const extraPeople = parseInt(document.getElementById('extraPeople').value) || 0;
  const extraCars = parseInt(document.getElementById('extraCars').value) || 0;
  const visitors = parseInt(document.getElementById('visitors').value) || 0;

  const extraPeopleCost = extraPeople * 300 * nights;
  const extraCarsCost = extraCars * 300 * nights;
  const visitorsCost = visitors * 100;
  const petCost = bringPet ? (50 * qty * nights) : 0;

  const totalAddonCost = extraPeopleCost + extraCarsCost + visitorsCost + petCost;

  if (totalAddonCost > 0) {
    if (rowAddons) rowAddons.classList.remove('hidden');
    document.getElementById('addonPrice').innerText = totalAddonCost;
  } else {
    if (rowAddons) rowAddons.classList.add('hidden');
    document.getElementById('addonPrice').innerText = 0;
  }

  let discount = 0;
  if (discountRow) discountRow.classList.remove('hidden');

  const totalPriceForDiscount = basePrice + rushPrice + acPrice;

  // 車床天地通常是特約價，不適用一般的多晚/連假折扣
  if (type === 'car_bed_vip') {
      discount = 0;
  } 
  else if (config.discountType === 'full_venue_promo') {
    if (nights >= 2) discount = totalPriceForDiscount * 0.15;
  } else if (config.discountType === 'percentage') {
    if (isHolidayForDiscount && nights >= 3) discount = totalPriceForDiscount * 0.15;
    else if (nights >= 2) discount = totalPriceForDiscount * 0.10;
  } else if (config.discountType === 'fixed_amount' || config.discountType === 'fixed_amount_premium') {
    let perUnitDiscount = 0;
    if (nights >= 3) perUnitDiscount += 300;
    if (hasSaturday && nights >= 2) perUnitDiscount += 200;

    discount = perUnitDiscount * qty;

    const maxDiscount = Math.round(totalPriceForDiscount * 0.2);
    discount = Math.min(discount, maxDiscount);
  }

  const total = Math.round(basePrice + rushPrice + acPrice + totalAddonCost - discount);

  document.getElementById('basePrice').innerText = Math.round(basePrice);
  document.getElementById('rushPrice').innerText = Math.round(rushPrice);
  document.getElementById('acPrice').innerText = Math.round(acPrice);
  document.getElementById('discountPrice').innerText = Math.round(discount);
  document.getElementById('finalTotal').innerText = total;

  if (document.getElementById('extraOptions').classList.contains('hidden')) {
    document.getElementById('rowRush').classList.add('hidden');
    document.getElementById('rowAC').classList.add('hidden');
  } else {
    if (Math.round(rushPrice) > 0) document.getElementById('rowRush').classList.remove('hidden');
    if (Math.round(acPrice) > 0) document.getElementById('rowAC').classList.remove('hidden');
  }

  document.getElementById('resultBox').classList.remove('hidden');
}

function submitOrder() {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS['zh'];
  const warningMsg = "⚠️抵達營區入口時，請勿直接入場，請先撥電話告知營主！非常重要❗️感謝配合🙏";
  if (!confirm(warningMsg + "\n\n確認送出訂單？")) return;

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const line = document.getElementById('customerLine').value.trim();
  const note = document.getElementById('customerNote').value.trim();
  const visitTime = document.getElementById('visitTime').value;

  if (!name || !phone) { alert(t.alert_fill); return; }

  const typeSelect = document.getElementById('campType');
  const typeText = typeSelect.options[typeSelect.selectedIndex].text;
  const typeValue = typeSelect.value;

  if (typeValue === 'room' || typeValue === 'starcraft' || typeValue === 'dt392') {
    const confirmMsg = t.confirm_room_policy;
    if (!confirm(confirmMsg)) { return; }
  }

  const dateRange = document.getElementById('dateRange').value;
  const total = document.getElementById('finalTotal').innerText;

  let details = `【${typeText}】`;

  let qty = 1;
  const qtyBlock = document.getElementById('qtyBlock');
  if (qtyBlock && !qtyBlock.classList.contains('hidden')) {
    const unitQtySelect = document.getElementById('unitQty');
    qty = parseInt(unitQtySelect.value);
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

    // 取得加購資料
    const extraPeople = parseInt(document.getElementById('extraPeople').value);
    const extraCars = parseInt(document.getElementById('extraCars').value);
    const visitors = parseInt(document.getElementById('visitors').value);
    if (extraPeople > 0) details += ` / 加人:${extraPeople}`;
    if (extraCars > 0) details += ` / 加車:${extraCars}`;
    if (visitors > 0) details += ` / 訪客:${visitors}`;

    // 🔥 車床天地 VIP 專屬資訊
    if (typeValue === 'car_bed_vip') {
        const carBedId = document.getElementById('carBedId').value.trim();
        const pQty = document.getElementById('carBedPeople').value;
        const hasTent = document.getElementById('carBedTent').checked;
        
        if (!carBedId) {
            alert("⚠️ 請輸入「車床天地會員編號」才能享優惠價格喔！");
            return;
        }
        details += ` / 🆔車床編號:${carBedId} / ${pQty}人`;
        if (hasTent) details += " (有搭帳)";
    }

    if (!document.getElementById('extraOptions').classList.contains('hidden')) {
      // 判斷夜衝
      const config = CAMPING_CONFIG[typeValue];
      if (visitTime && config && config.nightRush) {
          const hour = parseInt(visitTime.split(':')[0]);
          if (hour >= 21) details += " (含夜衝)";
      }
      if (document.getElementById('useAC').checked) { details += " (含冷氣)"; }
      if (document.getElementById('bringPet').checked) { details += " (含寵物)"; }
    }

    const guestInputs = document.querySelectorAll('.guest-name-input');
    let guestNames = [];
    guestInputs.forEach((input, index) => {
      if (input.value.trim() !== "") { guestNames.push(`(第${index + 2}位: ${input.value.trim()})`); }
    });
    if (guestNames.length > 0) { details += `\n同行：${guestNames.join('、')}`; }
  }

  if (visitTime) { details += ` / 預計時間:${visitTime}`; }

  const btn = document.getElementById('submitBtn');
  const originalText = btn.innerText;
  btn.innerText = "⏳ 處理中...";
  btn.disabled = true;

  const orderData = {
    name: name,
    phone: phone,
    line: line,
    dateRange: dateRange,
    itemDetails: details,
    totalPrice: total,
    note: note
  };

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(orderData),
    headers: { "Content-Type": "text/plain" }
  })
    .then(() => {
        let successMsg = "🎉 預訂資料已送出！\n\n";
        successMsg += "【請務必完成匯款以保留營位】\n";
        successMsg += "🏦 合作金庫 (006)\n";
        successMsg += "💰 帳號：5492988007780\n\n";
        successMsg += "⚠️ 系統將自動開啟 LINE，請務必「貼上」剛剛複製的帳號或截圖回傳給營主確認！";
        
        alert(successMsg);

        const lineId = "@lutopia";
        const message = `你好，我是 ${name}，\n我已送出預訂：${dateRange}。\n\n我的匯款帳號後五碼/明細：\n(請在此輸入)\n\n------------------\n提醒自己：\n營區帳號：合作金庫(006) 5492988007780`;
        
        const encodedMsg = encodeURIComponent(message);
        const lineUrl = `https://line.me/R/oaMessage/${lineId}/?${encodedMsg}`;
        
        window.location.href = lineUrl;

        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerLine').value = '';
        document.getElementById('customerNote').value = '';
        btn.innerText = "✅ 完成";
        setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 3000);
    })
    .catch(error => {
      console.error('Error:', error);
      alert("連線忙碌中，請稍後再試，或直接私訊官方 LINE。");
      btn.innerText = originalText;
      btn.disabled = false;
    });
}

function hideResult() {
  document.getElementById('resultBox').classList.add('hidden');
}

function resetForm() {
  const picker = document.querySelector("#dateRange")._flatpickr;
  picker.clear();

  selectedDates = [];
  document.getElementById('campType').value = "";
  toggleInputs();

  document.getElementById('nights').value = '0';

  const acBox = document.getElementById('useAC');
  const petBox = document.getElementById('bringPet');
  if (acBox) acBox.checked = false;
  if (petBox) petBox.checked = false;

  document.getElementById('bikeQty').value = 1;
  document.getElementById('extraPeople').value = 0;
  document.getElementById('extraCars').value = 0;
  document.getElementById('visitors').value = 0;
  document.getElementById('visitTime').selectedIndex = 0;
  
  // 清空車床資訊
  const carBedId = document.getElementById('carBedId');
  if(carBedId) carBedId.value = '';
  const carBedTent = document.getElementById('carBedTent');
  if(carBedTent) carBedTent.checked = false;

  hideResult();
}

function selectPlan(planValue) {
  const select = document.getElementById('campType');
  select.value = planValue;
  toggleInputs();
  const target = document.getElementById('calculatorSection');
  if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

function copyBankInfo() {
    const account = document.getElementById('bankAccount').innerText;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(account).then(() => {
            alert("✅ 帳號已複製！\n請開啟您的銀行 APP 進行轉帳。");
        }).catch(err => {
            prompt("請長按複製帳號：", account);
        });
    } else {
        prompt("請長按複製帳號：", account);
    }
}