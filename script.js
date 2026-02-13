let game = {
    active: false,
    cash: parseInt(localStorage.getItem('fcm_cash')) || 0,
    record: parseInt(localStorage.getItem('fcm_record')) || 0,
    escort: parseInt(localStorage.getItem('fcm_escort')) || 0,
    speed: 5, pos: 50, dist: 0
};

window.onload = () => updateUI();

function updateUI() {
    document.getElementById('cash').innerText = Math.floor(game.cash);
    document.getElementById('menu-cash').innerText = Math.floor(game.cash);
    document.getElementById('highscore').innerText = game.record;
    document.getElementById('menu-record').innerText = game.record;

    if (game.escort >= 1) {
        document.getElementById('escort-left').classList.remove('hidden');
        document.getElementById('btn-esc-1').innerText = "OWNED";
        document.getElementById('btn-esc-1').disabled = true;
    }
    if (game.escort >= 2) {
        document.getElementById('escort-right').classList.remove('hidden');
        document.getElementById('btn-esc-2').innerText = "OWNED";
        document.getElementById('btn-esc-2').disabled = true;
    }
}

function startGame() {
    game.active = true;
    game.dist = 0;
    game.speed = 5;
    game.pos = 50;
    document.getElementById('main-menu').classList.add('hidden');
    document.querySelectorAll('.enemy').forEach(e => e.remove());
    updatePos();
    gameTick();
    spawnLoop();
}

function gameTick() {
    if (!game.active) return;
    
    game.dist++;
    game.cash += (1 + game.escort * 2);
    
    document.getElementById('cash').innerText = Math.floor(game.cash);
    document.getElementById('current-dist').innerText = game.dist;
    
    if (game.dist > game.record) {
        game.record = game.dist;
        document.getElementById('highscore').innerText = game.record;
    }

    if (game.dist % 250 === 0) game.speed += 0.4;
    requestAnimationFrame(gameTick);
}

function spawnLoop() {
    if (!game.active) return;
    let enemy = document.createElement('div');
    enemy.className = "enemy";
    enemy.style.left = (Math.random() * 65 + 15) + "%";
    enemy.style.top = "-80px";
    document.getElementById('road').appendChild(enemy);

    let move = setInterval(() => {
        if (!game.active) { clearInterval(move); enemy.remove(); return; }
        let y = parseInt(enemy.style.top) + game.speed;
        enemy.style.top = y + "px";

        let limo = document.getElementById('player-car').getBoundingClientRect();
        let en = enemy.getBoundingClientRect();

        if (en.bottom > limo.top && en.top < limo.bottom && en.right > limo.left && en.left < limo.right) {
            clearInterval(move);
            endGame();
        }
        if (y > window.innerHeight) { clearInterval(move); enemy.remove(); }
    }, 20);
    setTimeout(spawnLoop, Math.max(350, 1700 - (game.speed * 90)));
}

function endGame() {
    game.active = false;
    localStorage.setItem('fcm_cash', Math.floor(game.cash));
    localStorage.setItem('fcm_record', game.record);
    document.getElementById('menu-title').innerText = "MISSION FAILED";
    document.getElementById('main-menu').classList.remove('hidden');
    updateUI();
}

const moveLeft = () => { if(game.pos > 20) { game.pos -= 15; updatePos(); } };
const moveRight = () => { if(game.pos < 80) { game.pos += 15; updatePos(); } };
const updatePos = () => document.getElementById('player-car').style.left = game.pos + "%";

document.getElementById('btn-left').onclick = (e) => { e.preventDefault(); moveLeft(); };
document.getElementById('btn-right').onclick = (e) => { e.preventDefault(); moveRight(); };

document.addEventListener('keydown', (e) => {
    if(e.key === "ArrowLeft") moveLeft();
    if(e.key === "ArrowRight") moveRight();
});

function buyEscort(lv) {
    let p = lv === 1 ? 500 : 1500;
    if (game.cash >= p && game.escort === lv - 1) {
        game.cash -= p; game.escort = lv;
        localStorage.setItem('fcm_cash', game.cash);
        localStorage.setItem('fcm_escort', game.escort);
        updateUI();
    }
}
