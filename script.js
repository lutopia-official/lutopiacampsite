// ==========================================
// 0. 多語言設定 (i18n)
// ==========================================
let currentLang = 'zh'; // 預設語言
let selectedDates = [];
// 🔥 新增：用來儲存從後端抓回來的「各類別忙碌日期」
let GLOBAL_BLOCKED_DATA = {
    full: [],
    starcraft: [],
    dt392: [],
    room: []
};

const TRANSLATIONS = {
    zh: {
        loading: "資料載入中...",
        calc_title: "🌲 露營/場地/周邊服務費用試算",
        basic_unit: "基本單位：4人 / 1車 / 1帳 / 1車邊帳or車尾帳",
        important_notice: "重要提醒：",
        checkin_time_label: "入住時間：",
        checkin_time_val: "下午 14:00 以後",
        checkin_time_val_room: "下午 15:00 以後 (請勿提早，若要提早放行李請先告知)",
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
        
        opt_tent: "自搭帳篷",
        opt_moto: "機車、單車露營",
        opt_solo: "單人小帳棚",
        opt_car: "車泊、車露",
        opt_camper: "自備露營車/拖車",
        opt_starcraft: "StarCraft 美式復古拖車",
        opt_dt392: "大馳 DT392 露營車",
        opt_room: "錄托邦民宿房間",
        opt_full_basic: "純場地包場",
        opt_full_vans: "包場+2台露營車",
        opt_full_all: "包場+2台露營車+房間",
        opt_venue_hourly: "場地租借 (按時數計費)",
        opt_bicycle: "單車租借",
        
        label_date: "預約日期：",
        date_placeholder: "請點擊選擇日期...",
        rush_notice_title: "⚠️ 夜衝日期選擇教學：",
        rush_notice_desc: "請將「夜衝當晚」設為第一天。",

        label_time: "預計抵達/取車時間：",
        time_placeholder: "請選擇時間...",
        
        label_nights: "住宿晚數 (自動)：",
        label_rental_scheme: "租借時數方案：",
        label_bike_qty: "租借數量 (台)：",
        label_bike_scheme: "租借方案：",
        
        addon_title: "➕ 加購選項 (人/車/訪客)",
        label_extra_people: "加人 ($200/人/晚)",
        label_kid_free: "*小一以下免費",
        label_extra_car: "加車 ($300/車，拖車不在此限)",
        label_visitor: "訪客 ($100/人，23:00離場)",
        
        cb_night_rush: "我要夜衝 (21:00-23:00入場)",
        cb_ac: "使用冷氣 (+200元/晚)",
        
        btn_calc: "更新費用",
        btn_reset: "重新填寫",
        
        result_title: "試算結果",
        res_base: "基本費用：",
        res_addon: "加購費用：",
        res_rush: "夜衝費用：",
        res_ac: "冷氣加價：",
        res_discount: "符合折扣：",
        res_total: "總計金額：",
        
        customer_info_title: "📝 預訂資料填寫",
        ph_name: "您的姓名 (必填)",
        ph_phone: "聯絡電話 (必填)",
        ph_note: "其他備註需求 (例如：露營相關、租單車者身高...)",
        btn_submit: "🚀 確認預訂並送出",
        
        alert_fill: "請務必填寫「姓名」與「電話」才能送出訂單喔！",
        confirm_room_policy: "🛑【訂位前請確認】\n\n1. ⏰ 入住時間：15:00 以後。\n   (請勿提早，若要提早放行李請先告知)\n\n2. ♻️ 環保旅宿：不提供一次性備品。\n   (請自備毛巾、牙刷)\n\n請問您是否接受並繼續訂位？",
        sent_success: "🎉 預訂成功！\n\n營主已收到您的訂單，將盡快與您聯繫確認。\n(您無需再進行其他操作)",

        rule_title_basic: "🔷 收費標準與營區規定",
        rule_sub_price: "💰 營位計費標準",
        rule_li_unit: "基本單位：4人 / 1車 / 1帳 / 1炊事帳。",
        rule_li_add_person: "加人：多1人加 $200 (國小一年級以下免費)。",
        rule_li_add_car: "加車：多停一台車加收 $300 (拖車不在此限)。",
        rule_li_visitor: "訪客：每人 $100，需於 23:00 前離場。",

        rule_sub_tent: "⛺ 搭帳與冷氣規範",
        rule_li_big_tent: "大型帳篷：神殿、怪獸、5x8天幕等請訂2個營位。",
        rule_li_ac_fee: "冷氣使用：車上/帳內使用冷氣接電，酌收 $200/晚。",
        rule_li_warning: "未告知搭設大帳者，現場將禁止搭設。",

        rule_sub_rush: "🌙 夜衝服務 (限自搭帳)",
        rule_li_rush_time: "時間：22:00 後入場，23:30 前搭完。",
        rule_li_rush_price: "費用：平日 500元 / 假日 600元 / 連假 800元。",
        rule_li_rush_rv: "🚐 自備露營車夜衝依金額打 8 折。",

        rule_title_policy: "⚠️ 住宿取消政策與付款",
        rule_sub_refund: "📅 取消退費標準",
        ref_14: "14天前", ref_desc_14: "退 100% (扣手續費) 或改期",
        ref_10: "10-13天前", ref_desc_10: "退 70% (2日內補差額)",
        ref_7: "7-9天前", ref_desc_7: "退 50%",
        ref_4: "4-6天前", ref_desc_4: "退 30%",
        ref_0: "0-3天前", ref_desc_0: "視同取消，不退費",

        rule_sub_bank: "💰 付款資訊 (完成訂位後請全額匯款)",
        rule_bank_note: "請保留轉帳證明並回傳。",

        pricing_title: "全區獨享包場方案",
        pricing_desc: "選擇適合您的規模，平日/假日/連假皆有不同優惠",
        
        plan_a_title: "方案 A：純場地自由配",
        plan_a_desc: "自備裝備者最愛，CP值最高",
        plan_b_title: "方案 B：場地 + 露營車",
        plan_b_desc: "輕裝備首選，長輩小孩都開心",
        plan_c_title: "方案 C：豪華全配版",
        plan_c_desc: "露營車 + 民宿房間，懶人極致享受",

        th_period: "時段",
        tag_lite: "微包場 (10帳內)",
        tag_full: "全包場 (20帳)",
        
        td_weekday: "平日",
        td_weekend: "假日",
        td_holiday: "連假",

        feat_a_1: "全區草地營位使用",
        feat_a_2: "適合：純露營團體、車隊",
        feat_a_3: "假日滿帳平均僅 $500/帳",
        
        feat_b_1: "包含 2 台露營車 住宿",
        feat_b_2: "適合：新手混合團、三代同堂",
        feat_b_3: "免搭帳也能享受露營樂趣",
        
        feat_c_1: "含 2 台露營車 + 民宿房間",
        feat_c_2: "適合：重視睡眠品質、家族大聚會",
        feat_c_3: "長輩住民宿，年輕人睡帳篷",

        btn_book_a: "預約方案 A",
        btn_book_b: "預約方案 B",
        btn_book_c: "預約方案 C",

        note_title: "💡 價格說明與彈性升級：",
        note_1: "微包場 (Level 1)：適用於 10 帳/車以內之團體，保證不接散客，獨享全區。",
        note_2: "全包場 (Level 2)：適用於 20 帳/車以內之團體，享有人均最優惠價格。",
        note_3: "彈性機制：若訂微包場後人數增加，第 11 帳起每帳僅需補 $600 元，達全包場總價上限即不再加收。",

        bar_title: "🍹 吐煙怪獸酒吧 (Toen Kaijyu Bar)",
        bar_desc: "當夜幕低垂，營區化身為都蘭最Chill的角落。這裡沒有怪獸，只有好笑與故事。",
        bar_feat_1: "🦖 <strong>怪獸特調：</strong>只有這裡喝得到的獨家風味。",
        bar_feat_2: "🍺 <strong>沁涼生啤：</strong>大口喝酒大聊特聊，臉色擺好。",
        bar_feat_3: "🎵 <strong>音樂氛圍：</strong>精選歌單，伴隨夜幕輕飄飄。",
        bar_promo: "✨ <em>露營/住宿住客 憑訂位資訊 獨享專屬優惠！</em>",
        bar_info: "📍 地點：就在營區旁 / 營業時間：目前為五六日 9:00PM 固定營業，詳細依IG公告為主",
        bar_btn_ig: "追蹤吐煙怪獸 IG",
    },
    en: {
        loading: "Loading data...",
        calc_title: "🌲 Cost Calculator",
        basic_unit: "Unit: 4 Pax / 1 Vehicle / 1 Tent",
        important_notice: "Important:",
        checkin_time_label: "Check-in:",
        checkin_time_val: "After 14:00",
        checkin_time_val_room: "After 15:00",
        dont_early: "(No early check-in)",
        eco_policy_label: "Eco-Friendly:",
        eco_policy_desc: "No disposable amenities. (Bring towels/toothbrush)",
        
        label_type: "Select Type:",
        select_placeholder: "Choose...",
        label_unit_qty: "Quantity (Unit):",
        guest_name_label: "Guest Name #{n}:",

        group_camping: "⛺ Camping",
        group_rental: "🚐 Rental / Room",
        group_full: "🎉 Full Booking",
        group_venue: "🎪 Venue Rental",
        group_bike: "🚲 Services",
        
        opt_tent: "Tent Camping",
        opt_moto: "Moto/Bike Camping",
        opt_solo: "Solo Camping",
        opt_car: "Car Camping",
        opt_camper: "Self-driving RV/Trailer",
        opt_starcraft: "StarCraft Vintage Trailer",
        opt_dt392: "DT392 RV",
        opt_room: "Guest Room",
        opt_full_basic: "Full Venue Only",
        opt_full_vans: "Full Venue + 2 RVs",
        opt_full_all: "Full Venue + 2 RVs + Room",
        opt_venue_hourly: "Hourly Venue Rental",
        opt_bicycle: "Bicycle Rental",
        
        label_date: "Date:",
        date_placeholder: "Select Date...",
        rush_notice_title: "⚠️ Night Rush Info:",
        rush_notice_desc: "Set the 1st day as the Night Rush date.",

        label_time: "Arrival Time:",
        time_placeholder: "Select Time...",
        label_nights: "Nights:",
        label_rental_scheme: "Duration:",
        label_bike_qty: "Quantity:",
        label_bike_scheme: "Plan:",
        
        addon_title: "➕ Add-ons",
        label_extra_people: "Extra Person ($200/night)",
        label_kid_free: "*Free for kids under 7",
        label_extra_car: "Extra Car ($300/night, No Trailers)",
        label_visitor: "Visitor ($100, leave by 23:00)",
        
        cb_night_rush: "Night Rush (21:00-23:00)",
        cb_ac: "Use A/C (+$200/night)",
        
        btn_calc: "Update Price",
        btn_reset: "Reset",
        
        result_title: "Result",
        res_base: "Base Price:",
        res_addon: "Add-ons:",
        res_rush: "Night Rush:",
        res_ac: "A/C Fee:",
        res_discount: "Discount:",
        res_total: "Total:",
        
        customer_info_title: "📝 Your Information",
        ph_name: "Name (Required)",
        ph_phone: "Phone (Required)",
        ph_note: "Notes / Requests...",
        btn_submit: "🚀 Submit Order",
        
        alert_fill: "Please fill in Name and Phone!",
        confirm_room_policy: "🛑【Please Confirm】\n\n1. ⏰ Check-in is after 15:00.\n2. ♻️ No disposable amenities provided.\n   (Bring your own towels/toothbrush)\n\nAccept and continue?",
        sent_success: "🎉 Booking Confirmed!\n\nWe have received your order and will contact you shortly.",

        rule_title_basic: "🔷 Rules & Fees",
        rule_sub_price: "💰 Camping Fees",
        rule_li_unit: "Unit: 4 Pax / 1 Vehicle / 1 Tent.",
        rule_li_add_person: "Extra Person: +$200 (Kids < 7 Free).",
        rule_li_add_car: "Extra Car: +$300 (Trailers excluded).",
        rule_li_visitor: "Visitor: $100/person (Leave by 23:00).",

        rule_sub_tent: "⛺ Tents & A/C",
        rule_li_big_tent: "Big Tents: Please book 2 sites.",
        rule_li_ac_fee: "A/C Usage: +$200/night.",
        rule_li_warning: "Undeclared big tents are prohibited.",

        rule_sub_rush: "🌙 Night Rush (Tent Only)",
        rule_li_rush_time: "Time: 22:00-23:30 Check-in.",
        rule_li_rush_price: "Fee: Weekday $500 / W-end $600 / Holiday $800.",
        rule_li_rush_rv: "🚐 RV Night Rush: 20% Off.",

        rule_title_policy: "⚠️ Cancellation & Payment",
        rule_sub_refund: "📅 Refund Policy",
        ref_14: "14 days", ref_desc_14: "100% Refund",
        ref_10: "10-13 days", ref_desc_10: "70% Refund",
        ref_7: "7-9 days", ref_desc_7: "50% Refund",
        ref_4: "4-6 days", ref_desc_4: "30% Refund",
        ref_0: "0-3 days", ref_desc_0: "No Refund",

        rule_sub_bank: "💰 Payment (Transfer Full Amount)",
        rule_bank_note: "Please keep the transfer receipt.",

        pricing_title: "Exclusive Full Venue Booking",
        pricing_desc: "Choose the scale that fits your group. Discounts for weekdays!",
        
        plan_a_title: "Plan A: Venue Only",
        plan_a_desc: "Best CP value. Bring your own tents.",
        plan_b_title: "Plan B: Venue + 2 RVs",
        plan_b_desc: "Great for mixed groups (Elderly/Kids friendly).",
        plan_c_title: "Plan C: Luxury Full Set",
        plan_c_desc: "Venue + 2 RVs + Guest Room. Max comfort.",

        th_period: "Period",
        tag_lite: "Lite (Max 10)",
        tag_full: "Full (Max 20)",
        
        td_weekday: "Weekday",
        td_weekend: "Weekend",
        td_holiday: "Holiday",

        feat_a_1: "Exclusive use of the entire campsite",
        feat_a_2: "Suitable for: Camping groups, car clubs",
        feat_a_3: "Avg $500/tent on holidays (Full)",
        
        feat_b_1: "Includes 2 RVs (StarCraft/DT392)",
        feat_b_2: "Suitable for: 3-generation families",
        feat_b_3: "Enjoy camping without gear",
        
        feat_c_1: "Includes 2 RVs + Guest Room",
        feat_c_2: "Suitable for: Large family reunions",
        feat_c_3: "Elders in room, young ones in tents",

        btn_book_a: "Book Plan A",
        btn_book_b: "Book Plan B",
        btn_book_c: "Book Plan C",

        note_title: "💡 Pricing Notes & Elastic Upgrade:",
        note_1: "Lite (Level 1): For groups under 10 tents/cars. Guaranteed privacy.",
        note_2: "Full (Level 2): For groups under 20 tents/cars. Best per-person rate.",
        note_3: "Elasticity: If you book Lite but add more people later, just pay +$600/tent until the Full price cap is reached.",

        bar_title: "🍹 Toen Kaijyu Bar",
        bar_desc: "As night falls, the campsite transforms into the chillest corner of Dulan. No monsters here, just laughter and stories.",
        bar_feat_1: "🦖 <strong>Monster Specials:</strong> Exclusive flavors found only here.",
        bar_feat_2: "🍺 <strong>Ice-Cold Draft:</strong> Drink big, chat big, good vibes only.",
        bar_feat_3: "🎵 <strong>Musical Atmosphere:</strong> Curated playlists floating through the night.",
        bar_promo: "✨ <em>Exclusive: Camping/Lodging guests get special discounts with booking proof!</em>",
        bar_info: "📍 Location: Next to campsite / Hours: Fri-Sun 9:00 PM (Check IG for details)",
        bar_btn_ig: "Follow Toen Kaijyu IG",
    },
    jp: {
        loading: "読み込み中...",
        calc_title: "🌲 料金シミュレーション",
        basic_unit: "基本：4名 / 車1台 / テント1張",
        important_notice: "重要事項：",
        checkin_time_label: "チェックイン：",
        checkin_time_val: "14:00 以降",
        checkin_time_val_room: "15:00 以降",
        dont_early: "(アーリーチェックイン不可)",
        eco_policy_label: "エコ方針：",
        eco_policy_desc: "使い捨てアメニティなし (タオル・歯ブラシ持参)",
        
        label_type: "タイプ選択：",
        select_placeholder: "選択してください...",
        label_unit_qty: "数量 (台/張)：",
        guest_name_label: "ゲスト名 #{n}:",

        group_camping: "⛺ キャンプ",
        group_rental: "🚐 キャンピングカー / 部屋",
        group_full: "🎉 貸切",
        group_venue: "🎪 場所貸し",
        group_bike: "🚲 サービス",
        
        opt_tent: "テント持ち込み",
        opt_moto: "バイク・自転車キャンプ",
        opt_solo: "ソロキャンプ",
        opt_car: "車中泊",
        opt_camper: "自走式キャンピングカー/トレーラー",
        opt_starcraft: "StarCraft トレーラー",
        opt_dt392: "DT392 キャンピングカー",
        opt_room: "民宿の部屋",
        opt_full_basic: "場所のみ貸切",
        opt_full_vans: "貸切 + キャンピングカー2台",
        opt_full_all: "貸切 + キャンピングカー2台 + 部屋",
        opt_venue_hourly: "時間貸し",
        opt_bicycle: "自転車レンタル",
        
        label_date: "予約日：",
        date_placeholder: "日付を選択...",
        rush_notice_title: "⚠️ 前泊(夜間)について：",
        rush_notice_desc: "前泊する日を1日目に設定してください。",

        label_time: "到着予定時刻：",
        time_placeholder: "時間を選択...",
        label_nights: "泊数：",
        label_rental_scheme: "利用時間：",
        label_bike_qty: "台数：",
        label_bike_scheme: "プラン：",
        
        addon_title: "➕ オプション追加",
        label_extra_people: "追加人数 ($200/泊)",
        label_kid_free: "*小学1年生以下無料",
        label_extra_car: "追加車両 ($300/泊、トレーラー除く)",
        label_visitor: "日帰り客 ($100/人 23時退出)",
        
        cb_night_rush: "前泊・夜間入場 (21:00-23:00)",
        cb_ac: "エアコン利用 (+$200/泊)",
        
        btn_calc: "料金更新",
        btn_reset: "リセット",
        
        result_title: "計算結果",
        res_base: "基本料金：",
        res_addon: "追加料金：",
        res_rush: "前泊(夜間)：",
        res_ac: "エアコン：",
        res_discount: "割引：",
        res_total: "合計金額：",
        
        customer_info_title: "📝 予約情報",
        ph_name: "お名前 (必須)",
        ph_phone: "電話番号 (必須)",
        ph_note: "備考・リクエスト...",
        btn_submit: "🚀 予約を送信",
        
        alert_fill: "お名前と電話番号を入力してください！",
        confirm_room_policy: "🛑【確認事項】\n\n1. ⏰ チェックインは 15:00 以降です。\n2. ♻️ アメニティの提供はありません。\n   (タオル・歯ブラシをご持参ください)\n\n了承して予約しますか？",
        sent_success: "🎉 予約完了！\n\nご注文を受け付けました。オーナーよりご連絡いたします。",

        rule_title_basic: "🔷 料金・ルール",
        rule_sub_price: "💰 キャンプ料金",
        rule_li_unit: "基本：4名 / 車1台 / テント1張。",
        rule_li_add_person: "追加人数：+$200 (小1以下無料)。",
        rule_li_add_car: "追加車両：+$300 (トレーラー除く)。",
        rule_li_visitor: "日帰り：$100/人 (23時退出)。",

        rule_sub_tent: "⛺ テント・エアコン",
        rule_li_big_tent: "大型テント：2区画予約してください。",
        rule_li_ac_fee: "エアコン利用：+$200/泊。",
        rule_li_warning: "申告のない大型テントは設営禁止。",

        rule_sub_rush: "🌙 前泊 (テントのみ)",
        rule_li_rush_time: "時間：22:00-23:30 入場。",
        rule_li_rush_price: "料金：平日 500元 / 休日 600元 / 連休 800元。",
        rule_li_rush_rv: "🚐 キャンピングカー前泊：20% OFF。",

        rule_title_policy: "⚠️ キャンセル・支払い",
        rule_sub_refund: "📅 返金ポリシー",
        ref_14: "14日前", ref_desc_14: "100% 返金",
        ref_10: "10-13日前", ref_desc_10: "70% 返金",
        ref_7: "7-9日前", ref_desc_7: "50% 返金",
        ref_4: "4-6日前", ref_desc_4: "30% 返金",
        ref_0: "0-3日前", ref_desc_0: "返金なし",

        rule_sub_bank: "💰 お支払い (全額振込)",
        rule_bank_note: "振込明細を保存してください。",

        pricing_title: "全エリア貸切プラン",
        pricing_desc: "規模に合わせてプランを選択。平日はさらにお得！",
        
        plan_a_title: "プラン A：場所のみ貸切",
        plan_a_desc: "装備持参の方に最適。コスパ最高。",
        plan_b_title: "プラン B：場所 + キャンピングカー",
        plan_b_desc: "手軽に楽しみたい方へ。高齢者・子供も安心。",
        plan_c_title: "プラン C：豪華フルセット",
        plan_c_desc: "キャンピングカー + 部屋付き。最高の快適さ。",

        th_period: "期間",
        tag_lite: "小規模 (10張以内)",
        tag_full: "全貸切 (20張)",
        
        td_weekday: "平日",
        td_weekend: "休日",
        td_holiday: "連休",

        feat_a_1: "キャンプ場エリア完全貸切",
        feat_a_2: "最適：キャンプグループ、車クラブ",
        feat_a_3: "休日満員時 平均 $500/張",
        
        feat_b_1: "キャンピングカー2台付き",
        feat_b_2: "最適：3世代家族旅行",
        feat_b_3: "テントなしでも楽しめる",
        
        feat_c_1: "キャンピングカー2台 + 民宿の部屋",
        feat_c_2: "最適：大家族の集まり",
        feat_c_3: "高齢者は部屋で、若者はテントで",

        btn_book_a: "プラン A を予約",
        btn_book_b: "プラン B を予約",
        btn_book_c: "プラン C を予約",

        note_title: "💡 料金とアップグレードについて：",
        note_1: "小規模 (Level 1)：10張/台以内の団体向け。貸切保証。",
        note_2: "全貸切 (Level 2)：20張/台以内の団体向け。一人当たり最安。",
        note_3: "柔軟対応：小規模で予約後、人数が増えた場合は1張につき+$600で追加可能（全貸切料金が上限）。",

        bar_title: "🍹 吐煙怪獸（トエン・カイジュウ）バー",
        bar_desc: "夜の帳が下りると、キャンプ場は都蘭で最もチルな場所に。ここには怪獣はいません、あるのは笑いと物語だけ。",
        bar_feat_1: "🦖 <strong>怪獣特製カクテル：</strong>ここでしか味わえない限定の味。",
        bar_feat_2: "🍺 <strong>冷えた生ビール：</strong>豪快に飲んで、語り合って、最高の気分で。",
        bar_feat_3: "🎵 <strong>音楽の雰囲気：</strong>夜に浮かぶ厳選されたプレイリスト。",
        bar_promo: "✨ <em>宿泊者限定：予約提示で専用割引あり！</em>",
        bar_info: "📍 場所：キャンプ場横 / 営業：金・土・日 21:00〜 (詳細はIGにて)",
        bar_btn_ig: "IGをフォロー",
    }
};

