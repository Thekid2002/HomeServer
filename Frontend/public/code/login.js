const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let formData = new FormData(loginForm);
    fetch('/authentication/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password')
        })
    }).then(function (response) {
        if (response.status === 200) {
            response.json().then(function (data) {
                document.cookie = `token=${data.token}` + "; " + data.expirationDateTime + ";domain=;path=/";
                setTimeout(function () {
                    window.location.href = '/user/profile';
                }, 300);
            });
        } else {
            response.text().then(function (text) {
                alert(text);
            });
        }
    });
});