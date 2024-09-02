function editObject(id) {
    window.location.href = `/user/edit?id=${id}`;
}

function createObject() {
    window.location.href = "/user/create";
}

function deleteObject(id) {
    fetch(`/user/delete?id=${id}`, {
        method: "DELETE"
    }).then((response) => {
        if (response.status === 200) {
            location.reload();
        } else {
            response.text().then((text) => {
                alert(text);
            });
        }
    });
}