function changeLang(lang) {
    currentLang = lang;
    const t = TRANSLATIONS[lang];
    
    // 1. 更新所有有 data-i18n 的文字
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerHTML = t[key]; // 🔥 改用 innerHTML 以支援 <strong> 標籤
    });

    // 2. 更新 placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });
    
    // 3. 更新 optgroup 的 label
    document.querySelectorAll('[data-i18n-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-label');
        if (t[key]) el.label = t[key];
    });

    // 4. 重新觸發一次入住時間檢查
    toggleInputs(); 
}

// ==========================================
// 1. 設定與初始化
// ==========================================

// ✅ 您的 Google Apps Script 網址
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpiqltgo7ewZnP3fGJWV0fgszW5OMmBsDWBH0pIbh3sFzDwyOqYEx3WdYgkXRJxBS2/exec"; 

// 📅 2025-2026 國定假日與連假清單 (YYYY-MM-DD)
// 包含 2025 連假 + 2026 預估連假
const HOLIDAYS = [
    // --- 2025 年 ---
    "2025-01-01", 
    "2025-01-25", "2025-01-26", "2025-01-27", "2025-01-28", "2025-01-29",
    "2025-01-30", "2025-01-31", "2025-02-01", "2025-02-02", 
    "2025-02-28", "2025-03-01", "2025-03-02", 
    "2025-04-03", "2025-04-04", "2025-04-05", "2025-04-06", 
    "2025-05-30", "2025-05-31", "2025-06-01", 
    "2025-10-04", "2025-10-05", "2025-10-06", 
    "2025-10-10", "2025-10-11", "2025-10-12",
    "2025-12-31", // 2025 跨年夜

    // --- 2026 年 (預估) ---
    "2026-01-01", "2026-01-02", "2026-01-03", // 元旦連假
    "2026-02-14", "2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18",
    "2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22", // 春節連假 (初一2/17)
    "2026-02-27", "2026-02-28", "2026-03-01", // 228連假
    "2026-04-03", "2026-04-04", "2026-04-05", "2026-04-06", // 清明連假
    "2026-06-19", "2026-06-20", "2026-06-21", // 端午連假
    "2026-09-25", "2026-09-26", "2026-09-27", // 中秋連假
    "2026-10-09", "2026-10-10", "2026-10-11", // 國慶連假
    "2026-12-31" // 2026 跨年夜
];

