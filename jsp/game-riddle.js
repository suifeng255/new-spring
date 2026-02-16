const riddleData = [
  {
    question: "转眼又是岁末（打一字）",
    options: ["夕", "名", "罗", "暮"],
    answer: 2,
    explanation: "眼”为“目”，转过来为“罒”，加“岁”末之“夕”，合为“罗”字。"
  },
  {
    question: "岁首迎来马蹄声（打一字）",
    options: ["马", "山", "岂", "岁"],
    answer: 2,
    explanation: "岁首”为“山”，加马蹄象形“己”，合为“岂”。"
  },
  {
    question: "千里之行始于足下（打一字）",
    options: ["踵", "重", "千", "里"],
    answer: 1,
    explanation: "千”+“里”相合，即为“重”，千里象征骏马。"
  },
  {
    question: "马入山门便建功（打一字）",
    options: ["闯", "闲", "问", "闪"],
    answer: 0,
    explanation: "门”中有“马”，组合成“闯”，寓意马年闯出新气象。"
  },
  {
    question: "半畔残春伴马行（打一字）",
    options: ["骄", "乔", "侨", "荞"],
    answer: 0,
    explanation: "残春”取“乔”，旁配“马”，合为“骄”，含马年骄傲向前之意。"
  },
  {
    question: "四方同心助马行（打一字）",
    options: ["驷", "四", "西", "洒"],
    answer: 0,
    explanation: "四方”为“四”，配“马”，合为“驷”，古指骏马。"
  },
  {
    question: "一口咬定马前头（打一字）",
    options: ["吗", "马", "口", "弓"],
    answer: 0,
    explanation: "口”在“马”前，组合成“吗”，拆字清晰工整。"
  },
  {
    question: "除夕迎来一马蹄（打一字）",
    options: ["舛", "夕", "一", "马"],
    answer: 0,
    explanation: "夕”加“一”加马蹄形，合为“舛”，除夕迎新之意。"
  },
  {
    question: "新春前头添吉庆（打一字）",
    options: ["志", "吉", "士", "喜"],
    answer: 1,
    explanation: "新前头”为“亲”上，加“口”为“吉”，寓意新春吉祥。"
  },
  {
    question: "人人并肩迎马年（打一字）",
    options: ["从", "众", "俩", "仁"],
    answer: 0,
    explanation: "人人”并肩为“从”，迎马年，结构严谨无歧义。"
  }
];
// ===================== DOM元素获取 =====================
const riddleScore = document.getElementById('riddleScore'); // 分数显示元素
const riddleQuestion = document.getElementById('riddleQuestion'); // 题目显示元素
const riddleOptions = document.getElementById('riddleOptions'); // 选项容器
const riddleFeedback = document.getElementById('riddleFeedback'); // 答题反馈元素
const nextRiddleBtn = document.getElementById('nextRiddleBtn'); // 下一题按钮
const riddleProgress = document.getElementById('riddleProgress'); // 进度条填充元素
const progressText = document.getElementById('progressText'); // 进度文本（如1/5）
const riddleResult = document.getElementById('riddleResult'); // 答题结果容器
const accuracyRate = document.getElementById('accuracyRate'); // 正确率显示
const totalTime = document.getElementById('totalTime'); // 总用时显示
const restartRiddleBtn = document.getElementById('restartRiddleBtn'); // 重新答题按钮

// ===================== 游戏状态变量 =====================
let currentRiddleIndex = 0; // 当前题目索引（从0开始）
let riddleCorrectCount = 0; // 答对题数
let riddleStartTime = 0; // 答题开始时间（用于计算总用时）
let riddleTotalTime = 0; // 总答题用时（秒）

// ===================== 初始化游戏 =====================
// 页面加载后立即重置并启动游戏
resetRiddleGame();

// ===================== 事件绑定 =====================
// 下一题按钮点击事件
nextRiddleBtn.addEventListener('click', function () {
    // 当前题目索引+1，切换到下一题
    currentRiddleIndex++;

    // 判定：如果当前索引超出题目总数（答题结束）
    if (currentRiddleIndex >= riddleData.length) {
        // 计算总用时：当前时间 - 开始时间，转换为秒并取整
        riddleTotalTime = Math.floor((new Date().getTime() - riddleStartTime) / 1000);
        // 计算正确率：(答对题数/总题数)*100，取整
        const accuracy = Math.floor((riddleCorrectCount / riddleData.length) * 100);
        // 更新正确率和总用时显示
        accuracyRate.textContent = accuracy;
        totalTime.textContent = riddleTotalTime;
        // 显示答题结果区域
        riddleResult.style.display = 'block';
        return; // 终止函数，不再执行后续逻辑
    }

    // 未结束：显示下一题
    showCurrentRiddle();
    // 隐藏答题反馈（清除样式和显示状态）
    riddleFeedback.classList.remove('show', 'correct', 'incorrect');
    // 禁用下一题按钮（答题后才启用）
    nextRiddleBtn.disabled = true;
    // 更新进度条和进度文本
    updateRiddleProgress();
});

