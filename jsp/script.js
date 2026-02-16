// ==================== 全局变量 ====================
// 新春祝福数据（马年版）
const blessingData = [
    {
        title: "马年大吉",
        content: "马年到，福气到，马到成功展宏图，一马平川奔前程。愿你马年财运亨通，事业腾飞，家庭美满，幸福安康！",
        author: "新春祝福"
    },
    {
        title: "新春快乐",
        content: "新春佳节到，鞭炮声声辞旧岁，锣鼓喧天迎新年。愿你在马年里，所有的期待都能出现，所有的梦想都能实现，所有的希望都能如愿，所有的努力都能成功！",
        author: "新春祝福"
    },
    {
        title: "阖家幸福",
        content: "家是温馨的港湾，是永远的依靠。愿你马年阖家欢乐，幸福美满，父母安康，儿女聪慧，一家人其乐融融，共享天伦之乐！",
        author: "新春祝福"
    },
    {
        title: "事业有成",
        content: "马年新气象，事业节节高。愿你在马年里，工作顺利，步步高升，大展宏图，前程似锦，实现自己的人生价值！",
        author: "新春祝福"
    },
    {
        title: "财源广进",
        content: "金马送福，财源滚滚。愿你马年财运亨通，日进斗金，生意兴隆，投资顺利，钱包鼓鼓，富贵吉祥！",
        author: "新春祝福"
    }
];

