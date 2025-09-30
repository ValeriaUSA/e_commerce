export default function initSubmenu() {
  document.querySelectorAll('.dropdown-submenu .dropdown-item.dropdown-toggle')
    .forEach(function (element) {
      element.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()

        let parent = this.closest('.dropdown-submenu')
        let submenu = parent.querySelector('.dropdown-menu')

        if (submenu.classList.contains('show')) {
          submenu.classList.remove('show')
          parent.classList.remove('show')
          this.setAttribute('aria-expanded', 'false')
        } else {
          submenu.classList.add('show')
          parent.classList.add('show')
          this.setAttribute('aria-expanded', 'true')
        }
      })
    })
}
