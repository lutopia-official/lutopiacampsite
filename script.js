/* ==========================================
   0. 全域變數與設定
========================================== */
let currentLang = 'zh';
let selectedDates = []; // ✅ 改：允許 [單日] or [起訖兩日]

let GLOBAL_BLOCKED_DATA = { full: [], starcraft: [], dt392: [], room: [] };

// ⚠️ 請確認這是您最新的網址
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpiqltgo7ewZnP3fGJWV0fgszW5OMmBsDWBH0pIbh3sFzDwyOqYEx3WdYgkXRJxBS2/exec";

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
  en: {
    loading: "Loading data...",
    calc_title: "🌲 Cost Calculator",
    basic_unit: "Unit: 4 Pax / 1 Vehicle / 1 Tent",
    important_notice: "Important:",
    checkin_time_val: "Camping Check-in: After 14:00 (No early check-in)",
    checkin_time_val_room: "Room/RV Check-in: After 15:00 (No early check-in)",
    dont_early: "(No early check-in)",
    eco_policy_label: "Eco-Friendly:",
    eco_policy_desc: "No disposable amenities. (Bring towels/toothbrush)",
    label_type: "Select Type:",
    select_placeholder: "Choose...",
    label_unit_qty: "Quantity (Unit):",
    group_camping: "⛺ Camping Mode", group_rental: "🚐 Rental / Room", group_full: "🎉 Full Booking",
    group_venue: "🎪 Venue Rental", group_bike: "🚲 Services",
    opt_tent: "Tent Camping", opt_moto: "Moto/Bike Camping", opt_solo: "Solo Camping", opt_car: "Car Camping", opt_camper: "Self-driving RV/Trailer",
    opt_starcraft: "StarCraft Vintage Trailer", opt_dt392: "DT392 RV", opt_room: "Guest Room",
    opt_full_basic: "Full Venue Only", opt_full_vans: "Full Venue + 2 RVs", opt_full_all: "Full Venue + 2 RVs + Room",
    opt_venue_hourly: "Hourly Venue Rental", opt_bicycle: "Bicycle Rental",
    label_date: "Date:", date_placeholder: "Select Date...",
    rush_notice_title: "⚠️ Night Rush Info:", rush_notice_desc: "Set the 1st day as the Night Rush date.",
    label_time: "Arrival Time:", time_placeholder: "Select Time...",
    label_nights: "Nights:", label_rental_scheme: "Duration:",
    label_bike_qty: "Quantity:", label_bike_scheme: "Plan:",
    addon_title: "➕ Add-ons",
    label_extra_people: "Extra Person ($300/night)",
    label_kid_free: "*Free for kids under 7",
    label_extra_car: "Extra Car ($300/night, No Trailers)", label_visitor: "Visitor ($100, leave by 23:00)",
    cb_night_rush: "Night Rush (21:00-23:00)",
    cb_ac: "Use A/C (+$200/night)",
    cb_pet: "Bring Pet (+$50/night)",
    btn_calc: "Update Price", btn_reset: "Reset",
    result_title: "Result", res_base: "Base Price:", res_addon: "Add-ons:", res_rush: "Night Rush:",
    res_ac: "A/C Fee:", res_discount: "Discount:", res_total: "Total:",
    customer_info_title: "📝 Your Information", ph_name: "Name (Required)", ph_phone: "Phone (Required)",
    ph_note: "Notes / Requests...", btn_submit: "🚀 Submit Order",
    alert_fill: "Please fill in Name and Phone!",
    confirm_room_policy: "🛑【Please Confirm】\n\n1. ⏰ Check-in is after 15:00.\n2. ♻️ No disposable amenities provided.\n   (Bring your own towels/toothbrush)\n\nAccept and continue?",
    sent_success: "🎉 Order Sent!\n\nPlease note: Reservation is confirmed only after full payment.\nRefer to the bottom of the page for refund policies.",
    rule_title_basic: "🔷 Rules & Fees", rule_sub_price: "💰 Camping Fees",
    rule_li_unit: "Unit: 4 Pax / 1 Vehicle / 1 Tent.",
    rule_li_add_person: "Extra Person: +$300 (Kids < 7 Free).",
    rule_li_add_car: "Extra Car: +$300 (Trailers excluded).", rule_li_visitor: "Visitor: $100/person (Leave by 23:00).",
    rule_sub_tent: "⛺ Tents & A/C", rule_li_big_tent: "Big Tents: Please book 2 sites.",
    rule_li_ac_fee: "A/C Usage: +$200/night.",
    rule_li_warning: "Undeclared big tents are prohibited.",
    rule_sub_rush: "🌙 Night Rush (Tent Only)", rule_li_rush_time: "Time: 22:00-23:30 Check-in.",
    rule_li_rush_price: "Fee: Weekday $500 / W-end $600 / Holiday $800.", rule_li_rush_rv: "🚐 RV Night Rush: 20% Off.",
    rule_title_policy: "⚠️ Cancellation & Payment", rule_sub_refund: "📅 Refund Policy",
    ref_14: "14 days", ref_desc_14: "100% Refund", ref_10: "10-13 days", ref_desc_10: "70% Refund",
    ref_7: "7-9 days", ref_desc_7: "50% Refund", ref_4: "4-6 days", ref_desc_4: "30% Refund", ref_0: "0-3 days", ref_desc_0: "No Refund",
    rule_sub_bank: "💰 Payment (Transfer Full Amount)", rule_bank_note: "Please keep the transfer receipt.",
    opt_inc_dt392: "(w/ DT392 RV)", opt_inc_starcraft: "(w/ StarCraft Trailer)",
    opt_inc_room: "(w/ Guest Room)", opt_inc_both_rv: "(w/ StarCraft + DT392)",
    opt_inc_room_starcraft: "(w/ StarCraft + Room)", opt_inc_room_dt392: "(w/ DT392 + Room)",
    opt_inc_all_three: "(w/ StarCraft + DT392 + Room)", opt_group_contact: "(Contact us for groups)"
  },
  jp: {
    loading: "読み込み中...",
    calc_title: "🌲 料金シミュレーション",
    basic_unit: "基本：4名 / 車1台 / テント1張",
    important_notice: "重要事項：",
    checkin_time_val: "キャンプ：14:00 以降 (アーリーチェックイン不可)",
    checkin_time_val_room: "部屋/RV：15:00 以降 (アーリーチェックイン不可)",
    dont_early: "(アーリーチェックイン不可)",
    eco_policy_label: "エコ方針：",
    eco_policy_desc: "使い捨てアメニティなし (タオル・歯ブラシ持参)",
    label_type: "タイプ選択：",
    select_placeholder: "選択してください...",
    label_unit_qty: "数量 (台/張)：",
    group_camping: "⛺ キャンプモード", group_rental: "🚐 キャンピングカー / 部屋", group_full: "🎉 貸切",
    group_venue: "🎪 場所貸し", group_bike: "🚲 サービス",
    opt_tent: "テント持ち込み", opt_moto: "バイク・自転車キャンプ", opt_solo: "ソロキャンプ", opt_car: "車中泊", opt_camper: "自走式キャンピングカー/トレーラー",
    opt_starcraft: "StarCraft トレーラー", opt_dt392: "DT392 キャンピングカー", opt_room: "民宿の部屋",
    opt_full_basic: "場所のみ貸切", opt_full_vans: "貸切 + キャンピングカー2台", opt_full_all: "貸切 + キャンピングカー2台 + 部屋",
    opt_venue_hourly: "時間貸し", opt_bicycle: "自転車レンタル",
    label_date: "予約日：", date_placeholder: "日付を選択...",
    rush_notice_title: "⚠️ 前泊(夜間)について：", rush_notice_desc: "前泊する日を1日目に設定してください。",
    label_time: "到着予定時刻：", time_placeholder: "時間を選択...",
    label_nights: "泊数：", label_rental_scheme: "利用時間：",
    label_bike_qty: "台数：", label_bike_scheme: "プラン：",
    addon_title: "➕ オプション追加", label_extra_people: "追加人数 ($300/泊)",
    label_kid_free: "*小学1年生以下無料",
    label_extra_car: "追加車両 ($300/泊、トレーラー除く)", label_visitor: "日帰り客 ($100/人 23時退出)",
    cb_night_rush: "前泊・夜間入場 (21:00-23:00)",
    cb_ac: "エアコン利用 (+$200/泊)",
    cb_pet: "ペット同伴 (+$50/泊)",
    btn_calc: "料金更新", btn_reset: "リセット",
    result_title: "計算結果", res_base: "基本料金：", res_addon: "追加料金：", res_rush: "前泊(夜間)：",
    res_ac: "エアコン：", res_discount: "割引：", res_total: "合計金額：",
    customer_info_title: "📝 予約情報", ph_name: "お名前 (必須)", ph_phone: "電話番号 (必須)",
    ph_note: "備考・リクエスト...", btn_submit: "🚀 予約を送信",
    alert_fill: "お名前と電話番号を入力してください！",
    confirm_room_policy: "🛑【確認事項】\n\n1. ⏰ チェックインは 15:00 以降です。\n2. ♻️ アメニティの提供はありません。\n   (タオル・歯ブラシをご持参ください)\n\n了承して予約しますか？",
    sent_success: "🎉 送信完了！\n\n全額のお振込をもって予約確定となります。\nキャンセル規定はページ下部をご覧ください。",
    rule_title_basic: "🔷 料金・ルール", rule_sub_price: "💰 キャンプ料金",
    rule_li_unit: "基本：4名 / 車1台 / テント1張。",
    rule_li_add_person: "追加人数：+$300 (小1以下無料)。",
    rule_li_add_car: "追加車両：+$300 (トレーラー除く)。", rule_li_visitor: "日帰り：$100/人 (23時退出)。",
    rule_sub_tent: "⛺ テント・エアコン", rule_li_big_tent: "大型テント：2区画予約してください。",
    rule_li_ac_fee: "エアコン利用：+$200/泊。",
    rule_li_warning: "申告のない大型テントは設営禁止。",
    rule_sub_rush: "🌙 前泊 (テントのみ)", rule_li_rush_time: "時間：22:00-23:30 入場。",
    rule_li_rush_price: "料金：平日 500元 / 休日 600元 / 連休 800元。", rule_li_rush_rv: "🚐 キャンピングカー前泊：20% OFF。",
    rule_title_policy: "⚠️ キャンセル・支払い", rule_sub_refund: "📅 返金ポリシー",
    ref_14: "14日前", ref_desc_14: "100% 返金", ref_10: "10-13日前", ref_desc_10: "70% 返金",
    ref_7: "7-9日前", ref_desc_7: "50% 返金", ref_4: "4-6日前", ref_desc_4: "30% 返金", ref_0: "0-3日前", ref_desc_0: "返金なし",
    rule_sub_bank: "💰 お支払い (全額振込)", rule_bank_note: "振込明細を保存してください。",
    opt_inc_dt392: "(DT392 込み)", opt_inc_starcraft: "(StarCraft 込み)",
    opt_inc_room: "(民宿の部屋 込み)", opt_inc_both_rv: "(StarCraft + DT392 込み)",
    opt_inc_room_starcraft: "(StarCraft + 部屋 込み)", opt_inc_room_dt392: "(DT392 + 部屋 込み)",
    opt_inc_all_three: "(StarCraft + DT392 + 部屋 込み)", opt_group_contact: "(団体は要連絡)"
  }
};

