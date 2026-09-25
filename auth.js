/* =========================================================
   SPORTX — GLOBAL SUPABASE AUTH
   Real session based authentication
   Global language + Google Translate support
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       SUPABASE CONFIG
       ===================================================== */

    const SUPABASE_URL =
        "https://zchtcosljkkkiykhforj.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_aGLckKZjNaVbpdxZUFhCqA_VzHppjrW";


    /* =====================================================
       GLOBAL SPORTX LANGUAGE
       ===================================================== */

    const SPORTX_LANGUAGE_KEY =
        "sportx_language";


    const SPORTX_LANGUAGES = {
        en: "English",
        fa: "Persian",
        ps: "Pashto",
        tr: "Turkish",
        ar: "Arabic"
    };


    /* =====================================================
       GET SAVED LANGUAGE
       ===================================================== */

    function getSavedLanguage() {

        try {

            const language =
                localStorage.getItem(
                    SPORTX_LANGUAGE_KEY
                );

            if (
                language &&
                SPORTX_LANGUAGES[language]
            ) {

                return language;

            }

        }
        catch (error) {

            console.warn(
                "SportX language read error:",
                error
            );

        }

        return "en";

    }


    /* =====================================================
       SET GOOGLE TRANSLATE COOKIE
       ===================================================== */

    function setGoogleTranslateCookie(
        language
    ) {

        try {

            const lang =
                language || "en";


            const value =
                "/en/" + lang;


            document.cookie =
                "googtrans=" +
                encodeURIComponent(value) +
                "; path=/";


            /*
               GitHub Pages can sometimes behave
               differently with domain cookies.
            */

            const hostname =
                window.location.hostname;


            if (
                hostname &&
                hostname !== "localhost" &&
                hostname !== "127.0.0.1"
            ) {

                document.cookie =
                    "googtrans=" +
                    encodeURIComponent(value) +
                    "; path=/; domain=" +
                    hostname;

            }

        }
        catch (error) {

            console.warn(
                "SportX Google Translate cookie error:",
                error
            );

        }

    }


    /* =====================================================
       APPLY SAVED LANGUAGE BEFORE TRANSLATION
       ===================================================== */

    const initialLanguage =
        getSavedLanguage();


    setGoogleTranslateCookie(
        initialLanguage
    );


    /* =====================================================
       GOOGLE TRANSLATE UI CSS
       ===================================================== */

    function installGoogleTranslateCSS() {

        if (
            document.getElementById(
                "sportx-google-translate-style"
            )
        ) {

            return;

        }


        const style =
            document.createElement("style");


        style.id =
            "sportx-google-translate-style";


        style.textContent = `

            /* Google Translate top banner */

            .goog-te-banner-frame,
            .goog-te-balloon-frame,
            .goog-te-menu-frame,
            .goog-te-spinner-pos,
            iframe.goog-te-banner-frame {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                width: 0 !important;
            }


            /* Google Translate tooltip */

            .goog-tooltip,
            #goog-gt-tt {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }


            /* Google Translate gadget */

            .goog-te-gadget,
            .goog-te-gadget-simple {
                display: none !important;
                visibility: hidden !important;
            }


            /* Google injected body offset */

            body {
                top: 0 !important;
            }


            html {
                margin-top: 0 !important;
            }


            body > .skiptranslate {
                display: none !important;
            }


            /*
               Hide the Google Translate
               bottom/feedback elements.
            */

            .goog-te-ftab,
            .goog-te-ftab-float,
            .goog-te-combo {
                display: none !important;
            }

        `;


        (
            document.head ||
            document.documentElement
        ).appendChild(style);

    }


    /* =====================================================
       REMOVE GOOGLE TRANSLATE UI
       ===================================================== */

    function hideGoogleTranslateUI() {

        const selectors = [

            ".goog-te-banner-frame",
            ".goog-te-balloon-frame",
            ".goog-tooltip",
            ".goog-te-spinner-pos",
            ".goog-te-menu-frame",
            "#goog-gt-tt",
            ".goog-te-gadget",
            ".goog-te-gadget-simple",
            ".goog-te-ftab",
            ".goog-te-ftab-float",
            ".goog-te-combo",
            "iframe.goog-te-banner-frame"

        ];


        selectors.forEach(
            selector => {

                document
                .querySelectorAll(selector)
                .forEach(element => {

                    element.style.display =
                        "none";

                    element.style.visibility =
                        "hidden";

                    element.style.opacity =
                        "0";

                    element.style.pointerEvents =
                        "none";

                });

            }
        );


        if (document.body) {

            document.body.style.top =
                "0px";

        }


        document.documentElement.style.marginTop =
            "0px";

    }


    /* =====================================================
       GOOGLE TRANSLATE OBSERVER
       ===================================================== */

    function startGoogleTranslateObserver() {

        if (
            window.SportXGoogleTranslateObserver
        ) {

            return;

        }


        if (!document.documentElement) {

            return;

        }


        const observer =
            new MutationObserver(
                function () {

                    hideGoogleTranslateUI();

                }
            );


        observer.observe(
            document.documentElement,
            {
                childList: true,
                subtree: true
            }
        );


        window.SportXGoogleTranslateObserver =
            observer;


        hideGoogleTranslateUI();

    }


    /* =====================================================
       GOOGLE TRANSLATE INITIALIZER
       ===================================================== */

    let googleTranslateStarted =
        false;


    function googleTranslateElementInit() {

        if (
            googleTranslateStarted
        ) {

            hideGoogleTranslateUI();

            return;

        }


        googleTranslateStarted =
            true;


        try {

            if (
                !window.google ||
                !window.google.translate ||
                typeof
                window.google.translate.TranslateElement
                !== "function"
            ) {

                return;

            }


            let container =
                document.getElementById(
                    "google_translate_element"
                );


            if (!container) {

                container =
                    document.createElement("div");


                container.id =
                    "google_translate_element";


                container.setAttribute(
                    "aria-hidden",
                    "true"
                );


                container.style.position =
                    "fixed";

                container.style.left =
                    "-99999px";

                container.style.top =
                    "-99999px";

                container.style.width =
                    "1px";

                container.style.height =
                    "1px";

                container.style.overflow =
                    "hidden";


                document.body.appendChild(
                    container
                );

            }


            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",

                    includedLanguages:
                        "en,fa,ps,tr,ar",

                    autoDisplay: false,

                    multilanguagePage: true
                },
                "google_translate_element"
            );


            setTimeout(
                hideGoogleTranslateUI,
                100
            );


            setTimeout(
                hideGoogleTranslateUI,
                500
            );


            setTimeout(
                hideGoogleTranslateUI,
                1500
            );


        }
        catch (error) {

            console.warn(
                "SportX Google Translate initialization:",
                error
            );

        }

    }


    /* =====================================================
       EXPOSE GOOGLE CALLBACK
       ===================================================== */

    window.googleTranslateElementInit =
        googleTranslateElementInit;


    /* =====================================================
       LOAD GOOGLE TRANSLATE
       ===================================================== */

    function loadGoogleTranslate() {

        installGoogleTranslateCSS();

        startGoogleTranslateObserver();


        /*
           Do not load Google Translate twice.
        */

        if (
            window.SportXGoogleTranslateLoading ||
            window.SportXGoogleTranslateLoaded
        ) {

            return;

        }


        if (
            window.google &&
            window.google.translate
        ) {

            window.SportXGoogleTranslateLoaded =
                true;


            googleTranslateElementInit();

            return;

        }


        const existingScript =
            document.querySelector(
                'script[src*="translate.google.com/translate_a/element.js"]'
            );


        if (existingScript) {

            window.SportXGoogleTranslateLoading =
                true;


            existingScript.addEventListener(
                "load",
                function () {

                    window.SportXGoogleTranslateLoading =
                        false;

                    window.SportXGoogleTranslateLoaded =
                        true;

                    googleTranslateElementInit();

                },
                { once: true }
            );


            return;

        }


        window.SportXGoogleTranslateLoading =
            true;


        const script =
            document.createElement("script");


        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";


        script.async =
            true;


        script.onload =
            function () {

                window.SportXGoogleTranslateLoading =
                    false;

                window.SportXGoogleTranslateLoaded =
                    true;

                googleTranslateElementInit();

            };


        script.onerror =
            function () {

                window.SportXGoogleTranslateLoading =
                    false;

                console.warn(
                    "SportX Google Translate could not be loaded."
                );

            };


        document.head.appendChild(
            script
        );

    }


    /* =====================================================
       START LANGUAGE SYSTEM
       ===================================================== */

    function initSportXLanguage() {

        installGoogleTranslateCSS();

        startGoogleTranslateObserver();

        loadGoogleTranslate();

    }


    /* =====================================================
       PUBLIC LANGUAGE API
       ===================================================== */

    window.SportXLanguage = {

        key:
            SPORTX_LANGUAGE_KEY,


        languages:
            SPORTX_LANGUAGES,


        get:
            function () {

                return getSavedLanguage();

            },


        set:
            function (language) {

                if (
                    !SPORTX_LANGUAGES[language]
                ) {

                    language =
                        "en";

                }


                try {

                    localStorage.setItem(
                        SPORTX_LANGUAGE_KEY,
                        language
                    );

                }
                catch (error) {

                    console.warn(
                        "SportX language save error:",
                        error
                    );

                }


                setGoogleTranslateCookie(
                    language
                );


                return language;

            },


        apply:
            function (language) {

                const selected =
                    this.set(
                        language
                    );


                /*
                   Reloading makes Google Translate
                   read the new cookie cleanly.
                */

                window.location.reload();

                return selected;

            }

    };


    /* =====================================================
       LOAD SUPABASE IF NOT ALREADY LOADED
       ===================================================== */

    function loadSupabase() {

        return new Promise(
            (resolve, reject) => {

                if (
                    window.supabase &&
                    typeof
                    window.supabase.createClient
                    === "function"
                ) {

                    resolve();

                    return;

                }


                const existing =
                    document.querySelector(
                        'script[src*="supabase-js"]'
                    );


                if (existing) {

                    if (
                        window.supabase &&
                        typeof
                        window.supabase.createClient
                        === "function"
                    ) {

                        resolve();

                        return;

                    }


                    existing.addEventListener(
                        "load",
                        function () {

                            resolve();

                        },
                        {
                            once: true
                        }
                    );


                    existing.addEventListener(
                        "error",
                        function (error) {

                            reject(error);

                        },
                        {
                            once: true
                        }
                    );


                    return;

                }


                const script =
                    document.createElement(
                        "script"
                    );


                script.src =
                    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


                script.async =
                    true;


                script.onload =
                    function () {

                        resolve();

                    };


                script.onerror =
                    function () {

                        reject(
                            new Error(
                                "Unable to load Supabase."
                            )
                        );

                    };


                document.head.appendChild(
                    script
                );

            }
        );

    }


    /* =====================================================
       MAIN AUTH INITIALIZATION
       ===================================================== */

    async function initSportXAuth() {

        try {

            await loadSupabase();


            const supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );


            window.SportXSupabase =
                supabaseClient;


            /* =============================================
               DOM ELEMENTS
               ============================================= */

            const guestElements =
                document.querySelectorAll(
                    "[data-auth-guest]"
                );


            const userElements =
                document.querySelectorAll(
                    "[data-auth-user]"
                );


            const logoutButtons =
                document.querySelectorAll(
                    "[data-auth-logout]"
                );


            const nameElements =
                document.querySelectorAll(
                    "[data-user-name]"
                );


            const balanceElements =
                document.querySelectorAll(
                    "[data-user-balance]"
                );


            const initialsElements =
                document.querySelectorAll(
                    "[data-user-initials]"
                );


            /* =============================================
               HELPER — SHOW GUEST
               ============================================= */

            function showGuest() {

                guestElements.forEach(
                    element => {

                        element.style.display =
                            "";

                    }
                );


                userElements.forEach(
                    element => {

                        element.style.display =
                            "none";

                    }
                );

            }


            /* =============================================
               HELPER — SHOW USER
               ============================================= */

            function showUser() {

                guestElements.forEach(
                    element => {

                        element.style.display =
                            "none";

                    }
                );


                userElements.forEach(
                    element => {

                        element.style.display =
                            "";

                    }
                );

            }


            /* =============================================
               GET USER PROFILE
               ============================================= */

            async function getUserProfile(userId) {

                try {

                    const result =
                        await supabaseClient
                        .from("users")
                        .select(`
                            id,
                            first_name,
                            last_name,
                            email,
                            balance,
                            status
                        `)
                        .eq("id", userId)
                        .maybeSingle();


                    if (result.error) {

                        console.warn(
                            "SportX profile query:",
                            result.error
                        );

                        return null;

                    }


                    return result.data || null;

                }
                catch (error) {

                    console.warn(
                        "SportX profile error:",
                        error
                    );

                    return null;

                }

            }


            /* =============================================
               GET WALLET
               ============================================= */

            async function getWallet(userId) {

                try {

                    const result =
                        await supabaseClient
                        .from("wallets")
                        .select(`
                            balance,
                            currency
                        `)
                        .eq("user_id", userId)
                        .maybeSingle();


                    if (result.error) {

                        console.warn(
                            "SportX wallet query:",
                            result.error
                        );

                        return null;

                    }


                    return result.data || null;

                }
                catch (error) {

                    console.warn(
                        "SportX wallet error:",
                        error
                    );

                    return null;

                }

            }


            /* =============================================
               FORMAT BALANCE
               ============================================= */

            function formatBalance(
                balance,
                currency
            ) {

                const amount =
                    Number(balance || 0);


                const formatted =
                    amount.toLocaleString(
                        "en-US",
                        {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                        }
                    );


                return (
                    String(
                        currency || "AFN"
                    ) +
                    " " +
                    formatted
                );

            }


            /* =============================================
               UPDATE UI
               ============================================= */

            async function updateUserUI(user) {

                if (!user) {

                    showGuest();

                    return;

                }


                showUser();


                let profile =
                    await getUserProfile(
                        user.id
                    );


                let wallet =
                    await getWallet(
                        user.id
                    );


                /* -----------------------------------------
                   NAME
                   ----------------------------------------- */

                let firstName =
                    profile &&
                    profile.first_name
                        ? profile.first_name.trim()
                        : "";


                let lastName =
                    profile &&
                    profile.last_name
                        ? profile.last_name.trim()
                        : "";


                let fullName =
                    (
                        firstName +
                        " " +
                        lastName
                    ).trim();


                if (!fullName) {

                    fullName =
                        user.user_metadata &&
                        (
                            user.user_metadata.first_name ||
                            user.user_metadata.full_name
                        )
                            ? (
                                user.user_metadata.first_name ||
                                user.user_metadata.full_name
                            )
                            : "";

                }


                if (!fullName) {

                    fullName =
                        user.email ||
                        "SportX User";

                }


                /* -----------------------------------------
                   INITIALS
                   ----------------------------------------- */

                let initials =
                    "";


                if (firstName) {

                    initials +=
                        firstName
                        .charAt(0)
                        .toUpperCase();

                }


                if (lastName) {

                    initials +=
                        lastName
                        .charAt(0)
                        .toUpperCase();

                }


                if (!initials) {

                    initials =
                        fullName
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map(
                            word =>
                                word
                                .charAt(0)
                                .toUpperCase()
                        )
                        .join("");

                }


                if (!initials) {

                    initials =
                        "SX";

                }


                /* -----------------------------------------
                   BALANCE
                   ----------------------------------------- */

                let balance =
                    wallet
                        ? wallet.balance
                        : (
                            profile
                                ? profile.balance
                                : 0
                        );


                let currency =
                    wallet &&
                    wallet.currency
                        ? wallet.currency
                        : "AFN";


                /* -----------------------------------------
                   UPDATE NAME
                   ----------------------------------------- */

                nameElements.forEach(
                    element => {

                        element.textContent =
                            fullName;

                    }
                );


                /* -----------------------------------------
                   UPDATE INITIALS
                   ----------------------------------------- */

                initialsElements.forEach(
                    element => {

                        element.textContent =
                            initials;

                    }
                );


                /* -----------------------------------------
                   UPDATE BALANCE
                   ----------------------------------------- */

                balanceElements.forEach(
                    element => {

                        element.textContent =
                            formatBalance(
                                balance,
                                currency
                            );

                    }
                );

            }


            /* =============================================
               LOGOUT
               ============================================= */

            logoutButtons.forEach(
                button => {

                    /*
                       Prevent duplicate listeners.
                    */

                    if (
                        button.dataset.sportxLogoutBound
                    ) {

                        return;

                    }


                    button.dataset.sportxLogoutBound =
                        "true";


                    button.addEventListener(
                        "click",
                        async event => {

                            event.preventDefault();


                            button.disabled =
                                true;


                            try {

                                const {
                                    error
                                } =
                                    await supabaseClient
                                    .auth
                                    .signOut();


                                if (error) {

                                    console.error(
                                        "SportX logout:",
                                        error
                                    );


                                    button.disabled =
                                        false;


                                    return;

                                }


                                /*
                                   Remove ONLY old
                                   fake demo session.
                                */

                                localStorage.removeItem(
                                    "sportx_demo_user"
                                );


                                window.location.replace(
                                    "login.html"
                                );

                            }
                            catch (error) {

                                console.error(
                                    "SportX logout error:",
                                    error
                                );


                                button.disabled =
                                    false;

                            }

                        }
                    );

                }
            );


            /* =============================================
               INITIAL SESSION
               ============================================= */

            const {
                data,
                error
            } =
                await supabaseClient
                .auth
                .getSession();


            if (error) {

                console.error(
                    "SportX session error:",
                    error
                );


                showGuest();

            }
            else {

                await updateUserUI(
                    data &&
                    data.session
                        ? data.session.user
                        : null
                );

            }


            /* =============================================
               AUTH STATE LISTENER
               ============================================= */

            if (
                !window.SportXAuthListenerStarted
            ) {

                window.SportXAuthListenerStarted =
                    true;


                supabaseClient
                .auth
                .onAuthStateChange(
                    async (
                        event,
                        session
                    ) => {

                        console.log(
                            "SportX Auth:",
                            event
                        );


                        await updateUserUI(
                            session
                                ? session.user
                                : null
                        );

                    }
                );

            }

        }
        catch (error) {

            console.error(
                "SportX Auth initialization failed:",
                error
            );


            /*
               If authentication cannot initialize,
               show guest state instead of redirecting
               endlessly between pages.
            */

            document
            .querySelectorAll(
                "[data-auth-guest]"
            )
            .forEach(
                element => {

                    element.style.display =
                        "";

                }
            );


            document
            .querySelectorAll(
                "[data-auth-user]"
            )
            .forEach(
                element => {

                    element.style.display =
                        "none";

                }
            );

        }

    }


    /* =====================================================
       START LANGUAGE SYSTEM IMMEDIATELY
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                initSportXLanguage();

            },
            {
                once: true
            }
        );

    }
    else {

        initSportXLanguage();

    }


    /* =====================================================
       START AUTH
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initSportXAuth,
            {
                once: true
            }
        );

    }
    else {

        initSportXAuth();

    }


})();
