async function checkLogin() {

    console.log("Checking login...");

    const { data, error } = await supabaseClient.auth.getSession();

    console.log(data);
    console.log(error);

    if (error) {

        window.location.href = "login.html";
        return false;

    }

    if (!data.session) {

        window.location.href = "login.html";
        return false;

    }

    console.log("User is logged in");

    return true;

}
