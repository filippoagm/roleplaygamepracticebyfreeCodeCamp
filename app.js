let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let currentMonster;
let monsterCurrentHealth;
let inventory = ['fist'];
const weapons = [
  {
    name: "fist",
    power: 15,
  },
  {
    name: "dagger",
    power: 30,
  },
  {
    name: "sword",
    power: 50,
  },
  {
    name: "claymore",
    power: 70,
  },
  {
    name: "master sword",
    power: 100,
  },
];
const monsters = [
  {
    name: "Wolf",
    health:100,
    power: 10,
    gold: 20,
    xp: 20,
  },
  {
    name: "Salamandre",
    health: 200,
    power:30,
    gold: 50,
    xp: 50,
  },
  {
    name: "Dragon",
    health: 500,
    power: 50,
    gold: 100,
    xp: 100,
  },
];
const locations = [
  {
    id: 0,
    name: "Town",
    functions: [goStore, goCave, fightDragon],
    functionText: ['Go Store', 'Go Cave', 'Fight Dragon'],
    text: 'Welcome to this world of fantasy Adventurer'
  },
  {
    id: 1,
    name: "Store",
    functions: [buyHealth,buyWeapon,goTown],
    functionText: ['Buy health(10 gold)', 'Buy weapon(30 gold)', 'Go Town'],
    text: 'Welcome to the store',
  },
  {
    id: 2,
    name: "Cave",
    functions: [fightWolf,fightSalamandre,goTown],
    functionText: ['Fight Wolf', 'Fight Salamandre', 'Go Town'],
    text: 'Good look Adventurer'
  },
  {
    id: 3,
    name: "Lose",
    functions: [replay],
    functionText: ['Replay?'],
    text: 'You have lose Adventurer, want to play again?'
  },
  {
    id: 4,
    name: "Win",
    functions: [replay],
    functionText: ['Replay?'],
    text: 'YOU HAVE WIN ADVENTURER!!!'
  },
  {
    id: 5,
    name: "actions",
    functions: [attack,dodge,goTown],
    functionText: ['Attack', 'Dodge', 'Run'],
    text: 'What will you do adventurer?'
  },
]

// HTML Elements:
const element = selector => document.querySelector(selector);
const xpText = element(".xpText"),
  healthText = element(".healthText"),
  goldText = element(".goldText"),
  monsterStats = element("#monsterStats"),
  monsterName = element("#monsterName"),
  monsterHealth = element("#monsterHealth"),
  button1 = element("#button1"),
  button2 = element("#button2"),
  button3 = element("#button3"),
  text = element("#textContainer");
//--------------

const renderLocation = location => {

  button1.textContent = location.functionText[0];
  button1.onclick = location.functions[0];

  button2.textContent = location.functionText[1];
  button2.onclick = location.functions[1];

  button3.textContent = location.functionText[2];
  button3.onclick = location.functions[2];

  text.textContent = location.text;
  monsterStats.style.display = "none";
}

function goTown() {
  renderLocation(locations[0]);
}

function goStore() {
  renderLocation(locations[1]);
}

function goCave() {
  renderLocation(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.textContent = gold;
    healthText.textContent = health;
    text.textContent = `You have buy a potion, now you have ${health}pts of Health`;
  } else {
    text.textContent = "You don't have enoght money to buy a potion";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      goldText.textContent = gold;
      currentWeapon++;
      let weapon = inventory.push(weapons[currentWeapon].name);
      text.textContent = `You have buy ${weapon}.`;
      text.textContent += ` Now you have ${inventory}`;
    } else {
      text.textContent = "You don't have enoght gold to buy a new weapon";
    }
  } else {
    text.textContent = "You have the best posible weapon, do you want to sell the others?";
    button2.textContent = "Sell weapon?";
    button2.onclick = sellWeapon;
  }
}

function fight(monster) {
  renderLocation(locations[5]);
  monsterStats.style.display = "block";
  monsterName.textContent = monster.name;
  monsterCurrentHealth = monster.health;
  monsterHealth.textContent = monsterCurrentHealth;
}

function fightWolf() {
  currentMonster = 0;
  fight(monsters[currentMonster]);
}
function fightSalamandre() {
  currentMonster = 1;
  fight(monsters[currentMonster]);
}
function fightDragon() {
  currentMonster = 2;
  fight(monsters[currentMonster]);
}

function attack() {
  const weaponPower = weapons[currentWeapon].power;
  const weaponName = weapons[currentWeapon].name;
  const monsterPower = monsters[currentMonster].power
  const monsterName = monsters[currentMonster].name
  if (health >= 0) {
    if (isAllow()) {
      let damage = weaponPower + (xp / 4);
      monsterCurrentHealth -= damage;
      monsterHealth.textContent = monsterCurrentHealth;
      text.textContent = `You have used ${weaponName} and have deal ${damage}pts to ${monsterName}\n`;
      if (monsterCurrentHealth <= 0) {
        if (currentMonster === 2) {
          renderLocation(locations[4]);
          oneButton();
          return;
        } else {
          gold += monsters[currentMonster].gold;
          goldText.textContent = gold;
          xp += monsters[currentMonster].xp;
          xpText.textContent = xp;
          goTown();
          return;
        }
      }
    } else {
      text.textContent = "You have missed your attack \n";
    }
    if (isAllow()) {
      let damage = monsterPower + Math.floor(Math.random() * 10) + 1;
      health -= damage;
      healthText.textContent = health;
      text.innerHTML += "</br>" + `${monsterName} has dealed ${damage} to you`;
      if(health <= 0){
        lose();
        oneButton();
        return;
      }
    } else {
      text.innerHTML += "</br>" + `${monsterName} have missed its attack`;
    }
  } else {
    lose();
    oneButton();
  }
}

function isAllow() {
  return (Math.floor(Math.random() * 10) + 1 >= 5)
}

function dodge() {
  if (Math.floor(Math.random() * 2) + 1 >= 3) {
    text.textContent = "You have dodge the attack"
  } else {
    health -= monsters[currentMonster].power;
    healthText.textContent = health;
    text.textContent = "You have missed the dodge";
    text.textContent += `${monsters[currentMonster].name} has attack you`
    if(health <= 0){
      lose();
    }
  }
}

function lose(){
  renderLocation(locations[3]);
}
function oneButton(){
  button2.style.display = "none";
  button3.style.display = "none";
}

function replay(){
  xp = 0;
  gold = 50;
  health = 100;
  xpText.textContent = 0;
  goldText.textContent = gold;
  healthText.textContent = health;
  currentWeapon = 0;
  inventory = ['fist'];
  button2.style.display = "inline";
  button3.style.display = "inline";
  goTown();
}

function sellWeapon(){
  if(inventory.length > 1){
    gold += 15;
    goldText.textContent = gold;
    let shiftedWeapon = inventory.shift();
    text.textContent = `You have sold ${shiftedWeapon}`;
  }
}
const init = () => {
  renderLocation(locations[0]);
  healthText.textContent = health;
  xpText.textContent = xp;
  goldText.textContent = gold;
}
init();