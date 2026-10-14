let currentLang = 'ar';
let currentFabricFilter = 'all';
let currentMachineFilter = 'all';
let cart = [];
let selectedPaymentMethod = 'vf_cash';
let selectedPayPlan = 'deposit';
let serverOrders = [];

// 1. ألوان مصبغة النهار المرجعية
const factoryColors = [
  { nameAr: "ذهبي النهار (Daylight Gold)", nameEn: "Daylight Gold", hex: "#d97706" },
  { nameAr: "تركواز النيل (Nile Teal)", nameEn: "Nile Teal", hex: "#0f766e" },
  { nameAr: "أحمر قرمزي (Madder Red)", nameEn: "Madder Red", hex: "#991b1b" },
  { nameAr: "كحلي إنديجو (Indigo Night)", nameEn: "Indigo Night", hex: "#1e3a8a" },
  { nameAr: "أخضر زيتي (Bottle Green)", nameEn: "Bottle Green", hex: "#14532d" },
  { nameAr: "أسود فحمي (Charcoal Jet)", nameEn: "Charcoal Jet", hex: "#1f2937" }
];

// 2. كتالوج الأقمشة المتاحة للشراء أونلاين
let fabricsCatalog = [
  {
    id: 'fab-1',
    category: 'cotton',
    nameAr: 'سنجل جيرسيه قطن 100% فاخر',
    nameEn: '100% Cotton Single Jersey',
    specsAr: 'وزن 160-180 جرام · عرض مفتوح · صباغة رياكتيف وتجهيز كومباكتور',
    specsEn: '160-180 GSM · Open Width · Reactive Dyed & Compacted',
    pricePerKg: 295,
    minKg: 250
  },
  {
    id: 'fab-2',
    category: 'blends',
    nameAr: 'قطن ليكرا (95/5) عالي المطاطية',
    nameEn: 'Cotton / Lycra (95/5) Jersey',
    specsAr: 'وزن 190 جرام · ثبات أبعاد وتثبيت حراري على الرامات',
    specsEn: '190 GSM · High Stretch · Heat-Set on Stenter',
    pricePerKg: 330,
    minKg: 250
  },
  {
    id: 'fab-3',
    category: 'cotton',
    nameAr: 'ميلتون قطن مبطن (كسترة وحلاقة)',
    nameEn: '3-Thread Brushed Fleece (Melton)',
    specsAr: 'وزن 320 جرام · مجهز كسترة وحلاقة · ملمس ناعم للملابس الشتوية',
    specsEn: '320 GSM · Raised & Shaved Finish · Winter Grade',
    pricePerKg: 310,
    minKg: 250
  },
  {
    id: 'fab-4',
    category: 'polyester',
    nameAr: 'فسكوز ناعم (تجهيز سيلكون)',
    nameEn: 'Viscose Soft Drape Jersey',
    specsAr: 'وزن 170 جرام · انسيابية عالية · متاح سادة أو مطبوع روتاري',
    specsEn: '170 GSM · Reactive / Print Ready · Soft Finish',
    pricePerKg: 265,
    minKg: 250
  },
  {
    id: 'fab-5',
    category: 'polyester',
    nameAr: 'إنترلوك بوليستر رياضي',
    nameEn: 'Sports Polyester Interlock',
    specsAr: 'وزن 150 جرام · صباغة ديسبيرس عالية الثبات للملابس الرياضية',
    specsEn: '150 GSM · Disperse Dyed · Moisture Wicking Finish',
    pricePerKg: 210,
    minKg: 250
  },
  {
    id: 'fab-6',
    category: 'blends',
    nameAr: 'بيكيه لاكوست (للقمصان والبولو)',
    nameEn: 'Poly-Cotton Pique (Polo Lacoste)',
    specsAr: 'وزن 210 جرام · معالج سانفورايز ضد الانكماش',
    specsEn: '210 GSM · Sanforized · Zero Shrinkage Guarantee',
    pricePerKg: 280,
    minKg: 250
  }
];

