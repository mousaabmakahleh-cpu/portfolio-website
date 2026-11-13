// Runs synchronously in <head> so the correct theme is applied before first paint.
(function () {
    var theme = null;
    try { theme = localStorage.getItem('theme'); } catch (e) { }
    if (theme !== 'light' && theme !== 'dark') {
        theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.add('js');
})();
