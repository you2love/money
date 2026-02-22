// ==================== 导航功能 ====================
// 树形导航展开/收起功能
document.querySelectorAll('.tree-label').forEach(label => {
    label.addEventListener('click', function() {
        // 切换展开/收起状态
        this.classList.toggle('expanded');
        const children = this.nextElementSibling;
        if (children && children.classList.contains('tree-children')) {
            children.classList.toggle('expanded');
        }
    });
});

// 高亮当前活动的链接
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    
    document.querySelectorAll('.tree-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // 检查是否匹配当前页面
        if (href === currentPage || href.startsWith(currentPage.split('#')[0])) {
            link.classList.add('active');
            // 展开父级菜单
            let parent = link.closest('.tree-children');
            while (parent) {
                parent.classList.add('expanded');
                const label = parent.previousElementSibling;
                if (label && label.classList.contains('tree-label')) {
                    label.classList.add('expanded');
                }
                parent = parent.parentElement.closest('.tree-children');
            }
        }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    setActiveLink();

    // 默认展开第一个分类
    const firstLabel = document.querySelector('.tree-label');
    if (firstLabel && window.location.pathname.endsWith('index.html')) {
        firstLabel.click();
    }

    // 初始化所有交互图表
    initInteractiveCharts();
    
    // 初始化平滑滚动
    initSmoothScroll();
});

// 平滑滚动到锚点
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ==================== 交互图表功能 ====================
function initInteractiveCharts() {
    // 图表切换按钮
    document.querySelectorAll('.chart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const parent = this.closest('.interactive-chart');
            if (parent) {
                // 更新按钮状态
                parent.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // 更新图表显示
                const chartType = this.getAttribute('data-chart');
                parent.querySelectorAll('.chart-display').forEach(display => {
                    display.style.display = 'none';
                });
                const targetDisplay = parent.querySelector(`.chart-display[data-type="${chartType}"]`);
                if (targetDisplay) {
                    targetDisplay.style.display = 'block';
                }
            }
        });
    });
}

// ==================== 计算器功能 ====================
function calculateElasticity() {
    const p1 = parseFloat(document.getElementById('p1').value);
    const p2 = parseFloat(document.getElementById('p2').value);
    const q1 = parseFloat(document.getElementById('q1').value);
    const q2 = parseFloat(document.getElementById('q2').value);

    if (isNaN(p1) || isNaN(p2) || isNaN(q1) || isNaN(q2) || p1 === 0 || q1 === 0) {
        document.getElementById('elasticity-result').innerHTML = '请输入所有有效的数值（价格和需求量不能为 0）';
        return;
    }

    const priceChange = p2 - p1;
    const quantityChange = q2 - q1;
    const avgPrice = (p1 + p2) / 2;
    const avgQuantity = (q1 + q2) / 2;

    const priceChangePercent = priceChange / avgPrice;
    const quantityChangePercent = quantityChange / avgQuantity;

    const elasticity = quantityChangePercent / priceChangePercent;

    let elasticityType = '';
    if (Math.abs(elasticity) > 1) {
        elasticityType = '（富有弹性）';
    } else if (Math.abs(elasticity) < 1) {
        elasticityType = '（缺乏弹性）';
    } else {
        elasticityType = '（单位弹性）';
    }

    document.getElementById('elasticity-result').innerHTML =
        `价格弹性系数：${elasticity.toFixed(4)} ${elasticityType}<br>
         价格变化：${((priceChange / p1) * 100).toFixed(2)}%<br>
         需求量变化：${((quantityChange / q1) * 100).toFixed(2)}%`;
}

function calculateCPI() {
    const baseCost = parseFloat(document.getElementById('base-cost').value);
    const currentCost = parseFloat(document.getElementById('current-cost').value);

    if (isNaN(baseCost) || isNaN(currentCost) || baseCost === 0) {
        document.getElementById('cpi-result').innerHTML = '请输入有效的数值（基期成本不能为 0）';
        return;
    }

    const cpi = (currentCost / baseCost) * 100;
    const inflationRate = ((cpi - 100) / 100) * 100;

    document.getElementById('cpi-result').innerHTML =
        `CPI 指数：${cpi.toFixed(2)}<br>
         通货膨胀率：${inflationRate.toFixed(2)}%`;
}