// 3. بيانات الماكينات وأوقات الفراغ للتصنيع للغير
let machinesData = [
  {
    id: 'mac-1',
    type: 'dyeing',
    urgent: true,
    nameAr: 'خط ماكينات صباغة جيت (9 ماكينات Jet)',
    nameEn: 'High-Temp Jet Dyeing Line (9 Machines)',
    statusAr: 'متاح غداً — الوردية الثانية (2 ظهراً)',
    statusEn: 'Available Tomorrow — Shift B (2:00 PM)',
    capacityAr: 'طاقة شاغرة حتى 15 طن',
    capacityEn: 'Up to 15 Tons Open Capacity',
    unitAr: 'كجم',
    unitEn: 'kg',
    rate: 45,
    minQty: 250,
    slotsAr: ['غداً (الوردية الثانية - 2 ظهراً)', 'الخميس (طوال اليوم)', 'الأحد القادم (صباحاً)'],
    slotsEn: ['Tomorrow (Shift B - 2:00 PM)', 'Thursday (Full Day)', 'Next Sunday (Morning)']
  },
  {
    id: 'mac-2',
    type: 'printing_finishing',
    urgent: true,
    nameAr: 'خط طباعة روتاري (70,000 متر/يوم)',
    nameEn: 'Rotary Screen Printing Line (70,000m/day)',
    statusAr: 'متاح اليوم — الفترة المسائية',
    statusEn: 'Available Today — Evening Slot',
    capacityAr: 'طاقة شاغرة 25,000 متر',
    capacityEn: '25,000 Meters Open Slot',
    unitAr: 'متر',
    unitEn: 'meter',
    rate: 18,
    minQty: 1000,
    slotsAr: ['اليوم (فترة 6 مساءً)', 'الأربعاء (صباحاً)', 'السبت (خط كامل)'],
    slotsEn: ['Today (6:00 PM Slot)', 'Wednesday (Morning)', 'Saturday (Full Line)']
  },
  {
    id: 'mac-3',
    type: 'printing_finishing',
    urgent: true,
    nameAr: 'خط التجهيز النهائي (5 رامات + 2 كومباكتور + سانفورايز)',
    nameEn: 'Stenter, Compactor & Sanforizing Line',
    statusAr: 'متاح للحجز خلال 24 ساعة',
    statusEn: 'Available Within 24 Hours',
    capacityAr: 'تجهيز وتثبيت عرض وانكماش',
    capacityEn: '5 Stenters + 2 Compactors',
    unitAr: 'كجم',
    unitEn: 'kg',
    rate: 16,
    minQty: 300,
    slotsAr: ['غداً صباحاً (8:00 ص)', 'الجمعة (الوردية الأولى)', 'الإثنين القادم'],
    slotsEn: ['Tomorrow Morning (8:00 AM)', 'Friday Shift A', 'Next Monday']
  },
  {
    id: 'mac-4',
    type: 'dyeing',
    urgent: false,
    nameAr: 'ماكينات صباغة بنانا وجيجر (4 بنانا + 2 جيجر)',
    nameEn: 'Banana & Jigger Dyeing Machines',
    statusAr: 'أقرب وقت فراغ: بعد 3 أيام',
    statusEn: 'Next Free Slot: In 3 Days',
    capacityAr: 'مخصصة للأقمشة الحساسة والمنسوجة',
    capacityEn: 'For Delicate & Woven Fabrics',
    unitAr: 'كجم',
    unitEn: 'kg',
    rate: 50,
    minQty: 250,
    slotsAr: ['بعد 3 أيام (وردية صباحية)', 'الثلاثاء القادم', 'الخميس القادم'],
    slotsEn: ['In 3 Days (Morning Shift)', 'Next Tuesday', 'Next Thursday']
  },
  {
    id: 'mac-5',
    type: 'printing_finishing',
    urgent: false,
    nameAr: 'قسم النسيج الدائري (تشغيل نسيج للغير)',
    nameEn: 'Circular Knitting Floor (Toll Knitting)',
    statusAr: 'أقرب وقت فراغ: بعد يومين',
    statusEn: 'Next Free Slot: In 2 Days',
    capacityAr: 'طاقة إنتاجية 20 طن يومياً',
    capacityEn: '20 Tons / Day Capacity',
    unitAr: 'كجم',
    unitEn: 'kg',
    rate: 24,
    minQty: 500,
    slotsAr: ['بعد يومين (حجز 5 طن)', 'الأسبوع القادم (تعاقد مفتوح)'],
    slotsEn: ['In 2 Days (5 Tons Slot)', 'Next Week (Open Contract)']
  }
];

