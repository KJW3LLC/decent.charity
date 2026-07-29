// Search and Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const guideCards = document.querySelectorAll('.guide-card');
    const noResults = document.getElementById('no-results');

    let currentCategory = 'all';
    let currentSearchTerm = '';

    // Filter by charity category
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Get selected category
                currentCategory = this.dataset.category;

                // Apply filters
                applyFilters();
            });
        });
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearchTerm = this.value.toLowerCase();
            applyFilters();
        });
    }

    // Apply all active filters
    function applyFilters() {
        let visibleCount = 0;

        guideCards.forEach(card => {
            const category = card.dataset.category;
            const title = card.dataset.title;
            const description = card.dataset.description;
            const tags = card.dataset.tags.toLowerCase();

            // Check category filter
            const matchesCategory = currentCategory === 'all' || category === currentCategory;

            // Check search filter
            const matchesSearch = currentSearchTerm === '' ||
                                title.includes(currentSearchTerm) ||
                                description.includes(currentSearchTerm) ||
                                tags.includes(currentSearchTerm);

            // Show or hide card
            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    applyFilters();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
