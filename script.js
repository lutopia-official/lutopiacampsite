/* ==========================================
   0. 全域變數與設定
========================================== */
let currentLang = 'zh';
let selectedDates = []; 

let GLOBAL_BLOCKED_DATA = { full: [], starcraft: [], dt392: [], room: [] };

// ⚠️ 請確認這是您最新的網址
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwE4JzNMfmaLDF997ZphXIZklweAqwkKiij-jueG_AhQHGuiV1mAHaUG70zt2RLWpjo7g/exec";

// ✅ 記住「預計抵達/取車時間」原始選項文字
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
    addon_title: "➕ 加購選項 (人/車/訪客)", label_extra_people: "加人 ($300/人/晚)", label_kid_free: "*小一以下免費", label_visitor: "訪客 ($100/人，23:00離場)：",
    cb_night_rush: "我要夜衝 (20:00-23:00入場)", cb_ac: "使用冷氣 (+200元/晚)", cb_pet: "攜帶寵物 (+100元/晚)",
    btn_calc: "更新費用", btn_reset: "重新填寫", result_title: "試算結果", res_base: "基本費用：", res_addon: "加購費用：", res_rush: "夜衝費用：", res_ac: "冷氣加價：", res_discount: "符合折扣：", res_total: "總計金額：",
    customer_info_title: "📝 預訂資料填寫", ph_name: "您的姓名 (必填)", ph_phone: "聯絡電話 (必填)", ph_note: "其他備註需求 (例如：露營相關、租單車者身高...)", btn_submit: "🚀 確認預訂並送出", alert_fill: "請務必填寫「姓名」與「電話」才能送出訂單喔！",
    confirm_room_policy: "🛑【訂位前請確認】\n\n1. 🏡 錄托邦住宿入住時間：下午 15:00 以後。\n   (請勿提早，可以提早放置行李，請先告知)\n\n2. ♻️ 環保旅宿：不提供一次性備品。\n   (請自備毛巾、牙刷)\n\n請問您是否接受並繼續訂位？",
    rule_title_basic: "🔷 收費標準與營區規定", rule_sub_price: "💰 營位計費標準", rule_li_unit: "基本單位：4人 / 1車 / 1帳 / 1炊事帳。", rule_li_add_person: "加人：多1人加 $300 (國小一年級以下免費)。", rule_li_add_car: "加車：多停一台車加收 $300 (拖車不在此限)。", rule_li_visitor: "訪客：每人 $100，需於 23:00 前離場。", rule_sub_tent: "⛺ 搭帳與冷氣規範", rule_li_big_tent: "大型帳篷：神殿、怪獸、5x8天幕等請訂2個營位。", rule_li_ac_fee: "冷氣使用：車上/帳內使用冷氣接電，酌收 $200/晚。", rule_li_warning: "未告知搭設大帳者，現場將禁止搭設。", rule_sub_rush: "🌙 夜衝服務 (限自搭帳)", rule_li_rush_time: "時間：20:00 後入場，23:30 前搭完。", rule_li_rush_price: "費用：夜衝價格依各營位有所不同，請以系統試算為準。", rule_li_rush_rv: "🚐 自備露營車夜衝依金額打 8 折。",
    rule_noise_title: "🚫 噪音管制 (嚴格執行)", rule_noise_head: "⚠️ 晚間 10:30 過後<br>非常嚴厲禁止使用：", rule_noise_list: "❌ 卡啦OK唱歌<br>❌ 放音樂<br>❌ 大聲喧嘩", rule_noise_punish: "‼️ 違者將強制要求離場 ‼️<br>🚫 並且不會退費",
    rule_title_policy: "⚠️ 住宿取消政策與付款", rule_sub_refund: "📅 取消退費標準", ref_14: "14天前", ref_desc_14: "退 100% (扣手續費) 或改期", ref_10: "10-13天前", ref_desc_10: "退 70% (2日內補差額)", ref_7: "7-9天前", ref_desc_7: "退 50%",
    pricing_title: "全區獨享包場方案", pricing_desc: "選擇適合您的規模，平日/假日/連假皆有不同優惠", plan_a_title: "方案 A：純場地自由配", plan_b_title: "方案 B：場地 + 露營車", plan_c_title: "方案 C：豪華全配版", btn_book_a: "預約方案 A", btn_book_b: "預約方案 B", btn_book_c: "預約方案 C",
    opt_inc_dt392: "(含 大馳 DT392)", opt_inc_starcraft: "(含 StarCraft 美式復古拖車)", opt_inc_room: "(含 錄托邦民宿房間)", opt_inc_both_rv: "(含 StarCraft + DT392)", opt_inc_room_starcraft: "(含 StarCraft + 民宿房間)", opt_inc_room_dt392: "(含 DT392 + 民宿房間)", opt_group_contact: "(團體請洽官方)"
  },
  en: {
    loading: "Loading...", calc_title: "🌲 Camping & Services Calculator", basic_unit: "Basic Unit: 4 Pax / 1 Car / 1 Tent",
    important_notice: "Important Notice:", checkin_time_val: "⏰ Check-in: After 14:00", checkin_time_val_room: "🏡 Check-in: After 15:00",
    dont_early: "(No early check-in)", eco_policy_label: "Eco-friendly:", eco_policy_desc: "♻️ No disposable amenities (Bring your own towel/toothbrush)", checkin_time_label: "Check-in:",
    label_type: "Select Type:", select_placeholder: "Please select...", label_unit_qty: "Quantity:",
    group_camping: "⛺ Camping Mode", group_rental: "🚐 Rental & Room", group_full: "🎉 Full Booking", group_venue: "🎪 Venue Rental", group_bike: "🚲 Services",
    opt_tent: "Bring Your Own Tent", opt_moto: "Moto/Bike Camping", opt_solo: "Solo Tent", opt_car: "Car Camping", opt_camper: "Campervan/RV",
    opt_starcraft: "StarCraft Vintage Trailer", opt_dt392: "DT392 Camper", opt_room: "Lutopia Room",
    opt_full_basic: "Venue Only", opt_full_vans: "Venue + 2 Campers", opt_full_all: "Venue + 2 Campers + Room", opt_venue_hourly: "Hourly Venue Rental", opt_bicycle: "Bicycle Rental",
    label_date: "Date:", date_placeholder: "Select dates...", label_time: "Est. Arrival Time:", time_placeholder: "Select time...",
    label_nights: "Nights:", label_rental_scheme: "Rental Scheme:", label_bike_qty: "Bike Qty:", label_bike_scheme: "Bike Scheme:",
    addon_title: "➕ Add-ons", label_extra_people: "Extra Pax ($300/pax)", label_kid_free: "*Under 1st grade free", label_visitor: "Visitor ($100/pax, leave by 23:00):",
    cb_night_rush: "Night Rush (Entry 20:00-23:00)", cb_ac: "Use AC (+200/night)", cb_pet: "Bring Pet (+100/night)",
    btn_calc: "Calculate", btn_reset: "Reset", result_title: "Calculation Result", res_base: "Base Price:", res_addon: "Add-ons:", res_rush: "Night Rush:", res_ac: "AC Fee:", res_discount: "Discount:", res_total: "Total Amount:",
    customer_info_title: "📝 Booking Information", ph_name: "Your Name (Required)", ph_phone: "Phone Number (Required)", ph_note: "Additional Notes", btn_submit: "🚀 Confirm & Submit", alert_fill: "Please fill in Name and Phone!",
    confirm_room_policy: "🛑【Please Confirm】\n\n1. Check-in: After 15:00.\n2. Eco-friendly: No disposable amenities.\n\nDo you accept and wish to proceed?",
    rule_title_basic: "🔷 Pricing Standard & Rules", rule_sub_price: "💰 Pricing Standard", rule_li_unit: "Basic unit: 4 pax / 1 car / 1 tent.", rule_li_add_person: "Extra pax: +$300.", rule_li_add_car: "Extra car: +$300.", rule_li_visitor: "Visitor: $100/pax.", rule_sub_tent: "⛺ Tent & AC Rules", rule_li_big_tent: "Large tents need 2 spots.", rule_li_ac_fee: "AC usage: $200/night.", rule_li_warning: "Undeclared large tents prohibited.", rule_sub_rush: "🌙 Night Rush", rule_li_rush_time: "Entry after 20:00.", rule_li_rush_price: "Fee varies by spot.", rule_li_rush_rv: "🚐 RV night rush 20% off.",
    rule_noise_title: "🚫 Noise Control", rule_noise_head: "⚠️ Strictly prohibited after 22:30:", rule_noise_list: "❌ Karaoke<br>❌ Loud Music<br>❌ Loud Noise", rule_noise_punish: "‼️ Violators will be asked to leave ‼️<br>🚫 No refunds",
    rule_title_policy: "⚠️ Cancellation Policy", rule_sub_refund: "📅 Refund Standard", ref_14: "14 days prior", ref_desc_14: "100% refund", ref_10: "10-13 days prior", ref_desc_10: "70% refund", ref_7: "7-9 days prior", ref_desc_7: "50% refund",
    pricing_title: "Exclusive Full Booking", pricing_desc: "Choose your scale", plan_a_title: "Plan A: Venue Only", plan_b_title: "Plan B: Venue + Campers", plan_c_title: "Plan C: Full Package", btn_book_a: "Book Plan A", btn_book_b: "Book Plan B", btn_book_c: "Book Plan C",
    opt_inc_dt392: "(inc. DT392)", opt_inc_starcraft: "(inc. StarCraft)", opt_inc_room: "(inc. Room)", opt_inc_both_rv: "(inc. StarCraft & DT392)", opt_inc_room_starcraft: "(inc. StarCraft & Room)", opt_inc_room_dt392: "(inc. DT392 & Room)", opt_group_contact: "(Contact Official)"
  },
  jp: {
    loading: "読み込み中...", calc_title: "🌲 料金計算＆予約", basic_unit: "基本単位：4人 / 1車 / 1テント",
    important_notice: "重要なお知らせ：", checkin_time_val: "⏰ チェックイン：14:00以降", checkin_time_val_room: "🏡 チェックイン：15:00以降",
    dont_early: "(アーリーチェックイン不可)", eco_policy_label: "エコポリシー：", eco_policy_desc: "♻️ 使い捨てアメニティなし (タオル・歯ブラシ持参)", checkin_time_label: "チェックイン:",
    label_type: "タイプ選択：", select_placeholder: "選択してください...", label_unit_qty: "予約数量：",
    group_camping: "⛺ キャンプモード", group_rental: "🚐 レンタル/客室", group_full: "🎉 貸切宿泊", group_venue: "🎪 会場レンタル", group_bike: "🚲 周辺サービス",
    opt_tent: "テント持ち込み", opt_moto: "バイク・自転車キャンプ", opt_solo: "ソロテント", opt_car: "車中泊", opt_camper: "キャンピングカー",
    opt_starcraft: "StarCraft トレーラー", opt_dt392: "DT392 キャンピングカー", opt_room: "Lutopia 客室",
    opt_full_basic: "会場のみ", opt_full_vans: "会場 + キャンピングカー2台", opt_full_all: "会場 + 車2台 + 客室", opt_venue_hourly: "会場レンタル(時間制)", opt_bicycle: "レンタサイクル",
    label_date: "予約日：", date_placeholder: "日付を選択...", label_time: "到着予定時間：", time_placeholder: "時間を選択...",
    label_nights: "宿泊数：", label_rental_scheme: "レンタルプラン：", label_bike_qty: "レンタル数量：", label_bike_scheme: "レンタルプラン：",
    addon_title: "➕ 追加オプション", label_extra_people: "追加人数 ($300/人)", label_kid_free: "*小学1年生以下無料", label_visitor: "訪問者 ($100/人、23:00退場)：",
    cb_night_rush: "前泊 (20:00-23:00入場)", cb_ac: "エアコン使用 (+200/泊)", cb_pet: "ペット同伴 (+100/泊)",
    btn_calc: "料金を更新", btn_reset: "リセット", result_title: "計算結果", res_base: "基本料金：", res_addon: "追加料金：", res_rush: "前泊料金：", res_ac: "エアコン追加：", res_discount: "割引：", res_total: "合計金額：",
    customer_info_title: "📝 予約情報入力", ph_name: "お名前 (必須)", ph_phone: "電話番号 (必須)", ph_note: "その他のご要望", btn_submit: "🚀 予約を確定する", alert_fill: "お名前と電話番号は必須です！",
    confirm_room_policy: "🛑【ご確認ください】\n\n1. チェックイン: 15:00以降。\n2. エコポリシー: 使い捨てアメニティなし。\n\n同意して予約を続行しますか？",
    rule_title_basic: "🔷 料金基準と規則", rule_sub_price: "💰 料金基準", rule_li_unit: "基本単位：4人 / 1車 / 1テント。", rule_li_add_person: "追加人数：$300/人。", rule_li_add_car: "追加車：$300/台。", rule_li_visitor: "訪問者：$100/人。", rule_sub_tent: "⛺ テント・エアコン規則", rule_li_big_tent: "大型テントは2区画必要です。", rule_li_ac_fee: "エアコン使用：$200/泊。", rule_li_warning: "申告のない大型テントは禁止です。", rule_sub_rush: "🌙 前泊サービス", rule_li_rush_time: "時間：20:00以降入場。", rule_li_rush_price: "料金はシステム計算をご参照ください。", rule_li_rush_rv: "🚐 キャンピングカーの前泊は20%オフ。",
    rule_noise_title: "🚫 騒音規制", rule_noise_head: "⚠️ 22:30以降の禁止事項：", rule_noise_list: "❌ カラオケ<br>❌ 音楽<br>❌ 大声での会話", rule_noise_punish: "‼️ 違反者は退場となります ‼️<br>🚫 返金不可",
    rule_title_policy: "⚠️ キャンセルポリシー", rule_sub_refund: "📅 返金基準", ref_14: "14日前", ref_desc_14: "100%返金", ref_10: "10-13日前", ref_desc_10: "70%返金", ref_7: "7-9日前", ref_desc_7: "50%返金",
    pricing_title: "貸切プラン", pricing_desc: "規模に合わせてお選びください", plan_a_title: "プランA: 会場のみ", plan_b_title: "プランB: 会場+キャンピングカー", plan_c_title: "プランC: 豪華フルセット", btn_book_a: "プランAを予約", btn_book_b: "プランBを予約", btn_book_c: "プランCを予約",
    opt_inc_dt392: "(DT392 含む)", opt_inc_starcraft: "(StarCraft 含む)", opt_inc_room: "(客室 含む)", opt_inc_both_rv: "(StarCraft + DT392 含む)", opt_inc_room_starcraft: "(StarCraft + 客室 含む)", opt_inc_room_dt392: "(DT392 + 客室 含む)", opt_group_contact: "(団体は公式へ)"
  }
};