// 4. بيانات تتبع التشغيلات (6 مراحل)
let batchesDB = {
  "NH-2026-841": {
    spec: "1,200 كجم · سنجل جيرسيه قطن 100%",
    shade: "تركواز النيل (Reactive)",
    date: "خلال 48 ساعة",
    stage: 3
  },
  "NH-2026-905": {
    spec: "3,500 متر · فسكوز طباعة روتاري",
    shade: "باترن رقم #402",
    date: "غداً صباحاً",
    stage: 5
  }
};

const stageNames = [
  { ar: "استلام وفحص الخام", en: "Intake & Inspection" },
  { ar: "التجهيز التحضيري", en: "Pre-treatment" },
  { ar: "الصباغة ومطابقة اللون", en: "Dyeing" },
  { ar: "الطباعة", en: "Printing" },
  { ar: "التجهيز النهائي (رامات)", en: "Finishing" },
  { ar: "فحص الجودة والشحن", en: "QC & Dispatch" }
];

// ==========================================
// الاتصال بسيرفر الـ .NET
// ==========================================
async function syncDataFromServer() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) return;
    const data = await res.json();

    if (!data.fabrics || data.fabrics.length === 0) {
      await fetch('/api/fabrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fabricsCatalog)
      });
    } else {
      fabricsCatalog = data.fabrics;
    }

    if (!data.machines || data.machines.length === 0) {
      await fetch('/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(machinesData)
      });
    } else {
      machinesData = data.machines;
    }

    if (!data.batches || Object.keys(data.batches).length === 0) {
      await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchesDB)
      });
    } else {
      batchesDB = data.batches;
    }

    serverOrders = data.orders || [];

    renderFabrics();
    renderMachines();
  } catch (err) {
    console.warn("Offline mode:", err);
  }
}

