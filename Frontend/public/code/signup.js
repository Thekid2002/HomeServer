const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let formData = new FormData(signupForm);
    fetch('/authentication/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstname: formData.get('firstname'),
            surname: formData.get('surname'),
            email: formData.get('email'),
            password: formData.get('password'),
            phone: formData.get('phone')
        })
    }).then(async function (response) {
        if(response.status === 500) {
            alert(await response.text());
        } else {
            window.location.href = '/authentication/login';
        }
    });
});