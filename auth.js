/* =========================================================
   SPORTX — GLOBAL SUPABASE AUTH
   Real session based authentication
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
       LOAD SUPABASE IF NOT ALREADY LOADED
       ===================================================== */

    function loadSupabase() {

        return new Promise((resolve, reject) => {

            if (
                window.supabase &&
                typeof window.supabase.createClient === "function"
            ) {
                resolve();
                return;
            }


            const existing =
                document.querySelector(
                    'script[src*="supabase-js"]'
                );


            if (existing) {

                existing.addEventListener(
                    "load",
                    resolve,
                    { once:true }
                );

                existing.addEventListener(
                    "error",
                    reject,
                    { once:true }
                );

                return;
            }


            const script =
                document.createElement("script");


            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


            script.async = true;


            script.onload =
                () => resolve();


            script.onerror =
                () => reject(
                    new Error(
                        "Unable to load Supabase."
                    )
                );


            document.head.appendChild(
                script
            );

        });

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
                            minimumFractionDigits:0,
                            maximumFractionDigits:2
                        }
                    );


                return (
                    String(currency || "AFN") +
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
                            .slice(0,2)
                            .map(
                                word =>
                                    word
                                    .charAt(0)
                                    .toUpperCase()
                            )
                            .join("");

                }


                if (!initials) {

                    initials = "SX";

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
       START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initSportXAuth,
            {
                once:true
            }
        );

    }
    else {

        initSportXAuth();

    }


})();
