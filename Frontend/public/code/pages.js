function editObject(id) {
    window.location.href = `/pages/edit?id=${id}`;
}

function createObject() {
    window.location.href = "/pages/create";
}

function deleteObject(id) {
    fetch(`/pages/delete?id=${id}`, {
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
