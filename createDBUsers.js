const fs = require('fs');
let champ = [{
    "Campeon": "Diana",
    "Rol": "MidLaner",
    "Counters":"Cassiopeia",
    "EasyMatchup":"Gankplank",
    "id":"1" 
}];
let year = 1900;
for (let i = 0; i < 2; i++) {
    let id = Math.round(Math.random() * (100 - 10) + 10);
    let champ = {
        "Campeon": `${Campeon}`,
        "Rol": "MidLaner",
        "Counters": "Cassiopeia",
        "EasyMatchups": "Gankplank",
        "id": 10002 + i
    }
    users.push(champ);
}
console.table(champ);
fs.writeFileSync('./data/campeones.json',JSON.stringify(champ));