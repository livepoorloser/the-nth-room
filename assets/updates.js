(() => {
  const data = window.SITE_DATA || {};
  const section = new URLSearchParams(window.location.search).get('section') || 'training';
  const titleElement = document.getElementById('update-title');
  const summaryElement = document.getElementById('update-summary');
  const body = document.getElementById('update-body');
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const safeUrl = value => {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  };

  function renderTraining() {
    const items = data.training || [];
    const start = new Date(`${data.trainingStartWeek || '2026-11-02'}T00:00:00Z`);
    const dayMs = 24 * 60 * 60 * 1000;
    const weeks = Array.from({ length: 8 }, (_, index) => {
      const weekStart = new Date(start.getTime() + index * 7 * dayMs);
      const weekEnd = new Date(weekStart.getTime() + 6 * dayMs);
      const dateKey = weekStart.toISOString().slice(0, 10);
      const firstMonth = weekStart.getUTCMonth() + 1;
      const lastMonth = weekEnd.getUTCMonth() + 1;
      const firstYear = weekStart.getUTCFullYear();
      const lastYear = weekEnd.getUTCFullYear();
      const weekLabel = firstYear !== lastYear
        ? `${firstYear}年${firstMonth}月${weekStart.getUTCDate()}日—${lastYear}年${lastMonth}月${weekEnd.getUTCDate()}日`
        : firstMonth !== lastMonth
          ? `${firstMonth}月${weekStart.getUTCDate()}日—${lastMonth}月${weekEnd.getUTCDate()}日`
          : `${firstMonth}月${weekStart.getUTCDate()}日—${weekEnd.getUTCDate()}日`;
      return { dateKey, weekLabel, events: items.filter(item => item.weekStart === dateKey) };
    });

    body.innerHTML = `
      <div class="training-table-scroll" role="region" aria-label="每周培训安排" tabindex="0">
        <table class="training-table">
          <thead><tr><th scope="col">周次</th><th scope="col">时间</th><th scope="col">培训安排</th><th scope="col">说明</th></tr></thead>
          <tbody>${weeks.map((week, index) => `
            <tr class="${index === 0 ? 'training-current-week' : ''}">
              <th scope="row"><time datetime="${week.dateKey}">${week.weekLabel}</time>${index === 0 ? '<span class="current-week-tag">本周</span>' : ''}</th>
              <td data-label="时间">${week.events.length ? week.events.map(event => escapeHtml(event.time || '待定')).join('<br>') : '<span class="training-pending">—</span>'}</td>
              <td data-label="培训安排">${week.events.length ? week.events.map(event => `<strong>${escapeHtml(event.title)}</strong>`).join('<br>') : '<span class="training-pending">待安排</span>'}</td>
              <td data-label="说明">${week.events.length ? week.events.map(event => escapeHtml(event.description || '—')).join('<br>') : '<span class="training-pending">—</span>'}</td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
      <p class="training-table-note">安排如有调整，以实验室最新通知为准。</p>
    `;
  }

  function renderNotice() {
    const notice = data.announcement || {};
    body.innerHTML = `
      <article class="notice-page-item">
        <p>${escapeHtml(notice.label || '本周主题')}</p>
        <h2>${escapeHtml(notice.title || '本周讲解内容待更新')}</h2>
        <div>${escapeHtml(notice.body || '本周主题、讲解时间与准备事项将在这里更新。')}</div>
      </article>
    `;
  }

  function renderMaterials() {
    const share = data.share || {};
    const qq = data.qq || {};
    const shareUrl = safeUrl(share.url);
    const qqUrl = safeUrl(qq.url);
    body.innerHTML = `
      <div class="resource-layout">
        <section class="resource-column">
          <p class="section-kicker">WEEKLY FILES</p>
          <h2>${escapeHtml(share.title || '本周学习资料包')}</h2>
          <p>${escapeHtml(share.description || '教程、工程文件与练习素材')}</p>
          <span class="resource-code">${share.code ? `提取码 ${escapeHtml(share.code)}` : '提取码待更新'}</span>
          ${shareUrl ? `<a class="resource-link" href="${escapeHtml(shareUrl)}" target="_blank" rel="noreferrer">打开百度网盘 ↗</a>` : '<span class="resource-pending">网盘链接待补充</span>'}
        </section>
        <section class="resource-column" id="qq">
          <p class="section-kicker">COMMUNITY</p>
          <h2>QQ群交流</h2>
          <p>${qq.number ? `QQ群 ${escapeHtml(qq.number)}` : 'QQ群号待填写'}</p>
          ${qqUrl ? `<a class="resource-link" href="${escapeHtml(qqUrl)}" target="_blank" rel="noreferrer">加入QQ群 ↗</a>` : '<span class="resource-pending">加群链接待补充</span>'}
        </section>
      </div>
    `;
  }

  const pages = {
    training: { title: '近期培训安排', summary: '实验室培训日程与报名信息。', render: renderTraining },
    notice: { title: '每周讲解公告', summary: '本周讲解主题、时间与准备事项。', render: renderNotice },
    materials: { title: '每周网盘资料', summary: '每周讲解配套资料与实验室交流入口。', render: renderMaterials }
  };
  const pageKey = Object.hasOwn(pages, section) ? section : 'training';
  const page = pages[pageKey];
  document.title = `${page.title} | 第N实验室`;
  titleElement.textContent = page.title;
  summaryElement.textContent = page.summary;
  document.querySelector(`[data-update-nav="${pageKey}"]`)?.setAttribute('aria-current', 'location');
  page.render();
  if (window.location.hash === '#qq') document.getElementById('qq')?.scrollIntoView({ block: 'start' });
})();
