// calculator.js (ОНОВЛЕНА ВЕРСІЯ З ФУНКЦІЯМИ ЛР №3)

// ==============================================================================
//                 МАТЕМАТИЧНІ ФУНКЦІЇ (ЛР №2 & ЛР №3)
// ==============================================================================

// --- ФУНКЦІЇ ЛР №3 ---

function gcd(a, b) {
    // Алгоритм Евкліда для знаходження НОД(a, b) [cite: 92, 108]
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        let r = a % b; // 1. Ділимо a на b, отримуємо залишок r [cite: 109]
        a = b;         // 3. Переозначаємо a <- b [cite: 111]
        b = r;         // 3. Переозначаємо b <- r [cite: 111]
    }
    return a; // 2. Якщо r=0, то a (колишнє b) – найбільший спільний дільник [cite: 110]
}

function extendedGcd(a, b) {
    // Розширений алгоритм Евкліда (для оберненого елемента ЛР №2)
    if (a === 0) {
        return [b, 0, 1]; 
    }
    const [gcd, x1, y1] = extendedGcd(b % a, a);
    const x = y1 - Math.floor(b / a) * x1;
    const y = x1;
    return [gcd, x, y];
}

function isPrime(n, k = 5) {
    // Перевірка простоти на основі малої теореми Ферма [cite: 126, 99]
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;

    // Перевірка Ферма: ap-1 mod p ≡ 1 [cite: 101]
    for (let i = 0; i < k; i++) {
        // Обираємо випадкове a в інтервалі [2, p-2] [cite: 101, 102]
        let a = Math.floor(Math.random() * (n - 3)) + 2; 
        if (powerMod(a, n - 1, n) !== 1) {
            return false;
        }
    }
    return true;
}

function generatePrime(maxA) {
    // Генерація простого числа p <= A [cite: 127]
    if (maxA < 2) return null;
    let p = Math.floor(Math.random() * (maxA - 2)) + 2;
    while (!isPrime(p)) {
        p = Math.floor(Math.random() * (maxA - 2)) + 2;
        if (p >= maxA) p = maxA; // Якщо рандом не спрацював, перевіряємо межу
        if (p < 2) p = 2;
    }
    return p;
}

function phi(n) {
    // Алгоритм обчислення функції Ейлера ϕ(n) [cite: 170, 171]
    if (n <= 0) return 0;
    let result = n;
    let i = 2;
    
    // Розкладання числа на прості множники 
    while (i * i <= n) {
        if (n % i === 0) {
            // Знайдено простий дільник i
            while (n % i === 0) {
                n /= i;
            }
            // Формула: result -= result / i; [cite: 170]
            result -= result / i;
        }
        i++;
    }
    
    if (n > 1) {
        // Якщо n > 1, то залишок n є простим числом
        result -= result / n;
    }
    return Math.round(result);
}

// --- ФУНКЦІЇ ЛР №2 ---

function modInverse(a, m) {
    a = (a % m + m) % m; 
    if (a === 0) return null;

    const [gcdVal, x, y] = extendedGcd(a, m);
    
    if (gcdVal !== 1) {
        return null;
    } else {
        return (x % m + m) % m;
    }
}

function add(a, b, m) { return (a + b) % m; }
function reverseAdd(a, m) { return ((-a % m) + m) % m; }
function subtract(a, b, m) { return add(a, reverseAdd(b, m), m); }
function multiply(a, b, m) { return (a * b) % m; }

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

function powerMod(a, b, m) {
    if (b < 0) {
        throw new Error("Від'ємний показник степеня (b) не підтримується.");
    }
    a = a % m;
    let result = 1;

    for (let i = 0; i < b; i++) {
        result = (result * a) % m;
    }
    return result;
}

// ==============================================================================
//                         ФУНКЦІЇ ІНТЕРФЕЙСУ
// ==============================================================================

const mInput = document.getElementById('modulus-m');
const aInput = document.getElementById('operand-a');
const bInput = document.getElementById('operand-b');
const resultC = document.getElementById('result-c');
const errorMsg = document.getElementById('error-message');

function getInputs(isBinary = false, isGcd = false) {
    const m = parseInt(mInput.value);
    const a = parseInt(aInput.value);

    if (!isGcd && (isNaN(m) || m <= 0)) { // НОД(a,b) не залежить від m
        throw new Error("Модуль m має бути додатним числом.");
    }
    if (isNaN(a)) {
        throw new Error("Операнд 'a' має бути заданий.");
    }

    if (isBinary || isGcd) {
        const b = parseInt(bInput.value);
        if (isNaN(b)) {
            throw new Error("Операнд 'b' має бути заданий.");
        }
        return { m, a, b };
    }
    return { m, a };
}

function clearFields() {
    aInput.value = '';
    bInput.value = '';
    resultC.value = '---';
    errorMsg.textContent = '';
}

function calculate(operation) {
    let result;
    errorMsg.textContent = '';

    try {
        if (['add', 'subtract', 'multiply', 'power', 'divide'].includes(operation)) {
            // ЛР №2: Бінарні операції
            const { m, a, b } = getInputs(true);
            
            if (operation === 'add') result = add(a, b, m);
            else if (operation === 'subtract') result = subtract(a, b, m);
            else if (operation === 'multiply') result = multiply(a, b, m);
            else if (operation === 'power') result = powerMod(a, b, m);
            else if (operation === 'divide') result = divide(a, b, m);
            
        } else if (operation === 'gcd') {
             // ЛР №3: Завдання 3. Алгоритм Евкліда
            const { a, b } = getInputs(true, true);
            result = gcd(a, b);
            
        } else if (operation === 'isPrime') {
             // ЛР №3: Завдання 1. Перевірка простоти
            const { a } = getInputs(false);
            result = isPrime(a) ? "Просте" : "Складене";
            
        } else if (operation === 'genPrime') {
             // ЛР №3: Завдання 1. Генерація простого числа
            const { a } = getInputs(false);
            if (a <= 1) throw new Error("Межа А має бути > 1.");
            result = generatePrime(a);
            
        } else if (operation === 'phi') {
             // ЛР №3: Завдання 5. Обчислення функції Ейлера
            const { a } = getInputs(false);
            result = phi(a);
            
        } else if (operation === 'rev_add') {
            // ЛР №2: Унарна операція: -a
            const { m, a } = getInputs(false);
            result = reverseAdd(a, m);

        } else if (operation === 'mod_inverse') {
            // ЛР №2: Унарна операція: 1/a (через розширений Евклід)
            const { m, a } = getInputs(false);
            result = modInverse(a, m);
            if (result === null) {
                throw new Error(`Обернений елемент для ${a} не існує (НСД(${a}, ${m}) ≠ 1).`);
            }
        
        } else if (operation === 'euler_inverse') {
             // ЛР №3: Завдання 6. Обернений елемент за теоремою Ейлера
            const { m, a } = getInputs(true); // Використовуємо m як модуль, a як число
            const phiM = phi(m);
            if (gcd(a, m) !== 1) {
                throw new Error(`Числа ${a} і ${m} не взаємно прості. Теорема Ейлера не застосовується.`);
            }
            // Формула: a^-1 = a^(ϕ(m)-1) mod m [cite: 183]
            result = powerMod(a, phiM - 1, m);
        }
        
        resultC.value = result;

    } catch (e) {
        resultC.value = 'Помилка';
        errorMsg.textContent = e.message;
    }
}