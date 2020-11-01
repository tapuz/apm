function chart(){

    var ctx = document.getElementById("myChart").getContext('2d');
        var ds = [{"label":"Underweight ( <18.5)","data":[40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,40.0,41.0,41.0,42.0,42.0,43.0,43.0,44.0,45.0,45.0,46.0,46.0,47.0,47.0,48.0,49.0,49.0,50.0,50.0,51.0,52.0,52.0,53.0,54.0,54.0,55.0,56.0,56.0,57.0,57.0,58.0,59.0,59.0,60.0,61.0,61.0,62.0,63.0,64.0,64.0,65.0,66.0,66.0,67.0,68.0,68.0,69.0,70.0,71.0,71.0,72.0,73.0,73.0,74.0,75.0,76.0,76.0,77.0,78.0,79.0,80.0,80.0,81.0],"backgroundColor":"gray","borderColor":"gray","borderWidth":1,"type":"line","lineTension":0},{"label":"Healthy Weight (18.5-25)","data":[42.0,42.0,43.0,44.0,44.0,45.0,46.0,46.0,47.0,48.0,48.0,49.0,50.0,51.0,51.0,52.0,53.0,54.0,54.0,55.0,56.0,57.0,57.0,58.0,59.0,60.0,60.0,61.0,62.0,63.0,63.0,64.0,65.0,66.0,67.0,68.0,68.0,69.0,70.0,71.0,72.0,73.0,73.0,74.0,75.0,76.0,77.0,78.0,79.0,80.0,80.0,81.0,82.0,83.0,84.0,85.0,86.0,87.0,88.0,89.0,90.0,91.0,92.0,93.0,94.0,95.0,96.0,97.0,98.0,99.0,99.0,101.0,102.0,103.0,104.0,105.0,106.0,107.0,108.0,109.0,110.0],"backgroundColor":"green","borderColor":"green","borderWidth":1,"type":"line","lineTension":0},{"label":"Overweight (25-30)","data":[50.0,51.0,52.0,53.0,53.0,54.0,55.0,56.0,57.0,57.0,58.0,59.0,60.0,61.0,62.0,63.0,63.0,64.0,65.0,66.0,67.0,68.0,69.0,70.0,71.0,72.0,73.0,73.0,74.0,75.0,76.0,77.0,78.0,79.0,80.0,81.0,82.0,83.0,84.0,85.0,86.0,87.0,88.0,89.0,90.0,91.0,92.0,93.0,95.0,96.0,97.0,98.0,99.0,100.0,101.0,102.0,103.0,104.0,106.0,107.0,108.0,109.0,110.0,111.0,112.0,114.0,115.0,116.0,117.0,118.0,119.0,121.0,122.0,123.0,124.0,126.0,127.0,128.0,129.0,131.0,132.0],"backgroundColor":"yellow","borderColor":"yellow","borderWidth":1,"type":"line","lineTension":0},{"label":"Obesity [I] (30-35)","data":[59.0,60.0,60.0,61.0,62.0,63.0,64.0,65.0,66.0,67.0,68.0,69.0,70.0,71.0,72.0,73.0,74.0,75.0,76.0,77.0,78.0,79.0,80.0,81.0,83.0,84.0,85.0,86.0,87.0,88.0,89.0,90.0,91.0,92.0,94.0,95.0,96.0,97.0,98.0,99.0,101.0,102.0,103.0,104.0,105.0,107.0,108.0,109.0,110.0,112.0,113.0,114.0,115.0,117.0,118.0,119.0,121.0,122.0,123.0,125.0,126.0,127.0,129.0,130.0,131.0,133.0,134.0,135.0,137.0,138.0,139.0,141.0,142.0,144.0,145.0,147.0,148.0,149.0,150.0,150.0,150.0],"backgroundColor":"orange","borderColor":"orange","borderWidth":1,"type":"line","lineTension":0},{"label":"Obesity [II] (35-40)","data":[67.0,68.0,69.0,70.0,71.0,72.0,73.0,75.0,76.0,77.0,78.0,79.0,80.0,81.0,82.0,84.0,85.0,86.0,87.0,88.0,89.0,91.0,92.0,93.0,94.0,96.0,97.0,98.0,99.0,101.0,102.0,103.0,104.0,106.0,107.0,108.0,110.0,111.0,112.0,114.0,115.0,116.0,118.0,119.0,121.0,122.0,123.0,125.0,126.0,128.0,129.0,131.0,132.0,133.0,135.0,136.0,138.0,139.0,141.0,142.0,144.0,145.0,147.0,148.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0],"backgroundColor":"red","borderColor":"red","borderWidth":1,"type":"line","lineTension":0},{"label":"Obesity [III] (> 40)","data":[150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,150.0,40.0,40.0,40.0],"backgroundColor":"darkred","borderColor":"darkred","borderWidth":1,"type":"line","lineTension":0}];

        ds.unshift({
            label: 'Your BMI',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderColor: '#fff',
            borderWidth: 1,
            radius: 7,
            type: 'bubble',
            data: [
                {
                    y: 95,
                    x: 1.85 * 100
                }
            ]
        });

        var myChart = new Chart(ctx,
            {
                type: 'bar',
                data: {
                    labels: '',
                    datasets: ds
                },
                options: {
                    tooltips: {
                        enabled: true,
                        callbacks: {
                            title: function() {
                                return '';
                            },
                            label: function() {
                                return 'Your BMI: 27.76';
                            }

                        },

                    },
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                fontSize: 16,
                                display: true,
                                labelString: 'KG'
                            }

                        }]
                        ,
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                fontSize: 16,
                                labelString: 'CM'
                            }
                        }]

                    },

                    bezierCurve: false,
                    animation: false,
                    elements: {
                        point: { radius: 0 },
                        line: { tension: 0 }
                    }
                }
            });
}