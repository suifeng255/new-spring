// 十二生肖图标数组（包含马🐴，突出马年主题）
const zodiacIcons = ['🐭', '🐂', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐵', '🐔', '🐶', '🐷'];

const matchScore = document.getElementById('matchScore');
const matchGrid = document.getElementById('matchGrid');
const startMatchGame = document.getElementById('startMatchGame');
const pauseMatchGame = document.getElementById('pauseMatchGame');
const resetMatchGame = document.getElementById('resetMatchGame');
// 新增：通关提示层相关元素
const successOverlay = document.getElementById('successOverlay');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

// 新增：绑定再来一局按钮事件
restartBtn.addEventListener('click', function () {
    // 隐藏通关提示层
    successOverlay.classList.remove('show');
    // 重置游戏
    resetMatchGameFunc();
});
let mgGameScore = 0; // 当前游戏得分
let mgGameRunning = false; // 游戏是否运行中
let mgGamePaused = false; // 游戏是否暂停
let flippedCards = []; // 存储当前已翻转但未配对的卡片（最多3张）
let matchedPairs = 0; // 已成功配对的对数
let gameCards = []; // 存储所有游戏卡片的DOM元素，方便批量操作

// 开始/继续按钮点击事件
startMatchGame.addEventListener('click', function () {
    // 游戏未运行：执行开始游戏逻辑
    if (!mgGameRunning) {
        startMatchGameFunc();
    }
    // 游戏已暂停：执行恢复游戏逻辑
    else if (mgGamePaused) {
        resumeMatchGame();
    }
});

// 暂停按钮点击事件
pauseMatchGame.addEventListener('click', pauseMatchGameFunc);
// 重置按钮点击事件
resetMatchGame.addEventListener('click', resetMatchGameFunc);

// ===================== 游戏核心逻辑函数 =====================
/**
 * 开始游戏核心函数
 * 初始化游戏状态、重置数据、生成卡片、更新按钮状态
 */
function startMatchGameFunc() {
    // 更新游戏状态
    mgGameRunning = true;
    mgGamePaused = false;
    // 重置游戏数据
    mgGameScore = 0;
    matchedPairs = 0;
    flippedCards = [];
    // 更新分数显示
    updateMatchScore();
    // 生成游戏卡片
    generateMatchCards();

    // 更新按钮状态
    startMatchGame.textContent = '继续'; // 开始按钮变为“继续”
    pauseMatchGame.disabled = false; // 暂停按钮可用
    resetMatchGame.disabled = false; // 重置按钮可用
}

/**
 * 暂停游戏核心函数
 * 标记暂停状态，更新按钮文字，禁用卡片点击，设置半透明
 */
function pauseMatchGameFunc() {
    // 仅当游戏运行且未暂停时执行
    if (mgGameRunning && !mgGamePaused) {
        mgGamePaused = true; // 标记为暂停状态
        startMatchGame.textContent = '继续'; // 开始按钮显示“继续”
        // 遍历所有卡片，设置半透明并禁止点击
        gameCards.forEach(card => {
            card.style.opacity = '0.5'; // 半透明，视觉提示暂停
            card.style.pointerEvents = 'none'; // 禁止点击
        });
    }
}

/**
 * 恢复游戏核心函数
 * 取消暂停状态，恢复卡片样式和点击功能
 */
function resumeMatchGame() {
    mgGamePaused = false; // 取消暂停状态
    startMatchGame.textContent = '继续'; // 保持按钮文字为“继续”
    // 遍历所有卡片，恢复不透明并允许点击
    gameCards.forEach(card => {
        card.style.opacity = '1'; // 恢复正常透明度
        card.style.pointerEvents = 'auto'; // 允许点击
    });
}

/**
 * 停止游戏核心函数
 * 重置所有游戏状态和数据，清空卡片网格，恢复按钮初始状态
 */
function stopMatchGame() {
    // 重置游戏状态
    mgGameRunning = false;
    mgGamePaused = false;
    // 重置游戏数据
    mgGameScore = 0;
    matchedPairs = 0;
    flippedCards = [];
    // 更新分数显示
    updateMatchScore();
    // 清空卡片网格
    matchGrid.innerHTML = '';

    // 重置按钮初始状态
    startMatchGame.textContent = '开始'; // 按钮变回“开始”
    pauseMatchGame.disabled = true; // 暂停按钮禁用
    resetMatchGame.disabled = true; // 重置按钮禁用
}

/**
 * 重置游戏核心函数
 * 先停止当前游戏，再重新开始游戏
 */
function resetMatchGameFunc() {
    stopMatchGame(); // 停止当前游戏
    startMatchGameFunc(); // 重新开始游戏
}

/**
 * 生成消消乐卡片函数
 * 逻辑：1. 随机选8个生肖 2. 生成配对数组（8对=16张） 3. 打乱顺序 4. 创建卡片DOM并绑定事件
 */
function generateMatchCards() {
    // 清空卡片网格（避免重复生成）
    matchGrid.innerHTML = '';
    // 清空卡片数组
    gameCards = [];

    // 1. 从12个生肖中随机筛选8个（保证每次游戏卡片不同）
    // 先打乱原数组，再截取前8个
    const randomZodiacs = [...zodiacIcons].sort(() => 0.5 - Math.random()).slice(0, 8);
    // 2. 生成配对数组（8个生肖 × 2 = 16张卡片），然后再次打乱顺序
    const pairZodiacs = [...randomZodiacs, ...randomZodiacs].sort(() => 0.5 - Math.random());

    // 3. 循环创建卡片DOM元素
    pairZodiacs.forEach((icon, index) => {
        const card = document.createElement('div');
        card.className = 'match-card'; // 设置卡片基础样式类
        card.dataset.index = index; // 存储卡片索引（备用）
        card.dataset.icon = icon; // 存储卡片对应的生肖图标（核心：用于配对检测）
        card.textContent = icon; // 设置卡片文字（生肖图标）
        // 4. 绑定卡片点击事件：点击时执行翻牌逻辑
        card.addEventListener('click', () => flipCard(card));
        // 将卡片添加到网格容器
        matchGrid.appendChild(card);
        // 将卡片存入全局数组，方便后续批量操作
        gameCards.push(card);
    });
}

/**
 * 卡片翻牌核心函数（游戏核心逻辑）
 * 包含：翻牌过滤、翻牌执行、配对检测、计分规则、通关判定
 * @param {HTMLElement} card - 被点击的卡片DOM元素
 */
function flipCard(card) {
    // 过滤不可翻牌的场景（核心：避免无效操作）
    // 1. 游戏暂停 2. 卡片已配对 3. 卡片已翻转 → 直接返回，不执行翻牌
    if (mgGamePaused || card.classList.contains('matched') || card.classList.contains('flipped')) {
        return;
    }

    // 执行翻牌：添加flipped类，显示生肖图标
    card.classList.add('flipped');
    // 将翻牌的卡片加入已翻转数组
    flippedCards.push(card);

    // 场景1：已翻转2张卡片 → 检测是否配对
    if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards; // 解构获取两张卡片
        // 配对成功：两张卡片的生肖图标相同
        if (card1.dataset.icon === card2.dataset.icon) {
            // 添加matched类，标记为已配对（绿色背景，禁止点击）
            card1.classList.add('matched');
            card2.classList.add('matched');
            // 已配对对数+1
            matchedPairs++;
            // 计分：配对成功+20分
            mgGameScore += 20;
            // 更新分数显示
            updateMatchScore();
            // 清空已翻转数组，准备下一轮翻牌
            flippedCards = [];

            // 通关判定：8对卡片全部配对完成（16张卡片=8对）
            if (matchedPairs === 8) {
                // 延迟500ms显示提示（让最后一张卡片的动画完成）
                setTimeout(() => {
                    // 填充最终得分
                    finalScore.textContent = `最终得分：${mgGameScore}`;
                    // 显示通关提示层
                    successOverlay.classList.add('show');
                    // 停止游戏（保留按钮状态，方便重新开始）
                    // stopMatchGame(); // 注释掉原stopMatchGame，避免重置按钮状态
                }, 500);
            }
        }
    }

    // 场景2：已翻转3张卡片 → 配对失败（规则：最多同时翻2张，第3张触发失败逻辑）
    if (flippedCards.length === 3) {
        // 延迟800ms翻回卡片（让用户看清3张卡片的内容）
        setTimeout(() => {
            // 遍历所有已翻转但未配对的卡片，取消翻转状态
            flippedCards.forEach(card => {
                if (!card.classList.contains('matched')) {
                    card.classList.remove('flipped');
                }
            });
            // 计分：配对失败-5分，最低0分（避免负分）
            mgGameScore = Math.max(0, mgGameScore - 5);
            // 更新分数显示
            updateMatchScore();
            // 清空已翻转数组
            flippedCards = [];
        }, 800);
    }
}

/**
 * 更新分数显示函数
 * 同步全局得分变量到页面显示
 */
function updateMatchScore() {
    matchScore.textContent = `得分：${mgGameScore}`;
}