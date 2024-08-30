import {User} from "../models/user";
import {getAllRepositories, getAllRepositoriesByUserId} from "../repositories/repositoryRepository";
import {Repository} from "../models/repository";
import {RoleEnum} from "../models/roleEnum";
import {Request} from "express";

export async function getRepositoryPickerPage(user: User, req: Request): Promise<string> {
    let repoIdString;
    let repoId: number | null = null;
    if (req.headers.cookie && req.headers.cookie.split("repoId=")[1] && req.headers.cookie.split("repoId=")[1].split(";").length !== 0){
        repoIdString = req.headers.cookie.split("repoId=")[1].split(";")[0];
        repoId = parseInt(repoIdString);
    }
    let repositories: Repository[] = [];
    if(user.role === RoleEnum.SUPER_ADMIN) {
        repositories = await getAllRepositories();
    }else {
        repositories = await getAllRepositoriesByUserId(user.id);
    }
    let body = `<div class="picker-column">`
    for (let i = 0; i < repositories.length%5; i++) {
        body += `<div onclick="window.location.href = '/repositories/open?id=${repositories[i].id}'" class="picker-grid-item ${repositories[i].id === repoId ? "active" : ""}">`
        body += `<div class="picker-item-header">` +
            `<span class="material-symbols-outlined">` +
            (repositories[i].id === repoId ? `edit` : 'save') +
            `</span></div><div class="picker-item-center">`
        body += `<p style="font-size: 27px">${repositories[i].name}</p>`
        body += `<p>${repositories[i].description}</p>`
        body += `</div><div class="picker-item-bottom">`
        body += `<p>${(await repositories[i].getUser()).email}</p>`
        body += `</div></div>`
        console.log(repositories[i].id + " " + repoId)
    }
    body += `</div>`;
    return body
}
