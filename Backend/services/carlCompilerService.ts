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
    for (let i = 1; i < repositories.length + 1; i++) {
        body += `<div onclick="window.location.href = '/repositories/open?id=${repositories[i-1].id}'" class="picker-grid-item ${repositories[i-1].id === repoId ? "active" : ""}">`
        body += `<div class="picker-item-header">` +
            `<span class="material-symbols-outlined">` +
            (repositories[i-1].id === repoId ? `edit` : 'save') +
            `</span></div><div class="picker-item-center">`;
        body += repositories[i-1].icon ? `<span class="material-symbols-outlined">${repositories[i-1].icon}</span>` : "";
        body += `<p style="font-size: 27px">${repositories[i-1].name}</p>`
        body += `<p>${repositories[i-1].description}</p>`
        body += `</div><div class="picker-item-bottom">`
        body += `<p>${(await repositories[i-1].getUser()).email}</p>`
        body += `</div></div>`
        if(i%4 === 0) {
            body += `</div><div class="picker-column">`
        }
    }
    body += `</div>`;
    return body
}
