var xmlhttp = new XMLHttpRequest();
var url = "http://192.168.160.58/Olympics/api/Statistics/Games_Countries";
xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        //console.log(data)
        Counter = data.map(function (elem) {
            return elem.Counter
        })
        Name = data.map(function (elem) {
            return elem.Name
        })
        //console.log(Counter)
        //console.log(Name)
        const ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Name,
                datasets: [{
                    label: 'Number of Countries',
                    data: Counter,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}