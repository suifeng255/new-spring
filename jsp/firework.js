const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d'); // 画布2D上下文
const nextPageBtn = document.getElementById('nextPageBtn');
const audioTip = document.getElementById('audioTip');
// 全局状态变量
let particles = [];         // 存储爆炸后的烟花粒子
let meteors = [];           // 存储流星对象
let flyingFireworks = [];   // 存储飞行中的烟花弹
let audioInitiated = false; // 标记音频是否已授权（解决浏览器音频自动播放限制，这个限制是真的烦，AI给的解释是：避免恶意播放影响用户体验，所以需要用户交互）
//但是我这样写在点击屏幕中播放，这不就绕开了吗？可能是我想简单了
// 画布适配逻辑
/**
 * 调整画布尺寸以适配窗口大小
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
// 初始化画布尺寸
resizeCanvas();
// 监听窗口大小变化，实时调整画布
window.addEventListener('resize', resizeCanvas);


// 祝福语配置
// 随机显示的祝福语列表，可以在这里更改
const blessings = [
    "新年快乐", "万事如意", "May all your wishes come true", "阖家幸福",
    "前程似锦", "Peace and joy always", "财源广进", "Good health and long life",
    "Warm wishes for you", "事事顺心", "一定发财", "happy new year",
    "Blessings abound",
];

// 常量配置
// 烟花核心配置参数
const FIREWORK_CONFIG = {
    particleCount: 175,     // 单次爆炸生成的粒子数量
    maxSpeed: 10,           // 粒子最大初始速度
    minSpeed: 3,            // 粒子最小初始速度
    gravity: 0.03,          // 粒子重力加速度（模拟下坠）
    fadeSpeed: 0.97,        // 粒子速度衰减系数（模拟空气阻力）
    flyDuration: 1500,      // 烟花弹飞行时长（毫秒）
    fireworkSize: 5,        // 飞行中烟花弹的尺寸
    colors: [               // 烟花颜色库
        '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00ffff', '#0000ff',
        '#8b00ff', '#ff69b4', '#ffffff', '#ffa500', '#ff1493', '#00fa9a'
    ],
    shapes: ['circle', 'heart', 'star', 'petal'], // 烟花粒子可选形状,在下面进行代码绘制，
    shapeOutlineWidth: 1,   // 形状轮廓宽度
    shapeFillOpacity: 0.8,  // 形状填充透明度
    outlineColor: '#ffffff' // 形状轮廓颜色（增强视觉效果）
};

// 流星配置参数：这里是黑色背景太单调，在背景中加入了隔7s的流星经过
const METEOR_CONFIG = {
    minCount: 1,            // 每次生成流星的最小数量
    maxCount: 7,            // 每次生成流星的最大数量
    spawnInterval: 7000,    // 流星生成间隔（毫秒）
    speedRange: [5, 15],    // 流星速度范围
    lengthRange: [50, 150], // 流星长度范围
    alphaRange: [0.5, 1]    // 流星透明度范围
};

// ========== 音频处理逻辑 ==========
/**
 * 初始化音频授权（解决浏览器自动播放限制）
 * 仅在首次点击时执行，标记音频已授权并隐藏提示框
 */
function initAudio() {
    if (audioInitiated) return; // 已授权则直接返回
    audioInitiated = true; // 标记音频授权状态
    audioTip.classList.add('hidden'); // 隐藏音频提示框
}

/**
 * 播放烟花音效（每次创建新Audio实例实现叠加播放）
 * 解决单次播放无法叠加的问题，同时处理播放异常
 */
function playFireworkSound() {
    // 首次调用先完成音频授权
    if (!audioInitiated) {
        initAudio();
    }
    // 每次播放创建新的Audio对象，支持多烟花音效叠加
    const fireworkAudio = new Audio('images/礼花升空爆炸声.mp3');
    fireworkAudio.volume = 1; // 设置音量
    fireworkAudio.preload = 'auto'; // 预加载音频

    try {
        // 尝试播放音频，捕获播放失败异常（非关键错误）
        fireworkAudio.play().catch(err => {
            console.log('音效播放失败（非关键错误）:', err);
        });
        // 音频播放完毕后移除对象，释放内存
        fireworkAudio.addEventListener('ended', () => {
            fireworkAudio.remove();
        });
    } catch (err) {
        console.log('播放音效时出错:', err);
    }
}

