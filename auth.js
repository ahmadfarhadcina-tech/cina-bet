/* =========================================================
   SportX - Shared Authentication UI
   Demo authentication layer
   ========================================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "sportx_demo_user";

    /* ---------------------------------------------------------
       Get current user
    --------------------------------------------------------- */

    function getUser() {
        const rawUser = localStorage.getItem(STORAGE_KEY);

        if (!rawUser) {
            return null;
        }

        try {
            const user = JSON.parse(rawUser);

            if (!user || user.loggedIn !== true) {
                return null;
            }

            return user;

        } catch (error) {
            console.error("SportX Auth: Invalid user data.");
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    }


    /* ---------------------------------------------------------
       Check login status
    --------------------------------------------------------- */

    function isLoggedIn() {
        return getUser() !== null;
    }


    /* ---------------------------------------------------------
       Get user's display name
    --------------------------------------------------------- */

    function getDisplayName(user) {

        if (!user) {
            return "User";
        }

        if (user.name && user.name.trim()) {
            return user.name.trim();
        }

        const firstName = user.firstName
            ? user.firstName.trim()
            : "";

        const lastName = user.lastName
            ? user.lastName.trim()
            : "";

        const fullName = `${firstName} ${lastName}`.trim();

        if (fullName) {
            return fullName;
        }

        return "User";
    }


    /* ---------------------------------------------------------
       Generate initials
    --------------------------------------------------------- */

    function getInitials(name) {

        if (!name || !name.trim()) {
            return "US";
        }

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 1) {
            return words[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[1].charAt(0)
        ).toUpperCase();
    }


    /* ---------------------------------------------------------
       Format balance
    --------------------------------------------------------- */

    function formatBalance(balance) {

        let amount = Number(balance);

        if (!Number.isFinite(amount)) {
            amount = 1000;
        }

        return "AFN " + amount.toLocaleString("en-US", {
            maximumFractionDigits: 2
        });
    }


    /* ---------------------------------------------------------
       Update authentication UI
    --------------------------------------------------------- */

    function refreshAuthUI() {

        const user = getUser();

        const guestElements =
            document.querySelectorAll("[data-auth-guest]");

        const userElements =
            document.querySelectorAll("[data-auth-user]");

        const nameElements =
            document.querySelectorAll("[data-user-name]");

        const initialsElements =
            document.querySelectorAll("[data-user-initials]");

        const balanceElements =
            document.querySelectorAll("[data-user-balance]");


        /* Logged out */

        if (!user) {

            guestElements.forEach(function (element) {
                element.style.display = "";
            });

            userElements.forEach(function (element) {
                element.style.display = "none";
            });

            return;
        }


        /* Logged in */

        guestElements.forEach(function (element) {
            element.style.display = "none";
        });

        userElements.forEach(function (element) {
            element.style.display = "";
        });


        const displayName =
            getDisplayName(user);

        const initials =
            getInitials(displayName);

        const balance =
            formatBalance(user.balance);


        nameElements.forEach(function (element) {
            element.textContent = displayName;
        });

        initialsElements.forEach(function (element) {
            element.textContent = initials;
        });

        balanceElements.forEach(function (element) {
            element.textContent = balance;
        });
    }


    /* ---------------------------------------------------------
       Logout
       --------------------------------------------------------- */

    function logout() {

        localStorage.removeItem(STORAGE_KEY);

        /* Tell other SportX pages/tabs */

        window.dispatchEvent(
            new CustomEvent("sportx:authchange")
        );

        /* Return to Home */

        window.location.href = "index.html";
    }


    /* ---------------------------------------------------------
       Setup logout buttons
       --------------------------------------------------------- */

    function setupLogoutButtons() {

        const logoutButtons =
            document.querySelectorAll(
                "[data-auth-logout]"
            );

        logoutButtons.forEach(function (button) {

            /* Prevent duplicate listeners */

            if (button.dataset.authReady === "true") {
                return;
            }

            button.dataset.authReady = "true";

            button.addEventListener("click", function (event) {

                event.preventDefault();

                logout();
            });
        });
    }


    /* ---------------------------------------------------------
       Initialize
       --------------------------------------------------------- */

    function initAuth() {

        refreshAuthUI();

        setupLogoutButtons();
    }


    /* ---------------------------------------------------------
       DOM Ready
       --------------------------------------------------------- */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initAuth
        );

    } else {

        initAuth();
    }


    /* ---------------------------------------------------------
       LocalStorage changes
       --------------------------------------------------------- */

    window.addEventListener("storage", function (event) {

        if (event.key === STORAGE_KEY) {
            refreshAuthUI();
            setupLogoutButtons();
        }

    });


    /* ---------------------------------------------------------
       Internal SportX auth changes
       --------------------------------------------------------- */

    window.addEventListener(
        "sportx:authchange",
        function () {

            refreshAuthUI();
            setupLogoutButtons();

        }
    );


    /* ---------------------------------------------------------
       Public API
       --------------------------------------------------------- */

    window.SportXAuth = {

        getUser: getUser,

        isLoggedIn: isLoggedIn,

        refresh: function () {
            refreshAuthUI();
            setupLogoutButtons();
        },

        logout: logout

    };

})();
