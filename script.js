let input = document.getElementById("input");
let result = document.getElementById("result");
let rate = document.getElementById("rate");
let lastUpdated = document.getElementById("lastUpdated");
let convertButton = document.getElementById("convertButton");
let convertToggler = document.getElementById("convertToggler");
let isEuroToPound = false;
let updateButton = document.getElementById("updateButton");
let exchangeRate = 0;

convertToggler.addEventListener("click", function() {
    isEuroToPound = !isEuroToPound;
    if(isEuroToPound) {
        convertToggler.textContent = "€ → £";
    } else {
        convertToggler.textContent = "£ → €";
    }
});

convertButton.addEventListener("click", function() {
    let amount = parseFloat(input.value);
    if(isEuroToPound) {
        let convertedAmount = amount * exchangeRate;
        result.textContent = `£${convertedAmount.toFixed(2)}`;
    } else {
        let convertedAmount = amount / exchangeRate;
        result.textContent = `€${convertedAmount.toFixed(2)}`;
    }
});

updateButton.addEventListener("click", function(){
    updateRate();
});

function updateRate() {
    fetch("https://api.exchangerate-api.com/v4/latest/EUR")
    .then(response => response.json())
    .then(data => {
        exchangeRate = data.rates.GBP;
        localStorage.setItem("exchangeRate", exchangeRate);
        localStorage.setItem("lastUpdated", Date.now());
        rate.textContent = `1€ = £${exchangeRate}`;
    })
    .catch(error => {
        console.log("API error:", error);
        rate.textContent = "Could not update rate";
    });
}

function checkRate() {

    let savedRate = localStorage.getItem("exchangeRate");
    let savedTime = localStorage.getItem("lastUpdated");

    if(savedRate && savedTime) {

        let currentTime = Date.now();

        let difference = currentTime - savedTime;

        let sixHours = 6 * 60 * 60 * 1000;

        if(difference < sixHours) {
            exchangeRate = Number(savedRate);
            rate.textContent = `1€ = £${exchangeRate}`;
        } else {
            updateRate();
        }

    } else {
        updateRate();
    }
    let date = new Date(Number(savedTime));

    lastUpdated.textContent = date.toLocaleString();
}

checkRate();