//形状绘制工具，AI出不同形状，但是吃配置吧，复杂的形状，电脑一直卡，不流畅
/**
 * 形状绘制工具对象
 * 包含圆形、心形、星形、花瓣形的绘制方法，均支持轮廓和透明度
 */
const ShapeDrawer = {
    /**
     * 绘制圆形（带轮廓）
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} x - 圆心X坐标
     * @param {number} y - 圆心Y坐标
     * @param {number} size - 圆的半径
     * @param {string} fillColor - 填充颜色
     * @param {string} outlineColor - 轮廓颜色
     * @param {number} outlineWidth - 轮廓宽度
     * @param {number} alpha - 透明度
     */
    circle: function (ctx, x, y, size, fillColor, outlineColor, outlineWidth, alpha) {
        ctx.save(); // 保存当前画布状态
        ctx.globalAlpha = alpha; // 设置透明度
        // 绘制填充圆
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        // 绘制轮廓
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.stroke();
        ctx.restore(); // 恢复画布状态
    },

    /**
     * 绘制心形（带轮廓）
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} x - 心形中心X坐标
     * @param {number} y - 心形中心Y坐标
     * @param {number} size - 心形大小
     * @param {string} fillColor - 填充颜色
     * @param {string} outlineColor - 轮廓颜色
     * @param {number} outlineWidth - 轮廓宽度
     * @param {number} alpha - 透明度
     */
    heart: function (ctx, x, y, size, fillColor, outlineColor, outlineWidth, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y); // 平移坐标系到心形中心
        ctx.scale(size / 10, size / 10); // 缩放适配尺寸
        // 绘制填充心形（贝塞尔曲线实现）
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.bezierCurveTo(5, -10, 10, -5, 0, 5);
        ctx.bezierCurveTo(-10, -5, -5, -10, 0, -5);
        ctx.closePath();
        ctx.fill();
        // 绘制轮廓
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.stroke();
        ctx.restore();
    },

    /**
     * 绘制五角星（带轮廓）
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} x - 星形中心X坐标
     * @param {number} y - 星形中心Y坐标
     * @param {number} size - 星形大小
     * @param {string} fillColor - 填充颜色
     * @param {string} outlineColor - 轮廓颜色
     * @param {number} outlineWidth - 轮廓宽度
     * @param {number} alpha - 透明度
     */
    star: function (ctx, x, y, size, fillColor, outlineColor, outlineWidth, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y); // 平移坐标系到星形中心
        // 绘制填充五角星
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
            const r = i % 2 === 0 ? size : size / 2; // 交替半径实现五角星
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        // 绘制轮廓
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.stroke();
        ctx.restore();
    },

    /**
     * 绘制花瓣形（八角星，带轮廓）
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} x - 花瓣中心X坐标
     * @param {number} y - 花瓣中心Y坐标
     * @param {number} size - 花瓣大小
     * @param {string} fillColor - 填充颜色
     * @param {string} outlineColor - 轮廓颜色
     * @param {number} outlineWidth - 轮廓宽度
     * @param {number} alpha - 透明度
     */
    petal: function (ctx, x, y, size, fillColor, outlineColor, outlineWidth, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y); // 平移坐标系到花瓣中心
        // 绘制填充八角星
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        for (let i = 0; i < 16; i++) {
            const angle = (i * 2 * Math.PI / 16) - Math.PI / 2;
            const radius = i % 2 === 0 ? size : size / 3; // 交替半径实现花瓣形
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        // 绘制轮廓
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.stroke();
        ctx.restore();
    }
};

