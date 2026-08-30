document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("serviceSearch");
    const serviceCards = document.querySelectorAll(".service-card");
    const serviceCount = document.getElementById("serviceCount");
    const noResults = document.getElementById("noResults");

    // ==========================================
    // SEARCH SERVICES
    // ==========================================

    function searchServices() {

        const search = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let count = 0;

        serviceCards.forEach(card => {

            const title = card
                .querySelector("h3")
                .textContent
                .toLowerCase();

            const description = card
                .querySelector("p")
                .textContent
                .toLowerCase();

            const service = (
                card.dataset.service || ""
            ).toLowerCase();

            const matches =
                title.includes(search) ||
                description.includes(search) ||
                service.includes(search);

            if (matches) {

                card.style.display = "";

                count++;

            } else {

                card.style.display = "none";

            }

        });

        if (serviceCount) {
            serviceCount.textContent = `${count} Services`;
        }

        if (noResults) {

            noResults.style.display =
                count === 0 ? "block" : "none";

        }

    }


    // ==========================================
    // SEARCH EVENT
    // ==========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchServices
        );

    }


    // ==========================================
    // SERVICE CLICK
    // ==========================================

    serviceCards.forEach(card => {

        card.addEventListener("click", () => {

            const service =
                card.dataset.service;

            if (!service) {
                return;
            }

            window.location.href =
                `providers.html?service=${encodeURIComponent(service)}`;

        });

    });


    // ==========================================
    // MOBILE MENU
    // ==========================================

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "mobile-active"
                );

            }
        );

    }

});