import { searchItems } from '../data/search-data.js';

var form = document.querySelector('[data-search-form]');
var input = document.querySelector('[data-search-input]');
var results = document.querySelector('[data-search-results]');
var params = new URLSearchParams(window.location.search);

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderCard(item) {
  var tags = (item.tags || []).slice(0, 3).map(function (tag) {
    return '<span>' + escapeHtml(tag) + '</span>';
  }).join('');

  return '' +
    '<article class="movie-card" data-title="' + escapeHtml(item.title) + '">' +
      '<a class="movie-cover" href="' + escapeHtml(item.url) + '">' +
        '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + ' 在线观看" loading="lazy">' +
        '<span class="cover-shine"></span>' +
        '<span class="movie-badge">' + escapeHtml(item.type) + '</span>' +
        '<span class="play-chip">立即播放</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
        '<h2><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h2>' +
        '<p class="movie-desc">' + escapeHtml(item.summary) + '</p>' +
        '<div class="movie-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span></div>' +
        '<div class="movie-tags">' + tags + '</div>' +
        '<a class="category-pill" href="./categories.html">' + escapeHtml(item.category) + '</a>' +
      '</div>' +
    '</article>';
}

function applySearch(event) {
  if (event) {
    event.preventDefault();
  }

  var query = input ? input.value.trim().toLowerCase() : '';
  var list = searchItems.filter(function (item) {
    if (!query) {
      return true;
    }

    var text = [
      item.title,
      item.year,
      item.region,
      item.type,
      item.genre,
      item.category,
      item.summary,
      (item.tags || []).join(' ')
    ].join(' ').toLowerCase();

    return text.indexOf(query) !== -1;
  }).slice(0, 96);

  if (!results) {
    return;
  }

  if (!list.length) {
    results.innerHTML = '<div class="empty-result">没有找到匹配的影片</div>';
    return;
  }

  results.innerHTML = list.map(renderCard).join('');
}

if (input) {
  var initial = params.get('q') || '';
  input.value = initial;
  input.addEventListener('input', applySearch);
}

if (form) {
  form.addEventListener('submit', applySearch);
}

applySearch();
