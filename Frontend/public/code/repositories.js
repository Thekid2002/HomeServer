function editObject(id){
    window.location.href = `/repositories/edit?id=${id}`;
}

function createObject() {
    window.location.href = `/repositories/edit`;
}

function deleteObject(id){
    fetch(`/repositories/delete?id=${id}`, {
        method: 'DELETE'
    }).then(response => {
        if(response.status === 200){
            location.reload();
        }else {
            response.text().then(text => {
                alert(text);
            });
        }
    });
}