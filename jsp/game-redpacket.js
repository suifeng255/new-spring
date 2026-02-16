const redPacketScore = document.getElementById('redPacketScore');
const redPacketGameArea = document.getElementById('redPacketGameArea');
const player = document.getElementById('player');
const startRedPacketGame = document.getElementById('startRedPacketGame');
const pauseRedPacketGame = document.getElementById('pauseRedPacketGame');
const resetRedPacketGame = document.getElementById('resetRedPacketGame');
const redPacketCount = document.getElementById('redPacketCount');
const trapCount = document.getElementById('trapCount');
const rankList = document.getElementById('rankList');
const countdownEl = document.getElementById('countdown');
const gameOverEl = document.getElementById('gameOver');
const moveLeftBtn = document.getElementById('moveLeftBtn');
const moveRightBtn = document.getElementById('moveRightBtn');

let rpGameScore = 0; // 当前得分
let rpGameInterval = null; // 生成红包/陷阱红包的定时器
let rpGameRunning = false; // 游戏是否运行中
let rpGamePaused = false; // 游戏是否暂停
let rpGameTime = 0; // 游戏运行时间（备用）
let rpTimeInterval = null; // 备用定时器
let redPacketCatchCount = 0; // 已接普通红包数量
let trapCatchCount = 0; // 已接陷阱红包数量
let rankData = []; // 排行榜数据（存储得分和用时）
let countdownTime = 60; // 倒计时总时长（60秒）
let countdownInterval = null; // 倒计时定时器

// 初始化排行榜（页面加载时执行）
initRankList();

// 开始/继续游戏按钮点击事件
startRedPacketGame.addEventListener('click', function () {
    // 如果游戏未运行，执行开始游戏逻辑
    if (!rpGameRunning) {
        startRedPacketGameFunc();
    }
    // 如果游戏已暂停，执行恢复游戏逻辑
    else if (rpGamePaused) {
        resumeRedPacketGame();
    }
});

pauseRedPacketGame.addEventListener('click', pauseRedPacketGameFunc);
resetRedPacketGame.addEventListener('click', resetRedPacketGameFunc);

// 左移按钮点击事件
moveLeftBtn.addEventListener('click', function () {
    // 游戏未运行或暂停时，不执行移动
    if (!rpGameRunning || rpGamePaused) return;

    // 获取玩家和游戏区域的位置信息
    const playerRect = player.getBoundingClientRect();
    const gameAreaRect = redPacketGameArea.getBoundingClientRect();
    const moveStep = 25; // 每次移动步长（像素）

    // 确保玩家不超出游戏区域左侧边界
    if (playerRect.left > gameAreaRect.left) {
        player.style.left = `${player.offsetLeft - moveStep}px`;
    }
});

// 右移按钮点击事件
moveRightBtn.addEventListener('click', function () {
    // 游戏未运行或暂停时，不执行移动
    if (!rpGameRunning || rpGamePaused) return;

    // 获取玩家和游戏区域的位置信息
    const playerRect = player.getBoundingClientRect();
    const gameAreaRect = redPacketGameArea.getBoundingClientRect();
    const moveStep = 25; // 每次移动步长（像素）

    // 确保玩家不超出游戏区域右侧边界
    if (playerRect.right < gameAreaRect.right) {
        player.style.left = `${player.offsetLeft + moveStep}px`;
    }
});

// 键盘方向键控制
document.addEventListener('keydown', function (e) {
    // 游戏未运行或暂停时，不响应键盘事件
    if (!rpGameRunning || rpGamePaused) return;

    // 获取位置信息
    const playerRect = player.getBoundingClientRect();
    const gameAreaRect = redPacketGameArea.getBoundingClientRect();
    const moveStep = 15; // 键盘移动步长（比按钮小，更精细）

    // 根据按键执行不同逻辑
    switch (e.key) {
        case 'ArrowLeft': // 左方向键
            if (playerRect.left > gameAreaRect.left) {
                player.style.left = `${player.offsetLeft - moveStep}px`;
            }
            break;
        case 'ArrowRight': // 右方向键
            if (playerRect.right < gameAreaRect.right) {
                player.style.left = `${player.offsetLeft + moveStep}px`;
            }
            break;
    }
});