// ==========================================
// عرض متجر الأقمشة والألوان
// ==========================================
function renderFabrics() {
  const container = document.getElementById('fabricsContainer');
  if (!container) return;
  container.innerHTML = '';

  const list = currentFabricFilter === 'all'
    ? fabricsCatalog
    : fabricsCatalog.filter(f => f.category === currentFabricFilter);

  list.forEach(fab => {
    const title = currentLang === 'ar' ? fab.nameAr : fab.nameEn;
    const specs = currentLang === 'ar' ? fab.specsAr : fab.specsEn;
    const unitCurrency = currentLang === 'ar' ? 'ج.م / كجم' : 'EGP / kg';
    const defaultCol = factoryColors[0];
    const defaultColName = currentLang === 'ar' ? defaultCol.nameAr : defaultCol.nameEn;

    let swatchesHtml = '';
    factoryColors.forEach((c, idx) => {
      const cName = currentLang === 'ar' ? c.nameAr : c.nameEn;
      swatchesHtml += `<span class="swatch-circle ${idx === 0 ? 'active' : ''}" 
                             style="background:${c.hex}" 
                             title="${cName}"
                             onclick="selectFabricColor('${fab.id}', '${cName}', '${c.hex}', this)"></span>`;
    });

    const card = document.createElement('div');
    card.className = 'luxury-card';
    card.innerHTML = `
      <div>
        <div class="fabric-preview-banner" id="banner-${fab.id}" style="background-color: ${defaultCol.hex};">
          <span class="preview-shade-tag" id="bannerTag-${fab.id}">${defaultColName}</span>
          <span class="price-tag">${fab.pricePerKg} ${unitCurrency}</span>
        </div>

        <div class="card-body">
          <div class="card-title">${title}</div>
          <div class="card-specs">${specs}</div>

          <span class="swatches-label">${currentLang === 'ar' ? 'اضغط لمعاينة اللون أو اكتب كود Pantone:' : 'Click swatch to preview or enter Pantone:'}</span>
          <div class="swatches-list" id="swatches-${fab.id}">${swatchesHtml}</div>

          <div class="input-row">
            <div>
              <label>${currentLang === 'ar' ? 'اللون / كود Pantone' : 'Shade / Pantone'}</label>
              <input type="text" id="shade-${fab.id}" value="${defaultColName}">
            </div>
            <div>
              <label>${currentLang === 'ar' ? `الكمية بالكيلو (حد أدنى ${fab.minKg})` : `Qty in kg (Min ${fab.minKg})`}</label>
              <input type="number" id="qty-${fab.id}" value="${fab.minKg}" min="${fab.minKg}" step="50"
                     oninput="updateFabricCardTotal('${fab.id}', ${fab.pricePerKg})">
            </div>
          </div>
        </div>
      </div>

      <div class="card-bottom">
        <div class="calc-price" id="total-${fab.id}">
          ${(fab.pricePerKg * fab.minKg).toLocaleString()} ${currentLang === 'ar' ? 'ج.م' : 'EGP'}
        </div>
        <button class="btn btn-primary" onclick="addFabricToCart('${fab.id}')">
          ${currentLang === 'ar' ? '+ أضف لطلب الشراء' : '+ Add to Order'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function selectFabricColor(fabId, colorName, hexCode, circleEl) {
  document.getElementById(`shade-${fabId}`).value = colorName;
  document.getElementById(`banner-${fabId}`).style.backgroundColor = hexCode;
  document.getElementById(`bannerTag-${fabId}`).textContent = colorName;

  const parent = document.getElementById(`swatches-${fabId}`);
  parent.querySelectorAll('.swatch-circle').forEach(el => el.classList.remove('active'));
  circleEl.classList.add('active');
}

function updateFabricCardTotal(fabId, price) {
  const qty = parseFloat(document.getElementById(`qty-${fabId}`).value) || 0;
  const currency = currentLang === 'ar' ? 'ج.م' : 'EGP';
  document.getElementById(`total-${fabId}`).textContent = `${(qty * price).toLocaleString()} ${currency}`;
}

function filterFabrics(cat, btn) {
  currentFabricFilter = cat;
  btn.parentElement.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderFabrics();
}

// ==========================================
// عرض ماكينات التصنيع للغير وأوقات الفراغ
// ==========================================
function renderMachines() {
  const container = document.getElementById('machinesContainer');
  if (!container) return;
  container.innerHTML = '';

  let list = machinesData;
  if (currentMachineFilter === 'available_now') {
    list = machinesData.filter(m => m.urgent);
  } else if (currentMachineFilter !== 'all') {
    list = machinesData.filter(m => m.type === currentMachineFilter);
  }

  list.forEach(mac => {
    const title = currentLang === 'ar' ? mac.nameAr : mac.nameEn;
    const status = currentLang === 'ar' ? mac.statusAr : mac.statusEn;
    const cap = currentLang === 'ar' ? mac.capacityAr : mac.capacityEn;
    const unit = currentLang === 'ar' ? mac.unitAr : mac.unitEn;
    const slots = currentLang === 'ar' ? mac.slotsAr : mac.slotsEn;
    const currency = currentLang === 'ar' ? 'ج.م' : 'EGP';

    const optionsHtml = slots.map(s => `<option value="${s}">${s}</option>`).join('');

    const card = document.createElement('div');
    card.className = 'luxury-card';
    card.innerHTML = `
      <div class="card-body">
        <span class="slot-badge ${mac.urgent ? 'slot-green' : 'slot-amber'}">● ${status}</span>
        <div class="card-title">${title}</div>

        <div class="machine-info-box">
          <div>
            <span>${currentLang === 'ar' ? 'سعر المصنعية للغير:' : 'Toll Mfg Rate:'}</span>
            <strong style="color:var(--gold)">${mac.rate} ${currency} / ${unit}</strong>
          </div>
          <div>
            <span>${currentLang === 'ar' ? 'الطاقة المتاحة:' : 'Open Capacity:'}</span>
            <strong>${cap}</strong>
          </div>
        </div>

        <div class="input-row">
          <div>
            <label>${currentLang === 'ar' ? 'اختر وقت الفراغ للحجز:' : 'Select Idle Slot:'}</label>
            <select id="slot-${mac.id}">${optionsHtml}</select>
          </div>
          <div>
            <label>${currentLang === 'ar' ? `الكمية (${unit}):` : `Quantity (${unit}):`}</label>
            <input type="number" id="mqty-${mac.id}" value="${mac.minQty}" min="${mac.minQty}" step="100"
                   oninput="updateMachineCardTotal('${mac.id}', ${mac.rate})">
          </div>
        </div>
      </div>

      <div class="card-bottom">
        <div class="calc-price" id="mtotal-${mac.id}">
          ${(mac.rate * mac.minQty).toLocaleString()} ${currency}
        </div>
        <button class="btn btn-gold" onclick="bookMachineSlot('${mac.id}')">
          ${currentLang === 'ar' ? 'احجز موعد الماكينة' : 'Book Machine Slot'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateMachineCardTotal(macId, rate) {
  const qty = parseFloat(document.getElementById(`mqty-${macId}`).value) || 0;
  const currency = currentLang === 'ar' ? 'ج.م' : 'EGP';
  document.getElementById(`mtotal-${macId}`).textContent = `${(qty * rate).toLocaleString()} ${currency}`;
}

function filterMachines(type, btn) {
  currentMachineFilter = type;
  btn.parentElement.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMachines();
}

// ==========================================
// إدارة سلة المشتريات وحجوزات الماكينات والدفع
// ==========================================
function selectPayPlan(plan) {
  selectedPayPlan = plan;
  const depLbl = document.getElementById('planDepositLbl');
  const fullLbl = document.getElementById('planFullLbl');
  if (depLbl) depLbl.classList.toggle('active', plan === 'deposit');
  if (fullLbl) fullLbl.classList.toggle('active', plan === 'full');
}

function switchPaymentMethod(method, btnEl) {
  selectedPaymentMethod = method;
  document.querySelectorAll('.pm-tab').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');

  document.getElementById('payBox-vf_cash').style.display = method === 'vf_cash' ? 'block' : 'none';
  document.getElementById('payBox-instapay').style.display = method === 'instapay' ? 'block' : 'none';
  document.getElementById('payBox-visa').style.display = method === 'visa' ? 'block' : 'none';
}

function addFabricToCart(fabId) {
  const fab = fabricsCatalog.find(f => f.id === fabId);
  const shade = document.getElementById(`shade-${fabId}`).value;
  const qty = parseFloat(document.getElementById(`qty-${fabId}`).value) || fab.minKg;

  if (qty < fab.minKg) {
    alert(currentLang === 'ar' ? `الحد الأدنى للطلب هو ${fab.minKg} كجم للون الواحد.` : `Minimum order is ${fab.minKg} kg per shade.`);
    return;
  }

  cart.push({
    type: currentLang === 'ar' ? 'شراء قماش جاهز' : 'Fabric Order',
    title: currentLang === 'ar' ? fab.nameAr : fab.nameEn,
    details: `${currentLang === 'ar' ? 'اللون:' : 'Shade:'} ${shade} | ${qty} kg`,
    total: qty * fab.pricePerKg
  });

  renderCart();
  document.getElementById('cartSection').scrollIntoView({ behavior: 'smooth' });
}

function bookMachineSlot(macId) {
  const mac = machinesData.find(m => m.id === macId);
  const slot = document.getElementById(`slot-${macId}`).value;
  const qty = parseFloat(document.getElementById(`mqty-${macId}`).value) || mac.minQty;
  const unit = currentLang === 'ar' ? mac.unitAr : mac.unitEn;

  cart.push({
    type: currentLang === 'ar' ? 'حجز ماكينة (تصنيع للغير)' : 'Toll Machine Booking',
    title: currentLang === 'ar' ? mac.nameAr : mac.nameEn,
    details: `${currentLang === 'ar' ? 'الموعد:' : 'Slot:'} ${slot} | ${qty} ${unit}`,
    total: qty * mac.rate
  });

  renderCart();
  document.getElementById('cartSection').scrollIntoView({ behavior: 'smooth' });
}

function renderCart() {
  const listEl = document.getElementById('cartItemsList');
  const footerEl = document.getElementById('cartFooter');
  const countEl = document.getElementById('cartCount');
  if (!listEl) return;

  countEl.textContent = cart.length;
  const currency = currentLang === 'ar' ? 'ج.م' : 'EGP';

  if (cart.length === 0) {
    listEl.innerHTML = `<p style="color:var(--text-muted); padding: 15px 0;">${
      currentLang === 'ar' ? 'السلة فارغة حالياً. اختر أقمشة من المتجر أو احجز موعد ماكينة من الأعلى.' : 'Your cart is empty. Add fabrics or reserve a machine slot above.'
    }</p>`;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  listEl.innerHTML = '';
  let grandTotal = 0;

  cart.forEach((item, index) => {
    grandTotal += item.total;
    listEl.innerHTML += `
      <div class="cart-row">
        <div>
          <span class="cart-tag">${item.type}</span>
          <div style="font-weight:800; color:var(--navy)">${item.title}</div>
          <div style="font-size:0.86rem; color:var(--text-muted)">${item.details}</div>
        </div>
        <div style="display:flex; align-items:center; gap:14px;">
          <strong style="color:var(--success); font-size:1.05rem;">${item.total.toLocaleString()} ${currency}</strong>
          <button class="btn-remove" onclick="removeCartItem(${index})">✕</button>
        </div>
      </div>
    `;
  });

  document.getElementById('cartGrandTotal').textContent = `${grandTotal.toLocaleString()} ${currency}`;

  const depositVal = Math.round(grandTotal * 0.25);
  const depEl = document.getElementById('depositAmountTxt');
  const fullEl = document.getElementById('fullAmountTxt');
  if (depEl) depEl.textContent = `${depositVal.toLocaleString()} ${currency}`;
  if (fullEl) fullEl.textContent = `${grandTotal.toLocaleString()} ${currency}`;

  // تعبئة بيانات العميل تلقائياً في خانات الدفع بمجرد ظهور السلة
  applyUserToCheckout();
}

function removeCartItem(i) {
  cart.splice(i, 1);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

async function submitOrderViaWhatsApp() {
  // إذا لم يكن العميل مسجلاً، نطلب منه تسجيل الدخول أولاً كما طلبت
  const savedUser = localStorage.getItem('alnahar_user');
  if (!savedUser) {
    if (confirm('لإتمام الطلب وحفظ بياناتك، يرجى تسجيل الدخول أو إنشاء حساب أولاً. الانتقال لصفحة الحساب الآن؟')) {
      window.location.href = 'account.html';
    }
    return;
  }

  const name = document.getElementById('custName').value.trim();
  const factory = document.getElementById('custFactory').value.trim();
  const phone = document.getElementById('custPhone').value.trim();

  if (!name || !factory || !phone) {
    alert(currentLang === 'ar' ? 'يرجى التأكد من الاسم واسم المصنع/العنوان ورقم الهاتف.' : 'Please verify your name, company/address, and phone number.');
    return;
  }

  let grandTotal = 0;
  cart.forEach(item => grandTotal += item.total);
  const requiredNow = selectedPayPlan === 'deposit' ? Math.round(grandTotal * 0.25) : grandTotal;

  let payMethodName = 'فودافون كاش (Vodafone Cash)';
  let payRef = document.getElementById('vfSenderNum')?.value.trim() || 'لم يحدد بعد';

  if (selectedPaymentMethod === 'instapay') {
    payMethodName = 'إنستا باي (InstaPay)';
    payRef = document.getElementById('instaRefNum')?.value.trim() || 'لم يحدد بعد';
  } else if (selectedPaymentMethod === 'visa') {
    payMethodName = 'بطاقة بنكية (Visa / MasterCard)';
    payRef = document.getElementById('cardHolder')?.value.trim() || 'طلب رابط دفع بنكي';
  }

  const orderRecord = {
    date: new Date().toLocaleString('ar-EG'),
    customerName: name,
    factoryName: factory,
    phone: phone,
    items: cart,
    totalAmount: grandTotal,
    paidNow: requiredNow,
    paymentPlan: selectedPayPlan === 'deposit' ? 'عربون 25%' : 'سداد كامل 100%',
    paymentMethod: payMethodName,
    paymentRef: payRef
  };

  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderRecord)
    });
  } catch (e) {
    console.warn("Could not save order to server:", e);
  }

  let msg = `*طلب شراء وحجز تشغيل — مصنع ومصبغة النهار*%0A`;
  msg += `*العميل:* ${name} (${factory})%0A`;
  msg += `*الهاتف:* ${phone}%0A`;
  msg += `----------------------------------%0A`;

  cart.forEach((item, i) => {
    msg += `*${i + 1}. [${item.type}]* ${item.title}%0A`;
    msg += `   ${item.details} — *${item.total.toLocaleString()} ج.م*%0A`;
  });

  msg += `----------------------------------%0A`;
  msg += `*إجمالي الفاتورة:* ${grandTotal.toLocaleString()} ج.م%0A`;
  msg += `*نظام السداد المختار:* ${orderRecord.paymentPlan}%0A`;
  msg += `*المبلغ المطلوب سداده الآن:* ${requiredNow.toLocaleString()} ج.م%0A`;
  msg += `*وسيلة الدفع:* ${payMethodName}%0A`;
  msg += `*مرجع التحويل:* ${payRef}`;

  window.open(`https://wa.me/201000887410?text=${msg}`, '_blank');
}

// ==========================================
// تتبع التشغيلات (6 مراحل)
// ==========================================
function quickTrack(code) {
  document.getElementById('batchInput').value = code;
  searchBatch();
}

async function searchBatch() {
  await syncDataFromServer();
  const code = document.getElementById('batchInput').value.trim().toUpperCase();
  const resBox = document.getElementById('trackerResult');
  const grid = document.getElementById('stagesTrackGrid');

  if (!batchesDB[code]) {
    alert(currentLang === 'ar' ? 'رقم التشغيلة غير موجود. جرب NH-2026-841' : 'Batch ID not found. Try NH-2026-841');
    return;
  }

  const b = batchesDB[code];
  document.getElementById('tBatchId').textContent = code;
  document.getElementById('tBatchSpec').textContent = b.spec;
  document.getElementById('tBatchShade').textContent = b.shade;
  document.getElementById('tBatchDate').textContent = b.date;

  grid.innerHTML = '';
  stageNames.forEach((st, idx) => {
    const stepNum = idx + 1;
    let cls = '';
    let statusTxt = currentLang === 'ar' ? 'في الانتظار' : 'Pending';

    if (stepNum < b.stage) {
      cls = 'done';
      statusTxt = currentLang === 'ar' ? '✓ تمت المرحلة' : '✓ Completed';
    } else if (stepNum === parseInt(b.stage)) {
      cls = 'active';
      statusTxt = currentLang === 'ar' ? '● جاري التشغيل الآن' : '● In Progress';
    }

    grid.innerHTML += `
      <div class="step-card ${cls}">
        <div class="step-num">0${stepNum}</div>
        <div style="font-weight:800; color:var(--navy); margin-bottom:4px;">${currentLang === 'ar' ? st.ar : st.en}</div>
        <div style="font-size:0.78rem; font-weight:700;">${statusTxt}</div>
      </div>
    `;
  });

  resBox.style.display = 'block';
}

// ==========================================
// إدارة حساب العميل (التسجيل، الدخول، الهزة، والملء التلقائي)
// ==========================================
function triggerErrorShake(errorElementId, message) {
  const errBox = document.getElementById(errorElementId);
  const cardBox = document.getElementById('authCardBox');
  if (errBox) {
    errBox.textContent = message;
    errBox.style.display = 'block';
  }
  if (cardBox) {
    cardBox.classList.remove('shake');
    void cardBox.offsetWidth;
    cardBox.classList.add('shake');
  }
}

function switchMode(mode) {
  const regEl = document.getElementById('registerForm');
  const logEl = document.getElementById('loginForm');
  const titleEl = document.getElementById('boxTitle');
  const subEl = document.getElementById('boxSub');
  const regErr = document.getElementById('regErrorMsg');
  const logErr = document.getElementById('loginErrorMsg');

  if (regErr) regErr.style.display = 'none';
  if (logErr) logErr.style.display = 'none';

  if (mode === 'login') {
    regEl.style.display = 'none';
    logEl.style.display = 'block';
    titleEl.textContent = 'تسجيل الدخول';
    subEl.textContent = 'أدخل بريدك الإلكتروني وكلمة المرور للوصول لحسابك.';
  } else {
    regEl.style.display = 'block';
    logEl.style.display = 'none';
    titleEl.textContent = 'إنشاء حساب جديد';
    subEl.textContent = 'أنشئ حسابك لملء بياناتك تلقائياً عند إتمام أي طلب قماش أو حجز ماكينة.';
  }
}

async function submitRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const address = document.getElementById('regAddress').value.trim();
  const company = document.getElementById('regCompany').value.trim();
  const password = document.getElementById('regPass').value.trim();

  if (!name || !email || !phone || !address || !password) {
    triggerErrorShake('regErrorMsg', '⚠️ يرجى ملء جميع الحقول الأساسية المطلوبة (*).');
    return;
  }

  const userObj = { name, email, phone, address, company, password };

  try {
    const res = await fetch('/api/customers/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userObj)
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('alnahar_user', JSON.stringify(data.customer || userObj));
      window.location.href = 'index.html';
    } else if (res.status === 409) {
      triggerErrorShake('regErrorMsg', '✕ هذا البريد الإلكتروني مسجل بالفعل، اضغط على تسجيل الدخول بالأسفل.');
    } else if (res.status === 404) {
      triggerErrorShake('regErrorMsg', '⚠️ يرجى إيقاف سيرفر .NET (Ctrl+C) وتشغيله من جديد (dotnet run) لتفعيل التحديث.');
    } else {
      triggerErrorShake('regErrorMsg', '✕ تعذر إنشاء الحساب، تأكد من صحة البيانات.');
    }
  } catch (e) {
    triggerErrorShake('regErrorMsg', '✕ تعذر الاتصال بالسيرفر، تأكد أن dotnet run يعمل.');
  }
}

async function submitLogin() {
  const email = document.getElementById('logEmail').value.trim();
  const password = document.getElementById('logPass').value.trim();

  if (!email || !password) {
    triggerErrorShake('loginErrorMsg', '⚠️ يرجى إدخال البريد الإلكتروني وكلمة المرور.');
    return;
  }

  try {
    const res = await fetch('/api/customers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('alnahar_user', JSON.stringify(data.customer));
      window.location.href = 'index.html';
    } else if (res.status === 404) {
      triggerErrorShake('loginErrorMsg', '⚠️ يرجى إعادة تشغيل سيرفر .NET (Ctrl+C ثم dotnet run).');
    } else {
      triggerErrorShake('loginErrorMsg', '✕ البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
  } catch (e) {
    triggerErrorShake('loginErrorMsg', '✕ حدث خطأ في الاتصال بالسيرفر.');
  }
}

function checkAccountSession() {
  const formBox = document.getElementById('formContainer');
  const profBox = document.getElementById('profileContainer');
  if (!formBox || !profBox) return;

  const savedUser = localStorage.getItem('alnahar_user');
  if (savedUser) {
    const u = JSON.parse(savedUser);
    formBox.style.display = 'none';
    profBox.style.display = 'block';

    document.getElementById('profAvatar').textContent = (u.name || 'U').charAt(0).toUpperCase();
    document.getElementById('profName').textContent = u.name || '-';
    document.getElementById('profEmail').textContent = u.email || '-';
    document.getElementById('profCompany').textContent = u.company ? `🏢 ${u.company}` : 'عميل تجاري';
    document.getElementById('profPhone').textContent = u.phone || '-';
    document.getElementById('profAddress').textContent = u.address || '-';
  } else {
    formBox.style.display = 'block';
    profBox.style.display = 'none';
  }
}

function logoutCustomer() {
  localStorage.removeItem('alnahar_user');
  window.location.reload();
}

function applyUserToCheckout() {
  const savedUser = localStorage.getItem('alnahar_user');
  if (!savedUser) return;

  const u = JSON.parse(savedUser);
  const authBtnTxt = document.getElementById('authBtnText');
  if (authBtnTxt && u.name) {
    authBtnTxt.textContent = u.name;
  }

  const nameEl = document.getElementById('custName');
  const factoryEl = document.getElementById('custFactory');
  const phoneEl = document.getElementById('custPhone');

  if (nameEl) nameEl.value = u.name || '';
  if (factoryEl) factoryEl.value = u.company ? `${u.company} - ${u.address}` : (u.address || '');
  if (phoneEl) phoneEl.value = u.phone || '';
}

// ==========================================
// التبديل بين العربية والإنجليزية
// ==========================================
function toggleLanguage() {
  const htmlTag = document.getElementById('htmlTag');
  const langBtn = document.getElementById('langToggle');

  if (currentLang === 'ar') {
    currentLang = 'en';
    htmlTag.setAttribute('lang', 'en');
    htmlTag.setAttribute('dir', 'ltr');
    langBtn.textContent = 'العربية';
  } else {
    currentLang = 'ar';
    htmlTag.setAttribute('lang', 'ar');
    htmlTag.setAttribute('dir', 'rtl');
    langBtn.textContent = 'English';
  }

  document.querySelectorAll('[data-ar][data-en]').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });

  renderFabrics();
  renderMachines();
  renderCart();
}

function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

window.addEventListener('DOMContentLoaded', () => {
  syncDataFromServer();
  renderFabrics();
  renderMachines();
  renderCart();
  applyUserToCheckout();
});