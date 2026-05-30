// Sidebar toggle (only present on sub-pages)
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.sidebar-toggle');

// Load nav.html into all pages
const navPath = location.pathname.includes("/projects/")
  ? "../components/nav.html"
  : "components/nav.html";

fetch(navPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById("nav-placeholder").innerHTML = data;

    const toggleTheme = document.getElementById('theme-toggle');

    // Apply saved theme on load 
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.documentElement.classList.add("light");
        toggleTheme.textContent = "🌙"; 
    }

    // Toggle light/dark theme
    if (toggleTheme) {
        toggleTheme.addEventListener('click', () => {
            document.documentElement.classList.toggle('light');
            toggleTheme.classList.toggle('active');
            
            // Optional: change icon 
            const isLight = document.documentElement.classList.contains('light'); 
            toggleTheme.textContent = isLight ? "🌙" : "☀️";

            // Save preference
            localStorage.setItem("theme", isLight ? "light" : "dark");
        });
    }

    // Rewrite the releative paths due to folder depth differences between index.html and project pages
    if (location.pathname.includes("/projects/")) {
    document.querySelectorAll("nav a").forEach(link => {
        const href = link.getAttribute("href");

        // Only rewrite relative links, not external URLs
        if (!href.startsWith("http") && !href.startsWith("#")) {
            link.setAttribute("href", "../" + href);
        }
    });
}

  });



if (sidebar && toggle) {
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        toggle.classList.toggle('active');
    });
}

// Smooth scrolling for internal anchors
document.querySelectorAll('a[href^="#"]').forEach( () => {
    anchor.addEventListener("click", () => {
        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
    });
});