// 🛠️ 補班日 (雖是週六，但算平日價)
const MAKEUP_DAYS = [
    "2025-02-08" 
];

// 網頁載入後：抓取公告 & 空位表
window.onload = function() {
    if(GOOGLE_SCRIPT_URL.includes("https://script.google.com/macros/s/AKfycbzpiqltgo7ewZnP3fGJWV0fgszW5OMmBsDWBH0pIbh3sFzDwyOqYEx3WdYgkXRJxBS2/exec") || GOOGLE_SCRIPT_URL === "") {
        console.warn("尚未設定 Google Apps Script 網址，跳過資料抓取功能。");
        return;
    }

    fetch(GOOGLE_SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            if (data.msg && data.msg !== "") {
                const marquee = document.getElementById('marquee-text');
                if(marquee) marquee.innerText = data.msg;
            }
            if (data.vacancy && data.vacancy.length > 1) {
                renderVacancyTable(data.vacancy);
            }

            // 🔥 核心更新：接收分類好的忙碌日期
            if (data.blockedDates) {
                GLOBAL_BLOCKED_DATA = data.blockedDates;
                console.log("已同步訂房狀態:", GLOBAL_BLOCKED_DATA);
                
                // 預設先更新一次日曆 (預設可能是空或者是某個類型)
                updateCalendarBlocking();
            }
        })
        .catch(error => {
            console.error('資料讀取失敗:', error);
        });
};

