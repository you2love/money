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
    document.querySelectorAll('.tree-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
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
});

// 计算器相关函数
function calculateElasticity() {
    const p1 = parseFloat(document.getElementById('p1').value);
    const p2 = parseFloat(document.getElementById('p2').value);
    const q1 = parseFloat(document.getElementById('q1').value);
    const q2 = parseFloat(document.getElementById('q2').value);

    if (isNaN(p1) || isNaN(p2) || isNaN(q1) || isNaN(q2) || p1 === 0 || q1 === 0) {
        document.getElementById('elasticity-result').innerHTML = '请输入所有有效的数值（价格和需求量不能为0）';
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
        `价格弹性系数: ${elasticity.toFixed(4)} ${elasticityType}<br>
         价格变化: ${((priceChange / p1) * 100).toFixed(2)}%<br>
         需求量变化: ${((quantityChange / q1) * 100).toFixed(2)}%`;
}

function calculateCPI() {
    const baseCost = parseFloat(document.getElementById('base-cost').value);
    const currentCost = parseFloat(document.getElementById('current-cost').value);

    if (isNaN(baseCost) || isNaN(currentCost) || baseCost === 0) {
        document.getElementById('cpi-result').innerHTML = '请输入有效的数值（基期成本不能为0）';
        return;
    }

    const cpi = (currentCost / baseCost) * 100;
    const inflationRate = ((cpi - 100) / 100) * 100;

    document.getElementById('cpi-result').innerHTML =
        `CPI指数: ${cpi.toFixed(2)}<br>
         通货膨胀率: ${inflationRate.toFixed(2)}%`;
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

function calculateCrypto() {
    const initialInvestment = parseFloat(document.getElementById('crypto-initial').value);
    const startPrice = parseFloat(document.getElementById('crypto-start-price').value);
    const currentPrice = parseFloat(document.getElementById('crypto-current-price').value);

    if (isNaN(initialInvestment) || isNaN(startPrice) || isNaN(currentPrice) || startPrice === 0 || initialInvestment === 0) {
        document.getElementById('crypto-result').innerHTML = '请输入所有有效的数值（初始投资和初始价格不能为0）';
        return;
    }

    const tokenAmount = initialInvestment / startPrice;
    const currentValue = tokenAmount * currentPrice;
    const profit = currentValue - initialInvestment;
    const returnRate = (profit / initialInvestment) * 100;

    document.getElementById('crypto-result').innerHTML =
        `持有代币数量: ${tokenAmount.toFixed(6)}<br>
         当前价值: $${currentValue.toFixed(2)}<br>
         收益/损失: $${profit.toFixed(2)}<br>
         收益率: ${returnRate.toFixed(2)}%`;
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
        `电力碳排放: ${electricityCarbon.toFixed(2)} kg CO₂<br>
         燃料碳排放: ${fuelCarbon.toFixed(2)} kg CO₂<br>
         总碳排放: ${totalCarbonTonnes.toFixed(4)} 吨 CO₂<br>
         碳成本: $${carbonCost.toFixed(2)}<br>
         <small>注：燃料按汽油标准计算(2.31 kg CO₂/升)</small>`;
}

// 计算器切换功能（如果存在）
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
