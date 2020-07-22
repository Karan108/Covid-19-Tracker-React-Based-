import React, { useState, useEffect } from 'react'
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const casesTypeColors = {
    cases: {
        rgb: "rgb(204,16,52)",
        half_op: "rgba(204,16,52,0.5)",
    },
    recovered: {
        rgb: "rgb(125,215,29)",
        half_op: "rgba(125,215,29,0.5)",
    },
    deaths: {
        rgb: "rgb(251,68,67)",
        half_op: "rgba(251,68,67,0.5)",
    }
}

const options = {
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 0
        },
    },
    maintainAspectRatio: false,
    toooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

//when no value is passed for second parameter it will default to cases or else it takes the passed value
const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
};

function LineGraph({ casesType = "cases", ...props }) {
    const [data, setData] = useState({});


    // url== https://disease.sh/v3/covid-19/historical/all?lastdays=120
    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    let chartData = buildChartData(data, casesType);
                    setData(chartData);
                    console.log(chartData);
                });
        };
        fetchData();
    }, [casesType]);
    let color = casesTypeColors[casesType].rgb;
    let bgColor = casesTypeColors[casesType].half_op;
    return (
        <div className={props.className}>
            {/* data?.length === checks if data is present and then moves to checking length */}
            {data?.length > 0 &&
                < Line
                    options={options}
                    data={{
                        datasets: [
                            {
                                backgroundColor: bgColor,
                                borderColor: color,
                                data: data
                            }
                        ]
                    }} />

            }

            {/* in line the data takes an object as value and inside data ,
            datasets takes an array as value, inside which
            it takes an object with key value pair
             */}
        </div>
    )
}

export default LineGraph
// "#CC1034"