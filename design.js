// Sidebar toggle logic (works on all device sizes)
document.addEventListener("DOMContentLoaded", function() {
    const sidebarCard = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarFab = document.getElementById('sidebar-fab');

    function updateSidebarToggleIcon() {
        sidebarToggle.textContent = '←';
        sidebarFab.textContent = '→';
    }

    function openSidebar() {
        sidebarCard.classList.add('open');
        document.body.classList.remove('no-sidebar');
        sidebarToggle.style.display = 'flex';
        sidebarFab.style.display = 'none';
    }

    function closeSidebar() {
        sidebarCard.classList.remove('open');
        document.body.classList.add('no-sidebar');
        sidebarToggle.style.display = 'none';
        sidebarFab.style.display = 'flex';
    }

    // On load, always start with sidebar closed
    function setInitialSidebarState() {
        closeSidebar();
        updateSidebarToggleIcon();
    }
    setInitialSidebarState();

    sidebarToggle.addEventListener('click', closeSidebar);
    sidebarFab.addEventListener('click', openSidebar);

    // Optional: close sidebar with escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeSidebar();
    });
});