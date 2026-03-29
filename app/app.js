/**
 * Luna Astro - 前端应用逻辑
 * 功能：免费次数计数、星座计算、运势生成
 */

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initFreeCount();
    setupFormHandler();
});

// 免费次数管理
function initFreeCount() {
    let freeCount = localStorage.getItem('luna_free_count');
    
    if (freeCount === null) {
        freeCount = 2;
        localStorage.setItem('luna_free_count', freeCount);
        localStorage.setItem('luna_first_visit', new Date().toISOString());
    }
    
    const countElement = document.getElementById('freeCount');
    if (countElement) {
        countElement.textContent = freeCount;
    }
    
    // 如果免费次数用完，禁用提交按钮
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn && freeCount <= 0) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⚠️ Free Trial Used Up';
        
        // 显示付费提示
        setTimeout(() => {
            showPaywall();
        }, 1000);
    }
}

// 减少免费次数
function decreaseFreeCount() {
    let freeCount = parseInt(localStorage.getItem('luna_free_count') || '0');
    if (freeCount > 0) {
        freeCount--;
        localStorage.setItem('luna_free_count', freeCount);
        return freeCount;
    }
    return 0;
}

// 表单处理
function setupFormHandler() {
    const form = document.getElementById('readingForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const errorMessage = document.getElementById('errorMessage');
        
        // 检查免费次数
        let freeCount = parseInt(localStorage.getItem('luna_free_count') || '0');
        if (freeCount <= 0) {
            showError('Free trial used up. Please upgrade to continue.');
            setTimeout(showPaywall, 1000);
            return;
        }
        
        // 获取表单数据
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            birthYear: parseInt(document.getElementById('birthYear').value),
            birthMonth: parseInt(document.getElementById('birthMonth').value),
            birthDay: parseInt(document.getElementById('birthDay').value),
            partnerName: document.getElementById('partnerName').value.trim()
        };
        
        // 验证数据
        if (!formData.name || !formData.birthYear || !formData.birthMonth || !formData.birthDay) {
            showError('Please fill in all required fields.');
            return;
        }
        
        // 验证年龄（18+）
        const age = new Date().getFullYear() - formData.birthYear;
        if (age < 18) {
            showError('You must be 18+ to use this service.');
            return;
        }
        
        // 禁用按钮，显示加载状态
        submitBtn.disabled = true;
        submitBtn.textContent = '✨ Calculating...';
        
        try {
            // 计算星座
            const zodiacSign = calculateZodiacSign(formData.birthMonth, formData.birthDay);
            
            // 生成运势
            const reading = generateReading(formData, zodiacSign);
            
            // 减少免费次数
            const remainingCount = decreaseFreeCount();
            
            // 保存阅读记录
            saveReading(formData, reading, zodiacSign);
            
            // 显示结果
            showReadingResult(reading, zodiacSign, remainingCount);
            
        } catch (error) {
            console.error('Error generating reading:', error);
            showError('Something went wrong. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = '✨ Get Your Free Reading';
        }
    });
}

// 计算星座
function calculateZodiacSign(month, day) {
    const zodiacSigns = [
        { name: 'Capricorn', symbol: '♑', start: [12, 22], end: [1, 19] },
        { name: 'Aquarius', symbol: '♒', start: [1, 20], end: [2, 18] },
        { name: 'Pisces', symbol: '♓', start: [2, 19], end: [3, 20] },
        { name: 'Aries', symbol: '♈', start: [3, 21], end: [4, 19] },
        { name: 'Taurus', symbol: '♉', start: [4, 20], end: [5, 20] },
        { name: 'Gemini', symbol: '♊', start: [5, 21], end: [6, 20] },
        { name: 'Cancer', symbol: '♋', start: [6, 21], end: [7, 22] },
        { name: 'Leo', symbol: '♌', start: [7, 23], end: [8, 22] },
        { name: 'Virgo', symbol: '♍', start: [8, 23], end: [9, 22] },
        { name: 'Libra', symbol: '♎', start: [9, 23], end: [10, 22] },
        { name: 'Scorpio', symbol: '♏', start: [10, 23], end: [11, 21] },
        { name: 'Sagittarius', symbol: '♐', start: [11, 22], end: [12, 21] }
    ];
    
    for (let sign of zodiacSigns) {
        if ((month === sign.start[0] && day >= sign.start[1]) ||
            (month === sign.end[0] && day <= sign.end[1])) {
            return sign;
        }
    }
    
    return zodiacSigns[0]; // 默认摩羯座
}

// 生成运势（MVP 版本 - 随机生成）
function generateReading(data, zodiacSign) {
    const loveReadings = [
        "The stars align in your favor today! A unexpected encounter may spark new romantic possibilities. Stay open to love's surprises.",
        "Your intuition is especially strong now. Trust your feelings about a certain someone - they might be more interested than you think.",
        "Venus brings harmony to your love sector. If you're in a relationship, expect deeper connection. Singles may meet someone special through friends.",
        "Mars energizes your romance zone! Don't hold back - express your feelings boldly. The universe supports courageous hearts.",
        "The Moon illuminates your emotional needs. Take time for self-love today. A meaningful conversation could change everything.",
        "Mercury enhances communication in relationships. Perfect time to express your feelings or resolve lingering issues with clarity.",
        "Jupiter expands your love horizons! An adventure or learning experience could lead to romance. Say yes to new experiences.",
        "Saturn asks for commitment. Are you ready to take the next step? Serious conversations lead to lasting bonds."
    ];
    
    const compatibilityReadings = [
        "Your stars show strong compatibility! Fire and air signs create passionate dynamics.",
        "Earth and water elements blend beautifully. Expect emotional depth and stability.",
        "Opposite signs attract! Your differences create magnetic tension and growth.",
        "Same element resonance brings natural understanding and flow."
    ];
    
    const advice = [
        "Trust your intuition today.",
        "Be open to unexpected connections.",
        "Communication is key - speak your truth.",
        "Self-love attracts true love.",
        "Let go of past hurts and embrace new beginnings.",
        "Patience will be rewarded.",
        "Adventure leads to romance.",
        "Authenticity is your superpower."
    ];
    
    const randomIndex = Math.floor(Math.random() * loveReadings.length);
    const adviceIndex = Math.floor(Math.random() * advice.length);
    
    let reading = {
        title: `${zodiacSign.symbol} ${zodiacSign.name} Love Reading`,
        mainReading: loveReadings[randomIndex],
        advice: advice[adviceIndex],
        luckyColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 5)],
        luckyNumber: Math.floor(Math.random() * 99) + 1,
        compatibility: data.partnerName ? compatibilityReadings[Math.floor(Math.random() * compatibilityReadings.length)] : null,
        zodiacSign: zodiacSign.name,
        date: new Date().toLocaleDateString()
    };
    
    return reading;
}