// 初始化日期選擇器
let selectedDates = [];
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

// ==========================================
// 2. 價格與規則配置表 (Database)
// ==========================================
const CAMPING_CONFIG = {
    // --- A. 露營住宿類 ---
    tent: { rates: { weekday: 700, weekend: 800, holiday: 1000 }, nightRush: { weekday: 500, weekend: 600, holiday: 700 }, discountType: "fixed_amount" },
    moto: { rates: { weekday: 500, weekend: 600, holiday: 800 }, nightRush: { weekday: 200, weekend: 300, holiday: 400 }, discountType: "fixed_amount" },
    solo: { rates: { weekday: 500, weekend: 600, holiday: 800 }, nightRush: { weekday: 200, weekend: 300, holiday: 400 }, discountType: "fixed_amount" },
    car: { rates: { weekday: 600, weekend: 800, holiday: 1000 }, nightRush: { weekday: 500, weekend: 600, holiday: 700 }, discountType: "fixed_amount" },
    camper: { rates: { weekday: 800, weekend: 1000, holiday: 1200 }, nightRush: { weekday: 600, weekend: 700, holiday: 800 }, discountType: "fixed_amount_premium" },
    
    // --- B. 免裝備租賃/民宿 ---
    starcraft: { rates: { weekday: 1800, weekend: 2000, holiday: 2200 }, discountType: "percentage" },
    dt392: { rates: { weekday: 1800, weekend: 2000, holiday: 2200 }, discountType: "percentage" },
    room: { rates: { weekday: 2000, weekend: 2500, holiday: 2800 }, discountType: "percentage" },
    
    // --- C. 包場住宿 (🔥 已依照階梯式價格更新計算機全包場基底) ---
    full_basic: { rates: { weekday: 7000, weekend: 10000, holiday: 15000 }, discountType: "full_venue_promo" },
    full_vans: { rates: { weekday: 10000, weekend: 16000, holiday: 18000 }, discountType: "full_venue_promo" },
    full_all: { rates: { weekday: 13000, weekend: 18000, holiday: 20000 }, discountType: "full_venue_promo" },
    
    // --- D. 場地租借 ---
    venue_hourly: { 
        type: "venue_hourly", 
        weekdayRates: { '3hr': 3000, '5hr': 4500, '6hr': 6000, '8hr': 7500, 'day': 12000 }, 
        holidayRates: { '3hr': 4500, '5hr': null, '6hr': 5500, '8hr': 7000, 'day': 15000 } 
    },
    
    // --- E. 單車租借 ---
    bicycle: { 
        type: "bicycle",
        rates: { '2hr': 150, '4hr': 250, 'day': 400, '24hr': 600, '15day': 2500, '30day': 3500 }
    }
};

