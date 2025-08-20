document.addEventListener('DOMContentLoaded', () => {
  const amountInput = document.getElementById('amountInput');
  const fromUnitSelect = document.getElementById('fromUnitSelect');
  const toUnitSelect = document.getElementById('toUnitSelect');
  const convertButton = document.getElementById('convertButton');
  const resultOutput = document.getElementById('resultOutput');

  // Dynamically get the category from the body's data attribute
  const currentPageCategory = document.body.dataset.category;

  if (!currentPageCategory) {
    resultOutput.value = 'Error: Page category not configured in HTML.';
    console.error("Developer: data-category attribute not set on the body tag!");
    return;
  }

  convertButton.addEventListener('click', async () => {
    const amount = parseFloat(amountInput.value);
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    // A more generic validation that works for temperature too.
    if (isNaN(amount)) {
      resultOutput.value = 'Error: Please enter a valid amount.';
      return;
    }
    if (!fromUnit) {
      resultOutput.value = 'Error: Please select a "From" unit.';
      return;
    }
    if (!toUnit) {
      resultOutput.value = 'Error: Please select a "To" unit.';
      return;
    }

    resultOutput.value = 'Converting...';

    try {
      const response = await fetch('http://localhost:3001/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: currentPageCategory,
          fromUnit,
          toUnit,
          input: amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        resultOutput.value = `Error: ${data.error || `Request failed with status ${response.status}`}`;
      } else {
        resultOutput.value = data.result !== undefined && data.result !== null ? data.result : 'Conversion failed or no result.';
      }
    } catch (error) {
      console.error('Conversion API error:', error);
      resultOutput.value = 'Error: Could not connect to the server or process the request.';
    }
  });
});
