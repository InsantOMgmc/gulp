const burger = document.querySelector('.burger');
const links = document.querySelectorAll('a[href*="#"]');
const body = document.body;
const nav = document.querySelector('.header__nav');

// Sticky header
window.addEventListener('scroll', function () {
  var header = document.querySelector('.header');
  header.classList.toggle('sticky', window.scrollY > 0)
})

// Burger
burger.addEventListener('click', function () {
  this.classList.toggle('active');
  nav.classList.toggle('open');
  body.classList.toggle('lock');
});

// smooth scrolling
links.forEach(function (link) {
  link.addEventListener('click', event => {
    event.preventDefault();

    const blockId = link.getAttribute('href').substring(1);
    if (blockId) {

      document.getElementById(blockId).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      nav.classList.remove('open');
      body.classList.remove('lock');
      burger.classList.remove('active');
    }
  });

});