class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor() {
        this.apiUrl = 'https://api.frankfurter.app';
        this.currencies = [];
    }

    
    //getCurrencies(apiUrl) {}
    async getCurrencies() {
    const endpoint = 'https://api.frankfurter.app/currencies';

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error('Respuesta incorrecta');
        }

        const data = await response.json();

        this.currencies = [];

        for (const code in data) {
            if (data.hasOwnProperty(code)) {
                this.currencies.push(new Currency(code));
            }
        }
    } catch (error) {
        console.error('Error al obtener monedas:', error);
    }
}

    //convertCurrency(amount, fromCurrency, toCurrency) {}

    async convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency.code === toCurrency.code) {
            // Si las monedas son iguales, no convertimos.
            return amount;
        }

        try {
            const response = await fetch(`${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`);
            const data = await response.json();

            // Retornamos el monto convertido
            return data.rates[toCurrency.code] * amount;
        } catch (error) {
            console.error('Error al convertir la moneda:', error);
            return null;
        }
    }
}

    document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");

    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );

        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${
                fromCurrency.code
            } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