const HOLIDAYS = [
  // 2026 (民國115年) — 依政府行政機關辦公日曆表(連假/補假)
  // 元旦
  "2026-01-01",

  // 除夕與春節：2/14–2/22（其中除夕前一日逢週日，於 2/20 補假，所以連放 9 天）
  "2026-02-14", "2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19",
  "2026-02-20", "2026-02-21", "2026-02-22",

  // 228 和平紀念日：2/27–3/1（2/28 逢週六，2/27 補假）
  "2026-02-27", "2026-02-28", "2026-03-01",

  // 兒童節/清明：4/3–4/6（4/4 逢週六→4/3 補假；4/5 逢週日→4/6 補假）
  "2026-04-03", "2026-04-04", "2026-04-05", "2026-04-06",

  // 勞動節：5/1–5/3（5/1 週五＋例假日）
  "2026-05-01", "2026-05-02", "2026-05-03",

  // 端午：6/19–6/21（6/19 週五＋例假日）
  "2026-06-19", "2026-06-20", "2026-06-21",

  // 中秋＋孔子誕辰/教師節：9/25–9/28（9/25 週五、9/28 週一＋例假日）
  "2026-09-25", "2026-09-26", "2026-09-27", "2026-09-28",

  // 國慶：10/9–10/11（10/10 逢週六→10/9 補假）
  "2026-10-09", "2026-10-10", "2026-10-11",

  // 臺灣光復暨金門古寧頭大捷紀念日：10/24–10/26（10/25 逢週日→10/26 補假）
  "2026-10-24", "2026-10-25", "2026-10-26",

  // 行憲紀念日：12/25–12/27（12/25 週五＋例假日）
  "2026-12-25", "2026-12-26", "2026-12-27"
]; 

