let weapons = {
    1: {
        name: 'LASER V1',
        fillColor: "0xff0000",
        cooldown: 0,
        baseCooldown: 800,
        lastUsed: null
    },
    2: {
        name: 'PLASMA V3',
        fillColor: "0xe66eff",
        cooldown: 0,
        baseCooldown: 10000,
        lastUsed: null
    },
    3: {
        name: 'SUPERNOVA V9',
        fillColor: "0xff9300",
        cooldown: 0,
        baseCooldown: 30000,
        lastUsed: null
    }
}

window.currentWeapon = 1;

window.updateWeaponCooldown = (weaponId) => {
    switch (parseInt(weaponId)) {
        case 1:
            weapons[1].cooldown = weapons[1].baseCooldown;
            weapons[1].lastUsed = Date.now();
            break;
        case 2:
            weapons[2].cooldown = weapons[2].baseCooldown;
            weapons[2].lastUsed = Date.now();
            break;
        case 3:
            weapons[3].cooldown = weapons[3].baseCooldown;
            weapons[3].lastUsed = Date.now();
            break;
    }
};

window.resetWeaponCooldown = (weaponId) => {
    switch (parseInt(weaponId)) {
        case 1:
            weapons[1].cooldown = 0;
            break;
        case 2:
            weapons[2].cooldown = 0;
            break;
        case 3:
            weapons[3].cooldown = 0;
            break;
    }
};

window.setWeapon = (weaponId) => {
    window.currentWeapon = weaponId;

    window.sendToQt(JSON.stringify({weaponId}));
}

//called by Qt
window.isWeaponOffCoolDown = (weaponId) => {
    return weapons[weaponId].cooldown <= 0;
}

window.getWeaponInfos = () => weapons;
window.getWeapon = (weaponId) => {
    return weapons[weaponId];
};


window.setLanguage = (lang) => {
    console.log(lang)
    return lang;
};