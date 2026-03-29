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
        freeCount = 2;
        localStorage.setItem('luna_free_count', freeCount);
    }
    
    const countElement = document.getElementById('freeCount');
    if (countElement) {
        countElement.textContent = freeCount;
    }
    
    if (parseInt(freeCount) <= 0) {
        setTimeout(() => {
            window.location.href = 'paywall.html';
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

// 显示增强版结果
function showEnhancedResult(reading, zodiacSign, remainingCount) {
    const resultHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Reading - Luna</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    color: #ffffff;
                    min-height: 100vh;
                    padding: 40px 20px;
                }
                .container { max-width: 700px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 40px; }
                .logo { font-size: 80px; animation: float 3s ease-in-out infinite; }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                h1 {
                    font-size: 36px;
                    background: linear-gradient(90deg, #f8b500, #fceabb);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 20px 0;
                }
                .result-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    padding: 40px;
                    border-radius: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 30px;
                }
                .zodiac-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .zodiac-symbol { font-size: 80px; display: block; margin-bottom: 10px; }
                .zodiac-name { font-size: 28px; color: #f8b500; }
                .zodiac-element { 
                    font-size: 14px; 
                    color: #a0a0a0; 
                    text-transform: uppercase; 
                    letter-spacing: 2px;
                    margin-top: 10px;
                }
                .reading-section {
                    margin: 30px 0;
                    padding: 25px;
                    background: rgba(248, 181, 0, 0.05);
                    border-left: 4px solid #f8b500;
                    border-radius: 0 15px 15px 0;
                }
                .section-title {
                    font-size: 14px;
                    color: #f8b500;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 15px;
                }
                .reading-text {
                    font-size: 18px;
                    line-height: 1.8;
                    color: #e0e0e0;
                }
                .lucky-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin: 30px 0;
                }
                .lucky-item {
                    text-align: center;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                }
                .lucky-icon { font-size: 36px; margin-bottom: 10px; }
                .lucky-label { font-size: 12px; color: #a0a0a0; text-transform: uppercase; }
                .lucky-value { font-size: 20px; font-weight: bold; margin-top: 8px; }
                .compatibility-box {
                    background: rgba(78, 205, 196, 0.1);
                    border-left: 4px solid #4ECDC4;
                    padding: 25px;
                    border-radius: 0 15px 15px 0;
                    margin: 30px 0;
                }
                .compatibility-score {
                    font-size: 48px;
                    font-weight: bold;
                    background: linear-gradient(90deg, #4ECDC4, #44A08D);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-align: center;
                    display: block;
                    margin: 20px 0;
                }
                .count-info {
                    text-align: center;
                    padding: 25px;
                    background: rgba(248, 181, 0, 0.1);
                    border-radius: 15px;
                    border: 1px solid rgba(248, 181, 0, 0.3);
                    margin-top: 30px;
                }
                .count-info span {
                    color: #f8b500;
                    font-weight: bold;
                    font-size: 32px;
                }
                .btn {
                    display: block;
                    width: 100%;
                    padding: 18px;
                    margin-top: 15px;
                    border: none;
                    border-radius: 15px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    text-align: center;
                    text-decoration: none;
                }
                .btn-primary {
                    background: linear-gradient(90deg, #f8b500, #fceabb);
                    color: #0f0c29;
                }
                .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                .share-buttons {
                    display: flex;
                    gap: 15px;
                    margin-top: 20px;
                }
                .share-btn {
                    flex: 1;
                    padding: 15px;
                    border: none;
                    border-radius: 10px;
                    font-size: 14px;
                    cursor: pointer;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                .share-btn:hover { background: rgba(255, 255, 255, 0.2); }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🌙</div>
                    <h1>Your Love Reading</h1>
                </div>
                
                <div class="result-card">
                    <div class="zodiac-header">
                        <span class="zodiac-symbol">${zodiacSign.symbol}</span>
                        <div class="zodiac-name">${zodiacSign.name}</div>
                        <div class="zodiac-element">${zodiacSign.element} Sign • Ruled by ${zodiacSign.ruler}</div>
                    </div>
                    
                    <div class="reading-section">
                        <div class="section-title">💕 Cosmic Love Forecast</div>
                        <p class="reading-text">${reading.loveReading}</p>
                    </div>
                    
                    ${reading.compatibility ? `
                        <div class="compatibility-box">
                            <div class="section-title">💖 Compatibility with ${reading.compatibility.partnerName}</div>
                            <span class="compatibility-score">${reading.compatibility.score}%</span>
                            <p class="reading-text" style="text-align: center;">${reading.compatibility.message}</p>
                        </div>
                    ` : ''}
                    
                    <div class="reading-section">
                        <div class="section-title">✨ Cosmic Advice</div>
                        <p class="reading-text">${reading.advice}</p>
                    </div>
                    
                    <div class="lucky-grid">
                        <div class="lucky-item">
                            <div class="lucky-icon">🎨</div>
                            <div class="lucky-label">Lucky Color</div>
                            <div class="lucky-value" style="color: ${reading.luckyColor}">●</div>
                        </div>
                        <div class="lucky-item">
                            <div class="lucky-icon">🔢</div>
                            <div class="lucky-label">Lucky Number</div>
                            <div class="lucky-value">${reading.luckyNumber}</div>
                        </div>
                        <div class="lucky-item">
                            <div class="lucky-icon">💎</div>
                            <div class="lucky-label">Power Crystal</div>
                            <div class="lucky-value">${reading.crystal}</div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; color: #a0a0a0; font-size: 14px;">
                        📅 ${reading.date}
                    </div>
                </div>
                
                <div class="count-info">
                    <p>✨ Free Readings Left: <span>${remainingCount}</span>/2</p>
                    ${remainingCount > 0 ? 
                        '<p style="font-size: 12px; color: #a0a0a0; margin-top: 10px;">Come back when you need more cosmic guidance!</p>' :
                        '<p style="font-size: 12px; color: #a0a0a0; margin-top: 10px;">Unlock unlimited readings for deeper insights!</p>'
                    }
                </div>
                
                ${remainingCount > 0 ? `
                    <button class="btn btn-secondary" onclick="window.location.href='reading-enhanced.html'">🔮 New Reading</button>
                ` : `
                    <button class="btn btn-primary" onclick="window.location.href='paywall.html'">✨ Unlock Unlimited Readings</button>
                `}
                
                <button class="btn btn-secondary" onclick="window.location.href='index.html'">🏠 Home</button>
            </div>
        </body>
        </html>
    `;
    
    const newWindow = window.open('', '_blank');
    newWindow.document.write(resultHTML);
    newWindow.document.close();
}
