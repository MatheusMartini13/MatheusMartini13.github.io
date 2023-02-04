"use strict";
async function getInfo(userName) {
    const userInfo = await fetch("https://api.github.com/users/" + userName);
    const finalUser = await userInfo.json();
    console.log(finalUser.name);
}
getInfo("matheusmartini13");