// ==========================================
// 3. 介面互動邏輯 (Toggle Inputs)
// ==========================================
function toggleInputs() {
    const type = document.getElementById('campType').value;
    
    // 取得所有區塊元素
    const nightsBlock = document.getElementById('nightsBlock');
    const rentalBlock = document.getElementById('rentalDurationBlock');
    const bikeBlock = document.getElementById('bikeBlock');
    const extraOptions = document.getElementById('extraOptions');
    const addonBlock = document.getElementById('addonBlock'); // 加購區
    const unitNotice = document.getElementById('unitNotice'); // 基本單位告示
    const rushNotice = document.getElementById('rushNotice'); // 夜衝日期提示
    const policyNotice = document.getElementById('policyNotice'); // 入住與環保政策提醒
    
    const campingRules = document.getElementById('campingRules');
    const venueRules = document.getElementById('venueRules');
    const bikeRules = document.getElementById('bikeRules');

    const unitQtyBlock = document.getElementById('qtyBlock'); // 數量選單
    const guestListBlock = document.getElementById('guestListBlock'); // 朋友名單區

    // --- 1. 定義標準數量選項 (1-10) ---
    const unitQtySelect = document.getElementById('unitQty');
    const standardOptions = `
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10 (團體請洽官方)</option>
    `;

    // --- 2. 針對「房間」修改選項 ---
    if (type === 'room') {
        // 如果選房間，鎖定只能選 1
        if (!unitQtySelect.innerHTML.includes("僅此一間")) {
            unitQtySelect.innerHTML = '<option value="1">1 (房間僅此一間)</option>';
            unitQtySelect.value = 1;
        }
    } else {
        // 如果不是房間，且目前被鎖定過 (或是空的/只有一個選項)，則恢復標準選項
        // 但要注意：如果目前是單車或其他特殊類型，可能會有不同邏輯
        // 這裡確保只有在需要時才恢復
        if (unitQtySelect.innerHTML.includes("僅此一間") || unitQtySelect.options.length < 2) {
            unitQtySelect.innerHTML = standardOptions;
            unitQtySelect.value = 1; 
        }
    }

    // 3. 先全部隱藏
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

    // 👇 如果未選擇類型，隱藏結果並返回
    if (!type || type === "") {
        hideResult();
        campingRules.classList.remove('hidden'); 
        return;
    }

    // 4. 依類型顯示對應區塊
    if (type === 'venue_hourly') {
        rentalBlock.classList.remove('hidden');
        venueRules.classList.remove('hidden');
        
    } else if (type === 'bicycle') {
        bikeBlock.classList.remove('hidden');
        if(bikeRules) bikeRules.classList.remove('hidden');
        
    } else {
        // --- 住宿/包場/租賃/露營 ---
        nightsBlock.classList.remove('hidden');
        campingRules.classList.remove('hidden');
        if(addonBlock) addonBlock.classList.remove('hidden');

        // 包場時隱藏基本單位提示
        const isFullBooking = (type === 'full_basic' || type === 'full_vans' || type === 'full_all');
        if(unitNotice) {
            if (isFullBooking) {
                unitNotice.classList.add('hidden');
            } else {
                unitNotice.classList.remove('hidden');
            }
        }

        if(policyNotice) policyNotice.classList.remove('hidden');

        // 🔥 處理時間選項 🔥
        const checkInText = document.getElementById('checkInTimeText');
        const visitTimeSelect = document.getElementById('visitTime');
        
        // 【重置】先把所有時間都打開
        for (let i = 0; i < visitTimeSelect.options.length; i++) {
            let opt = visitTimeSelect.options[i];
            opt.disabled = false;
            opt.hidden = false;
            
            // 如果是被改過的 15:00，改回原本單純的 "15:00"
            if (opt.value === "15:00") {
                opt.text = "15:00";
            }
        }

        if (type === 'room' || type === 'starcraft' || type === 'dt392') {
            // 如果是 房間/露營車/民宿：
            // 1. 改上方提示文字
            if(checkInText) {
                checkInText.innerText = TRANSLATIONS[currentLang].checkin_time_val_room;
                checkInText.style.color = "#800080"; 
                checkInText.style.fontWeight = "bold";
            }
            
            // 2. 只隱藏 15:00 以前的時間 (14:00, 14:30)
            let opt1400 = visitTimeSelect.querySelector('option[value="14:00"]');
            let opt1430 = visitTimeSelect.querySelector('option[value="14:30"]');
            
            if(opt1400) { opt1400.disabled = true; opt1400.hidden = true; } 
            if(opt1430) { opt1430.disabled = true; opt1430.hidden = true; }

            // 3. 修改 15:00 顯示文字
            let opt1500 = visitTimeSelect.querySelector('option[value="15:00"]');
            if(opt1500) {
                opt1500.text = "15:00 (check in time)";
            }

            // 檢查若目前選到的值是被隱藏的
            if(visitTimeSelect.value === "14:00" || visitTimeSelect.value === "14:30") {
                visitTimeSelect.value = ""; 
            }

        } else {
            // 如果是 露營：改回一般文字
            if(checkInText) {
                checkInText.innerText = TRANSLATIONS[currentLang].checkin_time_val;
                checkInText.style.color = ""; 
                checkInText.style.fontWeight = "";
            }
        }
        
        // 只有「自搭帳/車露」顯示夜衝/冷氣
        if (type === 'tent' || type === 'car' || type === 'camper' || type === 'moto' || type === 'solo') {
            extraOptions.classList.remove('hidden');
            document.getElementById('rowRush').classList.remove('hidden');
            document.getElementById('rowAC').classList.remove('hidden');
            if(rushNotice) rushNotice.classList.remove('hidden'); 
        } else {
            document.getElementById('isNightRush').checked = false;
            document.getElementById('useAC').checked = false;
        }
    }

    // 🔥 處理「數量」與「朋友名單」的顯示邏輯
    if (type.includes('full') || type === 'bicycle' || type === 'venue_hourly') {
        if(unitQtyBlock) unitQtyBlock.classList.add('hidden');
        if(guestListBlock) guestListBlock.classList.add('hidden');
        document.getElementById('unitQty').value = 1; 
    } else {
        if(unitQtyBlock) unitQtyBlock.classList.remove('hidden');
        generateGuestInputs(); // 檢查是否需要顯示名單
    }
    
    // 🔥 呼叫更新日曆鎖定的函式
    updateCalendarBlocking();

    calculateTotal();
}

