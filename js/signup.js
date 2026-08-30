document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // CHECK EXISTING SESSION
    // ==========================================
    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (session) {

        const role = await getUserRole(session.user.id);

        if (role === "provider") {
            window.location.href = "provider-dashboard.html";
        } else {
            window.location.href = "customer-dashboard.html";
        }

        return;
    }


    // ==========================================
    // ROLE
    // ==========================================
    let selectedRole = "customer";


    const roleCustomerBtn =
        document.getElementById("roleCustomerBtn");

    const roleProviderBtn =
        document.getElementById("roleProviderBtn");


    // ==========================================
    // CUSTOMER ROLE
    // ==========================================
    roleCustomerBtn.addEventListener("click", () => {

        selectedRole = "customer";

        roleCustomerBtn.classList.add("active");
        roleProviderBtn.classList.remove("active");

    });


    // ==========================================
    // PROVIDER ROLE
    // ==========================================
    roleProviderBtn.addEventListener("click", () => {

        selectedRole = "provider";

        roleProviderBtn.classList.add("active");
        roleCustomerBtn.classList.remove("active");

    });


    // ==========================================
    // FORM ELEMENTS
    // ==========================================
    const signupForm =
        document.getElementById("signupForm");

    const nameInput =
        document.getElementById("signupName");

    const emailInput =
        document.getElementById("signupEmail");

    const phoneInput =
        document.getElementById("signupPhone");

    const passwordInput =
        document.getElementById("signupPassword");

    const confirmInput =
        document.getElementById("signupConfirmPassword");


    // ==========================================
    // ERROR ELEMENTS
    // ==========================================
    const nameError =
        document.getElementById("nameError");

    const emailError =
        document.getElementById("signupEmailError");

    const phoneError =
        document.getElementById("phoneError");

    const passwordError =
        document.getElementById("signupPasswordError");

    const confirmError =
        document.getElementById("confirmPasswordError");

    const signupNote =
        document.getElementById("signupNote");


    // ==========================================
    // SIGNUP
    // ==========================================
    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        // Remove previous errors
        [
            nameError,
            emailError,
            phoneError,
            passwordError,
            confirmError
        ].forEach(el => el.classList.remove("show"));

        signupNote.classList.remove("show");


        // ==========================================
        // GET VALUES
        // ==========================================
        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const phone =
            phoneInput.value.trim();

        const password =
            passwordInput.value;

        const confirm =
            confirmInput.value;


        // ==========================================
        // VALIDATION
        // ==========================================
        const emailValid =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        const phoneValid =
            /^[0-9+\-\s]{10,15}$/.test(phone);


        let hasError = false;


        if (!name) {
            nameError.classList.add("show");
            hasError = true;
        }


        if (!emailValid) {
            emailError.classList.add("show");
            hasError = true;
        }


        if (!phoneValid) {
            phoneError.classList.add("show");
            hasError = true;
        }


        if (password.length < 6) {
            passwordError.classList.add("show");
            hasError = true;
        }


        if (confirm !== password) {
            confirmError.classList.add("show");
            hasError = true;
        }


        if (hasError) {
            return;
        }


        // ==========================================
        // SUPABASE AUTH SIGNUP
        // ==========================================
        const {
            data,
            error
        } = await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {
                data: {
                    full_name: name,
                    phone: phone,
                    role: selectedRole
                }
            }

        });


        // ==========================================
        // SIGNUP ERROR
        // ==========================================
        if (error) {

            console.error("Signup error:", error);

            if (
                error.message.toLowerCase().includes("already registered") ||
                error.message.toLowerCase().includes("already exists")
            ) {

                signupNote.textContent =
                    "An account with this email already exists. Please login instead.";

            } else {

                signupNote.textContent =
                    error.message;
            }

            signupNote.classList.add("show");

            return;
        }


        // ==========================================
        // USER CREATED
        // ==========================================
        if (data.user) {

            console.log("Supabase user created:", data.user);


            // ==========================================
            // CREATE PROFILE
            // ==========================================
            if (data.session) {

                const {
                    error: profileError
                } = await supabaseClient
                    .from("profiles")
                    .insert([{
                        id: data.user.id,
                        full_name: name,
                        email: email,
                        phone: phone,
                        role: selectedRole
                    }]);


                if (profileError) {

                    console.error(
                        "Profile creation error:",
                        profileError
                    );

                    signupNote.textContent =
                        "Account created, but profile setup failed. Please contact support.";

                    signupNote.classList.add("show");

                    return;
                }


                console.log("Profile created successfully.");


                // ==========================================
                // REDIRECT
                // ==========================================
                if (selectedRole === "provider") {

                    window.location.href =
                        "provider-dashboard.html";

                } else {

                    window.location.href =
                        "customer-dashboard.html";
                }


            } else {

                // ==========================================
                // EMAIL CONFIRMATION ENABLED
                // ==========================================
                signupNote.textContent =
                    "Account created successfully! Please check your email and confirm your account before logging in.";

                signupNote.classList.add("show");

                signupForm.reset();

            }

        }

    });


    // ==========================================
    // GET USER ROLE
    // ==========================================
    async function getUserRole(userId) {

        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();


        if (error) {

            console.error(
                "Role fetch error:",
                error
            );

            return "customer";
        }


        return data.role;

    }

});