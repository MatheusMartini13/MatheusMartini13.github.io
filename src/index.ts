async function getInfo(userName:string) {
    const userInfo = await fetch("https://api.github.com/users/" + userName)
    const finalUser = await userInfo.json()
    console.log(finalUser.name)
}

getInfo("matheusmartini13");
