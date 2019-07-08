/*jshint esversion: 7 */

function setLayout(sometitlex, sometitley) {
    const new_layout = {
        autosize: true,
        margin: {l: 45, r: 30, t: 30, b: 30},
        hovermode: "closest",
        showlegend: false,
        xaxis: {range: [-100,100], zeroline: true, title: sometitlex},
        yaxis: {range: [0, 100], zeroline: true, title: sometitley},
        aspectratio: {x: 1, y: 1}
    };
    return new_layout;
}

// convert the string to a numerical function
function GetYValues(xValues, Gradient) { 
    //computes the y values for given x values
    let y = [];
    for (var i in xValues) {
        x = xValues[i];  
        y.push(Gradient*x);
    }
    return y;
}

function GetAllGraphData(xValues, yValues) {
    let data = [
        {
            type: "scatter",
            mode: "lines",
            x: xValues,
            y: yValues,
            line: {color: "#960078", width: 3, dash: "dashed"},
        },
    ];

    return [data];
}

function GetNewInputs(){
    let Beta = parseFloat(document.getElementById("BetaController").value);
    return [Beta];
}

function UpdatePlots(NewPlots = false){ 
    let NewInputs = GetNewInputs();
    let Beta = NewInputs[0];
    //maybe try skipping updating if the value of the slider is different already.
    
    xValues = numeric.linspace(-100, 100, 1000);
    yValues = GetYValues(xValues, Beta);
    GraphData = GetAllGraphData(xValues, yValues)[0];
    if (NewPlots){
        NewPlotAllGraphs(GraphData);
    }else{
        ReactAllGraphs(GraphData);
    }
}


function ReactAllGraphs(GraphData){
    Plotly.react("graph", GraphData, setLayout('x', 'ct'));  
}

function NewPlotAllGraphs(GraphData){
    Plotly.purge("graph");
    Plotly.newPlot("graph", GraphData, setLayout('x', 'ct'));
}

function Setup() {
    $('#BetaController').on("input", function(){
        $("#" + $(this).attr("id") + "Display").text($(this).val() + $("#" + $(this).attr("id") + "Display").attr("data-unit"));
        UpdatePlots();
    });
    UpdatePlots(true);
}

$(document).ready(Setup); //Load setup when document is ready.