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
            window.location.href = '/200';
        } else {
            response.text().then(text => {
                alert(text);
            });
        }
    });
}