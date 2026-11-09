// Old GitHub Pages address → new home, keeping the page path.
(function () {
  if (location.hostname === 'drakeion2532.github.io') {
    location.replace('https://shubhanpunde.vercel.app' + location.pathname.replace(/^\/shubhanpunde\.github\.io/, '') + location.search + location.hash);
  }
})();