// 重新答题按钮点击事件
restartRiddleBtn.addEventListener('click', function () {
    // 隐藏答题结果区域
    riddleResult.style.display = 'none';
    // 重置游戏状态，重新开始答题
    resetRiddleGame();
});

// ===================== 游戏核心逻辑函数 =====================
/**
 * 重置游戏函数
 * 初始化所有状态变量，重新开始答题流程
 */
function resetRiddleGame() {
    currentRiddleIndex = 0; // 重置当前题目索引为第1题
    riddleCorrectCount = 0; // 重置答对题数为0
    riddleTotalTime = 0; // 重置总用时为0
    riddleStartTime = new Date().getTime(); // 记录新的答题开始时间
    // 显示第1题
    showCurrentRiddle();
    // 隐藏答题反馈
    riddleFeedback.classList.remove('show', 'correct', 'incorrect');
    // 禁用下一题按钮
    nextRiddleBtn.disabled = true;
    // 更新分数显示
    updateRiddleScore();
    // 更新进度条和进度文本
    updateRiddleProgress();
}

/**
 * 显示当前题目函数
 * 核心逻辑：根据当前索引获取题目数据，动态生成选项并绑定点击事件
 */
function showCurrentRiddle() {
    // 获取当前题目数据
    const riddle = riddleData[currentRiddleIndex];
    // 更新题目显示
    riddleQuestion.textContent = riddle.question;
    // 清空选项容器（避免重复生成）
    riddleOptions.innerHTML = '';

    // 循环生成选项DOM元素
    riddle.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'riddle-option'; // 设置选项基础样式类
        optionEl.dataset.index = index; // 存储选项索引（用于判断是否答对）
        optionEl.textContent = option; // 设置选项文字

        // 绑定选项点击事件（答题核心逻辑）
        optionEl.addEventListener('click', function () {
            // 防重复点击：如果已有正确选项标记，直接返回
            if (document.querySelector('.riddle-option.correct')) return;

            // 获取选中选项的索引
            const selectedIdx = parseInt(this.dataset.index);
            // 判断是否答对：选中索引 === 正确答案索引
            const isCorrect = selectedIdx === riddle.answer;

            // 标记答题结果
            if (isCorrect) {
                // 答对：给选中选项添加correct样式
                this.classList.add('correct');
                // 答对题数+1
                riddleCorrectCount++;
                // 设置答对反馈文本（包含解析）
                riddleFeedback.textContent = `恭喜你，答对了！${riddle.explanation}`;
                // 显示答对反馈（添加show和correct样式）
                riddleFeedback.classList.add('show', 'correct');
            } else {
                // 答错：给选中选项添加incorrect样式
                this.classList.add('incorrect');
                // 标记正确答案（给正确选项添加correct样式）
                document.querySelectorAll('.riddle-option')[riddle.answer].classList.add('correct');
                // 设置答错反馈文本（提示正确答案+解析）
                riddleFeedback.textContent = `答错啦～正确答案：${riddle.options[riddle.answer]}。${riddle.explanation}`;
                // 显示答错反馈（添加show和incorrect样式）
                riddleFeedback.classList.add('show', 'incorrect');
            }

            // 更新分数显示
            updateRiddleScore();
            // 启用下一题按钮
            nextRiddleBtn.disabled = false;
        });

        // 将选项添加到选项容器
        riddleOptions.appendChild(optionEl);
    });
}

/**
 * 更新分数显示函数
 * 同步答对题数和当前答题数到页面
 */
function updateRiddleScore() {
    riddleScore.textContent = `答对：${riddleCorrectCount} / ${currentRiddleIndex + 1}`;
}

/**
 * 更新进度条函数
 * 计算当前答题进度，更新进度条宽度和进度文本
 */
function updateRiddleProgress() {
    // 计算进度百分比：(当前题数/总题数)*100
    const progress = ((currentRiddleIndex + 1) / riddleData.length) * 100;
    // 更新进度条宽度
    riddleProgress.style.width = `${progress}%`;
    // 更新进度文本（如1/5、2/5...）
    progressText.textContent = `${currentRiddleIndex + 1}/${riddleData.length}`;
}