// ==========================================
// 📅 設定假日 (包含連假)
// ==========================================
const HOLIDAYS = [
    "2026-01-01", 
    "2026-02-14", "2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18", 
    "2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22", 
    "2026-02-27", "2026-02-28", "2026-03-01", 
    "2026-04-03", "2026-04-04", "2026-04-05", "2026-04-06",
    "2026-05-01", "2026-05-02", "2026-05-03",
    "2026-06-19", "2026-06-20", "2026-06-21",
    "2026-09-25", "2026-09-26", "2026-09-27",
    "2026-10-09", "2026-10-10", "2026-10-11",
    "2026-12-31"
];

// ✅ 補班日
const MAKEUP_DAYS = [
    "2026-02-07", 
    "2026-02-21"
];

// ✅ 定義過年期間 (Chinese New Year)
const CNY_DAYS = [
    "2026-02-14", "2026-02-15", "2026-02-16", "2026-02-17", 
    "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22"
];

// ==========================================
// 📅 定義連假完整區間 (用於計算住滿 9.5 折)
// ⚠️ 這裡只列出「過夜的晚上」，不包含退帳日
// ==========================================
const HOLIDAY_BLOCKS = [
    // 春節 (共8晚)
    ["2026-02-14", "2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21"], 
    // 228連假 (住 2/27, 2/28 兩晚，3/1退帳)
    ["2026-02-27", "2026-02-28"], 
    // 清明連假 (住 4/3, 4/4, 4/5 三晚，4/6退帳)
    ["2026-04-03", "2026-04-04", "2026-04-05"], 
    // 勞動節 (住 5/1, 5/2 兩晚，5/3退帳)
    ["2026-05-01", "2026-05-02"], 
    // 端午節 (住 6/19, 6/20 兩晚，6/21退帳)
    ["2026-06-19", "2026-06-20"], 
    // 中秋節 (住 9/25, 9/26 兩晚，9/27退帳)
    ["2026-09-25", "2026-09-26"], 
    // 國慶日 (住 10/9, 10/10 兩晚，10/11退帳)
    ["2026-10-09", "2026-10-10"]  
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

let hasShownDateNotice = false;

flatpickr("#dateRange", {
  mode: "range",
  minDate: "today",
  dateFormat: "Y-m-d (D)",
  locale: "zh",
  onOpen: function() {
    // 當客人點開日曆時，跳出提醒視窗
    if (!hasShownDateNotice) {
        alert("⚠️ 【預約日期選擇提醒】\n\n請務必點選「進場日期」與「退場日期」！\n(不然無法算出價格唷，請點選出進、退場時間)");
        hasShownDateNotice = true; 
    }
  },
  onChange: function (dates) {
    updateNights(dates);
    checkCarBedVipAvailability(); 
    calculateTotal();
  }
});

// 檢查車床天地連假限制
function checkCarBedVipAvailability() {
    const carBedOption = document.querySelector('option[value="car_bed_vip"]');
    if (!carBedOption) return;

    let hasHoliday = false;
    if (selectedDates.length >= 2) {
        let currentDate = new Date(selectedDates[0]);
        const endDate = new Date(selectedDates[1]);
        while (currentDate < endDate) {
            const dateStr = formatDate(currentDate);
            if ((HOLIDAYS.includes(dateStr) || CNY_DAYS.includes(dateStr)) && !MAKEUP_DAYS.includes(dateStr)) {
                hasHoliday = true;
                break;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    const campTypeSelect = document.getElementById('campType');
    if (hasHoliday) {
        carBedOption.disabled = true;
        carBedOption.text = "🚙 車床天地特約 (連假不適用)";
        if (campTypeSelect.value === 'car_bed_vip') {
            alert("⚠️ 抱歉，車床天地特約方案「連假期間」不適用，請改選一般車泊或其他方案。");
            campTypeSelect.value = "";
            toggleInputs();
        }
    } else {
        carBedOption.disabled = false;
        carBedOption.text = "🚙 車床天地特約會員 (需驗證編號)";
    }
}

// ==========================================
// 💰 價格設定 (已更新為最新平日/假日/連假價格)
// ==========================================
const CAMPING_CONFIG = {
  // 1. 自搭帳篷
  tent: { 
      rates: { weekday: 700, weekend: 800, holiday: 1000, cny: 1200 }, 
      nightRush: { weekday: 500, weekend: 600, holiday: 600, cny: 800 }, 
      discountType: "fixed_amount" 
  },
  
  // 2. 機車露營
  moto: { 
      rates: { weekday: 400, weekend: 500, holiday: 600, cny: 800 }, 
      nightRush: { weekday: 300, weekend: 400, holiday: 500, cny: 500 }, 
      discountType: "fixed_amount" 
  },
  
  // 3. 單人
  solo: { 
      rates: { weekday: 400, weekend: 500, holiday: 600, cny: 800 }, 
      nightRush: { weekday: 300, weekend: 400, holiday: 500, cny: 500 }, 
      discountType: "fixed_amount" 
  },
  
  // 4. 車泊 (Car)
  car: { 
      rates: { weekday: 600, weekend: 700, holiday: 800, cny: 1100 }, 
      nightRush: { weekday: 500, weekend: 600, holiday: 600, cny: 800 }, 
      discountType: "fixed_amount" 
  },
  
  // 5. 車床天地
  car_bed_vip: { 
      people_rates: {
          1: { weekday: 250, weekend: 350, holiday: 350, cny: 350 },
          2: { weekday: 300, weekend: 400, holiday: 400, cny: 400 },
          3: { weekday: 400, weekend: 500, holiday: 500, cny: 500 },
          4: { weekday: 500, weekend: 600, holiday: 600, cny: 600 }
      },
      tent_add_on: { weekday: 50, weekend: 50, holiday: 50, cny: 50 }, 
      ac_fee: 50,
      nightRush: { weekday: 300, weekend: 400, holiday: 500, cny: 500 }, 
      discountType: "none" 
  },

  // 6. 自備露營車 (Camper)
  camper: { 
      rates: { weekday: 800, weekend: 1000, holiday: 1200, cny: 1500 }, 
      nightRush: { weekday: 600, weekend: 700, holiday: 800, cny: 800 }, 
      discountType: "fixed_amount_premium" 
  },
  
  // 7. StarCraft
  starcraft: { 
      rates: { weekday: 1800, weekend: 2000, holiday: 2600, cny: 2800 }, 
      discountType: "percentage" 
  },
  
  // 8. DT392
  dt392: { 
      rates: { weekday: 1600, weekend: 1800, holiday: 2000, cny: 2400 }, 
      discountType: "percentage" 
  },
  
  // 9. 民宿
  room: { 
      rates: { weekday: 2200, weekend: 2400, holiday: 2500, cny: 2600 }, 
      discountType: "percentage" 
  },
  
  // 10. 包場
  full_basic: { rates: { weekday: 7000, weekend: 10000, holiday: 15000, cny: 15000 }, discountType: "full_venue_promo" },
  full_vans: { rates: { weekday: 10000, weekend: 16000, holiday: 18000, cny: 18000 }, discountType: "full_venue_promo" },
  full_all: { rates: { weekday: 13000, weekend: 18000, holiday: 20000, cny: 20000 }, discountType: "full_venue_promo" },
  
  // 11. 其他
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
    nightsBlock.classList.remove('hidden');
    if (campingRules) campingRules.classList.remove('hidden');
    
    if (type === 'car_bed_vip') {
        if(carBedBlock) carBedBlock.classList.remove('hidden');
        extraOptions.classList.remove('hidden'); 
        const acSpan = document.querySelector('[data-i18n="cb_ac"]');
        if(acSpan) acSpan.innerText = "使用冷氣 (+50元/晚)";
        
    } else {
        if(addonBlock) addonBlock.classList.remove('hidden');
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

    if (type === 'tent' || type === 'car' || type === 'camper' || type === 'moto' || type === 'solo' || type === 'car_bed_vip') {
      extraOptions.classList.remove('hidden');
    } else {
      const acBox = document.getElementById('useAC');
      const petBox = document.getElementById('bringPet');
      if (acBox) acBox.checked = false;
      if (petBox) petBox.checked = false;
    }
  }

  if (type.includes('full') || type === 'bicycle' || type === 'venue_hourly') {
    if (unitQtyBlock) unitQtyBlock.classList.add('hidden');
    if (guestListBlock) guestListBlock.classList.add('hidden');
    document.getElementById('unitQty').value = 1;
  } else {
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

  // ✅ 偵測時間 >= 20:00 (8 PM) 自動勾選夜衝
  const visitTime = document.getElementById('visitTime').value;
  const rushCheckbox = document.getElementById('isNightRush');
  if (visitTime && rushCheckbox && !rushCheckbox.parentElement.classList.contains('hidden')) {
      const hour = parseInt(visitTime.split(':')[0]);
      if (hour >= 20) { 
          if (!rushCheckbox.checked) {
              rushCheckbox.checked = true; // 自動打勾
          }
      }
  }

  const rowAddons = document.getElementById('rowAddons');
  if (rowAddons) rowAddons.classList.add('hidden');
  document.getElementById('rowRush').classList.add('hidden');
  document.getElementById('rowAC').classList.add('hidden');
  const discountRow = document.getElementById('discountPrice')?.parentElement;
  if (discountRow) discountRow.classList.remove('hidden');

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

  if (selectedDates.length < 2) { hideResult(); return; }
  const nights = parseInt(document.getElementById('nights').value);
  if (nights < 1) { hideResult(); return; }

  let qty = 1;
  const qtyBlock = document.getElementById('qtyBlock');
  if (qtyBlock && !qtyBlock.classList.contains('hidden')) {
    qty = parseInt(document.getElementById('unitQty').value) || 1;
  }

  // ✅ 偵測夜衝選項
  let isNightRush = false;
  if (rushCheckbox && rushCheckbox.checked && !rushCheckbox.parentElement.classList.contains('hidden')) {
      isNightRush = true;
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
    
    if (CNY_DAYS.includes(dateStr)) {
        rateType = 'cny';
    } else if (isMakeup) {
        rateType = 'weekday';
    } else if (HOLIDAYS.includes(dateStr)) {
        rateType = 'holiday';
    } else if (dayOfWeek === 5 || dayOfWeek === 6) {
        rateType = 'weekend';
    }

    if (dayOfWeek === 6 && !isMakeup) hasSaturday = true;
    if (HOLIDAYS.includes(dateStr) || CNY_DAYS.includes(dateStr)) isHolidayForDiscount = true;

    if (i === 0 && isNightRush && config.nightRush) {
        let rushRate = 0;
        if (config.nightRush[rateType]) {
            rushRate = config.nightRush[rateType];
        } else if (config.nightRush['holiday']) { 
            rushRate = config.nightRush['holiday'];
        } else {
            rushRate = config.nightRush['weekday'];
        }

        if (type === 'camper') {
            rushRate = rushRate * 0.8;
        }

        basePrice += rushRate * qty;
        rushPrice = rushRate * qty; 

} else {
                let dailyBase = 0;

                // ✅ 修正：加上防呆判定，避免車床天地這種無固定基準價的方案報錯當機
                let rate_room = 0;
                if (config.rates) {
                    rate_room = config.rates[rateType] !== undefined ? config.rates[rateType] : config.rates['holiday'];
                }
                
                const rate_star = CAMPING_CONFIG.starcraft.rates[rateType] || CAMPING_CONFIG.starcraft.rates['holiday'];
                const rate_dt = CAMPING_CONFIG.dt392.rates[rateType] || CAMPING_CONFIG.dt392.rates['holiday'];
        if (type === 'car_bed_vip') {
            const pQty = parseInt(document.getElementById('carBedPeople').value) || 2;
            let personPrice = 0;
            if (config.people_rates[pQty][rateType] !== undefined) {
                personPrice = config.people_rates[pQty][rateType];
            } else {
                personPrice = config.people_rates[pQty]['weekend'];
            }
            const hasTent = document.getElementById('carBedTent').checked;
            let tentFee = 0;
            if (hasTent) {
                tentFee = config.tent_add_on[rateType] || 50; 
            }
            dailyBase = (personPrice + tentFee) * qty; 
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
            dailyBase = (config.rates[rateType] !== undefined) ? config.rates[rateType] : config.rates['holiday'];
            dailyBase *= qty;
        }
        basePrice += dailyBase;
    }

    if (useAC) {
        if (type === 'car_bed_vip') {
            acPrice += 50 * qty; 
        } else {
            acPrice += 200 * qty;
        }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const extraPeople = parseInt(document.getElementById('extraPeople').value) || 0;
  const visitors = parseInt(document.getElementById('visitors').value) || 0;
  const extraPeopleCost = extraPeople * 300 * nights;
  const visitorsCost = visitors * 100;
  const petCost = bringPet ? (100 * qty * nights) : 0;
  const totalAddonCost = extraPeopleCost + visitorsCost + petCost;

  if (totalAddonCost > 0) {
    if (rowAddons) rowAddons.classList.remove('hidden');
    document.getElementById('addonPrice').innerText = totalAddonCost;
  } else {
    if (rowAddons) rowAddons.classList.add('hidden');
    document.getElementById('addonPrice').innerText = 0;
  }

  let discount = 0;
  if (discountRow) discountRow.classList.remove('hidden');
  
  const totalPriceForDiscount = basePrice + acPrice;

  // ✅ 1. 判斷是否「住滿連假」
  let isFullHoliday = false;
  const stayDatesStr = [];
  let tempDate = new Date(selectedDates[0]);
  for (let i = 0; i < nights; i++) {
      stayDatesStr.push(formatDate(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
  }
  
  for (let block of HOLIDAY_BLOCKS) {
      // 檢查客人的住宿日期是否完整包含整個連假區間
      if (block.every(d => stayDatesStr.includes(d))) {
          isFullHoliday = true;
          break;
      }
  }

  // ✅ 2. 基本折扣邏輯
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

  // ✅ 3. 若住滿連假，再疊加 5% 折扣 (相當於總價打 9.5 折)
  if (isFullHoliday && type !== 'car_bed_vip') {
      discount += (totalPriceForDiscount * 0.05);
  }

  const total = Math.round(basePrice + acPrice + totalAddonCost - discount);

  if (isNightRush) {
      document.getElementById('basePrice').innerText = Math.round(basePrice);
      document.getElementById('rushPrice').innerText = " (已含)"; 
  } else {
      document.getElementById('basePrice').innerText = Math.round(basePrice);
      document.getElementById('rushPrice').innerText = 0;
  }

  document.getElementById('acPrice').innerText = Math.round(acPrice);
  document.getElementById('discountPrice').innerText = Math.round(discount);
  document.getElementById('finalTotal').innerText = total;

  if (document.getElementById('extraOptions').classList.contains('hidden')) {
    document.getElementById('rowRush').classList.add('hidden');
    document.getElementById('rowAC').classList.add('hidden');
  } else {
    if (isNightRush) document.getElementById('rowRush').classList.remove('hidden');
    else document.getElementById('rowRush').classList.add('hidden');
    
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

    const extraPeople = parseInt(document.getElementById('extraPeople').value);
    const visitors = parseInt(document.getElementById('visitors').value);
    if (extraPeople > 0) details += ` / 加人:${extraPeople}`;
    if (visitors > 0) details += ` / 訪客:${visitors}`;

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
      const config = CAMPING_CONFIG[typeValue];
      // ✅ 檢查是否勾選夜衝 checkbox
      const isNightRush = document.getElementById('isNightRush').checked;
      
      // ✅ 檢查時間是否也 >= 20:00 (雙重確認)
      if (visitTime) {
          const hour = parseInt(visitTime.split(':')[0]);
          if (hour >= 20) details += " (含夜衝)";
          else if (isNightRush) details += " (含夜衝)";
      } else if (isNightRush) {
          details += " (含夜衝)";
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

  const last5 = document.getElementById('last5').value.trim(); 
  const noteCombined = (last5 ? `[末五碼:${last5}] ` : "") + note;

  const orderData = {
    name: name,
    phone: phone,
    line: line,
    dateRange: dateRange,
    itemDetails: details,
    totalPrice: total,
    note: noteCombined, 
    last5: last5 
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
        openLineApp(orderData); 

        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerLine').value = '';
        document.getElementById('customerNote').value = '';
        document.getElementById('last5').value = ''; 
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

function openLineApp(formData) {
  const LINE_ID = "@lutopia"; 
  const BANK_INFO = `
【匯款資訊】
銀行代碼：006 (合作金庫)
銀行帳號：5492-9880-07780
戶名：錄托邦露營區
  `.trim();
  const last5Text = formData.last5 ? formData.last5 : "尚未匯款";
  const message = `
Hi 錄托邦，我剛剛在官網下單了！
這是我的訂單資訊，請確認：

👤 姓名：${formData.name}
📞 電話：${formData.phone}
📅 日期：${formData.dateRange}
⛺ 項目：${formData.itemDetails}
💰 總金額：$${formData.totalPrice}
🏧 帳號末五碼：${last5Text}
📝 備註：${formData.note || "無"}

${BANK_INFO}

請幫我保留營位，我匯款後會再通知您！謝謝！
  `.trim();
  const encodedMsg = encodeURIComponent(message);
  const lineUrl = `https://line.me/R/oaMessage/${LINE_ID}/?${encodedMsg}`;
  window.location.href = lineUrl;
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
  document.getElementById('visitors').value = 0;
  document.getElementById('visitTime').selectedIndex = 0;
  const carBedId = document.getElementById('carBedId');
  if(carBedId) carBedId.value = '';
  const carBedTent = document.getElementById('carBedTent');
  if(carBedTent) carBedTent.checked = false;
  const last5 = document.getElementById('last5');
  if(last5) last5.value = '';
  const rushBox = document.getElementById('isNightRush');
  if(rushBox) rushBox.checked = false;
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

// ==========================================
// 🏕️ 部落慢活專案 Modal 控制邏輯
// ==========================================

function openTribalModal() {
    const modal = document.getElementById('tribalModal');
    if (modal) {
        modal.style.display = 'flex'; // 顯示視窗
        modal.classList.remove('hidden');
    }
}

function closeTribalModal() {
    const modal = document.getElementById('tribalModal');
    if (modal) {
        modal.style.display = 'none'; // 隱藏視窗
        modal.classList.add('hidden');
    }
}

function bookTribalPackage() {
    // 1. 關閉 Modal
    closeTribalModal();
    
    // 2. 自動捲動到填寫資料區塊
    const targetSection = document.getElementById('customerInfoSection') || document.getElementById('calculatorSection');
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 3. 自動在「備註欄」帶入專案預設文字，方便客人填寫
    const noteInput = document.getElementById('customerNote');
    if (noteInput) {
        // 如果原本已經有字，就空一行再加
        const existingText = noteInput.value.trim();
        const templateText = "【我要預約部落慢活 3天2夜包套】\n1. 預計體驗人數： 人\n2. 是否需加購車站接送：\n3. 是否需加購代烤肉服務：";
        
        if (existingText) {
            noteInput.value = existingText + "\n\n" + templateText;
        } else {
            noteInput.value = templateText;
        }
    }

    // 4. 跳出貼心提示
    setTimeout(() => {
        alert("🎉 已為您切換至預約表單！\n\n👉 請在上方選擇您的「預約日期」與「營位類型」。\n👉 已經為您在最下方的「備註欄」帶入包套格式，請直接填寫體驗人數與加購需求即可！");
    }, 500);
}