const MAKEUP_DAYS = [
  "2025-02-08", // 2025 補班日
  // 2026（民國115年）：無「調整上班」補班日
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

/* ✅ 改：range 模式仍保留，但 updateNights 會保留單日 dates，讓 bike/venue 可計算 */
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
  car:  { rates: { weekday: 600, weekend: 800, holiday: 1200 }, nightRush: { weekday: 500, weekend: 600, holiday: 800 }, discountType: "fixed_amount" },
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
  const rushNotice = document.getElementById('rushNotice');
  const policyNotice = document.getElementById('policyNotice');
  const campingRules = document.getElementById('campingRules');
  const unitQtyBlock = document.getElementById('qtyBlock');
  const guestListBlock = document.getElementById('guestListBlock');
  const unitQtySelect = document.getElementById('unitQty');

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS['zh'];

  // 動態調整 unitQty 的顯示文字
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

  // 先全部隱藏
  nightsBlock.classList.add('hidden');
  rentalBlock.classList.add('hidden');
  bikeBlock.classList.add('hidden');
  extraOptions.classList.add('hidden');
  if (addonBlock) addonBlock.classList.add('hidden');
  if (unitNotice) unitNotice.classList.add('hidden');
  if (rushNotice) rushNotice.classList.add('hidden');
  if (policyNotice) policyNotice.classList.add('hidden');
  if (campingRules) campingRules.classList.add('hidden');

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
    // === 住宿/露營類 ===
    nightsBlock.classList.remove('hidden');
    if (campingRules) campingRules.classList.remove('hidden');
    if (addonBlock) addonBlock.classList.remove('hidden');

    const isFullBooking = (type === 'full_basic' || type === 'full_vans' || type === 'full_all');
    if (unitNotice) {
      if (isFullBooking) unitNotice.classList.add('hidden');
      else unitNotice.classList.remove('hidden');
    }
    if (policyNotice) policyNotice.classList.remove('hidden');

    // 入住時間文字
    const checkInText = document.getElementById('checkInTimeText');
    const visitTimeSelect = document.getElementById('visitTime');
    if (visitTimeSelect) {
      for (let i = 0; i < visitTimeSelect.options.length; i++) {
        let opt = visitTimeSelect.options[i];
        opt.disabled = false; opt.hidden = false;
        if (opt.value === "15:00") { opt.text = "15:00"; }
      }
    }

    if (type === 'room' || type === 'starcraft' || type === 'dt392') {
      if (checkInText) {
        checkInText.innerText = TRANSLATIONS[currentLang].checkin_time_val_room;
        checkInText.style.color = "#800080"; checkInText.style.fontWeight = "bold";
      }
      if (visitTimeSelect) {
        let opt1400 = visitTimeSelect.querySelector('option[value="14:00"]');
        let opt1430 = visitTimeSelect.querySelector('option[value="14:30"]');
        if (opt1400) { opt1400.disabled = true; opt1400.hidden = true; }
        if (opt1430) { opt1430.disabled = true; opt1430.hidden = true; }
        let opt1500 = visitTimeSelect.querySelector('option[value="15:00"]');
        if (opt1500) { opt1500.text = "15:00 (check in time)"; }
        if (visitTimeSelect.value === "14:00" || visitTimeSelect.value === "14:30") { visitTimeSelect.value = ""; }
      }
    } else {
      if (checkInText) {
        checkInText.innerText = TRANSLATIONS[currentLang].checkin_time_val;
        checkInText.style.color = ""; checkInText.style.fontWeight = "";
      }
    }

    // 民宿 vs 露營
    const extraPeopleLabel = document.querySelector('[data-i18n="label_extra_people"]');
    const extraPeopleInput = document.getElementById('extraPeople');
    const basicUnitDesc = document.querySelector('[data-i18n="basic_unit"]');

    if (type === 'room') {
      if (basicUnitDesc) basicUnitDesc.innerText = "基本單位：2人 / 1間 (第三人起需加購)";
      if (extraPeopleLabel) extraPeopleLabel.innerText = "➕ 加購選項 (第三/人) 加人 ($300/人)";
      if (extraPeopleInput) {
        extraPeopleInput.max = 2; extraPeopleInput.placeholder = "最多加 2 人";
        if (parseInt(extraPeopleInput.value) > 2) extraPeopleInput.value = 2;
      }
    } else {
      if (basicUnitDesc) basicUnitDesc.innerText = t.basic_unit;
      if (extraPeopleLabel) extraPeopleLabel.innerText = t.label_extra_people;
      if (extraPeopleInput) {
        extraPeopleInput.removeAttribute('max'); extraPeopleInput.placeholder = "0";
      }
    }

    // 露營類顯示夜衝/冷氣/寵物
    if (type === 'tent' || type === 'car' || type === 'camper' || type === 'moto' || type === 'solo') {
      extraOptions.classList.remove('hidden');
    } else {
      const nightRushBox = document.getElementById('isNightRush');
      if (nightRushBox) nightRushBox.checked = false;

      const acBox = document.getElementById('useAC');
      if (acBox) acBox.checked = false;

      const petBox = document.getElementById('bringPet');
      if (petBox) petBox.checked = false;
    }
  }

  // qty + guest list
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