// 生肖运势数据（马年版）
const zodiacFortuneData = [
    {
        zodiac: "鼠",
        name: "子鼠",
        fortune: {
            career: "事业上有贵人相助，适合拓展业务，尝试新的工作方法，能够取得不错的成绩。但需注意劳逸结合，避免过度劳累。",
            wealth: "财运平稳，正财收入稳定，偏财机会较少，不宜进行高风险投资。合理规划开支，能有不错的储蓄。",
            love: "感情运较好，单身者有机会遇到心仪的对象，已有伴侣者感情更加稳定，适合增进彼此的沟通和理解。",
            health: "健康状况良好，但需注意饮食卫生，避免肠胃疾病。适当运动，增强体质。"
        }
    },
    {
        zodiac: "牛",
        name: "丑牛",
        fortune: {
            career: "事业运上升，工作中能够得到领导的认可，有晋升的机会。但需注意团队合作，避免独断专行。",
            wealth: "财运较好，正财收入增加，偏财有意外收获。但需注意理财，避免盲目消费。",
            love: "感情运平稳，单身者桃花运一般，需主动出击；已有伴侣者感情稳定，适合共同规划未来。",
            health: "健康运一般，需注意关节和颈椎问题，避免久坐不动，适当进行户外活动。"
        }
    },
    {
        zodiac: "虎",
        name: "寅虎",
        fortune: {
            career: "事业运起伏较大，机遇与挑战并存。需保持冷静，谨慎决策，避免冲动行事。",
            wealth: "财运波动，正财稳定，偏财风险较大，不宜进行大额投资。需注意财务安全，避免破财。",
            love: "感情运较好，单身者有较多的桃花机会，需认真选择；已有伴侣者需注意沟通，避免争吵。",
            health: "健康运良好，精力充沛，但需注意心血管问题，保持良好的生活习惯。"
        }
    },
    {
        zodiac: "兔",
        name: "卯兔",
        fortune: {
            career: "事业运顺利，工作中能够发挥自己的优势，得到同事和领导的认可。适合学习新的技能，提升自己。",
            wealth: "财运不错，正财收入增加，偏财有小收获。需注意合理消费，避免铺张浪费。",
            love: "感情运佳，单身者有机会脱单，已有伴侣者感情甜蜜，适合考虑婚姻大事。",
            health: "健康运较好，需注意眼部健康，避免长时间使用电子产品。"
        }
    },
    {
        zodiac: "龙",
        name: "辰龙",
        fortune: {
            career: "事业运平稳，工作中需保持专注，避免分心。适合稳扎稳打，积累经验，为未来发展打下基础。",
            wealth: "财运一般，正财稳定，偏财机会较少。需注意理财，避免不必要的开支。",
            love: "感情运较好，单身者有机会遇到合适的对象，已有伴侣者感情升温，适合增进感情。",
            health: "健康运良好，需注意饮食规律，避免熬夜，保持良好的作息。"
        }
    },
    {
        zodiac: "蛇",
        name: "巳蛇",
        fortune: {
            career: "事业运上升，工作中能够展现自己的能力，有机会得到重用。需注意人际关系，避免与人发生冲突。",
            wealth: "财运不错，正财收入增加，偏财有意外之财。但需注意理性消费，避免挥霍。",
            love: "感情运波动，单身者桃花运较好，但需谨慎选择；已有伴侣者需注意沟通，避免误会。",
            health: "健康运较好，需注意运动安全，避免受伤。保持规律的作息，增强体质。"
        }
    },
    {
        zodiac: "马",
        name: "午马",
        fortune: {
            career: "本命年事业运旺盛，有大展宏图的机会。需把握机遇，勇于尝试，能够取得显著的成绩。",
            wealth: "财运亨通，正财偏财皆有收获，适合进行合理的投资。但需注意风险，避免贪心。",
            love: "感情运起伏，单身者桃花旺盛，需认真选择；已有伴侣者需注意感情稳定，避免争吵。",
            health: "健康运一般，需注意情绪管理，避免焦虑和压力过大。适当放松，保持心情愉悦。"
        }
    },
    {
        zodiac: "羊",
        name: "未羊",
        fortune: {
            career: "事业运一般，工作中需保持耐心，避免急躁。适合学习新知识，提升自己的竞争力。",
            wealth: "财运平稳，正财收入稳定，偏财机会较少。需注意储蓄，为未来做准备。",
            love: "感情运较好，单身者有机会脱单，已有伴侣者感情稳定，适合共同创造美好未来。",
            health: "健康运一般，需注意呼吸道问题，避免感冒。保持室内通风，适当锻炼。"
        }
    },
    {
        zodiac: "猴",
        name: "申猴",
        fortune: {
            career: "事业运较好，工作中能够发挥自己的聪明才智，有创新的机会。需注意团队合作，避免单打独斗。",
            wealth: "财运不错，正财收入增加，偏财有投资机会。但需注意风险，避免盲目跟风。",
            love: "感情运波动，单身者桃花较多，需认真选择；已有伴侣者需注意感情保鲜，避免平淡。",
            health: "健康运良好，需注意口腔健康，保持良好的卫生习惯。"
        }
    },
    {
        zodiac: "鸡",
        name: "酉鸡",
        fortune: {
            career: "事业运平稳，工作中需保持认真负责的态度，避免失误。适合按部就班，稳步发展。",
            wealth: "财运一般，正财稳定，偏财机会较少。需注意节约，避免不必要的开支。",
            love: "感情运较好，单身者有机会遇到心仪的对象，已有伴侣者感情甜蜜，适合共同规划未来。",
            health: "健康运较好，需注意肝脏健康，避免饮酒过量。保持清淡饮食，适当运动。"
        }
    },
    {
        zodiac: "狗",
        name: "戌狗",
        fortune: {
            career: "事业运上升，工作中能够得到贵人相助，有晋升的机会。需注意工作效率，避免拖延。",
            wealth: "财运不错，正财收入增加，偏财有小收获。需注意理财，避免盲目投资。",
            love: "感情运平稳，单身者桃花运一般，需主动争取；已有伴侣者感情稳定，适合增进彼此的了解。",
            health: "健康运一般，需注意肠胃问题，避免暴饮暴食。保持规律的饮食和作息。"
        }
    },
    {
        zodiac: "猪",
        name: "亥猪",
        fortune: {
            career: "事业运较好，工作中能够得到领导的赏识，有发展的机会。需注意细节，避免粗心大意。",
            wealth: "财运亨通，正财偏财皆有收获，适合进行合理的投资。但需注意风险，避免贪心。",
            love: "感情运佳，单身者有机会脱单，已有伴侣者感情甜蜜，适合考虑婚姻大事。",
            health: "健康运良好，需注意体重管理，避免过度饮食。保持适量运动，增强体质。"
        }
    }
];

// 马年开运小贴士
const fortuneTipsData = [
    "马年可佩戴马形饰品，增强自身运势，带来好运和福气。",
    "年初一早起开门迎福，摆放鲜花和绿植，增添喜庆氛围，提升家宅运势。",
    "马年宜穿橙色、金色衣物，辟邪招财，带来好运。",
    "保持积极乐观的心态，多行善事，积累福报，运势自然提升。",
    "马年可在家中或办公室摆放风水摆件，如金马、聚宝盆等，提升财运。",
    "注意人际关系，与人为善，避免争吵和冲突，保持和谐的人际关系。"
];

