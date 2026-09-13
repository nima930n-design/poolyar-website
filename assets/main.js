/**
 * Polyar - Vanilla JavaScript Utilities
 * Designed for GitHub Pages drag-and-drop deployment
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      });
    });
  }

  // 2. FAQ Accordion Handler
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('.material-symbols-outlined');
      const isHidden = content.classList.contains('hidden');

      // Close other accordions in the same container
      const parent = toggle.closest('.faq-container') || document;
      parent.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      parent.querySelectorAll('.faq-toggle .material-symbols-outlined').forEach(i => i.classList.remove('rotate-180'));

      if (isHidden) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });

  // Open first FAQ item if available
  const firstFaq = document.querySelector('.faq-toggle');
  if (firstFaq && !firstFaq.nextElementSibling.classList.contains('hidden')) {
    const icon = firstFaq.querySelector('.material-symbols-outlined');
    if (icon) icon.classList.add('rotate-180');
  }

  // 3. Telegram Order / Message Generator
  const orderForm = document.getElementById('telegramOrderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('orderName')?.value || 'کاربر گرامی';
      const phone = document.getElementById('orderPhone')?.value || 'ثبت نشده';
      const packageType = document.getElementById('orderPackage')?.value || 'نسخه اصلی پولیار';
      const note = document.getElementById('orderNote')?.value || 'بدون توضیحات';

      const message = `سلام جناب موسوی، درخواست جدید برای اپلیکیشن پولیار:
👤 نام: ${name}
📞 شماره/آیدی: ${phone}
📦 نوع درخواست: ${packageType}
📝 توضیحات: ${note}
⏰ تاریخ درخواست: ${new Date().toLocaleDateString('fa-IR')}`;

      const encodedMsg = encodeURIComponent(message);
      const telegramUrl = `https://t.me/nima_001?text=${encodedMsg}`;
      
      showToast('در حال انتقال به تلگرام...', 'success');
      setTimeout(() => {
        window.open(telegramUrl, '_blank');
      }, 700);
    });
  }

  // 4. Quick Telegram Order Buttons on Products
  document.querySelectorAll('.btn-quick-order').forEach(button => {
    button.addEventListener('click', (e) => {
      const pkg = button.getAttribute('data-package') || 'نسخه پولیار';
      const message = `سلام جناب موسوی، من مایل به دریافت و ثبت سفارش «${pkg}» هستم. لطفاً راهنمایی بفرمایید.`;
      const encodedMsg = encodeURIComponent(message);
      const telegramUrl = `https://t.me/nima_001?text=${encodedMsg}`;
      window.open(telegramUrl, '_blank');
    });
  });

  // 5. Copy to clipboard functionality
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`«${textToCopy}» در کلیپ‌بورد کپی شد`, 'success');
        }).catch(() => {
          showToast('امکان کپی خودکار فراهم نشد', 'error');
        });
      }
    });
  });

  // 6. Interactive Financial Simulator (on Products or Home Showcase)
  initInteractiveSimulator();
});

/**
 * Toast Notification system
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('polyar-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'polyar-toast-container';
    container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-primary-container text-surface-container-lowest' : 'bg-surface-container-highest text-white border border-primary/40';
  toast.className = `p-4 rounded-xl shadow-2xl flex items-center gap-3 font-label-md text-sm transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto ${bgColor}`;
  
  toast.innerHTML = `
    <span class="material-symbols-outlined text-lg">${type === 'success' ? 'check_circle' : 'info'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Remove after 3.5 seconds
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Interactive Budget Simulator for testing in browser
 */
function initInteractiveSimulator() {
  const calcIncomeBtn = document.getElementById('simAddIncome');
  const calcExpenseBtn = document.getElementById('simAddExpense');
  const calcResetBtn = document.getElementById('simReset');
  const balanceDisplay = document.getElementById('simBalance');
  const incomeDisplay = document.getElementById('simIncome');
  const expenseDisplay = document.getElementById('simExpense');
  const txList = document.getElementById('simTxList');

  if (!balanceDisplay) return;

  let totalIncome = 32000000;
  let totalExpense = 13550000;

  function updateDisplays() {
    const net = totalIncome - totalExpense;
    if (balanceDisplay) balanceDisplay.textContent = net.toLocaleString('fa-IR');
    if (incomeDisplay) incomeDisplay.textContent = '+ ' + totalIncome.toLocaleString('fa-IR');
    if (expenseDisplay) expenseDisplay.textContent = '- ' + totalExpense.toLocaleString('fa-IR');
  }

  if (calcIncomeBtn) {
    calcIncomeBtn.addEventListener('click', () => {
      const amountInput = document.getElementById('simAmount');
      const titleInput = document.getElementById('simTitle');
      const amount = parseInt(amountInput?.value || '2500000', 10);
      const title = titleInput?.value.trim() || 'درآمد جدید';

      if (isNaN(amount) || amount <= 0) {
        showToast('لطفاً مبلغ معتبری وارد کنید', 'error');
        return;
      }

      totalIncome += amount;
      updateDisplays();

      if (txList) {
        const item = document.createElement('div');
        item.className = 'p-3 rounded-xl bg-surface-container-high/60 border border-primary/20 flex items-center justify-between animate-fadeIn';
        item.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center material-symbols-outlined text-sm">arrow_downward</span>
            <div>
              <div class="text-sm font-bold text-white">${title}</div>
              <div class="text-xs text-on-surface-variant">هم‌اکنون • واریز</div>
            </div>
          </div>
          <div class="text-primary font-bold text-sm dir-ltr">+ ${amount.toLocaleString('fa-IR')} <span class="text-xs">تومان</span></div>
        `;
        txList.insertBefore(item, txList.firstChild);
      }

      showToast(`درآمد «${title}» با موفقیت افزوده شد`, 'success');
      if (titleInput) titleInput.value = '';
    });
  }

  if (calcExpenseBtn) {
    calcExpenseBtn.addEventListener('click', () => {
      const amountInput = document.getElementById('simAmount');
      const titleInput = document.getElementById('simTitle');
      const amount = parseInt(amountInput?.value || '450000', 10);
      const title = titleInput?.value.trim() || 'هزینه روزمره';

      if (isNaN(amount) || amount <= 0) {
        showToast('لطفاً مبلغ معتبری وارد کنید', 'error');
        return;
      }

      totalExpense += amount;
      updateDisplays();

      if (txList) {
        const item = document.createElement('div');
        item.className = 'p-3 rounded-xl bg-surface-container-high/60 border border-error/20 flex items-center justify-between animate-fadeIn';
        item.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-error-container/30 text-error flex items-center justify-center material-symbols-outlined text-sm">arrow_upward</span>
            <div>
              <div class="text-sm font-bold text-white">${title}</div>
              <div class="text-xs text-on-surface-variant">هم‌اکنون • خرید</div>
            </div>
          </div>
          <div class="text-error font-bold text-sm dir-ltr">- ${amount.toLocaleString('fa-IR')} <span class="text-xs">تومان</span></div>
        `;
        txList.insertBefore(item, txList.firstChild);
      }

      showToast(`هزینه «${title}» با موفقیت ثبت شد`, 'success');
      if (titleInput) titleInput.value = '';
    });
  }

  if (calcResetBtn) {
    calcResetBtn.addEventListener('click', () => {
      totalIncome = 32000000;
      totalExpense = 13550000;
      updateDisplays();
      showToast('مقادیر شبیه‌ساز بازنشانی شدند', 'info');
    });
  }
}
