"use strict";
let userArray = [];
const searchDiv = document.querySelector('#searchField');
const historyDiv = document.querySelector('#historyDiv');
const topsDiv = document.querySelector('#topsDiv');
const mainLabel = createElement('label');
mainLabel.textContent = 'Qual o nome de usuário a ser pesquisado?';
mainLabel.setAttribute('class', "text-center");
searchDiv.append(mainLabel);
const mainInput = createElement('input');
mainInput.setAttribute('class', 'form-control');
searchDiv.append(mainInput);
const mainBtn = createElement('button');
mainBtn.textContent = 'Adicionar ao LOG';
mainBtn.setAttribute('class', "btn btn-secondary m-2");
searchDiv.append(mainBtn);
const topBtn = createElement('button');
topBtn.textContent = 'Ver usuários com mais repositórios';
topBtn.setAttribute('class', "btn btn-secondary m-2");
searchDiv.append(topBtn);
const histBtn = createElement('button');
histBtn.textContent = 'Ver histórico';
histBtn.setAttribute('class', "btn btn-secondary m-2");
searchDiv.append(histBtn);
mainBtn.addEventListener('click', async (ev) => {
    await newSearch(mainInput.value).then(() => renderUser(userArray, 0));
});
topBtn.addEventListener('click', async (ev) => {
    await orderByRepos();
});
histBtn.addEventListener('click', async (ev) => {
    await showHistory();
});
function showHistory() {
    renderUser(userArray, 0);
}
async function showRepos(id, login) {
    let reposArray = await getInfo(login + '/repos');
    const reposDiv = createElement('div');
    const repoParent = document.querySelector('#' + id);
    reposDiv.id = repoParent.id + "repo";
    repoParent.append(reposDiv);
    reposArray.forEach((el) => {
        let element = {
            name: el.name,
            description: el.description,
            fork: el.fork,
            stargazers_count: el.stargazers_count,
            htmlUrl: el.html_url
        };
        const repoName = createElement("a");
        const repoDescription = createElement("p");
        const repoFork = createElement("p");
        const repoStar = createElement("p");
        const repoSingleDiv = createElement('div');
        const bodyDiv = createElement('div');
        repoName.textContent = element.name;
        repoName.setAttribute('href', element.htmlUrl);
        repoName.setAttribute('class', "btn btn-dark text-uppercase");
        repoDescription.textContent = element.description;
        repoFork.textContent = 'Fork? ' + element.fork;
        repoFork.setAttribute('class', "list-group-item text-dark");
        repoStar.textContent = 'Quantidade de estrelas: ' + element.stargazers_count;
        repoStar.setAttribute('class', "list-group-item text-dark");
        repoSingleDiv.setAttribute('class', "card-body");
        repoSingleDiv.append(repoName, repoDescription, repoFork, repoStar);
        bodyDiv.setAttribute('class', 'card bg-secondary m-2 text-left');
        bodyDiv.append(repoSingleDiv);
        reposDiv.append(bodyDiv);
    });
    const clearBtn = createElement("button");
    clearBtn.addEventListener('click', (ev) => {
        reposDiv.innerHTML = "";
        reposDiv.parentElement.parentElement.querySelector('button').dataset.open = 'false';
    });
    clearBtn.textContent = `Limpar Repositórios do usuário`;
    clearBtn.setAttribute('class', "btn btn-secondary m-2");
    reposDiv.append(clearBtn);
}
function createElement(elementType) {
    let createdElement = document.createElement(elementType);
    return createdElement;
}
const br = (qtd = 1) => createElement('br');
async function newSearch(searchArgument) {
    let infoJson = await getInfo(searchArgument);
    if (infoJson === null) {
        return;
    }
    else {
        const newUser = {
            "name": infoJson.name,
            "bio": infoJson.bio,
            "id": infoJson.id,
            "login": infoJson.login,
            "photoUrl": infoJson.avatar_url,
            "reposUrl": infoJson.repos_url,
            "reposQtd": infoJson.public_repos,
        };
        let alreadyInArray = false;
        userArray.forEach((el) => {
            if (el.id === newUser.id) {
                alreadyInArray = true;
            }
        });
        if (!alreadyInArray) {
            userArray.push(newUser);
        }
        else {
            alert('Usuário já adicionado.');
        }
    }
}
function createUserInterface(el) {
    let newUser = el;
    let newDiv = createElement('div');
    newDiv.id = 'id' + newUser.id;
    let newName = createElement('h2');
    newName.textContent = newUser.name;
    let newPic = createElement('img');
    newPic.setAttribute("src", newUser.photoUrl);
    newPic.setAttribute("class", "img-thumbnail rounded-circle imgWidth");
    let newUserId = createElement('h3');
    newUserId.textContent = newUser.id + " - " + newUser.login;
    let bio = createElement('div');
    // bio.innerHTML = newUser.bio.replaceAll(/(&nbsp;)+/g,"\n")
    let newText = newUser?.bio?.replaceAll(/( )+/g, "\n");
    let textArray = newText?.split('\n');
    console.log(textArray);
    textArray?.forEach((el) => bio.append(createElement('p').textContent = el, createElement('br')));
    bio.setAttribute("class", "text-muted h6");
    let publicRepos = createElement('p');
    publicRepos.textContent = `O usuário tem ${newUser.reposQtd} repositórios públicos.`;
    let repository = createElement('div');
    repository.id = newDiv.id + "reposhow";
    let reposUrl = createElement('button');
    reposUrl.textContent = 'Veja aqui o repositório do usuário';
    reposUrl.setAttribute('class', "btn btn-secondary m-2");
    reposUrl.dataset.open = "false";
    newDiv.append(newName, newPic, br(), newUserId, bio, publicRepos, reposUrl, repository, createElement('hr'));
    reposUrl.addEventListener('click', (ev) => {
        if (reposUrl.dataset.open === "false") {
            reposUrl.dataset.open = "true";
            showRepos(repository.id, newUser.login);
        }
        else {
            alert('Repositório já aberto!');
        }
    });
    historyDiv.append(newDiv);
}
function renderUser(mainArray, qntPositions) {
    historyDiv.innerHTML = '<br/>';
    topsDiv.innerHTML = '<br/>';
    if (qntPositions === 0) {
        mainArray.forEach((el) => {
            createUserInterface(el);
        });
    }
    else {
        let realLenght;
        mainArray.length < qntPositions ? (realLenght = mainArray.length) : (realLenght = qntPositions);
        for (let index = 0; index < realLenght; index++) {
            createUserInterface(mainArray[index]);
        }
    }
}
async function getInfo(userName) {
    const userInfo = await fetch("https://api.github.com/users/" + userName);
    const finalUser = await userInfo.json();
    if (await finalUser.message === "Not Found") {
        return null;
    }
    else {
        return finalUser;
    }
}
async function orderByRepos() {
    let newArray = [...userArray].sort((a, b) => b.reposQtd - a.reposQtd);
    renderUser(newArray, 5);
}
