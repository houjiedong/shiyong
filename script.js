document.addEventListener('DOMContentLoaded', function () {
    const consumerTypeInput = document.getElementById('consumer-type');
    const startMatrixInputButton = document.getElementById('start-matrix-input');
    const submitCriteriaButton = document.getElementById('submit-criteria');
    const submitOptionsButton = document.getElementById('submit-options');
    const submitRatingsButton = document.getElementById('submit-ratings');
    const optionsInput = document.getElementById('options-input');
    const ratingList = document.getElementById('rating-list');
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');

    let criteriaMatrix = [];
    let options = [];
    let ratings = {};
    let criteriaWeights = {};

    startMatrixInputButton.addEventListener('click', function () {
        // 这里不再验证消费类型是否为1或2
        document.getElementById('criteria-section').classList.remove('hidden');
    });

    submitCriteriaButton.addEventListener('click', function () {
        criteriaMatrix = [
            [1, parseInt(document.getElementById('matrix-1-2').value), parseInt(document.getElementById('matrix-1-3').value), parseInt(document.getElementById('matrix-1-4').value)],
            [1 / parseInt(document.getElementById('matrix-1-2').value), 1, parseInt(document.getElementById('matrix-2-3').value), parseInt(document.getElementById('matrix-2-4').value)],
            [1 / parseInt(document.getElementById('matrix-1-3').value), 1 / parseInt(document.getElementById('matrix-2-3').value), 1, parseInt(document.getElementById('matrix-3-4').value)],
            [1 / parseInt(document.getElementById('matrix-1-4').value), 1 / parseInt(document.getElementById('matrix-2-4').value), 1 / parseInt(document.getElementById('matrix-3-4').value), 1]
        ];

        // 计算标准的权重
        const rowSums = criteriaMatrix.map(row => row.reduce((a, b) => a + b, 0));
        const normalizedMatrix = criteriaMatrix.map((row, i) => row.map(value => value / rowSums[i]));
        const criteriaSums = normalizedMatrix[0].map((_, colIndex) => normalizedMatrix.map(row => row[colIndex]).reduce((a, b) => a + b, 0));
        criteriaWeights = criteriaSums.map(sum => sum / criteriaSums.length);

        document.getElementById('options-section').classList.remove('hidden');
    });

    submitOptionsButton.addEventListener('click', function () {
        options = optionsInput.value.trim().split(' ');
        ratingList.innerHTML = '';
        options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.innerHTML = `<h4>${option}</h4>
                <label>实用性评分：<input type="number" id="${option}-1" min="1" max="9"></label><br>
                <label>质量评分：<input type="number" id="${option}-2" min="1" max="9"></label><br>
                <label>耐用性评分：<input type="number" id="${option}-3" min="1" max="9"></label><br>
                <label>性价比评分：<input type="number" id="${option}-4" min="1" max="9"></label><br>
            `;
            ratingList.appendChild(optionDiv);
        });
        document.getElementById('rating-section').classList.remove('hidden');
    });

    submitRatingsButton.addEventListener('click', function () {
        options.forEach(option => {
            ratings[option] = criteriaWeights.reduce((sum, weight, index) => {
                const score = parseInt(document.getElementById(`${option}-${index + 1}`).value) || 1;
                return sum + (score * weight);
            }, 0);
        });

        // 计算每个选项的权重（选项得分 / 所有选项得分之和）
        const totalScores = Object.values(ratings).reduce((a, b) => a + b, 0);
        const normalizedRatings = {};
        Object.keys(ratings).forEach(option => {
            normalizedRatings[option] = ratings[option] / totalScores;
        });

        const bestOption = Object.keys(normalizedRatings).reduce((best, option) => normalizedRatings[option] > normalizedRatings[best] ? option : best);
        resultContent.innerHTML = `最佳决策是：${bestOption}，权重为 ${normalizedRatings[bestOption].toFixed(4)}`;
        resultSection.classList.remove('hidden');
    });
});
