document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('grid');
    const elementGrid = document.getElementById('element-container');
    const timeDisplay = document.getElementById('time-display');
    const scoreDisplay = document.getElementById('score-display');
    const gazdagDisplay = document.getElementById('gazdag-display');
    const hatarDisplay = document.getElementById('hatar-display');
    const fasorDisplay = document.getElementById('fasor-display');
    const krumpliDisplay = document.getElementById('krumpli-display');
    const questGrid = document.getElementById('quest-grid');
    const newGame = document.getElementById('new-game');
    const rotateElement = document.getElementById('rotate');
    const mirrorElement = document.getElementById('mirror');

    const rows = 11;
    const cols = 11;
    const questrows = 2;
    const questcols = 2;

    let matrix = createMatrix(rows, cols);
    let questMatrix = createMatrix(questrows, questcols);
    let remainingTime = 28;
    let fullscore = 0;
    let score1 = 0;
    let gameOver = false;
    let randomElement;
    let id;
    
    const elements = [
        {
            time: 2,
            type: 'water',
            shape: [[1, 1, 1],
            [0, 0, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'village',
            shape: [[1, 1, 1],
            [0, 0, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'forest',
            shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'plains',
            shape: [[1, 1, 1],
            [0, 0, 1],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'forest',
            shape: [[1, 1, 1],
            [0, 0, 1],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'village',
            shape: [[1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'plains',
            shape: [[1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'village',
            shape: [[1, 1, 0],
            [1, 0, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'village',
            shape: [[1, 1, 1],
            [1, 1, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'plains',
            shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'plains',
            shape: [[0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'water',
            shape: [[1, 1, 1],
            [1, 0, 0],
            [1, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'water',
            shape: [[1, 0, 0],
            [1, 1, 1],
            [1, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'forest',
            shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 1]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'forest',
            shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'water',
            shape: [[1, 1, 0],
            [1, 1, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
    ]

    generateMatrix(matrix);
    generateQuestMatrix(questMatrix);
    generateRandomElement(elements);

    //Event Listeners

    grid.addEventListener('click', function (event) {
        if (gameOver) {
            alert('Game over! Start a new game!');
            return;
        }

        if (event.target.tagName === 'TD') {
            const clickedCell = event.target;
            const rowIndex = clickedCell.parentNode.rowIndex;
            const colIndex = clickedCell.cellIndex;
            const dataValue = clickedCell.dataset.value;

            elementGrid.innerHTML = '';

            if (randomElement.time === 2 && remainingTime === 1) {
                alert('Cannot place element with time 2 when remaining time is 1!');
                checkTimeElement();
                return;
            }

            if (addElementToMatrix(matrix, randomElement, rowIndex, colIndex) === false) {
                keepRandomElement();
                return;
            } else {
                if (remainingTime - randomElement.time === 0) {
                    alert('Game Over!');
                    updateMatrix(matrix, randomElement);
                    updateTime();
                    addCellClickListeners();
                    generateRandomElement(elements);
                } else {
                    updateMatrix(matrix, randomElement);
                    checkTimeElement();
                    updateTime();
                    addCellClickListeners();
                }
            }

        }
    });

    newGame.addEventListener('click', function (event) {
        matrix = createMatrix(rows, cols);
        questMatrix = createMatrix(questrows, questcols);
        remainingTime = 28;
        fullscore = 0;
        score1 = 0;
        gameOver = false;

        generateMatrix(matrix);
        generateQuestMatrix(questMatrix);
        generateRandomElement(elements);

        timeDisplay.textContent = `Maradandó idő: ${remainingTime}`;
        scoreDisplay.textContent = `Összpont: ${fullscore}`;
        hatarDisplay.textContent = `Határvidék: ${fullscore}`;

        elementGrid.innerHTML = '';

        keepRandomElement();

        addCellClickListeners();
    });

    rotateElement.addEventListener('click', function () {
        rotateElementMatrix(randomElement);
        elementGrid.innerHTML = '';
        keepRandomElement();
    });

    mirrorElement.addEventListener('click', function () {
        elementGrid.innerHTML = '';
        mirrorCurrentElement();
    });

    window.addEventListener('resize', function () {
        generateQuestMatrix(questMatrix);
    });

    function createMatrix(rows, cols) {
        return Array.from({ length: rows }, () => Array(cols).fill(0));
    }

    function generateMatrix(matrix) {

        grid.innerHTML = '';

        for (let i = 0; i < rows; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('td');
                if (
                    (i + 1 === 2 && j + 1 === 2) ||
                    (i + 1 === 4 && j + 1 === 9) ||
                    (i + 1 === 6 && j + 1 === 4) ||
                    (i + 1 === 9 && j + 1 === 10) ||
                    (i + 1 === 10 && j + 1 === 6)
                ) {
                    matrix[i][j] = 'mountain';
                    cell.dataset.value = 2;
                    cell.id = `mountain`;
                    cell.style.backgroundImage = 'url("tiles/mountain_tile.png")';
                } else {
                    cell.dataset.value = 0;
                    cell.style.backgroundImage = 'url("tiles/base_tile.png")';
                }
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
        addCellClickListeners();
    }

    function updateMatrix(matrix, randomElement) {
        const gridCells = document.querySelectorAll('#grid td');

        gridCells.forEach(cell => {
            const rowIndex = cell.parentNode.rowIndex;
            const colIndex = cell.cellIndex;
            const cellValue = matrix[rowIndex][colIndex];

            if ((rowIndex + 1 === 2 && colIndex + 1 === 2) ||
                (rowIndex + 1 === 4 && colIndex + 1 === 9) ||
                (rowIndex + 1 === 6 && colIndex + 1 === 4) ||
                (rowIndex + 1 === 9 && colIndex + 1 === 10) ||
                (rowIndex + 1 === 10 && colIndex + 1 === 6)
            ) {
                matrix[rowIndex][colIndex] = 'mountain';
                cell.dataset.value = 2;
                cell.id = 'mountain';
                cell.style.backgroundImage = 'url("tiles/mountain_tile.png")';
            } else if (cell.id === randomElement.type && cell.dataset.value !== '1') {
                cell.dataset.value = 1;
                id = randomElement.type;
                cell.style.backgroundImage = 'url("tiles/' + randomElement.type + '_tile.png")';
            }
        });


        addCellClickListeners();
    }

    function addCellClickListeners() {
        const gridCells = document.querySelectorAll('#grid td');

        gridCells.forEach(cell => {
            const rowIndex = cell.parentNode.rowIndex;
            const colIndex = cell.cellIndex;
            const cellValue = matrix[rowIndex][colIndex];

            if (cellValue !== 'mountain') {
                cell.classList.add('placeable');
            }
            else if (cellValue === 'mountain') {
                cell.classList.add('unplaceable');
            }
        });
    }

    function generateQuestMatrix(questMatrix) {
        questGrid.innerHTML = '';
        const windowWidth = window.innerWidth;

        for (let i = 0; i < questrows; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < questcols; j++) {
                const cell = document.createElement('td');
                if ((i + 1 === 1 && j + 1 === 1)) {
                    questMatrix[i][j] = 'gazdag';
                    cell.id = `hatar`;
                    if (windowWidth < 1248) {
                        cell.style.backgroundImage = 'url("img/kisGazdag.png")';
                        cell.style.backgroundSize = '100px';
                    } else {
                        cell.style.backgroundImage = 'url("missions_hun/Group 71.png")';
                    }
                } else if ((i + 1 === 1 && j + 1 === 2)) {
                    questMatrix[i][j] = 'fasor';
                    cell.id = `hatar`;
                    if (windowWidth < 1248) {
                        cell.style.backgroundImage = 'url("img/kisFasor.png")';
                        cell.style.backgroundSize = '100px';
                    } else {
                        cell.style.backgroundImage = 'url("missions_hun/Group 68.png")';
                    }

                } else if ((i + 1 === 2 && j + 1 === 1)) {
                    questMatrix[i][j] = 'krumpliontozes';
                    cell.id = `krumpliontozes`;
                    if (windowWidth < 1248) {
                        cell.style.backgroundImage = 'url("img/kisKrumpli.png")';
                        cell.style.backgroundSize = '100px';
                    } else {
                        cell.style.backgroundImage = 'url("missions_hun/Group 70.png")';
                    }

                } else {
                    questMatrix[i][j] = 'hatar';
                    cell.id = `hatar`;
                    if (windowWidth < 1248) {
                        cell.style.backgroundImage = 'url("img/kisHatar.png")';
                        cell.style.backgroundSize = '100px';
                    } else {
                        cell.style.backgroundImage = 'url("missions_hun/Group 78.png")';
                    }

                }
                cell.addEventListener('click', function () {
                    cell.classList.toggle('glow');
                });

                row.appendChild(cell);
            }
            questGrid.appendChild(row);
        }

    }

    function updateTime() {
        remainingTime = remainingTime - randomElement.time;
        timeDisplay.textContent = `Maradandó idő: ${remainingTime}`;
        if (remainingTime === 0) {
            gameOver = true;
            checkFullRows(matrix);
            checkFullColumns(matrix);
            checkFullScore();
        }
        scoreDisplay.textContent = `Összpont: ${fullscore}`;
        hatarDisplay.textContent = `Határvidék: ${fullscore}`;
    }

    function generateRandomElement(elements) {
        elementGrid.innerHTML = '';

        const randomInex = Math.floor(Math.random() * elements.length);
        randomElement = elements[randomInex];
        const timeDiv = document.createElement('div');
        timeDiv.textContent = `Idő: ${randomElement.time}`;
        elementGrid.appendChild(timeDiv);

        for (let i = 0; i < 3; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('td');
                if (randomElement.shape[i][j] === 1) {
                    cell.dataset.value = 1;
                    cell.style.backgroundImage = 'url("tiles/' + randomElement.type + '_tile.png")';
                } else {
                    cell.dataset.value = 0;
                    cell.style.backgroundImage = 'url("tiles/base_tile.png")';
                }
                row.appendChild(cell);
            }
            elementGrid.appendChild(row);
        }

    }

    function keepRandomElement() {
        const timeDiv = document.createElement('div');
        timeDiv.textContent = `Idő: ${randomElement.time}`;
        elementGrid.appendChild(timeDiv);

        for (let i = 0; i < 3; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('td');
                if (randomElement.shape[i][j] === 1) {
                    cell.dataset.value = 1;
                    cell.style.backgroundImage = 'url("tiles/' + randomElement.type + '_tile.png")';
                } else {
                    cell.dataset.value = 0;
                    cell.style.backgroundImage = 'url("tiles/base_tile.png")';
                }
                row.appendChild(cell);
            }
            elementGrid.appendChild(row);
        }
    }

    function mirrorCurrentElement() {
        if (randomElement) {
            randomElement.mirrored = !randomElement.mirrored;
            keepRandomElement();
        }
    }

    function rotateElementMatrix(element) {
        element.rotation = (element.rotation + 90) % 360;

        const rotatedShape = [];

        for (let i = 0; i < element.shape.length; i++) {
            rotatedShape.push([]);
            for (let j = 0; j < element.shape[i].length; j++) {
                rotatedShape[i][j] = element.shape[element.shape.length - 1 - j][i];
            }
        }

        element.shape = rotatedShape;
    }

    function checkTimeElement() {
        if (randomElement.time === 2 && remainingTime === 1) {
            do {
                generateRandomElement(elements);
                updateMatrix(matrix, randomElement);
            } while (randomElement.time !== 1);
        } else {
            generateRandomElement(elements);
        }
    }

    function addElementToMatrix(matrix, element, x, y) {
        const shape = element.shape.map(row => row.slice());
        const elementId = element.type;

        if (element.mirrored) {
            shape.forEach(row => row.reverse());
        }

        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                const targetRowIndex = x + i;
                const targetColIndex = y + j;

                if (targetRowIndex < 0 || targetRowIndex >= matrix.length || targetColIndex < 0 || targetColIndex >= matrix[0].length) {
                    if (shape[i][j] === 1) {
                        return false;
                    }
                    continue;
                }

                const targetDataValue = matrix[targetRowIndex][targetColIndex];
                if ((targetDataValue === 'mountain' || targetDataValue === 'village' || targetDataValue === 'water' || targetDataValue === 'forest' || targetDataValue === 'plains') && shape[i][j] === 1) {
                    alert('Cannot place element on a mountain or element cell');
                    return false;
                }
            }
        }

        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] === 1) {
                    const targetRowIndex = x + i;
                    const targetColIndex = y + j;

                    matrix[targetRowIndex][targetColIndex] = shape[i][j];
                    const cellId = elementId;

                    matrix[targetRowIndex][targetColIndex] = cellId;

                    const cell = document.querySelector(`#grid tr:nth-child(${targetRowIndex + 1}) td:nth-child(${targetColIndex + 1})`);
                    cell.id = cellId;
                }
            }
        }
    }

    function transpose(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    function checkFullRows(matrix) {
        for (let i = 0; i < matrix.length; i++) {
            const rowValues = matrix[i];
            const expectedIds = ['water', 'village', 'forest', 'plains', 'mountain'];
            const hasAnyId = rowValues.every(id => expectedIds.includes(id));

            if (hasAnyId) {
                score1++;
            }
        }
    }

    function checkFullColumns(matrix) {
        const transposedMatrix = transpose(matrix);

        for (let i = 0; i < transposedMatrix.length; i++) {
            const colValues = transposedMatrix[i];
            const expectedIds = ['water', 'village', 'forest', 'plains', 'mountain'];
            const hasAnyId = colValues.every(id => expectedIds.includes(id));

            if (hasAnyId) {
                score1++;
            }
        }
    }

    function checkFullScore() {
        fullscore = score1 * 6
    }
});