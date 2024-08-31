function goToPage(page) {
    window.location.href = `/${page}`;
}

function logout() {
    let youSureBruv = confirm("Are you sure you want to log out?");
    if (!youSureBruv) {
        return;
    }

    fetch("/authentication/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    }).then((res) => {
        if (res.status === 200) {
            let cookies = document.cookie.split(";");

            for (let i = 0; i < cookies.length; ++i) {
                let myCookie = cookies[i];
                let pos = myCookie.indexOf("=");
                let name = pos > -1 ? myCookie.substr(0, pos) : myCookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=; path=/";
            }
            sessionStorage.clear();
            localStorage.clear();
            goToPage("carlInstructions");
        }
    });
}
