const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    let formData = new FormData(loginForm);

    try {
        const response = await fetch('/authentication/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });

        if (response.status === 200) {
            const data = await response.json();

            // Set the cookie
            document.cookie = `token=${data.token}; expires=${new Date(data.expirationDateTime).toUTCString()}; domain=; path=/`;

            // Ensure the cookie is set by checking it
            if (document.cookie.includes(`token=${data.token}`)) {
                // Redirect to the specified page after confirming the cookie is set
                window.location.href = '/carlInstructions';
            } else {
                alert('Failed to set the authentication cookie.');
            }
        } else {
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
