(() => {
  const list = document.getElementById('home-events');
  if (!list) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const events = (window.SITE_DATA?.training || [])
    .filter(event => event && event.weekStart && event.title)
    .map(event => ({ ...event, weekDate: new Date(`${event.weekStart}T00:00:00`) }))
    .filter(event => !Number.isNaN(event.weekDate.getTime()))
    .filter(event => {
      const weekEnd = new Date(event.weekDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return weekEnd >= today;
    })
    .sort((a, b) => a.weekDate - b.weekDate)
    .slice(0, 3);

  list.replaceChildren();
  if (!events.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-note';
    empty.textContent = '近期暂无已确认的培训安排。';
    list.append(empty);
    return;
  }

  for (const event of events) {
    const row = document.createElement('article');
    row.className = 'home-event';

    const date = document.createElement('p');
    date.className = 'home-event-time';
    date.textContent = event.time || '时间待通知';

    const title = document.createElement('h3');
    title.textContent = event.title;

    const description = document.createElement('p');
    description.className = 'home-event-description';
    description.textContent = event.description || '活动说明待更新。';

    row.append(date, title, description);
    list.append(row);
  }
})();
