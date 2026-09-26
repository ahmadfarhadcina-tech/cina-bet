(function () {

    "use strict";

    const SUPABASE_URL =
        "https://zchtcosljkkkiykhforj.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_aGLckKZjNaVbpdxZUFhCqA_VzHppjrW";

    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyBep2khsSd8ynLg2gEG1sxxoLMug632emA",
        authDomain: "sportx-36865.firebaseapp.com",
        projectId: "sportx-36865",
        storageBucket: "sportx-36865.firebasestorage.app",
        messagingSenderId: "397751189949",
        appId: "1:397751189949:web:9c82fac60e20c3c1ca52d4",
        measurementId: "G-XXH0H2MMHD"
    };

    const SPORTX_LANGUAGE_KEY =
        "sportx_language";

    const SPORTX_LANGUAGES = {
        en: "English",
        fa: "Persian",
        ps: "Pashto",
        tr: "Turkish",
        ar: "Arabic"
    };

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

    function setGoogleTranslateCookie(language) {

        try {

            const lang =
                language || "en";

            const value =
                "/en/" + lang;

            document.cookie =
                "googtrans=" +
                encodeURIComponent(value) +
                "; path=/";

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

    const initialLanguage =
        getSavedLanguage();

    setGoogleTranslateCookie(
        initialLanguage
    );

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

            .goog-te-banner-frame,
            .goog-te-balloon-frame,
            .goog-te-menu-frame,
            .goog-te-spinner-pos,
            iframe.goog-te-banner-frame {
                display:none !important;
                visibility:hidden !important;
                opacity:0 !important;
                height:0 !important;
                width:0 !important;
            }

            .goog-tooltip,
            #goog-gt-tt {
                display:none !important;
                visibility:hidden !important;
                opacity:0 !important;
            }

            .goog-te-gadget,
            .goog-te-gadget-simple {
                display:none !important;
                visibility:hidden !important;
            }

            body {
                top:0 !important;
            }

            html {
                margin-top:0 !important;
            }

            body > .skiptranslate {
                display:none !important;
            }

            .goog-te-ftab,
            .goog-te-ftab-float,
            .goog-te-combo {
                display:none !important;
            }

        `;

        (
            document.head ||
            document.documentElement
        ).appendChild(style);

    }

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

    window.googleTranslateElementInit =
        googleTranslateElementInit;

    function loadGoogleTranslate() {

        installGoogleTranslateCSS();

        startGoogleTranslateObserver();

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

    function initSportXLanguage() {

        installGoogleTranslateCSS();

        startGoogleTranslateObserver();

        loadGoogleTranslate();

    }

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

                window.location.reload();

                return selected;

            }

    };

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
                    document.createElement("script");

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

    function loadFirebase() {

        return new Promise(
            (resolve, reject) => {

                if (
                    window.firebase &&
                    typeof
                    window.firebase.initializeApp
                    === "function" &&
                    typeof
                    window.firebase.auth
                    === "function"
                ) {

                    resolve();

                    return;

                }

                const appScript =
                    document.querySelector(
                        'script[src*="firebase-app-compat.js"]'
                    );

                const authScript =
                    document.querySelector(
                        'script[src*="firebase-auth-compat.js"]'
                    );

                let appLoaded =
                    !!appScript;

                let authLoaded =
                    !!authScript;

                function check() {

                    if (
                        window.firebase &&
                        typeof
                        window.firebase.initializeApp
                        === "function" &&
                        typeof
                        window.firebase.auth
                        === "function"
                    ) {

                        resolve();

                    }

                }

                if (appScript) {

                    appScript.addEventListener(
                        "load",
                        function () {

                            appLoaded =
                                true;

                            check();

                        },
                        {
                            once: true
                        }
                    );

                    appScript.addEventListener(
                        "error",
                        reject,
                        {
                            once: true
                        }
                    );

                }

                if (authScript) {

                    authScript.addEventListener(
                        "load",
                        function () {

                            authLoaded =
                                true;

                            check();

                        },
                        {
                            once: true
                        }
                    );

                    authScript.addEventListener(
                        "error",
                        reject,
                        {
                            once: true
                        }
                    );

                }

                if (!appScript) {

                    const script =
                        document.createElement("script");

                    script.src =
                        "https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js";

                    script.onload =
                        function () {

                            appLoaded =
                                true;

                            check();

                        };

                    script.onerror =
                        reject;

                    document.head.appendChild(
                        script
                    );

                }

                if (!authScript) {

                    const script =
                        document.createElement("script");

                    script.src =
                        "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js";

                    script.onload =
                        function () {

                            authLoaded =
                                true;

                            check();

                        };

                    script.onerror =
                        reject;

                    document.head.appendChild(
                        script
                    );

                }

                if (
                    appLoaded &&
                    authLoaded
                ) {

                    check();

                }

                setTimeout(
                    function () {

                        if (
                            !window.firebase ||
                            typeof
                            window.firebase.auth
                            !== "function"
                        ) {

                            reject(
                                new Error(
                                    "Unable to load Firebase."
                                )
                            );

                        }

                    },
                    10000
                );

            }
        );

    }

    async function initFirebase() {

        await loadFirebase();

        if (
            !window.firebase.apps ||
            !window.firebase.apps.length
        ) {

            window.firebase.initializeApp(
                FIREBASE_CONFIG
            );

        }

        return window.firebase.auth();

    }

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

            let firebaseAuth =
                null;

            try {

                firebaseAuth =
                    await initFirebase();

            }
            catch (firebaseError) {

                console.warn(
                    "SportX Firebase initialization:",
                    firebaseError
                );

            }

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

            function getFirebaseName(user) {

                if (!user) {

                    return "";

                }

                if (user.displayName) {

                    return user.displayName;

                }

                if (user.email) {

                    return user.email.split("@")[0];

                }

                return "SportX User";

            }

            function getFirebaseInitials(user) {

                const name =
                    getFirebaseName(user);

                const parts =
                    name
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean);

                if (parts.length >= 2) {

                    return (
                        parts[0].charAt(0) +
                        parts[1].charAt(0)
                    ).toUpperCase();

                }

                if (parts.length === 1) {

                    return parts[0]
                        .substring(0, 2)
                        .toUpperCase();

                }

                return "SX";

            }

            async function updateUserUI(user, authType) {

                if (!user) {

                    showGuest();

                    return;

                }

                showUser();

                let profile =
                    null;

                let wallet =
                    null;

                if (
                    authType === "supabase"
                ) {

                    profile =
                        await getUserProfile(
                            user.id
                        );

                    wallet =
                        await getWallet(
                            user.id
                        );

                }

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

                if (
                    !fullName &&
                    authType === "supabase"
                ) {

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

                if (
                    !fullName &&
                    authType === "firebase"
                ) {

                    fullName =
                        getFirebaseName(user);

                }

                if (!fullName) {

                    fullName =
                        user.email ||
                        "SportX User";

                }

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

                if (
                    !initials &&
                    authType === "firebase"
                ) {

                    initials =
                        getFirebaseInitials(
                            user
                        );

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

                nameElements.forEach(
                    element => {

                        element.textContent =
                            fullName;

                    }
                );

                initialsElements.forEach(
                    element => {

                        element.textContent =
                            initials;

                    }
                );

                balanceElements.forEach(
                    element => {

                        element.textContent =
                            formatBalance(
                                balance,
                                currency
                            );

                    }
                );

                window.SportXCurrentUser =
                    user;

                window.SportXCurrentAuthType =
                    authType;

            }

            async function updateAuthenticationState() {

                let supabaseSession =
                    null;

                try {

                    const result =
                        await supabaseClient
                        .auth
                        .getSession();

                    if (
                        result &&
                        result.data &&
                        result.data.session
                    ) {

                        supabaseSession =
                            result.data.session;

                    }

                }
                catch (error) {

                    console.warn(
                        "SportX Supabase session:",
                        error
                    );

                }

                if (supabaseSession) {

                    await updateUserUI(
                        supabaseSession.user,
                        "supabase"
                    );

                    return;

                }

                if (firebaseAuth) {

                    const firebaseUser =
                        firebaseAuth.currentUser;

                    if (firebaseUser) {

                        await updateUserUI(
                            firebaseUser,
                            "firebase"
                        );

                        return;

                    }

                }

                showGuest();

                window.SportXCurrentUser =
                    null;

                window.SportXCurrentAuthType =
                    null;

            }

            logoutButtons.forEach(
                button => {

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

                                try {

                                    await supabaseClient
                                    .auth
                                    .signOut();

                                }
                                catch (error) {

                                    console.warn(
                                        "SportX Supabase logout:",
                                        error
                                    );

                                }

                                if (firebaseAuth) {

                                    try {

                                        await firebaseAuth
                                        .signOut();

                                    }
                                    catch (error) {

                                        console.warn(
                                            "SportX Firebase logout:",
                                            error
                                        );

                                    }

                                }

                                localStorage.removeItem(
                                    "sportx_demo_user"
                                );

                                localStorage.removeItem(
                                    "sportx_firebase_user"
                                );

                                window.SportXCurrentUser =
                                    null;

                                window.SportXCurrentAuthType =
                                    null;

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

            const sessionResult =
                await supabaseClient
                .auth
                .getSession();

            if (
                sessionResult.error
            ) {

                console.error(
                    "SportX session error:",
                    sessionResult.error
                );

            }

            await updateAuthenticationState();

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
                            "SportX Supabase Auth:",
                            event
                        );

                        if (session) {

                            await updateUserUI(
                                session.user,
                                "supabase"
                            );

                        }
                        else if (
                            firebaseAuth &&
                            firebaseAuth.currentUser
                        ) {

                            await updateUserUI(
                                firebaseAuth.currentUser,
                                "firebase"
                            );

                        }
                        else {

                            showGuest();

                        }

                    }
                );

            }

            if (firebaseAuth) {

                firebaseAuth.onAuthStateChanged(
                    async user => {

                        console.log(
                            "SportX Firebase Auth:",
                            user
                                ? "SIGNED_IN"
                                : "SIGNED_OUT"
                        );

                        if (user) {

                            const currentSupabase =
                                await supabaseClient
                                .auth
                                .getSession();

                            if (
                                !currentSupabase.data.session
                            ) {

                                localStorage.setItem(
                                    "sportx_firebase_user",
                                    JSON.stringify({
                                        uid: user.uid,
                                        email: user.email,
                                        displayName: user.displayName,
                                        photoURL: user.photoURL
                                    })
                                );

                                await updateUserUI(
                                    user,
                                    "firebase"
                                );

                            }

                        }
                        else {

                            localStorage.removeItem(
                                "sportx_firebase_user"
                            );

                            const currentSupabase =
                                await supabaseClient
                                .auth
                                .getSession();

                            if (
                                !currentSupabase.data.session
                            ) {

                                showGuest();

                                window.SportXCurrentUser =
                                    null;

                                window.SportXCurrentAuthType =
                                    null;

                            }

                        }

                    }
                );

            }

        }
        catch (error) {

            console.error(
                "SportX Auth initialization failed:",
                error
            );

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
