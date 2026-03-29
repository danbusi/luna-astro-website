/**
 * Luna Astro - Enhanced Reading Experience
 * 增强版占卜逻辑
 */

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    initFreeCount();
    loadLoadingPhrases();
});

// 创建星空背景
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

// 免费次数管理
function initFreeCount() {
    let freeCount = localStorage.getItem('luna_free_count');
    
    if (freeCount === null) {
        freeCount = 1;
        localStorage.setItem('luna_free_count', freeCount);
        localStorage.setItem('luna_first_visit', new Date().toISOString());
    }
    
    const countElement = document.getElementById('freeCount');
    if (countElement) {
        countElement.textContent = freeCount;
    }
    
    if (parseInt(freeCount) <= 0) {
        setTimeout(() => {
            window.location.href = 'paywall-enhanced.html';
        }, 2000);
    }
}

// 步骤导航
function nextStep(stepNumber) {
    // 验证当前步骤
    if (!validateStep(stepNumber - 1)) {
        return;
    }
    
    // 更新进度条
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
            step.classList.remove('active');
            step.textContent = '✓';
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
            step.classList.remove('completed');
            step.textContent = stepNumber;
        } else {
            step.classList.remove('active', 'completed');
            step.textContent = index + 1;
        }
    });
    
    // 切换步骤
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.getElementById('step' + stepNumber).classList.add('active');
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(stepNumber) {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 === stepNumber) {
            step.classList.add('active');
            step.classList.remove('completed');
            step.textContent = stepNumber;
        } else if (index + 1 > stepNumber) {
            step.classList.remove('active', 'completed');
            step.textContent = index + 1;
        }
    });
    
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.getElementById('step' + stepNumber).classList.add('active');
}

// 验证步骤
function validateStep(stepNumber) {
    if (stepNumber === 1) {
        const name = document.getElementById('name').value.trim();
        if (!name) {
            alert('Please tell me your name ✨');
            return false;
        }
    } else if (stepNumber === 2) {
        const year = document.getElementById('birthYear').value;
        const month = document.getElementById('birthMonth').value;
        const day = document.getElementById('birthDay').value;
        
        if (!year || !month || !day) {
            alert('Please enter your birth date 🌟');
            return false;
        }
        
        // 验证年龄
        const age = new Date().getFullYear() - parseInt(year);
        if (age < 18) {
            alert('You must be 18+ to use this service 🔞');
            return false;
        }
        
        if (age > 120) {
            alert('Please enter a valid birth year 🌙');
            return false;
        }
    }
    
    return true;
}

// 提交占卜
function submitReading() {
    // 验证第三步
    if (!validateStep(3)) {
        return;
    }
    
    // 检查免费次数
    let freeCount = parseInt(localStorage.getItem('luna_free_count') || '0');
    if (freeCount <= 0) {
        window.location.href = 'paywall.html';
        return;
    }
    
    // 显示加载页面
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('stepLoading').classList.add('active');
    
    // 更新进度条
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.add('completed');
        step.textContent = '✓';
    });
    
    // 收集数据
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        birthYear: parseInt(document.getElementById('birthYear').value),
        birthMonth: parseInt(document.getElementById('birthMonth').value),
        birthDay: parseInt(document.getElementById('birthDay').value),
        birthTime: document.getElementById('birthTime').value,
        birthPlace: document.getElementById('birthPlace').value.trim(),
        partnerName: document.getElementById('partnerName').value.trim(),
        partnerYear: document.getElementById('partnerYear').value,
        partnerMonth: document.getElementById('partnerMonth').value,
        partnerDay: document.getElementById('partnerDay').value,
        relationshipStatus: document.getElementById('relationshipStatus').value
    };
    
    // 模拟加载过程
    const loadingPhrases = [
        'Calculating planetary positions...',
        'Aligning the zodiac stars...',
        'Consulting Venus, the love planet...',
        'Reading your cosmic blueprint...',
        'Unlocking your love destiny...',
        'Finalizing your reading...'
    ];
    
    let phraseIndex = 0;
    const phraseInterval = setInterval(() => {
        if (phraseIndex < loadingPhrases.length) {
            document.getElementById('loadingPhrase').textContent = loadingPhrases[phraseIndex];
            phraseIndex++;
        }
    }, 800);
    
    // 3 秒后生成结果
    setTimeout(() => {
        clearInterval(phraseInterval);
        
        // 减少免费次数
        freeCount--;
        localStorage.setItem('luna_free_count', freeCount);
        
        // 计算星座和生成运势
        const zodiacSign = calculateZodiacSign(formData.birthMonth, formData.birthDay);
        const reading = generateEnhancedReading(formData, zodiacSign);
        
        // 保存记录
        saveReading(formData, reading, zodiacSign);
        
        // 显示结果
        showEnhancedResult(reading, zodiacSign, freeCount);
        
    }, 5000);
}

