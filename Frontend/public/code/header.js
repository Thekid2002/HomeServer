function goToPage(page) {
    window.location.href = `/${page}`;
}

function logout() {
    fetch('/authentication/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    }).then(res => {
        if (res.status === 200) {
            goToPage('carlInstructions');
        }
    });
}