// 🔥 新增函式：根據選擇的房型，動態鎖定日曆
function updateCalendarBlocking() {
    const type = document.getElementById('campType').value;
    const picker = document.querySelector("#dateRange")._flatpickr;
    
    if (!picker) return;

    // 1. 基礎：永遠鎖定「全包場」的日子
    let datesToDisable = [...(GLOBAL_BLOCKED_DATA.full || [])];

    // 2. 根據類型追加鎖定
    if (type === 'starcraft') {
        // 如果選美式拖車，要加上「已被訂走的拖車日期」
        if(GLOBAL_BLOCKED_DATA.starcraft) {
            datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.starcraft);
        }
    } else if (type === 'dt392') {
        // 如果選大馳露營車
        if(GLOBAL_BLOCKED_DATA.dt392) {
            datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.dt392);
        }
    } else if (type === 'room') {
        // 如果選民宿房間
        if(GLOBAL_BLOCKED_DATA.room) {
            datesToDisable = datesToDisable.concat(GLOBAL_BLOCKED_DATA.room);
        }
    } else if (type && type.includes('full')) {
        // 如果客人想訂「包場」，那只要「任何房型」有人訂的那天，都不能包場
        // 所以要把所有忙碌日期都加進來
        datesToDisable = datesToDisable
            .concat(GLOBAL_BLOCKED_DATA.starcraft || [])
            .concat(GLOBAL_BLOCKED_DATA.dt392 || [])
            .concat(GLOBAL_BLOCKED_DATA.room || []);
    }

    // 3. 更新 Flatpickr 設定
    picker.set('disable', datesToDisable);
}