// 保存阅读记录
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

// 显示阅读结果
function showReadingResult(reading, zodiacSign, remainingCount) {
    // 创建结果页面
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
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    color: #ffffff;
                    min-height: 100vh;
                    padding: 20px;
                }
                .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { font-size: 64px; margin-bottom: 10px; }
                h1 {
                    font-size: 28px;
                    background: linear-gradient(90deg, #e94560, #ff6b6b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 10px;
                }
                .result-card {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 30px;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 20px;
                }
                .zodiac-sign {
                    font-size: 48px;
                    text-align: center;
                    margin-bottom: 15px;
                }
                .reading-text {
                    font-size: 18px;
                    line-height: 1.8;
                    color: #e0e0e0;
                    margin-bottom: 20px;
                }
                .advice-box {
                    background: rgba(233, 69, 96, 0.1);
                    border-left: 4px solid #e94560;
                    padding: 15px 20px;
                    margin: 20px 0;
                    border-radius: 0 10px 10px 0;
                }
                .advice-label {
                    color: #e94560;
                    font-weight: bold;
                    font-size: 12px;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                }
                .lucky-info {
                    display: flex;
                    justify-content: space-around;
                    margin: 20px 0;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .lucky-item { text-align: center; }
                .lucky-label { font-size: 12px; color: #a0a0a0; }
                .lucky-value { font-size: 20px; font-weight: bold; margin-top: 5px; }
                .count-info {
                    text-align: center;
                    padding: 20px;
                    background: rgba(233, 69, 96, 0.1);
                    border-radius: 10px;
                    margin-top: 20px;
                }
                .count-info span {
                    color: #e94560;
                    font-weight: bold;
                    font-size: 24px;
                }
                .btn {
                    display: block;
                    width: 100%;
                    padding: 15px;
                    margin-top: 15px;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    text-align: center;
                    text-decoration: none;
                }
                .btn-primary {
                    background: linear-gradient(90deg, #e94560, #ff6b6b);
                    color: white;
                }
                .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                .compatibility {
                    background: rgba(78, 205, 196, 0.1);
                    border-left: 4px solid #4ECDC4;
                    padding: 15px 20px;
                    margin: 20px 0;
                    border-radius: 0 10px 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🌙</div>
                    <h1>Your Love Reading</h1>
                </div>
                
                <div class="result-card">
                    <div class="zodiac-sign">${zodiacSign.symbol}</div>
                    <h2 style="text-align: center; margin-bottom: 20px;">${zodiacSign.name}</h2>
                    
                    <p class="reading-text">${reading.mainReading}</p>
                    
                    ${reading.compatibility ? `
                        <div class="compatibility">
                            <div class="advice-label">💕 Compatibility with ${reading.partnerName || 'your partner'}</div>
                            <p style="color: #e0e0e0;">${reading.compatibility}</p>
                        </div>
                    ` : ''}
                    
                    <div class="advice-box">
                        <div class="advice-label">✨ Cosmic Advice</div>
                        <p style="color: #e0e0e0;">${reading.advice}</p>
                    </div>
                    
                    <div class="lucky-info">
                        <div class="lucky-item">
                            <div class="lucky-label">Lucky Color</div>
                            <div class="lucky-value" style="color: ${reading.luckyColor}">●</div>
                        </div>
                        <div class="lucky-item">
                            <div class="lucky-label">Lucky Number</div>
                            <div class="lucky-value">${reading.luckyNumber}</div>
                        </div>
                    </div>
                </div>
                
                <div class="count-info">
                    <p>Free Readings Left: <span>${remainingCount}</span>/2</p>
                    ${remainingCount > 0 ? 
                        '<p style="font-size: 12px; color: #a0a0a0; margin-top: 10px;">Come back tomorrow for more insights!</p>' :
                        '<p style="font-size: 12px; color: #a0a0a0; margin-top: 10px;">Upgrade to unlock unlimited readings!</p>'
                    }
                </div>
                
                ${remainingCount > 0 ? `
                    <a href="reading.html" class="btn btn-secondary">← New Reading</a>
                ` : `
                    <a href="paywall.html" class="btn btn-primary">✨ Unlock Unlimited Readings</a>
                    <a href="reading.html" class="btn btn-secondary">← Back to Reading</a>
                `}
                
                <a href="index.html" class="btn btn-secondary" style="margin-top: 10px;">🏠 Home</a>
            </div>
        </body>
        </html>
    `;
    
    // 打开新窗口显示结果
    const newWindow = window.open('', '_blank');
    newWindow.document.write(resultHTML);
    newWindow.document.close();
}

// 显示错误信息
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
}

// 显示付费墙
function showPaywall() {
    window.location.href = 'paywall.html';
}