/**
 * 飞行烟花弹类
 * 负责烟花弹从底部飞到目标位置的运动逻辑，到达后触发爆炸
 * @class
 * @param {number} targetX - 目标位置X坐标（鼠标点击位置）
 * @param {number} targetY - 目标位置Y坐标（鼠标点击位置）
 */
class FlyingFirework {
    constructor(targetX, targetY) {
        // 起始位置：页面底部随机X坐标，Y坐标为画布底部
        this.startX = Math.random() * canvas.width;
        this.startY = canvas.height;
        // 目标位置：鼠标点击的坐标
        this.targetX = targetX;
        this.targetY = targetY;
        // 飞行时间相关
        this.startTime = Date.now(); // 开始飞行的时间戳
        this.duration = FIREWORK_CONFIG.flyDuration; // 飞行总时长
        // 当前位置（初始为起始位置）
        this.currentX = this.startX;
        this.currentY = this.startY;
        // 外观样式：随机颜色、固定大小、随机形状
        this.color = FIREWORK_CONFIG.colors[Math.floor(Math.random() * FIREWORK_CONFIG.colors.length)];
        this.size = FIREWORK_CONFIG.fireworkSize;
        this.shape = FIREWORK_CONFIG.shapes[Math.floor(Math.random() * FIREWORK_CONFIG.shapes.length)];
        // 爆炸状态标记：是否已爆炸
        this.exploded = false;
    }

    /**
     * 更新烟花弹的飞行位置
     * 计算飞行进度，线性插值更新坐标，到达目标后触发爆炸
     */
    update() {
        if (this.exploded) return; // 已爆炸则停止更新

        // 计算已飞行时间占总时长的比例（0~1）
        const elapsed = Date.now() - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);

        // 线性插值计算当前位置（匀速飞行）
        this.currentX = this.startX + (this.targetX - this.startX) * progress;
        this.currentY = this.startY + (this.targetY - this.startY) * progress;

        // 进度达到1（到达目标位置），触发爆炸
        if (progress >= 1) {
            this.explode();
            this.exploded = true;
        }
    }

    /**
     * 绘制飞行中的烟花弹
     * 使用圆形+轮廓绘制，即使设置了其他形状，飞行中统一显示为圆形
     */
    draw() {
        if (this.exploded) return; // 已爆炸则停止绘制
        ShapeDrawer.circle(
            ctx,
            this.currentX,
            this.currentY,
            this.size,
            this.color,
            FIREWORK_CONFIG.outlineColor,
            FIREWORK_CONFIG.shapeOutlineWidth,
            1 // 飞行中不透明
        );
    }

    /**
     * 烟花弹爆炸逻辑
     * 生成指定数量的粒子，继承当前烟花的颜色和形状
     */
    explode() {
        // 生成爆炸粒子（数量由配置决定）
        for (let i = 0; i < FIREWORK_CONFIG.particleCount; i++) {
            particles.push(new Particle(this.currentX, this.currentY, this.color, this.shape));
        }
        // 爆炸时显示随机祝福语
        this.showBlessing();
    }

    /**
     * 显示祝福语
     * 创建DOM元素，通过CSS过渡实现缩放和淡入淡出效果
     */
    showBlessing() {
        // 创建祝福语DOM元素
        const blessing = document.createElement('div');
        blessing.className = 'blessing';
        // 随机选择祝福语
        const randomText = blessings[Math.floor(Math.random() * blessings.length)];
        blessing.textContent = randomText;
        // 定位到烟花爆炸位置（居中对齐）
        blessing.style.left = `${this.targetX}px`;
        blessing.style.top = `${this.targetY}px`;
        blessing.style.transform = 'translate(-50%, -50%) scale(0)';
        document.body.appendChild(blessing);

        // 延迟100ms触发淡入缩放效果
        setTimeout(() => {
            blessing.style.opacity = 1;
            blessing.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);

        // 1.2秒后触发淡出缩小效果，随后移除DOM元素
        setTimeout(() => {
            blessing.style.opacity = 0;
            blessing.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(blessing);
            }, 300);
        }, 1200);
    }

    /**
     * 判断烟花弹是否可移除
     * 已爆炸的烟花弹可从数组中移除，减少性能消耗
     * @returns {boolean} 是否已爆炸
     */
    isDead() {
        return this.exploded;
    }
}

