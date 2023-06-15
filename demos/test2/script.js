document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('span.menu-icon');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelector('.menu-links');
    const user = document.querySelector('.user');

    console.log(menuIcon);

    menuIcon.addEventListener('click', function() {
        menuOverlay.style.display = menuOverlay.style.display === 'flex' ? 'none' : 'flex';
    });

    user.addEventListener('click', function() {
        const submenu = this.querySelector('.submenu');
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    });

    // Menü dışında bir yere tıklanması durumunda menünün kapanmasını sağlar
    menuOverlay.addEventListener('click', function(event) {
        if (event.target === this) {
            menuOverlay.style.display = 'none';
        }
    });

    // Menü linklerine tıklanınca menünün kapanmasını sağlar
    menuLinks.addEventListener('click', function() {
        menuOverlay.style.display = 'none';
    });
});