// 加载语句
function loadLoadingPhrases() {
    const phrases = [
        'Calculating planetary positions...',
        'Aligning the zodiac stars...',
        'Consulting Venus, the love planet...',
        'Reading your cosmic blueprint...',
        'Unlocking your love destiny...',
        'Finalizing your reading...'
    ];
    
    let index = 0;
    setInterval(() => {
        const element = document.getElementById('loadingPhrase');
        if (element && element.textContent !== phrases[index]) {
            element.textContent = phrases[index];
            index = (index + 1) % phrases.length;
        }
    }, 2000);
}

// 计算星座
function calculateZodiacSign(month, day) {
    const zodiacSigns = [
        { name: 'Capricorn', symbol: '♑', start: [12, 22], end: [1, 19], element: 'Earth', ruler: 'Saturn' },
        { name: 'Aquarius', symbol: '♒', start: [1, 20], end: [2, 18], element: 'Air', ruler: 'Uranus' },
        { name: 'Pisces', symbol: '♓', start: [2, 19], end: [3, 20], element: 'Water', ruler: 'Neptune' },
        { name: 'Aries', symbol: '♈', start: [3, 21], end: [4, 19], element: 'Fire', ruler: 'Mars' },
        { name: 'Taurus', symbol: '♉', start: [4, 20], end: [5, 20], element: 'Earth', ruler: 'Venus' },
        { name: 'Gemini', symbol: '♊', start: [5, 21], end: [6, 20], element: 'Air', ruler: 'Mercury' },
        { name: 'Cancer', symbol: '♋', start: [6, 21], end: [7, 22], element: 'Water', ruler: 'Moon' },
        { name: 'Leo', symbol: '♌', start: [7, 23], end: [8, 22], element: 'Fire', ruler: 'Sun' },
        { name: 'Virgo', symbol: '♍', start: [8, 23], end: [9, 22], element: 'Earth', ruler: 'Mercury' },
        { name: 'Libra', symbol: '♎', start: [9, 23], end: [10, 22], element: 'Air', ruler: 'Venus' },
        { name: 'Scorpio', symbol: '♏', start: [10, 23], end: [11, 21], element: 'Water', ruler: 'Pluto' },
        { name: 'Sagittarius', symbol: '♐', start: [11, 22], end: [12, 21], element: 'Fire', ruler: 'Jupiter' }
    ];
    
    for (let sign of zodiacSigns) {
        if ((month === sign.start[0] && day >= sign.start[1]) ||
            (month === sign.end[0] && day <= sign.end[1])) {
            return sign;
        }
    }
    
    return zodiacSigns[0];
}