function calculateGDP() {
    const C = parseFloat(document.getElementById('consumption').value) || 0;
    const I = parseFloat(document.getElementById('investment').value) || 0;
    const G = parseFloat(document.getElementById('government').value) || 0;
    const NX = parseFloat(document.getElementById('net-export').value) || 0;

    const gdp = C + I + G + NX;

    document.getElementById('gdp-result').innerHTML =
        `GDP = C + I + G + NX<br>
         GDP = ${C} + ${I} + ${G} + ${NX}<br>
         GDP = ${gdp.toFixed(2)}`;
}

function calculateMultiplier() {
    const mpc = parseFloat(document.getElementById('mpc').value);

    if (isNaN(mpc) || mpc <= 0 || mpc >= 1) {
        document.getElementById('multiplier-result').innerHTML = '请输入有效的边际消费倾向（0 < MPC < 1）';
        return;
    }

    const multiplier = 1 / (1 - mpc);
    const taxMultiplier = -mpc / (1 - mpc);

    document.getElementById('multiplier-result').innerHTML =
        `投资乘数：${multiplier.toFixed(4)}<br>
         税收乘数：${taxMultiplier.toFixed(4)}<br>
         平衡预算乘数：1`;
}

function calculateUtility() {
    const x = parseFloat(document.getElementById('good-x').value);
    const y = parseFloat(document.getElementById('good-y').value);
    const alpha = parseFloat(document.getElementById('alpha').value) || 0.5;

    if (isNaN(x) || isNaN(y) || x < 0 || y < 0) {
        document.getElementById('utility-result').innerHTML = '请输入有效的商品数量（非负数）';
        return;
    }

    // Cobb-Douglas 效用函数 U = x^α * y^(1-α)
    const utility = Math.pow(x, alpha) * Math.pow(y, 1 - alpha);
    const muX = alpha * Math.pow(x, alpha - 1) * Math.pow(y, 1 - alpha);
    const muY = (1 - alpha) * Math.pow(x, alpha) * Math.pow(y, -alpha);

    document.getElementById('utility-result').innerHTML =
        `效用值 U: ${utility.toFixed(4)}<br>
         商品 X 的边际效用 MUx: ${muX.toFixed(4)}<br>
         商品 Y 的边际效用 MUy: ${muY.toFixed(4)}<br>
         边际替代率 MRS: ${(muX / muY).toFixed(4)}`;
}

function calculateCrypto() {
    const initialInvestment = parseFloat(document.getElementById('crypto-initial').value);
    const startPrice = parseFloat(document.getElementById('crypto-start-price').value);
    const currentPrice = parseFloat(document.getElementById('crypto-current-price').value);

    if (isNaN(initialInvestment) || isNaN(startPrice) || isNaN(currentPrice) || startPrice === 0 || initialInvestment === 0) {
        document.getElementById('crypto-result').innerHTML = '请输入所有有效的数值（初始投资和初始价格不能为 0）';
        return;
    }

    const tokenAmount = initialInvestment / startPrice;
    const currentValue = tokenAmount * currentPrice;
    const profit = currentValue - initialInvestment;
    const returnRate = (profit / initialInvestment) * 100;

    document.getElementById('crypto-result').innerHTML =
        `持有代币数量：${tokenAmount.toFixed(6)}<br>
         当前价值：$${currentValue.toFixed(2)}<br>
         收益/损失：$${profit.toFixed(2)}<br>
         收益率：${returnRate.toFixed(2)}%`;
}

function calculateCarbon() {
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const fuel = parseFloat(document.getElementById('fuel').value) || 0;
    const carbonIntensity = parseFloat(document.getElementById('carbon-intensity').value) || 0.5;
    const carbonPrice = parseFloat(document.getElementById('carbon-price').value) || 80;

    const electricityCarbon = electricity * carbonIntensity;
    const fuelCarbon = fuel * 2.31;
    const totalCarbonTonnes = (electricityCarbon + fuelCarbon) / 1000;
    const carbonCost = totalCarbonTonnes * carbonPrice;

    document.getElementById('carbon-result').innerHTML =
        `电力碳排放：${electricityCarbon.toFixed(2)} kg CO₂<br>
         燃料碳排放：${fuelCarbon.toFixed(2)} kg CO₂<br>
         总碳排放：${totalCarbonTonnes.toFixed(4)} 吨 CO₂<br>
         碳成本：$${carbonCost.toFixed(2)}<br>
         <small>注：燃料按汽油标准计算 (2.31 kg CO₂/升)</small>`;
}

