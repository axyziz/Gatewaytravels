async function checkLogin() {

    console.log("Checking login...");

    const { data, error } = await supabaseClient.auth.getSession();

    console.log(data);
    console.log(error);

    if (error) {
        alert("Auth Error");
        window.location.href = "login.html";
        return;
    }

    if (!data.session) {
        alert("No session found");
        window.location.href = "login.html";
        return;
    }

    alert("User is logged in");

}
