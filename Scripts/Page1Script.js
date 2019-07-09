/*jshint esversion: 7 */

function setLayout(sometitlex, sometitley) {
    const new_layout = {
        autosize: true,
        margin: {l: 45, r: 30, t: 30, b: 30},
        hovermode: "closest",
        showlegend: false,
        xaxis: {range: [-100, 100], zeroline: true, title: sometitlex},
        yaxis: {range: [0, 100], zeroline: true, title: sometitley},
        aspectratio: {x: 1, y: 1}
    };
    return new_layout;
}

function GetGamma(Beta){
    let Gamma = 1/(sqrt(1-Beta**2));
    return Gamma;
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

function GetStraightLineValues(xValues, m, c) { 
    //computes the y values for given x values
    let y = [];

    if (m == "inf"){
        //figure out what to do here
    }else{
        for (let i in xValues) {
            x = xValues[i];  
            y.push(m*x + c);
        }
    }
    return y;
}

function GetAllGraphData(xValues, yValues) {
    let data = [];
    
    for (i = 0; i < yValues.length; i++) {
        data.push(
            {
                type: "scatter",
                mode: "lines",
                x: xValues,
                y: yValues[i],
                line: {color: "#960078", width: 3, dash: "dashed"},
            }
        );
    }
    return data;
}

function GetNewInputs(){
    let FrameBeta = parseFloat(document.getElementById("FrameBetaController").value);
    let ObjectBeta = parseFloat(document.getElementById("ObjectBetaController").value);
    return [FrameBeta, ObjectBeta];
}

function Main(EventList = [], NewPlots = false){ 
    let NewInputs = GetNewInputs();
    let FrameBeta = NewInputs[0];
    let ObjectBeta = NewInputs[1];
    //maybe try skipping updating if the value of the slider is different already.
    
    xValues = numeric.linspace(-100, 100, 1000);

    xDash_yValues = GetStraightLineValues(xValues, FrameBeta, 0);
    ctDash_yValues = GetStraightLineValues(xValues, (1/FrameBeta), 0);
    Object_yValues = GetStraightLineValues(xValues, 1/ObjectBeta, 0);

    AllYValues = [xDash_yValues];
    //AllYValues = xDash_yValues;
    AllYValues.push(ctDash_yValues);
    AllYValues.push(Object_yValues);

    GraphData = GetAllGraphData(xValues, AllYValues);

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
    $('#FrameBetaController').on("input", function(){
        $("#" + $(this).attr("id") + "Display").text($(this).val() + $("#" + $(this).attr("id") + "Display").attr("data-unit"));
        Main("cats");
    });

    $('#ObjectBetaController').on("input", function(){
        $("#" + $(this).attr("id") + "Display").text($(this).val() + $("#" + $(this).attr("id") + "Display").attr("data-unit"));
        Main("cats");
    });

    $("#SubmitButton").on("click", function(){
        let EventX = parseFloat(document.getElementById("EventX").value);
        let EventY = parseFloat(document.getElementById("EventY").value);
        Main([EventX, EventY]);
        //now clear box ready for new values.
    });
    
    Main("cats", true);
}

$(document).ready(Setup); //Load setup when document is ready.