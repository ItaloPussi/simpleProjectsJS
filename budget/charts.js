const canvas = document.querySelector(".chart canvas")
const canvasCtx = canvas.getContext('2d')

function pieChart(income, outcome) {
    var myChart = new Chart(canvasCtx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Outcome'],
            datasets: [{
                data: [income, outcome],
                backgroundColor: [
                    'rgba(0, 255, 0, 1)',
                    'rgba(240, 98, 77, 1)',
                ],
                borderColor: [
                    'rgba(00, 100, 0, 1)',
                    'rgba(161, 69, 48, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: false
            }
        }
    });
}
