let level = 1;
let currentPlayer = 1;

let players = {
  1: { name: "", score: 0, avatar: "" },
  2: { name: "", score: 0, avatar: "" }
};

let cards = [];
let flipped = [];
let lock = false;

/* 25 images */
const cardImages = [
  "assets/cards/c1.jfif",
  "assets/cards/c2.jfif",
  "assets/cards/c3.jfif",
  "assets/cards/c4.jfif",
  "assets/cards/c5.jfif",
  "assets/cards/c6.jfif",
  "assets/cards/c7.jfif",
  "assets/cards/c8.jfif",
  "assets/cards/c9.jfif",
  "assets/cards/c10.jfif",
  "assets/cards/c11.jfif",
  "assets/cards/c12.jfif",
  "assets/cards/c13.jfif",
  "assets/cards/c14.jfif",
  "assets/cards/c15.jfif",
  "assets/cards/c16.jfif",
  "assets/cards/c17.jfif",
  "assets/cards/c18.jfif",
  "assets/cards/c19.jfif",
  "assets/cards/c20.jfif",
  "assets/cards/c21.jfif",
  "assets/cards/c22.jfif",
  "assets/cards/c23.jfif",
  "assets/cards/c24.jfif",
  "assets/cards/c25.jfif"
];

/* avatars */
const avatarList = [
  "assets/avatars/a1.jfif",
  "assets/avatars/a2.jfif",
  "assets/avatars/a3.jfif",
  "assets/avatars/a4.jfif",
  "assets/avatars/a5.jfif"
];

/* levels */
const levelSizes = [12, 16, 20, 25, 30, 35, 40, 45, 50, 50];

/* screens */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* start screen */
function goSetup() {
  showScreen("setupScreen");
  renderAvatars("p1avatars", 1);
  renderAvatars("p2avatars", 2);
}

/* avatars */
function renderAvatars(container, player) {
  const div = document.getElementById(container);
  div.innerHTML = "";

  avatarList.forEach(src => {
    const wrapper = document.createElement("div");
    wrapper.className = "avatar";

    const img = document.createElement("img");
    img.src = src;

    img.onclick = () => {
      players[player].avatar = src;
    };

    wrapper.appendChild(img);
    div.appendChild(wrapper);
  });
}

/* start game */
function startGame() {
  players[1].name = document.getElementById("p1name").value || "P1";
  players[2].name = document.getElementById("p2name").value || "P2";

  showScreen("gameScreen");
  loadLevel();
}

/* load level */
function loadLevel() {
  let size = levelSizes[level - 1];

  let pairs = size / 2;
  let values = [];

  for (let i = 0; i < pairs; i++) {
    let img = cardImages[i % cardImages.length];
    values.push(img, img);
  }

  cards = shuffle(values);
  flipped = [];
  lock = false;

  renderBoard();
  updateUI();
}

/* board */
function renderBoard() {
  const board = document.getElementById("gameBoard");
  board.innerHTML = "";

  let cols = Math.ceil(Math.sqrt(cards.length));
  board.style.gridTemplateColumns = `repeat(${cols}, 80px)`;

  cards.forEach((img) => {
    const card = document.createElement("div");
    card.className = "card";

    const image = document.createElement("img");
    image.src = img;

    card.appendChild(image);

    card.onclick = () => flipCard(card, img);

    board.appendChild(card);
  });
}

/* flip */
function flipCard(card, value) {
  if (lock || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  flipped.push({ card, value });

  if (flipped.length === 2) {
    lock = true;
    setTimeout(checkMatch, 600);
  }
}

/* match */
function checkMatch() {
  let [a, b] = flipped;

  if (a.value === b.value) {
    players[currentPlayer].score += 10; // score clearer
  } else {
    a.card.classList.remove("flipped");
    b.card.classList.remove("flipped");
    switchTurn();
  }

  flipped = [];
  lock = false;

  if (checkWin()) endLevel();

  updateUI();
}

/* turn */
function switchTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
}

/* win */
function checkWin() {
  return document.querySelectorAll(".card.flipped").length === cards.length;
}

/* end level */
function endLevel() {
  let winner =
    players[1].score > players[2].score
      ? players[1].name
      : players[2].name;

  document.getElementById("winnerText").innerText =
    "🎉 Congrats " + winner + "! 🎉";

  showScreen("winScreen");
}

/* next level */
function nextLevel() {
  level++;
  if (level > 10) level = 1;

  showScreen("gameScreen");
  loadLevel();
}

function updateUI() {
  document.getElementById("scoreBoard").innerHTML = `
    <table style="
      margin: auto;
      border-collapse: collapse;
      font-weight: bold;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      min-width: 300px;
    ">
      <tr style="background:#ff66a3; color:white;">
        <th>Player</th>
        <th>Avatar</th>
        <th>Score</th>
      </tr>

      <tr class="${currentPlayer === 1 ? 'activePlayer' : ''}">
  	<td>${players[1].name}</td>
  	<td><img src="${players[1].avatar}" width="30"></td>
  	<td>${players[1].score}</td>
      </tr>

      <tr class="${currentPlayer === 2 ? 'activePlayer' : ''}">
  	<td>${players[2].name}</td>
  	<td><img src="${players[2].avatar}" width="30"></td>
  	<td>${players[2].score}</td>
      </tr>
    </table>
  `;

  document.getElementById("turnInfo").innerText =
    "Turn: " + players[currentPlayer].name;

  document.getElementById("levelInfo").innerText =
    "Level " + level;
}

/* shuffle */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}