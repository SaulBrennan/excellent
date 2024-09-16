// Object mapping country codes to currency symbols
const currencySymbols = {
    'US': '$',  // United States Dollar
    'CN': '¥',  // Chinese Yuan
    'IN': '₹',  // Indian Rupee
    'UK': '£',  // British Pound
    'DE': '€',  // Euro (Germany)
    'FR': '€',  // Euro (France)
    'IT': '€',  // Euro (Italy)
    'ES': '€',  // Euro (Spain)
    'CA': 'C$', // Canadian Dollar
    'AU': 'A$', // Australian Dollar
    'JP': '¥',  // Japanese Yen
    'BR': 'R$', // Brazilian Real
    'RU': '₽',  // Russian Ruble
    'MX': 'Mex$', // Mexican Peso
    'NL': '€',  // Euro (Netherlands)
  };
  
  // Function to update all currency symbols
  function updateCurrencySymbols() {
    const country = document.getElementById('country').value;
    const currencySymbol = country ? (currencySymbols[country] || '$') : '';
    const currencyElements = [
      'currency-symbol',
      'mortgage-currency-symbol',
      'monthly-repayment-currency-symbol',
      'isa-currency-symbol',
      'investments-currency-symbol',
      'pension-currency-symbol',
      'pension-contribution-currency-symbol',
      'other-assets-currency-symbol'
    ];
    currencyElements.forEach(id => {
      document.getElementById(id).textContent = currencySymbol;
    });
  }
  
  // Function to format number with commas
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // Function to handle currency input formatting
  function handleCurrencyInput(e) {
    let value = e.target.value.replace(/[^\d.]/g, '');
    let parts = value.split('.');
    if (parts[0]) {
      parts[0] = formatNumber(parts[0]);
    }
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
    }
    e.target.value = parts.join('.');
  }
  
  // Function to handle percentage input formatting
  function handlePercentageInput(e) {
    let value = e.target.value.replace(/[^\d.]/g, '');
    let parts = value.split('.');
    if (parts[0].length > 2) {
      parts[0] = parts[0].slice(0, 2);
    }
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
    }
    value = parts.join('.');
    let numValue = parseFloat(value);
    if (numValue > 100) {
      value = '100';
    }
    e.target.value = value;
  }
  
  // Add event listeners
  document.getElementById('country').addEventListener('change', updateCurrencySymbols);
  const currencyInputs = [
    'income',
    'mortgageBalance',
    'monthlyRepayment',
    'isaBalance',
    'totalInvestments',
    'pensionValue',
    'monthlyPensionContribution',
    'otherAssets'
  ];
  currencyInputs.forEach(id => {
    document.getElementById(id).addEventListener('input', handleCurrencyInput);
  });
  document.getElementById('mortgageRate').addEventListener('input', handlePercentageInput);
  
  // Initial call to set default currency symbols (blank)
  updateCurrencySymbols();