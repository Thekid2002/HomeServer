function createObject() {
    let repositoryId = window.location.href.split("?")[1].split("=")[1];
    window.location.href = `/saveFile/edit?repositoryId=${repositoryId}`;
}

function editObject(id) {
    let repositoryId = window.location.href.split("?")[1].split("=")[1];
    window.location.href = `/saveFile/edit?id=${id}&repositoryId=${repositoryId}`;
}

function deleteObject(id) {
    let repositoryId = window.location.href.split("?")[1].split("=")[1];
    fetch(`/saveFile/delete?id=${id}&repositoryId=${repositoryId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    }).then((response) => {
        if (response.status === 200) {
            window.location.reload();
        }
        response.text().then((text) => {
            alert(text);
        });
    });
}
