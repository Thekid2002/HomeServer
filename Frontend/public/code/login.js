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
        return response.json();
    }).then(function (data) {
        if (data.token) {
            document.cookie = `token=${data.token}` + "; " + data.expirationDateTime + ";domain=;path=/";;
            setTimeout(() => {
                window.location.href = '/compilerCalculator';
            }, 150);
        } else {
            alert('Invalid credentials');
        }
    });
});