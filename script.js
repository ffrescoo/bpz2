
function extendedGcd(a, b) {
    if (a === 0) {
        return [b, 0, 1]; // [gcd, x, y]
    }
    const [gcd, x1, y1] = extendedGcd(b % a, a);
    const x = y1 - Math.floor(b / a) * x1;
    const y = x1;
    return [gcd, x, y];
}

// Знаходження зворотного елемента по множенню (a^-1 mod m)
function modInverse(a, m) {
    a = (a % m + m) % m; // Приведення a до [0, m-1]
    if (a === 0) return null;

    const [gcd, x, y] = extendedGcd(a, m);
    
    if (gcd !== 1) {
        return null; // Обернений елемент не існує
    } else {
        return (x % m + m) % m; // Приведення x до [0, m-1]
    }
}

// Операції:
function add(a, b, m) { return (a + b) % m; }
function reverseAdd(a, m) { return (m - (a % m + m) % m) % m; }
function subtract(a, b, m) { return add(a, reverseAdd(b, m), m); }
function multiply(a, b, m) { return (a * b) % m; }

// Зведення в ступінь (a^b mod m) - реалізація циклом
function powerMod(a, b, m) {
    if (b < 0) {
        throw new Error("Від'ємний показник степеня не підтримується.");
    }
    a = (a % m + m) % m;
    let result = 1;

    for (let i = 0; i < b; i++) {
        result = (result * a) % m;
    }
    return result;
}

// Ділення (a / b mod m)
function divide(a, b, m) {
    if (b === 0) {
        throw new Error("Ділення на нульовий клас не визначене.");
    }
    const bInv = modInverse(b, m);
    
    if (bInv === null) {
        throw new Error(`Обернений елемент для ${b} не існує (НСД(${b}, ${m}) ≠ 1).`);
    }
    
    return multiply(a, bInv, m);
}


const mInput = document.getElementById('modulus-m');
const aInput = document.getElementById('operand-a');
const bInput = document.getElementById('operand-b');
const resultC = document.getElementById('result-c');
const errorMsg = document.getElementById('error-message');

function getInputs(isBinary = false) {
    const m = parseInt(mInput.value);
    const a = parseInt(aInput.value);

    if (isNaN(m) || m <= 0) {
        throw new Error("Модуль m має бути додатним числом.");
    }
    if (isNaN(a)) {
        throw new Error("Операнд 'a' має бути заданий.");
    }

    if (isBinary) {
        const b = parseInt(bInput.value);
        if (isNaN(b)) {
            throw new Error("Операнд 'b' має бути заданий для цієї операції.");
        }
        return { m, a, b };
    }
    return { m, a };
}

function clearFields() {
    aInput.value = '';
    bInput.value = '';
    bInput.disabled = true;
    resultC.value = '---';
    errorMsg.textContent = '';
}

function calculate(operation) {
    let result;
    errorMsg.textContent = '';
    bInput.disabled = true;

    try {
        if (['add', 'subtract', 'multiply', 'power', 'divide'].includes(operation)) {
            // Бінарні операції
            bInput.disabled = false;
            const { m, a, b } = getInputs(true);
            
            if (operation === 'add') result = add(a, b, m);
            else if (operation === 'subtract') result = subtract(a, b, m);
            else if (operation === 'multiply') result = multiply(a, b, m);
            else if (operation === 'power') result = powerMod(a, b, m);
            else if (operation === 'divide') result = divide(a, b, m);

        } else if (operation === 'reverse_add') {
            // Унарні операції: -a
            const { m, a } = getInputs(false);
            result = reverseAdd(a, m);

        } else if (operation === 'mod_inverse') {
            // Унарні операції: 1/a
            const { m, a } = getInputs(false);
            result = modInverse(a, m);
            if (result === null) {
                throw new Error(`Обернений елемент для ${a} не існує (НСД(${a}, ${m}) ≠ 1).`);
            }
        }
        
        resultC.value = result;

    } catch (e) {
        resultC.value = 'Помилка';
        errorMsg.textContent = e.message;
    }
}

// Увімкнути/вимкнути поле b при зміні фокусу (для зручності)
document.querySelectorAll('.operations-grid button').forEach(button => {
    button.addEventListener('click', () => {
        const op = button.textContent;
        const isBinary = ['+', '-', '*', '^', '/'].includes(op);
        bInput.disabled = !isBinary;
    });
});