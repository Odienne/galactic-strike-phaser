export const isWeaponOffCoolDown = () => {
    return window.sendToQt({"function": "isWeaponOffCoolDown"});
}

export const updateWeaponCooldown = () => {
    return window.sendToQt({"function": "updateWeaponCooldown"});
}

export const signalScore = (score) => {
    return window.sendToQt({score});
}
export const signalTime = (time) => {
    return window.sendToQt({time});
}

window.setLanguage = (lang) => {
    console.log(lang)
    return lang;
};