// ==================== DOM元素获取 ====================
// 音乐相关
const musicModal = document.getElementById('musicModal');
const musicAgreeBtn = document.getElementById('musicAgreeBtn');
const musicRefuseBtn = document.getElementById('musicRefuseBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
// 新增：音乐控制按钮
const musicControlBtn = document.getElementById('musicControlBtn');

// 加载动画
const loaderContainer = document.getElementById('loaderContainer');
// 头部按钮
const scrollDownBtn = document.getElementById('scrollDownBtn');
// 新春祝福
const blessingSlides = document.getElementById('blessingSlides');
const blessingPrevBtn = document.getElementById('blessingPrevBtn');
const blessingNextBtn = document.getElementById('blessingNextBtn');
const blessingInput = document.getElementById('blessingInput');
const generateBlessingBtn = document.getElementById('generateBlessingBtn');
const customBlessingCard = document.getElementById('customBlessingCard');
// 生肖运势
const zodiacTabs = document.getElementById('zodiacTabs');
const fortuneCard = document.getElementById('fortuneCard');
const tipsList = document.getElementById('tipsList');
// 返回顶部
const backToTop = document.getElementById('backToTop');

// ==================== 全局状态变量 ====================
// 祝福轮播
let currentBlessingIndex = 0;
// 生肖运势
let currentZodiacIndex = 6; // 默认显示马（午马）
// 新增：音乐播放状态
let isMusicPlaying = false;

// ==================== 页面初始化 - 音乐弹窗优先执行 ====================
document.addEventListener('DOMContentLoaded', function () {
    // 音乐选择弹窗事件绑定（页面最先执行）
    musicAgreeBtn.addEventListener('click', function () {
        backgroundMusic.play().catch(err => console.log('音乐播放失败:', err));
        isMusicPlaying = true; // 标记播放状态
        musicModal.style.display = 'none';
        initPage();
    });

    musicRefuseBtn.addEventListener('click', function () {
        isMusicPlaying = false; // 标记暂停状态
        musicModal.style.display = 'none';
        initPage();
    });
});

// 页面核心初始化（音乐选择后执行）
function initPage() {
    // 模拟加载过程
    setTimeout(function () {
        loaderContainer.classList.add('hidden');
    }, 1500);

    // 新增：初始化音乐控制按钮状态
    if (backgroundMusic.paused) {
        isMusicPlaying = false;
        musicControlBtn.textContent = '🎵 播放音乐';
        musicControlBtn.classList.remove('paused');
    } else {
        isMusicPlaying = true;
        musicControlBtn.textContent = '🎵 暂停音乐';
        musicControlBtn.classList.add('paused');
    }

    // 初始化所有模块
    initBlessingSlider();
    initZodiacFortune();
    initFortuneTips();

    // 绑定通用事件
    bindCommonEvents();
}

// ==================== 初始化函数 ====================
/**
 * 初始化新春祝福轮播
 */
function initBlessingSlider() {
    blessingData.forEach((blessing, index) => {
        const card = document.createElement('div');
        card.className = 'blessing-card';
        card.innerHTML = `
            <h3 class="blessing-card-title">${blessing.title}</h3>
            <p class="blessing-card-content">${blessing.content}</p>
            <p class="blessing-card-author">—— ${blessing.author}</p>
        `;
        blessingSlides.appendChild(card);
    });

    // 轮播按钮事件
    blessingPrevBtn.addEventListener('click', function () {
        currentBlessingIndex = (currentBlessingIndex - 1 + blessingData.length) % blessingData.length;
        updateBlessingSlider();
    });

    blessingNextBtn.addEventListener('click', function () {
        currentBlessingIndex = (currentBlessingIndex + 1) % blessingData.length;
        updateBlessingSlider();
    });

    // 自动轮播
    setInterval(function () {
        currentBlessingIndex = (currentBlessingIndex + 1) % blessingData.length;
        updateBlessingSlider();
    }, 5000);

    // 自定义祝福生成
    generateBlessingBtn.addEventListener('click', function () {
        const customText = blessingInput.value.trim();
        if (customText) {
            customBlessingCard.innerHTML = `<p class="custom-blessing-content">${customText}</p>`;
            customBlessingCard.classList.add('show');
            blessingInput.value = '';
        } else {
            alert('请输入你的新春祝福！');
        }
    });

    // 初始化轮播位置
    updateBlessingSlider();
}

/**
 * 更新祝福轮播显示
 */
function updateBlessingSlider() {
    const slideWidth = document.querySelector('.blessing-card').offsetWidth;
    blessingSlides.style.transform = `translateX(-${currentBlessingIndex * slideWidth}px)`;
}

/**
 * 初始化马年生肖运势
 */
function initZodiacFortune() {
    // 生成生肖标签
    zodiacFortuneData.forEach((zodiac, index) => {
        const tab = document.createElement('div');
        tab.className = `zodiac-tab ${index === currentZodiacIndex ? 'active' : ''}`;
        tab.dataset.index = index;
        tab.textContent = zodiac.name;

        tab.addEventListener('click', function () {
            currentZodiacIndex = parseInt(this.dataset.index);
            updateZodiacTabs();
            updateFortuneCard();
        });

        zodiacTabs.appendChild(tab);
    });

    // 初始化显示马的运势
    updateFortuneCard();
}

/**
 * 初始化马年开运小贴士
 */
function initFortuneTips() {
    fortuneTipsData.forEach(tip => {
        const li = document.createElement('li');
        li.className = 'tips-item';
        li.innerHTML = `
            <span class="tips-icon">⭐</span>
            <p class="tips-content">${tip}</p>
        `;
        tipsList.appendChild(li);
    });
}

/**
 * 更新生肖标签状态
 */
function updateZodiacTabs() {
    const tabs = document.querySelectorAll('.zodiac-tab');
    tabs.forEach((tab, index) => {
        tab.classList.toggle('active', index === currentZodiacIndex);
    });
}

/**
 * 更新运势卡片内容
 */
function updateFortuneCard() {
    const zodiac = zodiacFortuneData[currentZodiacIndex];
    fortuneCard.innerHTML = `
        <div class="fortune-header">
            <h3 class="fortune-zodiac">${zodiac.name} · 马年运势</h3>
            <p class="fortune-title">丙午马年 ${zodiac.zodiac}生肖运势详解</p>
        </div>
        <div class="fortune-grid">
            <div class="fortune-item">
                <h4 class="fortune-item-title">事业运势</h4>
                <p class="fortune-item-content">${zodiac.fortune.career}</p>
            </div>
            <div class="fortune-item">
                <h4 class="fortune-item-title">财富运势</h4>
                <p class="fortune-item-content">${zodiac.fortune.wealth}</p>
            </div>
            <div class="fortune-item">
                <h4 class="fortune-item-title">感情运势</h4>
                <p class="fortune-item-content">${zodiac.fortune.love}</p>
            </div>
            <div class="fortune-item">
                <h4 class="fortune-item-title">健康运势</h4>
                <p class="fortune-item-content">${zodiac.fortune.health}</p>
            </div>
        </div>
    `;
}

/**
 * 绑定通用页面事件
 */
function bindCommonEvents() {
    // 滚动到祝福模块
    scrollDownBtn.addEventListener('click', function () {
        document.querySelector('.blessing-section').scrollIntoView({ behavior: 'smooth' });
    });

    // 返回顶部按钮
    window.addEventListener('scroll', function () {
        backToTop.classList.toggle('show', window.scrollY > 300);
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 窗口大小变化更新轮播
    window.addEventListener('resize', debounce(updateBlessingSlider, 200));

    // 新增：音乐控制按钮点击事件
    musicControlBtn.addEventListener('click', toggleMusic);
}

// ==================== 新增：音乐控制函数 ====================
/**
 * 切换音乐播放/暂停状态
 */
function toggleMusic() {
    if (isMusicPlaying) {
        // 暂停音乐
        backgroundMusic.pause();
        musicControlBtn.textContent = '🎵 播放音乐';
        musicControlBtn.classList.remove('paused');
    } else {
        // 播放音乐
        backgroundMusic.play().catch(err => console.log('音乐播放失败:', err));
        musicControlBtn.textContent = '🎵 暂停音乐';
        musicControlBtn.classList.add('paused');
    }
    isMusicPlaying = !isMusicPlaying;
}

// ==================== 工具函数 ====================
/**
 * 防抖函数（优化窗口resize等高频事件）
 */
function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}