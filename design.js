// Sidebar toggle logic (works on all device sizes)
document.addEventListener("DOMContentLoaded", function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    function openSidebar() {
        sidebar.classList.add('open');
        sidebar.setAttribute('aria-hidden', 'false');
        sidebarToggle.setAttribute('aria-expanded', 'true');
        sidebarBackdrop.classList.add('active');
        document.body.classList.remove('no-sidebar'); // Show sidebar
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebar.setAttribute('aria-hidden', 'true');
        sidebarToggle.setAttribute('aria-expanded', 'false');
        sidebarBackdrop.classList.remove('active');
        document.body.classList.add('no-sidebar'); // Hide sidebar, expand chat
    }

    // On load, if window is wide, show sidebar; if not, hide it
    function setInitialSidebarState() {
        if (window.innerWidth > 700) {
            document.body.classList.remove('no-sidebar');
            sidebar.classList.remove('open');
        } else {
            document.body.classList.add('no-sidebar');
            sidebar.classList.remove('open');
        }
    }
    setInitialSidebarState();

    sidebarToggle.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Close sidebar when clicking backdrop or when resizing to desktop
    sidebarBackdrop.addEventListener('click', closeSidebar);
    window.addEventListener('resize', () => {
        if (window.innerWidth > 700) {
            closeSidebar();
            document.body.classList.remove('no-sidebar');
        } else {
            closeSidebar();
        }
    });

    // Optional: close sidebar with escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeSidebar();
    });
});