/* ✅ 改：不再把單日選取清空，讓 bike/venue 可用 */
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

/* ✅ 改：bike/venue 只需 1 天即可計算；露營住宿仍需 2 天 range */
function calculateTotal() {
  const type = document.getElementById('campType').value;
  if (!type || type === "") { hideResult(); return; }

  const config = CAMPING_CONFIG[type];
  if (!config) { hideResult(); return; }

  // 先把結果區常見列重置（避免切換類型時殘留）
  const rowAddons = document.getElementById('rowAddons');
  if (rowAddons) rowAddons.classList.add('hidden');
  document.getElementById('rowRush').classList.add('hidden');
  document.getElementById('rowAC').classList.add('hidden');
  const discountRow = document.getElementById('discountPrice').parentElement;
  if (discountRow) discountRow.classList.remove('hidden');

  // ====== 1) 單車租借：只要選 1 天就能算 ======
  if (type === 'bicycle') {
    if (selectedDates.length < 1) { hideResult(); return; }

    // 清掉露營加購 checkbox（避免送單備註混入）
    const nightRushBox = document.getElementById('isNightRush');
    const acBox = document.getElementById('useAC');
    const petBox = document.getElementById('bringPet');
    if (nightRushBox) nightRushBox.checked = false;
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

    if (discountRow) discountRow.classList.add('hidden'); // bike 不用折扣列
    document.getElementById('resultBox').classList.remove('hidden');
    return;
  }

  // ====== 2) 場地租借：只要選 1 天即可判斷假日價 ======
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

    if (discountRow) discountRow.classList.add('hidden'); // venue 不用折扣列
    document.getElementById('resultBox').classList.remove('hidden');
    return;
  }

  // ====== 3) 住宿/露營：必須 range 兩日 ======
  if (selectedDates.length < 2) { hideResult(); return; }

  const nights = parseInt(document.getElementById('nights').value);
  if (nights < 1) { hideResult(); return; }

  let qty = 1;
  const qtyBlock = document.getElementById('qtyBlock');
  if (qtyBlock && !qtyBlock.classList.contains('hidden')) {
    qty = parseInt(document.getElementById('unitQty').value) || 1;
  }

  // 夜衝由抵達時間自動判斷（若是露營類）
  let isNightRush = false;
  const visitTime = document.getElementById('visitTime').value;
  if (visitTime && config.nightRush) {
    const hour = parseInt(visitTime.split(':')[0]);
    if (hour >= 21) isNightRush = true;
  }
  const nightRushBox = document.getElementById('isNightRush');
  if (nightRushBox) nightRushBox.checked = isNightRush;

  const useAC = document.getElementById('useAC')?.checked || false;
  const bringPet = document.getElementById('bringPet')?.checked || false;

  // 夜衝 1 晚提醒
  let rushWarning = document.getElementById('rushWarningText');
  if (!rushWarning) {
    const rushOption = document.getElementById('isNightRush')?.parentElement;
    if (rushOption) {
      rushWarning = document.createElement('div');
      rushWarning.id = 'rushWarningText';
      rushWarning.style.color = 'red';
      rushWarning.style.fontSize = '0.9rem';
      rushWarning.style.marginTop = '5px';
      rushWarning.style.fontWeight = 'bold';
      rushOption.parentElement.appendChild(rushWarning);
    }
  }
  if (rushWarning) {
    if (isNightRush && nights === 1) {
      rushWarning.innerText = "💡 提醒：您只選了 1 晚，系統將僅計算「純夜衝」費用。若您是要「夜衝+續住露營」，請務必選擇 2 晚 (例如週五~週日)。";
      rushWarning.classList.remove('hidden');
    } else {
      rushWarning.classList.add('hidden');
    }
  }

  let basePrice = 0, rushPrice = 0, acPrice = 0;
  let hasWeekend = false;
  let currentDate = new Date(selectedDates[0]);

  for (let i = 0; i < nights; i++) {
    let dateStr = formatDate(currentDate);
    let dayOfWeek = currentDate.getDay();
    let rateType = 'weekday';

    if (MAKEUP_DAYS.includes(dateStr)) rateType = 'weekday';
    else if (HOLIDAYS.includes(dateStr)) rateType = 'holiday';
    else if (dayOfWeek === 5 || dayOfWeek === 6) { rateType = 'weekend'; hasWeekend = true; }

    let dailyBase = 0;
    let rate_room = CAMPING_CONFIG.room.rates[rateType];
    let rate_star = CAMPING_CONFIG.starcraft.rates[rateType];
    let rate_dt = CAMPING_CONFIG.dt392.rates[rateType];

    if (type === 'room') {
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
      dailyBase = config.rates[rateType] * qty;
    }

    basePrice += dailyBase;

    if (i === 0 && isNightRush && config.nightRush) {
      let rushType = rateType;
      if (type === 'camper') {
        rushPrice += config.nightRush[rushType] * 0.8 * qty;
      } else if (type === 'starcraft' || type === 'dt392' || type === 'room') {
        // 不計算
      } else {
        rushPrice += config.nightRush[rushType] * qty;
      }
    }

    if (useAC) acPrice += 200 * qty;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const extraPeople = parseInt(document.getElementById('extraPeople').value) || 0;
  const extraCars = parseInt(document.getElementById('extraCars').value) || 0;
  const visitors = parseInt(document.getElementById('visitors').value) || 0;

  let extraPersonRate = 300;
  if (type === 'room') extraPersonRate = 300;

  const extraPeopleCost = extraPeople * extraPersonRate * nights;
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

  // 折扣
  let discount = 0;
  if (discountRow) discountRow.classList.remove('hidden');

  let isHolidayForDiscount = false;
  let checkDate = new Date(selectedDates[0]);
  for (let k = 0; k < nights; k++) {
    if (HOLIDAYS.includes(formatDate(checkDate))) { isHolidayForDiscount = true; break; }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  let totalPriceForDiscount = basePrice + rushPrice + acPrice;

  if (config.discountType === 'full_venue_promo') {
    if (nights >= 2) discount = totalPriceForDiscount * 0.15;
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

  // 若 extraOptions 被隱藏，就把夜衝/冷氣行也隱藏
  if (document.getElementById('extraOptions').classList.contains('hidden')) {
    document.getElementById('rowRush').classList.add('hidden');
    document.getElementById('rowAC').classList.add('hidden');
  } else {
    // ✅ 顯示列（有勾/有費用才顯示）
    if (Math.round(rushPrice) > 0) document.getElementById('rowRush').classList.remove('hidden');
    if (acPrice > 0) document.getElementById('rowAC').classList.remove('hidden');
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

    const extraPeople = document.getElementById('extraPeople').value;
    const extraCars = document.getElementById('extraCars').value;
    const visitors = document.getElementById('visitors').value;
    if (parseInt(extraPeople) > 0) { details += ` / 加人:${extraPeople}`; }
    if (parseInt(extraCars) > 0) { details += ` / 加車:${extraCars}`; }
    if (parseInt(visitors) > 0) { details += ` / 訪客:${visitors}`; }

    if (!document.getElementById('extraOptions').classList.contains('hidden')) {
      if (document.getElementById('isNightRush').checked) { details += " (含夜衝)"; }
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
  btn.innerText = "⏳ 處理中..."; btn.disabled = true;

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
    .then(response => {
      alert(t.sent_success);
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
      btn.innerText = originalText; btn.disabled = false;
    });
}

function hideResult() { document.getElementById('resultBox').classList.add('hidden'); }

function resetForm() {
  const picker = document.querySelector("#dateRange")._flatpickr;
  picker.clear();

  selectedDates = [];
  document.getElementById('campType').value = "";
  toggleInputs();

  document.getElementById('nights').value = '0';

  const nightRushBox = document.getElementById('isNightRush');
  const acBox = document.getElementById('useAC');
  const petBox = document.getElementById('bringPet');
  if (nightRushBox) nightRushBox.checked = false;
  if (acBox) acBox.checked = false;
  if (petBox) petBox.checked = false;

  document.getElementById('bikeQty').value = 1;
  document.getElementById('extraPeople').value = 0;
  document.getElementById('extraCars').value = 0;
  document.getElementById('visitors').value = 0;
  document.getElementById('visitTime').selectedIndex = 0;
  hideResult();
}

function selectPlan(planValue) {
  const select = document.getElementById('campType');
  select.value = planValue;
  toggleInputs();
  const target = document.getElementById('calculatorSection');
  if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}
