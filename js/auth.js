async function checkLogin() {

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error(error);
        window.location.href = "login.html";
        return;
    }

    if (!data.session) {
        window.location.href = "login.html";
    }

}
