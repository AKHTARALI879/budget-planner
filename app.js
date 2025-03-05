document.getElementById('budgetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;

    const response = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, category, amount })
    });

    if (response.ok) {
        loadBudgetData();
    }
});

async function loadBudgetData() {
    const response = await fetch('/api/budget');
    const data = await response.json();
    const tableBody = document.querySelector('#budgetTable tbody');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type}</td>
            <td>${item.category}</td>
            <td>${item.amount}</td>
        `;
        tableBody.appendChild(row);
    });

    updateChart(data);
}

function updateChart(data) {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    const income = data.filter(item => item.type === 'income').reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const expense = data.filter(item => item.type === 'expense').reduce((sum, item) => sum + parseFloat(item.amount), 0);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        }
    });
}

loadBudgetData();