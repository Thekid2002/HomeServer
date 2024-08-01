export function goToPage(page) {
    switch (page) {
        case "simpleCalculator":
            window.location.href = "simpleCalculator.html";
            break;
        case "interpreterCalculator":
            window.location.href = "interpreterCalculator.html";
            break;
        case "compilerCalculator":
            window.location.href = "compilerCalculator.html";
            break;
    }
}