/**
 * 烟花粒子类（爆炸后生成）
 * 负责粒子的运动、重力、衰减和绘制逻辑
 * @class
 * @param {number} x - 粒子初始X坐标（爆炸位置）
 * @param {number} y - 粒子初始Y坐标（爆炸位置）
 * @param {string} baseColor - 基础颜色（继承自烟花弹）
 * @param {string} shape - 粒子形状（继承自烟花弹）
 */
class Particle {
    constructor(x, y, baseColor, shape) {
        this.x = x; // 初始X坐标
        this.y = y; // 初始Y坐标
        // 粒子颜色：优先使用烟花弹颜色，否则随机
        this.color = baseColor || FIREWORK_CONFIG.colors[Math.floor(Math.random() * FIREWORK_CONFIG.colors.length)];
        // 粒子初始速度：在配置范围内随机
        this.speed = Math.random() * (FIREWORK_CONFIG.maxSpeed - FIREWORK_CONFIG.minSpeed) + FIREWORK_CONFIG.minSpeed;
        // 粒子运动角度：随机360度
        this.angle = Math.random() * Math.PI * 2;
        // 速度分量（X/Y方向）
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        // 粒子尺寸：随机1.5~4.5
        this.size = Math.random() * 3 + 1.5;
        // 粒子生命周期（帧数）
        this.life = 150;
        // 粒子透明度（随生命周期递减）
        this.alpha = 1;
        // 粒子形状：继承烟花弹或随机
        this.shape = shape || FIREWORK_CONFIG.shapes[Math.floor(Math.random() * FIREWORK_CONFIG.shapes.length)];
    }

    /**
     * 更新粒子状态
     * 应用重力、更新位置、递减生命周期、速度衰减
     */
    update() {
        this.vy += FIREWORK_CONFIG.gravity; // 应用重力（Y方向加速）
        this.x += this.vx; // 更新X坐标
        this.y += this.vy; // 更新Y坐标
        this.life--; // 生命周期递减
        this.alpha = this.life / 150; // 透明度随生命周期递减
        this.vx *= FIREWORK_CONFIG.fadeSpeed; // X方向速度衰减
        this.vy *= FIREWORK_CONFIG.fadeSpeed; // Y方向速度衰减
    }

    /**
     * 绘制粒子
     * 根据粒子形状调用对应的绘制方法，应用透明度和样式
     */
    draw() {
        ShapeDrawer[this.shape](
            ctx,
            this.x,
            this.y,
            this.size,
            this.color,
            FIREWORK_CONFIG.outlineColor,
            FIREWORK_CONFIG.shapeOutlineWidth,
            this.alpha * FIREWORK_CONFIG.shapeFillOpacity // 最终透明度
        );
    }
}
/**
 * 流星类
 * 负责流星的生成、运动和绘制逻辑
 * @class
 */
class Meteor {
    constructor() {
        // 初始位置：画布上方随机区域（超出画布左侧/右侧，增加真实感）
        this.x = Math.random() * canvas.width * 1.5 - canvas.width * 0.25;
        this.y = Math.random() * canvas.height * 0.3;
        // 运动角度：45~75度（向下向右）
        this.angle = Math.PI / 4 + Math.random() * Math.PI / 6;
        // 运动速度：配置范围内随机
        this.speed = METEOR_CONFIG.speedRange[0] + Math.random() * (METEOR_CONFIG.speedRange[1] - METEOR_CONFIG.speedRange[0]);
        // 流星长度：配置范围内随机
        this.length = METEOR_CONFIG.lengthRange[0] + Math.random() * (METEOR_CONFIG.lengthRange[1] - METEOR_CONFIG.lengthRange[0]);
        // 初始透明度：配置范围内随机
        this.alpha = METEOR_CONFIG.alphaRange[0] + Math.random() * (METEOR_CONFIG.alphaRange[1] - METEOR_CONFIG.alphaRange[0]);
        // 流星颜色：随机白色或淡蓝色
        this.color = Math.random() > 0.5 ? 'rgba(255,255,255,' : 'rgba(180,220,255,';
    }