// 🔥 新增：當數量改變時觸發
function onQtyChange() {
    generateGuestInputs(); // 產生欄位
    calculateTotal();      // 重新算錢
}

// 🔥 新增：動態產生朋友姓名欄位
function generateGuestInputs() {
    const qty = parseInt(document.getElementById('unitQty').value);
    const container = document.getElementById('guestInputsContainer');
    const block = document.getElementById('guestListBlock');
    
    if(!container || !block) return;

    // 清空原本的欄位
    container.innerHTML = "";

    // 如果數量 > 1，才顯示這個區塊
    if (qty > 1) {
        block.classList.remove('hidden');
        
        // 從第 2 位開始產生 (因為第 1 位是訂購人自己)
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

// ==========================================
// 4. 費用計算核心 (Calculate Total)
// ==========================================
function calculateTotal() {
    const type = document.getElementById('campType').value;
    
    if (!type || type === "") {
        hideResult();
        return;
    }

    const config = CAMPING_CONFIG[type];
    if (selectedDates.length === 0) { hideResult(); return; }

    let finalPrice = 0;
    
    // --- A. 單車租借 ---
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

    // --- B. 場地租借 ---
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
            } else {
                finalPrice = config.holidayRates[scheme];
            }
        } else {
            finalPrice = config.weekdayRates[scheme];
        }
        
        document.getElementById('basePrice').innerText = finalPrice;
        document.getElementById('finalTotal').innerText = finalPrice;
        document.getElementById('discountPrice').parentElement.classList.add('hidden');
        document.getElementById('resultBox').classList.remove('hidden');
        return;
    }

    // --- C. 住宿/包場/露營 (含加購) ---
    const nights = parseInt(document.getElementById('nights').value);
    if (nights < 1) { hideResult(); return; }

    // 🔥 取得數量 (如果隱藏了，預設為 1)
    let qty = 1;
    const qtyBlock = document.getElementById('qtyBlock');
    if (qtyBlock && !qtyBlock.classList.contains('hidden')) {
        qty = parseInt(document.getElementById('unitQty').value) || 1;
    }

    const isNightRush = document.getElementById('isNightRush').checked;
    const useAC = document.getElementById('useAC').checked;

    // 🔥【防呆提示】如果只選1晚卻勾夜衝，提醒客人 🔥
    let rushWarning = document.getElementById('rushWarningText');
    if (!rushWarning) {
        const rushOption = document.getElementById('isNightRush').parentElement;
        rushWarning = document.createElement('div');
        rushWarning.id = 'rushWarningText';
        rushWarning.style.color = 'red';
        rushWarning.style.fontSize = '0.9rem';
        rushWarning.style.marginTop = '5px';
        rushWarning.style.fontWeight = 'bold';
        rushOption.parentElement.appendChild(rushWarning);
    }
    
    if (isNightRush && nights === 1) {
        rushWarning.innerText = "💡 提醒：您只選了 1 晚，系統將僅計算「純夜衝」費用。若您是要「夜衝+續住露營」，請務必選擇 2 晚 (例如週五~週日)。";
        rushWarning.classList.remove('hidden');
    } else {
        rushWarning.classList.add('hidden');
    }


    let basePrice = 0;
    let rushPrice = 0;
    let acPrice = 0;

    let hasWeekend = false;
    let currentDate = new Date(selectedDates[0]);

    for (let i = 0; i < nights; i++) {
        let dateStr = formatDate(currentDate);
        let dayOfWeek = currentDate.getDay();
        
        let rateType = 'weekday';
        if (MAKEUP_DAYS.includes(dateStr)) {
            rateType = 'weekday';
        } else if (HOLIDAYS.includes(dateStr)) { 
            rateType = 'holiday';
        } else if (dayOfWeek === 5 || dayOfWeek === 6) { 
            rateType = 'weekend';
            hasWeekend = true; 
        }

        // 第一晚如果是夜衝，算夜衝價；否則算原價
        if (i === 0 && isNightRush && config.nightRush) {
            let rushType = rateType; 
            if(type === 'camper') {
                rushPrice += config.nightRush[rushType] * 0.8; 
            } else {
                rushPrice += config.nightRush[rushType];
            }
        } else {
            basePrice += config.rates[rateType];
        }

        // 🔥【修改】冷氣費 $200 (注意：之前您說改成100，後來又說200，這裡先設為200)
        // 若要改回100，請改這裡
        if (useAC) { acPrice += 200; }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // 🔥 乘上數量
    basePrice = basePrice * qty;
    if (useAC) { acPrice = acPrice * qty; }
    if (isNightRush) { rushPrice = rushPrice * qty; }

    // ➕ 加購計算 (人/車/訪客)
    const extraPeople = parseInt(document.getElementById('extraPeople').value) || 0;
    const extraCars = parseInt(document.getElementById('extraCars').value) || 0;
    const visitors = parseInt(document.getElementById('visitors').value) || 0;

    const extraPeopleCost = extraPeople * 200 * nights;
    // 🔥 已更新：加車 $300
    const extraCarsCost = extraCars * 300 * nights;
    const visitorsCost = visitors * 100;
    
    const totalAddonCost = extraPeopleCost + extraCarsCost + visitorsCost;

    const rowAddons = document.getElementById('rowAddons');
    if (totalAddonCost > 0) {
        rowAddons.classList.remove('hidden');
        document.getElementById('addonPrice').innerText = totalAddonCost;
    } else {
        rowAddons.classList.add('hidden');
    }

    // 折扣計算
    let discount = 0;
    document.getElementById('discountPrice').parentElement.classList.remove('hidden');
    
    let isHolidayForDiscount = false;
    let checkDate = new Date(selectedDates[0]);
    for(let k=0; k<nights; k++) {
        if (HOLIDAYS.includes(formatDate(checkDate))) {
            isHolidayForDiscount = true;
            break;
        }
        checkDate.setDate(checkDate.getDate() + 1);
    }

    // 這裡的 totalPriceForDiscount 應該是單一單位的價格，還是總價？
    // 通常折扣是針對總價打折
    let totalPriceForDiscount = basePrice + rushPrice + acPrice; 

    if (config.discountType === 'full_venue_promo') {
        if (nights >= 2) { discount = totalPriceForDiscount * 0.15; }
    } else if (config.discountType === 'percentage') {
        if (isHolidayForDiscount && nights >= 3) discount = totalPriceForDiscount * 0.15;
        else if (nights >= 2) discount = totalPriceForDiscount * 0.10;
    } else if (config.discountType === 'fixed_amount' || config.discountType === 'fixed_amount_premium') {
        // 固定金額折扣也要乘上數量嗎？通常是「每帳優惠多少」
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

// ==========================================
// 5. 送出訂單 (全自動版 - 最終修正)
// ==========================================
function submitOrder() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const line = document.getElementById('customerLine').value.trim();
    const note = document.getElementById('customerNote').value.trim();
    const visitTime = document.getElementById('visitTime').value; 
    
    if (!name || !phone) {
        alert(TRANSLATIONS[currentLang].alert_fill); 
        return;
    }

    const typeSelect = document.getElementById('campType');
    const typeText = typeSelect.options[typeSelect.selectedIndex].text;
    const typeValue = typeSelect.value; 

    // 住宿/露營車專屬的「貼心提醒」
    if (typeValue === 'room' || typeValue === 'starcraft' || typeValue === 'dt392') {
        const confirmMsg = TRANSLATIONS[currentLang].confirm_room_policy; 
        if (!confirm(confirmMsg)) {
            return; 
        }
    }

    const dateRange = document.getElementById('dateRange').value;
    const total = document.getElementById('finalTotal').innerText;
    
    // --- 組合訂單內容 ---
    let details = `【${typeText}】`;

    // 取得數量
    let qty = 1;
    const qtyBlock = document.getElementById('qtyBlock');
    if (qtyBlock && !qtyBlock.classList.contains('hidden')) {
        qty = parseInt(document.getElementById('unitQty').value);
    }

    if (typeValue === 'bicycle') {
        const qtyBike = document.getElementById('bikeQty').value;
        const schemeSelect = document.getElementById('bikeScheme');
        const schemeText = schemeSelect.options[schemeSelect.selectedIndex].text;
        details += ` / 數量:${qtyBike} / 方案:${schemeText}`;
    } else if (typeValue === 'venue_hourly') {
        const schemeSelect = document.getElementById('rentalScheme');
        const schemeText = schemeSelect.options[schemeSelect.selectedIndex].text;
        details += ` / 方案:${schemeText}`;
    } else {
        const nights = document.getElementById('nights').value;
        details += ` / ${nights}晚`;
        
        // 顯示數量 (如果大於1)
        if (qty > 1) {
            details += ` x ${qty}組`;
        }

        // 加購項目
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

        // 🔥 收集朋友名單
        const guestInputs = document.querySelectorAll('.guest-name-input');
        let guestNames = [];
        guestInputs.forEach((input, index) => {
            if(input.value.trim() !== "") {
                guestNames.push(`(第${index+2}位: ${input.value.trim()})`);
            }
        });
        
        if (guestNames.length > 0) {
            details += `\n同行：${guestNames.join('、')}`;
        }
    }

    if(visitTime) {
        details += ` / 預計時間:${visitTime}`;
    }

    // --- 按鈕狀態變更 ---
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

    // --- 送出資料到 Google Sheets (由後端發 LINE) ---
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: { "Content-Type": "text/plain" }
    })
    .then(response => {
        // 直接顯示成功，不跳轉 LINE
        alert(TRANSLATIONS[currentLang].sent_success);
        
        // 重置表單
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerLine').value = ''; 
        document.getElementById('customerNote').value = '';
        
        btn.innerText = "✅ 完成";
        setTimeout(() => { 
            btn.innerText = originalText; 
            btn.disabled = false; 
        }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("連線忙碌中，請稍後再試，或直接私訊官方 LINE。");
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

// ==========================================
// 6. UI 輔助
// ==========================================
function hideResult() {
    document.getElementById('resultBox').classList.add('hidden');
}

function resetForm() {
    const picker = document.querySelector("#dateRange")._flatpickr;
    picker.clear();
    document.getElementById('campType').value = ""; 
    toggleInputs(); 
    document.getElementById('nights').value = '0';
    document.getElementById('isNightRush').checked = false;
    document.getElementById('useAC').checked = false;
    document.getElementById('bikeQty').value = 1;
    document.getElementById('extraPeople').value = 0;
    document.getElementById('extraCars').value = 0;
    document.getElementById('visitors').value = 0;
    document.getElementById('visitTime').selectedIndex = 0; 
    hideResult();
}

function showModal(title, desc) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDesc').innerText = desc;
    const modal = document.getElementById('infoModal');
    if(modal) {
        modal.classList.remove('hidden'); 
        setTimeout(() => { modal.classList.add('show'); }, 10);
    }
}

function closeModal() {
    const modal = document.getElementById('infoModal');
    if(modal) {
        modal.classList.remove('show');
        setTimeout(() => { modal.classList.add('hidden'); }, 300);
    }
}

function renderVacancyTable(rows) {
    const tableDiv = document.getElementById('dynamic-vacancy-table');
    if (!tableDiv) return;

    let html = '<table style="width:100%; border-collapse:collapse; font-size:0.9rem; text-align:center;">';
    html += '<thead style="background-color:#f1f8f6; color:#2c5e50;"><tr>';
    rows[0].forEach(cell => { html += `<th style="border:1px solid #ddd; padding:10px;">${cell}</th>`; });
    html += '</tr></thead><tbody>';
    
    for (let i = 1; i < rows.length; i++) {
        html += '<tr>';
        rows[i].forEach(cell => {
            let style = 'border:1px solid #ddd; padding:10px;';
            let cellText = cell.toString();
            if (cellText.includes('滿') || cellText.includes('X') || cellText.includes('包場')) {
                style += 'background-color:#ffebee; color:#d32f2f; font-weight:bold;';
            } else if (cellText.includes('O') || cellText.includes('⭕')) {
                style += 'color:#2c5e50;';
            }
            if (cellText.includes('T00:00:00')) {
                let dateObj = new Date(cellText);
                cellText = `${dateObj.getMonth()+1}/${dateObj.getDate()}`;
            }
            html += `<td style="${style}">${cellText}</td>`;
        });
        html += '</tr>';
    }
    html += '</tbody></table>';
    tableDiv.innerHTML = html;
}

// 🔥 包場方案選擇器 (自動捲動到上方並選擇) 🔥
function selectPlan(planValue) {
    const select = document.getElementById('campType');
    select.value = planValue;
    
    // 觸發變更事件以更新畫面
    toggleInputs();

    // 捲動到計算機區域
    const target = document.getElementById('calculatorSection');
    if(target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}