// 移动端触摸控制，适配手机端，但AI给出的触摸点在手机上无法长按控制
redPacketGameArea.addEventListener('touchmove', function (e) {
    // 游戏未运行或暂停时，不响应触摸事件
    if (!rpGameRunning || rpGamePaused) return;

    e.preventDefault(); // 阻止默认触摸行为（如页面滚动）
    const touch = e.touches[0]; // 获取第一个触摸点
    const gameAreaRect = redPacketGameArea.getBoundingClientRect(); // 游戏区域位置
    const playerHalfWidth = player.offsetWidth / 2; // 玩家半宽（用于居中）
    const relativeX = touch.clientX - gameAreaRect.left; // 触摸点相对于游戏区域的X坐标

    // 确保玩家不超出游戏区域边界
    if (relativeX > playerHalfWidth && relativeX < gameAreaRect.width - playerHalfWidth) {
        player.style.left = `${relativeX - playerHalfWidth}px`;
    }
});

/**
 * 开始游戏函数
 * 初始化游戏状态、重置数据、启动定时器、更新UI
 */
function startRedPacketGameFunc() {
    // 更新游戏状态
    rpGameRunning = true;
    rpGamePaused = false;
    // 重置游戏数据
    rpGameScore = 0;
    rpGameTime = 0;
    redPacketCatchCount = 0;
    trapCatchCount = 0;
    countdownTime = 60; // 重置倒计时为60秒
    // 隐藏游戏结束提示
    gameOverEl.style.display = 'none';
    // 更新分数和倒计时显示
    updateRedPacketScore();
    updateCountdown();

    // 重置玩家位置到游戏区域底部居中
    player.style.left = '50%';
    // 清空游戏区域内的所有红包/陷阱红包
    clearRedPacketGameArea();

    // 启动生成红包/陷阱红包的定时器（每800ms生成一个）
    rpGameInterval = setInterval(spawnRedPacketOrTrap, 800);

    // 启动倒计时定时器（每秒执行一次）
    countdownInterval = setInterval(function () {
        countdownTime--; // 倒计时减1
        updateCountdown(); // 更新倒计时显示

        // 倒计时结束，执行游戏结束逻辑
        if (countdownTime <= 0) {
            clearInterval(countdownInterval); // 清除倒计时定时器
            endRedPacketGame(); // 结束游戏
        }
    }, 1000);

    // 更新按钮状态
    startRedPacketGame.textContent = '继续'; // 开始按钮变为“继续”
    pauseRedPacketGame.disabled = false; // 暂停按钮可用
    resetRedPacketGame.disabled = false; // 重置按钮可用
}

/**
 * 暂停游戏函数
 * 暂停定时器、暂停动画、更新按钮状态
 */
function pauseRedPacketGameFunc() {
    // 仅当游戏运行且未暂停时执行
    if (rpGameRunning && !rpGamePaused) {
        rpGamePaused = true; // 标记为暂停状态
        clearInterval(rpGameInterval); // 清除生成红包的定时器
        clearInterval(countdownInterval); // 清除倒计时定时器

        // 暂停所有红包/陷阱红包的下落动画
        document.querySelectorAll('.red-packet, .trap-packet').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
        startRedPacketGame.textContent = '继续'; // 开始按钮显示“继续”
    }
}

/**
 * 恢复游戏函数
 * 重启定时器、恢复动画、更新状态
 */
function resumeRedPacketGame() {
    rpGamePaused = false; // 取消暂停状态
    // 重启生成红包的定时器
    rpGameInterval = setInterval(spawnRedPacketOrTrap, 800);

    // 重启倒计时定时器
    countdownInterval = setInterval(function () {
        countdownTime--;
        updateCountdown();

        // 倒计时结束，结束游戏
        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            endRedPacketGame();
        }
    }, 1000);

    // 恢复所有红包/陷阱红包的下落动画
    document.querySelectorAll('.red-packet, .trap-packet').forEach(el => {
        el.style.animationPlayState = 'running';
    });
}