    /**
     * 更新流星状态
     * 移动位置、递减透明度
     */
    update() {
        this.x += Math.cos(this.angle) * this.speed; // X方向移动
        this.y += Math.sin(this.angle) * this.speed; // Y方向移动
        this.alpha -= 0.005; // 透明度缓慢递减
    }

    /**
     * 绘制流星
     * 绘制带透明度的线条，模拟流星拖尾效果
     */
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha; // 设置流星透明度
        ctx.strokeStyle = this.color + this.alpha + ')'; // 颜色+透明度
        ctx.lineWidth = 2; // 流星线条宽度
        ctx.beginPath();
        // 绘制流星主体（从当前位置向反方向延伸）
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        ctx.stroke();
        ctx.restore();
    }

    /**
     * 判断流星是否可移除
     * 透明度≤0或超出画布范围时可移除
     * @returns {boolean} 是否可移除
     */
    isDead() {
        return this.alpha <= 0 || this.x > canvas.width * 1.2 || this.y > canvas.height;
    }
}

// 核心功能函数
/**
 * 发射烟花
 * 初始化音频、播放音效、创建飞行烟花弹
 * @param {number} targetX - 目标X坐标
 * @param {number} targetY - 目标Y坐标
 */
function launchFirework(targetX, targetY) {
    initAudio(); // 确保音频已授权
    playFireworkSound(); // 播放烟花音效
    flyingFireworks.push(new FlyingFirework(targetX, targetY)); // 创建新烟花弹
}

/**
 * 生成流星
 * 在配置范围内随机生成指定数量的流星
 */
function spawnMeteors() {
    // 随机生成流星数量（介于最小/最大数量之间）
    const count = METEOR_CONFIG.minCount + Math.floor(Math.random() * (METEOR_CONFIG.maxCount - METEOR_CONFIG.minCount + 1));
    for (let i = 0; i < count; i++) {
        meteors.push(new Meteor()); // 创建新流星
    }
}

/**
 * 动画主循环
 * 持续更新并绘制所有元素（烟花弹、粒子、流星），实现动画效果
 */
function animate() {
    // 绘制半透明黑色背景，实现拖影效果（保留上一帧的轻微痕迹）
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新并绘制飞行中的烟花弹（倒序遍历，避免删除元素导致的索引问题）
    for (let i = flyingFireworks.length - 1; i >= 0; i--) {
        const fw = flyingFireworks[i];
        fw.update();
        fw.draw();
        // 移除已爆炸的烟花弹
        if (fw.isDead()) {
            flyingFireworks.splice(i, 1);
        }
    }

    // 更新并绘制爆炸后的粒子（倒序遍历）
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        // 移除生命周期结束的粒子
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }

    // 更新并绘制流星（倒序遍历）
    for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.update();
        m.draw();
        // 移除已消失的流星
        if (m.isDead()) {
            meteors.splice(i, 1);
        }
    }

    // 请求下一帧动画，形成循环
    requestAnimationFrame(animate);
}

// 初始化与事件绑定
// 启动动画主循环
animate();
// 设置定时器，定时生成流星
setInterval(spawnMeteors, METEOR_CONFIG.spawnInterval);
// 页面加载时立即生成一批流星
spawnMeteors();

/**
 * 页面跳转函数
 * 点击按钮后跳转到main.html
 */
function goToNextPage() {
    window.location.href = 'main.html';
}

// 点击页面任意位置发射烟花（排除跳转按钮）
document.body.addEventListener('click', (e) => {
    if (e.target !== nextPageBtn) {
        launchFirework(e.clientX, e.clientY);
    }
});

// 绑定底部按钮点击事件：跳转下一页
nextPageBtn.addEventListener('click', goToNextPage);