// 计算器切换功能
document.querySelectorAll('.calc-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.calc-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        document.querySelectorAll('.calculator-panel').forEach(panel => panel.classList.remove('active'));
        const calcType = this.getAttribute('data-calc');
        const panel = document.getElementById(`${calcType}-calc`);
        if (panel) {
            panel.classList.add('active');
        }
    });
});

// 为所有输入框添加实时验证
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value < 0) {
            this.value = '';
        }
    });
});

// ==================== 图表渲染工具函数 ====================
// 绘制供求曲线
function drawSupplyDemand(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.offsetWidth;
    const height = 300;
    const padding = 40;

    container.innerHTML = `
        <svg width="${width}" height="${height}" class="coordinate-chart">
            <!-- 坐标轴 -->
            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>
            
            <!-- 坐标轴标签 -->
            <text x="${width - 20}" y="${height - padding + 15}" font-size="12">Q</text>
            <text x="${padding - 25}" y="${padding + 10}" font-size="12">P</text>
            
            <!-- 需求曲线 -->
            <line x1="${padding + 20}" y1="${padding + 30}" x2="${width - padding - 20}" y2="${height - padding - 30}" 
                  stroke="#e74c3c" stroke-width="3" stroke-dasharray="5,5"/>
            <text x="${width - padding - 40}" y="${height - padding - 40}" fill="#e74c3c" font-size="12">D</text>
            
            <!-- 供给曲线 -->
            <line x1="${padding + 20}" y1="${height - padding - 30}" x2="${width - padding - 20}" y2="${padding + 30}" 
                  stroke="#3498db" stroke-width="3"/>
            <text x="${width - padding - 40}" y="${padding + 40}" fill="#3498db" font-size="12">S</text>
            
            <!-- 均衡点 -->
            <circle cx="${width / 2}" cy="${height / 2}" r="6" fill="#27ae60"/>
            <text x="${width / 2 + 10}" y="${height / 2 - 10}" font-size="11" fill="#27ae60">E</text>
            
            <!-- 均衡价格线 -->
            <line x1="${padding}" y1="${height / 2}" x2="${width / 2}" y2="${height / 2}" 
                  stroke="#27ae60" stroke-width="1" stroke-dasharray="3,3"/>
            <line x1="${width / 2}" y1="${height / 2}" x2="${width / 2}" y2="${height - padding}" 
                  stroke="#27ae60" stroke-width="1" stroke-dasharray="3,3"/>
            
            <text x="${padding - 35}" y="${height / 2 + 4}" font-size="10" fill="#27ae60">P*</text>
            <text x="${width / 2 - 10}" y="${height - padding + 15}" font-size="10" fill="#27ae60">Q*</text>
        </svg>
    `;
}

// 绘制经济周期图
function drawBusinessCycle(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.offsetWidth;
    const height = 300;
    const padding = 40;
    const centerY = height / 2;

    // 生成经济周期曲线（正弦波）
    const points = [];
    for (let i = 0; i <= width - padding * 2; i += 5) {
        const x = padding + i;
        const y = centerY - Math.sin(i / 50) * 60 + (i / (width - padding * 2)) * 20;
        points.push(`${x},${y}`);
    }

    container.innerHTML = `
        <svg width="${width}" height="${height}">
            <!-- 趋势线 -->
            <line x1="${padding}" y1="${centerY + 20}" x2="${width - padding}" y2="${centerY - 20}" 
                  stroke="#95a5a6" stroke-width="2" stroke-dasharray="5,5"/>
            <text x="${width - padding - 50}" y="${centerY - 25}" fill="#95a5a6" font-size="11">长期趋势</text>
            
            <!-- 实际 GDP 曲线 -->
            <polyline points="${points.join(' ')}" fill="none" stroke="#3498db" stroke-width="3"/>
            
            <!-- 阶段标记 -->
            <circle cx="${padding + 100}" cy="${centerY - 40}" r="5" fill="#e74c3c"/>
            <text x="${padding + 100}" y="${centerY - 55}" font-size="10" fill="#e74c3c">繁荣</text>
            
            <circle cx="${padding + 200}" cy="${centerY}" r="5" fill="#f39c12"/>
            <text x="${padding + 200}" y="${centerY - 15}" font-size="10" fill="#f39c12">衰退</text>
            
            <circle cx="${padding + 300}" cy="${centerY + 50}" r="5" fill="#e74c3c"/>
            <text x="${padding + 300}" y="${centerY + 70}" font-size="10" fill="#e74c3c">萧条</text>
            
            <circle cx="${padding + 400}" cy="${centerY + 10}" r="5" fill="#27ae60"/>
            <text x="${padding + 400}" y="${centerY - 10}" font-size="10" fill="#27ae60">复苏</text>
            
            <!-- 坐标轴 -->
            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>
            
            <text x="${padding - 30}" y="${padding + 15}" font-size="11">GDP</text>
            <text x="${width - 20}" y="${height - padding + 15}" font-size="11">时间</text>
        </svg>
    `;
}

