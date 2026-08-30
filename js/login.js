document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // CHECK IF USER IS ALREADY LOGGED IN
    // ==========================================
    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (session) {
        await redirectUser(session.user.id);
        return;
    }


    // ==========================================
    // GET FORM ELEMENTS
    // ==========================================
    const loginForm = document.getElementById("loginForm");

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    const loginNote = document.getElementById("loginNote");


    // ==========================================
    // SHOW MESSAGE
    // ==========================================
    function showNote(message) {
        loginNote.textContent = message;
        loginNote.classList.add("show");
    }


    // ==========================================
    // REDIRECT USER ACCORDING TO ROLE
    // ==========================================
    async function redirectUser(userId) {

        const { data: profile, error } = await supabaseClient
            .from("profiles")
            .select("id, full_name, email, phone, role")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Profile fetch error:", error);

            showNote(
                "Your account was found, but your profile could not be loaded."
            );

            return;
        }

        if (profile.role === "provider") {
            window.location.href = "provider-dashboard.html";
        } else {
            window.location.href = "customer-dashboard.html";
        }
    }


    // ==========================================
    // LOGIN
    // ==========================================
    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        // Remove previous errors
        loginNote.classList.remove("show");

        emailError.classList.remove("show");
        passwordError.classList.remove("show");


        const email = emailInput.value.trim();
        const password = passwordInput.value;


        // ==========================================
        // VALIDATION
        // ==========================================
        const emailValid =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        let hasError = false;


        if (!emailValid) {
            emailError.classList.add("show");
            hasError = true;
        }


        if (!password) {
            passwordError.classList.add("show");
            hasError = true;
        }


        if (hasError) {
            return;
        }


        // ==========================================
        // SUPABASE LOGIN
        // ==========================================
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        // ==========================================
        // LOGIN ERROR
        // ==========================================
        if (error) {

            console.error("Login error:", error);

            showNote(
                "Incorrect email or password. Please try again."
            );

            return;
        }


        // ==========================================
        // LOGIN SUCCESS
        // ==========================================
        if (data.user) {

            console.log("Login successful:", data.user);

            await redirectUser(data.user.id);
        }

    });

});