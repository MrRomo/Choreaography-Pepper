var char = 'X';
var score = [0, 0];
var winIndex = [ //win combination array
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getScore() {
  document.getElementById('player_score').innerHTML = '(X) Jugador: ' + score[0];
  document.getElementById('computer_score').innerHTML = '(O) I.A.: ' + score[1];
};

function winStep(char) {
  for (var i in winIndex) {
    var aim = 0;
    var occFields = 0;
    for (var j in winIndex[i]) {
      if (fields[winIndex[i][j]].getAttribute('used') === char) occFields++;
      if (!fields[winIndex[i][j]].hasAttribute('used')) aim = fields[winIndex[i][j]];
    };
    if (occFields == 2 && aim != 0) {
      return aim;
    };
  };
  if (char == 'O') return 0;
  else {
    var freeFields = [];
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].hasAttribute('used')) freeFields.push(fields[i]);
    };
    return freeFields[Math.floor(Math.random() * freeFields.length)];
  };
};

function ai() {
  if (winStep('O') != 0) return winStep('O');
  else return winStep('X');
};

function checkWin(char) {
  var check;
  var content = document.getElementById('content');
  for (var i in winIndex) {
    check = fields[winIndex[i][0]].getAttribute('used') === char &&
      fields[winIndex[i][0]].getAttribute('used') === fields[winIndex[i][1]].getAttribute('used') &&
      fields[winIndex[i][1]].getAttribute('used') === fields[winIndex[i][2]].getAttribute('used');
    if (check) {
      if (char === 'X') {
        bColor = "rgb(125, 209, 71)";
      } else {
        bColor = "rgb(225, 96, 96)";
      }
      for (var j = 0; j < 3; j++) {
        fields[winIndex[i][j]].style.backgroundColor = bColor;
      };
      return true;
    };
  };
  return false;
};

function checkDraw() {
  for (var i = 0; i < fields.length; i++) {
    if (!fields[i].hasAttribute('used')) return false;
  };
  document.getElementById('board').style.backgroundColor = "rgb(96, 156, 225)";
  return true;
};

function nextStep(step) {
  if (char === 'X') {
    if (!this.hasAttribute('used')) {
      this.innerHTML = 'X';
      this.setAttribute("used", 'X');
      this.style.backgroundImage = "url(\"images/human.png\")";
      this.removeEventListener('click', nextStep);
    };
  } else {
    if (!step.hasAttribute('used')) {
      step.innerHTML = 'O';
      step.setAttribute("used", 'O');
      step.style.backgroundImage = "url(\"images/ai.png\")";
      step.removeEventListener('click', nextStep);
    };
  };
  if (checkWin(char)) {
    document.getElementById('win').removeAttribute('style');
    if (char === 'X') {
      score[0]++;
      content.innerHTML = '\xA1Ganaste!, juguemos de nuevo';
      content.style.color = '#46a049';
      emotion = "Good"
      getSound('win');
    } else {
      score[1]++;
      content.innerHTML = 'Lo importante es divertirse, \xA1int\xE9ntalo de nuevo!';
      content.style.color = '#f21c0d';
      emotion = "Bad"
      getSound('lose');
    };
    sendInfo("GameEmotion", emotion);
  } else if (checkDraw()) {
    document.getElementById('win').removeAttribute('style');
    content.innerHTML = 'Bien hecho, fue un buen juego';
    content.style.color = '#989898';
    emotion = "Neutral"
    getSound('draw');
    sendInfo("GameEmotion", emotion);
  };

  char = (char === 'X') ? 'O' : 'X';
  if (char === 'O' && !checkWin('X') && !checkDraw()) {
    nextStep(ai());
  };
};

function getSound(status) {
  var audio = new Audio();
  if (status == 'win') audio.src = 'sounds/win.mp3';
  else if (status == 'lose') audio.src = 'sounds/lose.mp3';
  else audio.src = 'sounds/draw.mp3';
  audio.autoplay = true;
};

function restart() {
  document.getElementById('board').style.backgroundColor = "";
  document.getElementById('win').style.display = 'none';
  for (var i = 0; i < fields.length; i++) {
    fields[i].innerHTML = '&' + 'nbsp';
    fields[i].removeAttribute('style');
    fields[i].addEventListener('click', nextStep);
    if (fields[i].hasAttribute('used')) {
      fields[i].removeAttribute('used');
    };
  };
  getScore();
  if (char === 'O') nextStep(ai());
};

function gameOver() {
  document.getElementById('win').style.display = 'none';
  for (var i = 0; i < fields.length; i++) {
    fields[i].removeEventListener('click', nextStep);
    fields[i].style.cursor = 'default';
    if (fields[i].style.background != 'rgb(225, 96, 96)') fields[i].style.background = '#609CE1';
  };
  sendInfo("GameEnded", "");
  getScore();
};

function sendInfo(key, value) {
  try {
    QiSession(function (session) {
      session.service("ALMemory").then(function (memory) {
        memory.insertData(key, value);
      }, function (error) {
        alert("Ocurre un error: " + error);
      });
    }, function () {
      alert("Desconectado");
    });
  } catch (err) {
    alert(err.message);
  }
}

function init() {
  fields = document.getElementsByClassName('field');
  for (var i = 0; i < fields.length; i++) {
    fields[i].addEventListener('click', nextStep);
  };
  getScore();
};

window.onload = init;
