function linearEquation(a, b) {
    if (a === 0) {
        if (b === 0) {
            return 'many roots';
        } else {
            return 'no root';
        }
    } else {
        const x = -b / a;
        return 'one root x=' + x;
    }
}

function quadraticEquation(a, b, c) {

    if (a === 0) {
        return linearEquation(b, c);
    }
    const delta = b * b - 4 * a * c;
    if (delta > 0) {
        return `The equation has 2 roots: ${((-b + Math.sqrt(delta))) / (2 * a)} & ${((-b - Math.sqrt(delta))) / (2 * a)}`;
    }
    if (delta === 0) {
        return `The equation has 1 root: ${(-b) / (2 * a)}`;
    } else {
        return "No solution";
    }

}



function solveQuadratic() {

    const a = parseFloat(aCoef.value) || 1;
    const b = parseFloat(bCoef.value) || 1;
    const c = parseFloat(cCoef.value) || 0;

    const s = quadraticEquation(a, b, c);

    result.textContent = s;



}

const aCoef = document.querySelector('input#a');
const bCoef = document.querySelector('input#b');
const cCoef = document.querySelector('input#c');
const solve = document.querySelector('button');
solve.addEventListener('click', solveQuadratic);
// cái củ lìn solveQuadratic kia ko để dấu () vào :((

const result = document.querySelector('#result');