document.addEventListener("DOMContentLoaded", () => {
    const providersGrid =
        document.getElementById("providersGrid");

    const providerCards =
        document.querySelectorAll(".provider-card");

    const providerSearch =
        document.getElementById("providerSearch");

    const locationFilter =
        document.getElementById("locationFilter");

    const ratingFilter =
        document.getElementById("ratingFilter");

    const resetFilters =
        document.getElementById("resetFilters");

    const resultsCount =
        document.getElementById("resultsCount");

    const noResults =
        document.getElementById("noResults");

    const breadcrumbService =
        document.getElementById("breadcrumbService");

    const serviceBadge =
        document.getElementById("serviceBadge");

    const serviceTitle =
        document.getElementById("serviceTitle");

    const headingService =
        document.getElementById("headingService");


    /* =========================================
       GET SERVICE FROM URL
    ========================================= */

    const params =
        new URLSearchParams(window.location.search);

    let selectedService =
        params.get("service");


    if (selectedService) {

        selectedService =
            decodeURIComponent(selectedService)
                .toLowerCase()
                .trim()
                .replace(/-/g, " ");

    }


    console.log(
        "Selected Service:",
        selectedService
    );


    /* =========================================
       FORMAT SERVICE NAME
    ========================================= */

    function formatServiceName(service) {

        if (!service) {
            return "Professionals";
        }

        return service
            .split(" ")
            .map(word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
            )
            .join(" ");

    }


    /* =========================================
       UPDATE SERVICE UI
    ========================================= */

    function updateServiceUI() {

        const formattedService =
            formatServiceName(selectedService);


        if (selectedService) {

            breadcrumbService.textContent =
                formattedService;

            serviceBadge.textContent =
                formattedService;

            serviceTitle.textContent =
                formattedService;

            headingService.textContent =
                formattedService;

            document.title =
                `QuickServe | ${formattedService} Providers`;

        } else {

            breadcrumbService.textContent =
                "Providers";

            serviceBadge.textContent =
                "All Services";

            serviceTitle.textContent =
                "professional";

            headingService.textContent =
                "Professionals";

        }

    }


    /* =========================================
       FILTER PROVIDERS
    ========================================= */

    function filterProviders() {

        const search =
            providerSearch
                ? providerSearch.value
                    .trim()
                    .toLowerCase()
                : "";

        const location =
            locationFilter
                ? locationFilter.value.toLowerCase()
                : "all";

        const rating =
            ratingFilter
                ? ratingFilter.value
                : "all";


        let visibleCount = 0;


        providerCards.forEach(card => {

            const cardService =
                (card.dataset.service || "")
                    .toLowerCase()
                    .trim();


            const cardName =
                (card.dataset.name || "")
                    .toLowerCase();


            const cardLocation =
                (card.dataset.location || "")
                    .toLowerCase();


            const cardRating =
                parseFloat(
                    card.dataset.rating || "0"
                );


            const cardSkill =
                (card.dataset.skill || "")
                    .toLowerCase();


            /* -----------------------------------------
               SERVICE MATCH
            ----------------------------------------- */

            let serviceMatch = true;

            if (selectedService) {

                serviceMatch =
                    cardService === selectedService;

            }


            /* -----------------------------------------
               SEARCH MATCH
            ----------------------------------------- */

            let searchMatch = true;

            if (search) {

                searchMatch =
                    cardName.includes(search) ||
                    cardSkill.includes(search) ||
                    cardService.includes(search);

            }


            /* -----------------------------------------
               LOCATION MATCH
            ----------------------------------------- */

            let locationMatch = true;

            if (location !== "all") {

                locationMatch =
                    cardLocation === location;

            }


            /* -----------------------------------------
               RATING MATCH
            ----------------------------------------- */

            let ratingMatch = true;

            if (rating !== "all") {

                ratingMatch =
                    cardRating >=
                    parseFloat(rating);

            }


            /* -----------------------------------------
               FINAL MATCH
            ----------------------------------------- */

            const show =
                serviceMatch &&
                searchMatch &&
                locationMatch &&
                ratingMatch;


            if (show) {

                card.style.display = "";
                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        /* =========================================
           UPDATE COUNT
        ========================================= */

        if (resultsCount) {

            resultsCount.textContent =
                visibleCount;

        }


        /* =========================================
           NO RESULTS
        ========================================= */

        if (noResults) {

            noResults.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";

        }

    }


    /* =========================================
       SEARCH
    ========================================= */

    if (providerSearch) {

        providerSearch.addEventListener(
            "input",
            filterProviders
        );

    }


    /* =========================================
       LOCATION
    ========================================= */

    if (locationFilter) {

        locationFilter.addEventListener(
            "change",
            filterProviders
        );

    }


    /* =========================================
       RATING
    ========================================= */

    if (ratingFilter) {

        ratingFilter.addEventListener(
            "change",
            filterProviders
        );

    }


    /* =========================================
       RESET
    ========================================= */

    if (resetFilters) {

        resetFilters.addEventListener(
            "click",
            () => {

                if (providerSearch) {
                    providerSearch.value = "";
                }

                if (locationFilter) {
                    locationFilter.value = "all";
                }

                if (ratingFilter) {
                    ratingFilter.value = "all";
                }

                filterProviders();

            }
        );

    }


    /* =========================================
       VIEW PROVIDER PROFILE
    ========================================= */

    const profileButtons =
        document.querySelectorAll(".profile-btn");


    profileButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const provider =
                    button.dataset.provider;

                if (!provider) {
                    return;
                }


                console.log(
                    "Selected Provider:",
                    provider
                );


                window.location.href =
                    `providers-profile.html?provider=${encodeURIComponent(provider)}`;

            }
        );

    });


    /* =========================================
       MOBILE MENU
    ========================================= */

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.querySelector(".nav-links");


    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "show"
                );

            }
        );

    }


    /* =========================================
       INITIALIZE
    ========================================= */

    updateServiceUI();

    filterProviders();


    console.log(
        "QuickServe Providers Loaded"
    );

});