// 绘制菲利普斯曲线
function drawPhillipsCurve(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.offsetWidth;
    const height = 300;
    const padding = 40;

    container.innerHTML = `
        <svg width="${width}" height="${height}">
            <!-- 坐标轴 -->
            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>
            
            <!-- 菲利普斯曲线 -->
            <path d="M ${padding + 30} ${height - padding - 100} Q ${width / 2} ${height - padding - 50} ${width - padding - 30} ${height - padding - 150}" 
                  fill="none" stroke="#e74c3c" stroke-width="3"/>
            <text x="${width - padding - 50}" y="${height - padding - 140}" fill="#e74c3c" font-size="12">PC</text>
            
            <!-- 点 A -->
            <circle cx="${padding + 80}" cy="${height - padding - 80}" r="5" fill="#3498db"/>
            <text x="${padding + 90}" y="${height - padding - 75}" font-size="10">A</text>
            <text x="${padding + 90}" y="${height - padding - 60}" font-size="9" fill="#7f8c8d">低失业</text>
            <text x="${padding + 90}" y="${height - padding - 48}" font-size="9" fill="#7f8c8d">高通胀</text>
            
            <!-- 点 B -->
            <circle cx="${width - padding - 80}" cy="${height - padding - 130}" r="5" fill="#3498db"/>
            <text x="${width - padding - 70}" y="${height - padding - 125}" font-size="10">B</text>
            <text x="${width - padding - 70}" y="${height - padding - 110}" font-size="9" fill="#7f8c8d">高失业</text>
            <text x="${width - padding - 70}" y="${height - padding - 98}" font-size="9" fill="#7f8c8d">低通胀</text>
            
            <text x="${padding - 35}" y="${padding + 15}" font-size="11">通胀率</text>
            <text x="${width - 50}" y="${height - padding + 15}" font-size="11">失业率</text>
        </svg>
    `;
}

// 动态加载图表
window.addEventListener('resize', () => {
    // 重新绘制图表
    const supplyDemandContainer = document.getElementById('supply-demand-chart');
    if (supplyDemandContainer) {
        drawSupplyDemand('supply-demand-chart', {});
    }
    
    const businessCycleContainer = document.getElementById('business-cycle-chart');
    if (businessCycleContainer) {
        drawBusinessCycle('business-cycle-chart');
    }
    
    const phillipsContainer = document.getElementById('phillips-curve-chart');
    if (phillipsContainer) {
        drawPhillipsCurve('phillips-curve-chart');
    }
});

// 页面加载后绘制图表
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        drawSupplyDemand('supply-demand-chart', {});
        drawBusinessCycle('business-cycle-chart');
        drawPhillipsCurve('phillips-curve-chart');
    }, 100);
});

// ==================== 表格交互功能 ====================
// 表格排序功能
function sortTable(tableId, columnIndex) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const headers = table.querySelectorAll('th');
    
    // 确定排序方向
    const currentHeader = headers[columnIndex];
    const isAscending = !currentHeader.classList.contains('sort-asc');
    
    // 清除所有排序类
    headers.forEach(h => {
        h.classList.remove('sort-asc', 'sort-desc');
    });
    
    // 设置当前排序类
    currentHeader.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
    
    // 排序
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        
        const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        }
        
        return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });
    
    // 重新插入排序后的行
    rows.forEach(row => tbody.appendChild(row));
}

// ==================== 标签页切换功能 ====================
function switchTab(tabGroup, tabId) {
    const container = document.querySelector(`[data-tab-group="${tabGroup}"]`);
    if (!container) return;
    
    // 更新按钮状态
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    container.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
    
    // 更新内容显示
    container.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    container.querySelector(`#${tabId}`)?.classList.add('active');
}

// ==================== 折叠面板功能 ====================
function toggleAccordion(header) {
    const panel = header.nextElementSibling;
    if (!panel) return;
    
    panel.classList.toggle('active');
    header.classList.toggle('active');
}

// ==================== 工具函数 ====================
// 格式化数字（添加千分位）
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 计算百分比变化
function calculatePercentChange(oldValue, newValue) {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
}

// 显示提示框
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 5px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