/**
 * 结束游戏函数
 * 停止定时器、显示游戏结束、更新排行榜、重置按钮状态
 */
function endRedPacketGame() {
    // 更新游戏状态
    rpGameRunning = false;
    rpGamePaused = false;
    // 清除所有定时器
    clearInterval(rpGameInterval);
    clearInterval(countdownInterval);
    // 显示游戏结束提示
    gameOverEl.style.display = 'block';

    // 更新排行榜：添加当前成绩，按得分降序排序，只保留前5名
    rankData.push({ score: rpGameScore, time: 60 - countdownTime });
    rankData = rankData.sort((a, b) => b.score - a.score).slice(0, 5);
    initRankList(); // 重新渲染排行榜

    // 重置按钮状态
    startRedPacketGame.textContent = '开始'; // 继续按钮变回“开始”
    pauseRedPacketGame.disabled = true; // 暂停按钮禁用
}

/**
 * 停止游戏函数
 * 完全停止游戏，重置所有数据和UI
 */
function stopRedPacketGame() {
    // 更新游戏状态
    rpGameRunning = false;
    rpGamePaused = false;
    // 清除所有定时器
    clearInterval(rpGameInterval);
    clearInterval(countdownInterval);
    // 清空游戏区域
    clearRedPacketGameArea();
    // 隐藏游戏结束提示
    gameOverEl.style.display = 'none';

    // 重置所有游戏数据
    rpGameScore = 0;
    rpGameTime = 0;
    redPacketCatchCount = 0;
    trapCatchCount = 0;
    countdownTime = 60;
    // 更新UI显示
    updateRedPacketScore();
    updateCountdown();
    // 重置玩家位置
    player.style.left = '50%';

    // 重置按钮状态
    startRedPacketGame.textContent = '开始';
    pauseRedPacketGame.disabled = true;
    resetRedPacketGame.disabled = true;
}

/**
 * 重置游戏函数
 * 先停止游戏，再重新开始
 */
function resetRedPacketGameFunc() {
    stopRedPacketGame(); // 停止当前游戏
    startRedPacketGameFunc(); // 重新开始游戏
}

/**
 * 清空游戏区域函数
 * 删除所有红包/陷阱红包元素
 */
function clearRedPacketGameArea() {
    document.querySelectorAll('.red-packet, .trap-packet').forEach(el => el.remove());
}

/**
 * 更新倒计时显示函数
 * 更新倒计时文本，倒计时少于10秒时高亮
 */
function updateCountdown() {
    // 更新倒计时文本
    countdownEl.textContent = `倒计时：${countdownTime}秒`;
    // 倒计时少于10秒时，文字加粗高亮
    if (countdownTime <= 10) {
        countdownEl.style.color = '#e74c3c';
        countdownEl.style.fontWeight = 'bold';
    } else {
        // 恢复默认样式
        countdownEl.style.color = '#e74c3c';
        countdownEl.style.fontWeight = '600';
    }
}

/**
 * 生成红包/陷阱红包函数
 * 随机生成普通红包（75%）或陷阱红包（25%），设置位置和动画，绑定碰撞检测
 */
