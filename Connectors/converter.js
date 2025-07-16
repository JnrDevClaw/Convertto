document.addEventListener('DOMContentLoaded', async () => {
    const categorySelect = document.getElementById('categorySelect');
    const fromUnitSelect = document.getElementById('fromUnitSelect');
    const toUnitSelect = document.getElementById('toUnitSelect');
    const inputValue = document.getElementById('inputValue');
    const resultDisplay = document.getElementById('resultDisplay');

    // Load categories
    try {
        const response = await fetch('http://localhost:3000/api/categories');
        const categories = await response.json();
        categories.forEach(category => {
            const option = new Option(category, category);
            categorySelect.add(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }

    // Load units when category changes
    categorySelect.addEventListener('change', async () => {
        const category = categorySelect.value;
        if (!category) return;

        try {
            const response = await fetch(`http://localhost:3000/api/categories/${category}`);
            const conversions = await response.json();
            
            // Clear previous options
            fromUnitSelect.innerHTML = '<option value="">Select From Unit</option>';
            toUnitSelect.innerHTML = '<option value="">Select To Unit</option>';
            
            // Get unique units
            const units = [...new Set(conversions.flatMap(conv => [conv.fromUnit, conv.toUnit]))];
            
            // Add units to selects
            units.forEach(unit => {
                fromUnitSelect.add(new Option(unit, unit));
                toUnitSelect.add(new Option(unit, unit));
            });
        } catch (error) {
            console.error('Error loading units:', error);
        }
    });

    // Real-time conversion
    async function convertValue() {
        const category = categorySelect.value;
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        const input = inputValue.value;

        if (!category || !fromUnit || !toUnit || !input) {
            resultDisplay.textContent = '';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category,
                    fromUnit,
                    toUnit,
                    input: parseFloat(input)
                })
            });

            const data = await response.json();
            if (response.ok) {
                resultDisplay.textContent = `${data.result} ${toUnit}`;
                resultDisplay.classList.remove('error');
            } else {
                resultDisplay.textContent = data.error;
                resultDisplay.classList.add('error');
            }
        } catch (error) {
            resultDisplay.textContent = 'Error performing conversion';
            resultDisplay.classList.add('error');
        }
    }

    // Add event listeners for real-time conversion
    inputValue.addEventListener('input', convertValue);
    fromUnitSelect.addEventListener('change', convertValue);
    toUnitSelect.addEventListener('change', convertValue);
});