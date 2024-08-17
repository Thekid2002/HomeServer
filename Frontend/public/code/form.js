
let form = document.getElementById('form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let formData = new FormData(form);
    let object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    await fetch(window.location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    }).then(response => {
        if(response.status === 200){
            history.back();
        } else {
            response.text().then(text => {
                alert(text);
            });
        }
    })
});