function spawnRedPacketOrTrap() {
    const gameAreaWidth = redPacketGameArea.offsetWidth; // 游戏区域宽度
    // 随机类型：75%概率普通红包，25%概率陷阱红包
    const randomType = Math.random();
    let element, isRedPacket, isTrapPacket;

    // 创建普通红包元素
    if (randomType < 0.75) {
        element = document.createElement('div');
        element.className = 'red-packet';
        isRedPacket = true;
        isTrapPacket = false;
    }
    // 创建陷阱红包元素
    else {
        element = document.createElement('div');
        element.className = 'trap-packet';
        isRedPacket = false;
        isTrapPacket = true;
    }

    // 随机X坐标（避免贴边，左右各留40px）
    const randomX = Math.random() * (gameAreaWidth - 80) + 40;
    element.style.left = `${randomX}px`;
    // 随机下落动画时长（2-5秒），让红包下落速度不同
    const fallDuration = Math.random() * 3 + 2;
    element.style.animationDuration = `${fallDuration}s`;

    // 将红包/陷阱红包添加到游戏区域
    redPacketGameArea.appendChild(element);

    // 碰撞检测定时器（每50ms检测一次）
    const collisionCheck = setInterval(function () {
        // 获取元素（红包/陷阱）、玩家、游戏区域的位置信息
        const elRect = element.getBoundingClientRect();
        const pRect = player.getBoundingClientRect();
        const gameAreaRect = redPacketGameArea.getBoundingClientRect();

        // 碰撞检测逻辑：元素与玩家的矩形区域重叠
        if (elRect.bottom >= pRect.top && elRect.top <= pRect.bottom && elRect.right >= pRect.left && elRect.left <= pRect.right) {
            clearInterval(collisionCheck); // 清除碰撞检测定时器
            element.remove(); // 移除当前元素

            // 接到普通红包：加分，更新统计
            if (isRedPacket) {
                rpGameScore += 5; // 加5分
                redPacketCatchCount++; // 普通红包计数+1
                updateRedPacketScore(); // 更新UI
            }
            // 接到陷阱红包：扣分（最低0分），震动效果，更新统计
            else if (isTrapPacket) {
                rpGameScore = Math.max(0, rpGameScore - 10); // 扣10分，最低0分
                trapCatchCount++; // 陷阱红包计数+1
                updateRedPacketScore(); // 更新UI
                // 触发玩家震动动画
                player.style.animation = 'shake 0.5s';
                // 0.5秒后清除动画，恢复默认状态
                setTimeout(() => player.style.animation = '', 500);
            }
        }

        // 落地检测：元素顶部超出游戏区域底部，说明已落地
        if (elRect.top > gameAreaRect.bottom) {
            clearInterval(collisionCheck); // 清除碰撞检测定时器
            element.remove(); // 移除元素
        }
    }, 50);

    // 动画结束后移除元素（兜底，防止碰撞检测遗漏）
    setTimeout(() => element.remove(), fallDuration * 1000);
}

/**
 * 更新分数和统计显示函数
 * 更新得分、红包计数、陷阱计数，实时更新排行榜预览
 */
function updateRedPacketScore() {
    // 更新得分显示
    redPacketScore.textContent = `得分：${rpGameScore}`;
    // 更新红包/陷阱计数显示
    redPacketCount.textContent = redPacketCatchCount;
    trapCount.textContent = trapCatchCount;

    // 游戏运行且未暂停时，实时更新排行榜预览
    if (rpGameRunning && !rpGamePaused) {
        // 临时排行榜数据：现有数据 + 当前游戏数据
        const tempRankData = [...rankData, { score: rpGameScore, time: 60 - countdownTime }];
        // 按得分降序排序，保留前5名
        const sortedTempData = tempRankData.sort((a, b) => b.score - a.score).slice(0, 5);
        // 渲染临时排行榜
        renderRankList(sortedTempData);
    }
}

/**
 * 初始化排行榜函数
 * 调用渲染函数，显示排行榜数据
 */
function initRankList() {
    renderRankList(rankData);
}

/**
 * 渲染排行榜函数
 * 根据传入的数据，生成排行榜列表项
 * @param {Array} data - 排行榜数据数组，包含score和time属性
 */
function renderRankList(data) {
    rankList.innerHTML = ''; // 清空现有列表

    // 无数据时显示提示
    if (data.length === 0) {
        const li = document.createElement('li');
        li.textContent = '暂无游戏记录，快来挑战吧！';
        rankList.appendChild(li);
        return;
    }

    // 遍历数据，生成排行榜列表项
    data.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
                    <span>第${index + 1}名</span>
                    <span>得分：${item.score} | 用时：${item.time}s</span>
                `;
        rankList.appendChild(li);
    });
}