// 生成增强版运势
function generateEnhancedReading(data, zodiacSign) {
    // 爱情运势库
    const loveReadings = {
        Fire: [
            "Your passionate nature is attracting powerful cosmic energy! A bold romantic gesture or unexpected confession is written in the stars.",
            "Mars ignites your love sector! Your natural charisma is magnetic right now. Don't be surprised if someone makes the first move.",
            "The fire within you burns brighter than ever! Single? Expect a passionate encounter. Coupled? Rekindle the spark with adventure."
        ],
        Earth: [
            "Venus blesses your practical approach to love! A stable, long-term connection is favored. Take time to build something meaningful.",
            "Your grounded energy is deeply attractive now. Someone appreciates your reliability and loyalty. Trust is the foundation.",
            "The stars encourage you to slow down and savor love's simple pleasures. A quiet moment together means more than grand gestures."
        ],
        Air: [
            "Mercury enhances your communication! A heart-to-heart conversation reveals deeper feelings. Words matter now.",
            "Your intellectual connection with someone is blossoming! Share your dreams and ideas - mental stimulation leads to romance.",
            "The air is charged with possibility! A chance meeting or unexpected message could change your love story."
        ],
        Water: [
            "Your intuition is psychically attuned to love's undercurrents! Trust your feelings about someone - you're picking up their true intentions.",
            "The Moon illuminates your emotional depths! Vulnerability leads to intimacy. Share your heart, and watch love bloom.",
            "Your empathic nature is a gift now! Someone needs your understanding. A soulful connection awaits those who dare to feel deeply."
        ]
    };
    
    // 建议库
    const advice = {
        Fire: ["Take bold action", "Be direct about your feelings", "Embrace spontaneity"],
        Earth: ["Build trust slowly", "Show consistency", "Appreciate the little things"],
        Air: ["Communicate openly", "Stay curious about your partner", "Keep things light and fun"],
        Water: ["Trust your intuition", "Express your emotions", "Create emotional safety"]
    };
    
    // 幸运元素
    const luckyColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFEAA7', '#A29BFE', '#FD79A8'];
    const luckyNumbers = [3, 7, 9, 11, 13, 21, 27, 33];
    const crystals = {
        Fire: 'Carnelian',
        Earth: 'Rose Quartz',
        Air: 'Aquamarine',
        Water: 'Moonstone'
    };
    
    const randomIndex = Math.floor(Math.random() * 3);
    
    return {
        title: `${zodiacSign.symbol} ${zodiacSign.name} Love Reading`,
        zodiacSign: zodiacSign.name,
        element: zodiacSign.element,
        ruler: zodiacSign.ruler,
        loveReading: loveReadings[zodiacSign.element][randomIndex],
        advice: advice[zodiacSign.element][randomIndex],
        luckyColor: luckyColors[Math.floor(Math.random() * luckyColors.length)],
        luckyNumber: luckyNumbers[Math.floor(Math.random() * luckyNumbers.length)],
        crystal: crystals[zodiacSign.element],
        compatibility: data.partnerName ? generateCompatibilityReading(data, zodiacSign) : null,
        date: new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    };
}

// 配对分析
function generateCompatibilityReading(data, zodiacSign) {
    const compatibilityMessages = [
        "Your stars show powerful chemistry! Fire and Air create passionate dynamics with endless inspiration.",
        "Earth and Water blend beautifully - emotional depth meets practical stability. A nurturing bond awaits.",
        "Opposite signs attract! Your differences create magnetic tension and opportunities for growth.",
        "Same element resonance brings natural understanding and effortless flow together."
    ];
    
    return {
        partnerName: data.partnerName,
        message: compatibilityMessages[Math.floor(Math.random() * compatibilityMessages.length)],
        score: Math.floor(Math.random() * 40) + 60 // 60-100
    };
}

// 保存记录
function saveReading(userData, reading, zodiacSign) {
    const readings = JSON.parse(localStorage.getItem('luna_readings') || '[]');
    readings.push({
        ...userData,
        reading,
        zodiacSign: zodiacSign.name,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('luna_readings', JSON.stringify(readings));
}

// 显示增强版结果 - 跳转到结果页面
function showEnhancedResult(reading, zodiacSign, remainingCount) {
    // 将数据编码到 URL 参数
    const readingParam = encodeURIComponent(JSON.stringify(reading));
    const zodiacParam = encodeURIComponent(JSON.stringify(zodiacSign));
    
    // 跳转到结果页面
    window.location.href = `result.html?reading=${readingParam}&zodiac=${zodiacParam}&count=${remainingCount}`;
}
