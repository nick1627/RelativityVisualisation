/*jshint esversion: 7 */

//Define shitty global variables
let EventList = [];


class Event{
    constructor(ct, x){
        this.ct = ct;
        this.x = x;
    }

    GetTransformedPosition(Beta, Gamma){
        let ct = this.ct;
        let x = this.x;
    
        let ctDash = Gamma*(ct - Beta*x);
        let xDash = Gamma*(x - Beta*ct);
    
        return [ctDash, xDash];
    }

    //add something to allow getting plot data in both frames
}

function LorentzTransform(EventCoords, Beta, Gamma){
    let ct = EventCoords[0];
    let x = EventCoords[1];

    let ctDash = Gamma*(ct - Beta*x);
    let xDash = Gamma*(x - Beta*ct);

    return [ctDash, xDash];
}

function setLayout(sometitlex, sometitley) {
    const new_layout = {
        autosize: true,
        margin: {l: 45, r: 30, t: 30, b: 30},
        hovermode: "closest",
        showlegend: false,
        xaxis: {range: [-100, 100], zeroline: true, title: sometitlex},
        yaxis: {range: [-100, 100], zeroline: true, title: sometitley},
        aspectratio: {x: 1, y: 1}
    };
    return new_layout;
}

function GetGamma(Beta){
    let Gamma = 1/(Math.sqrt(1-Beta**2));
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

function GetEventAxisPoints(EventList, Gamma, Beta){
    //this function finds the ct, x coordinates of a point on the ct' or x' axis corresponding
    //to an event
    let ctDashPoints = [];
    let xDashPoints = [];

    for (i = 0; i < EventList.length; i++){
        let xA = EventList[i][0];
        let ctA = EventList[i][1];

        let xDashB = 0;
        let ctDashB = Gamma*(ctA - Beta*xA);
        
        let xDashC = Gamma*(xA - Beta*ctA);
        let ctDashC = 0;

        let xB = Gamma*Beta*ctDashB;
        let ctB = Gamma*ctDashB;

        let xC = Gamma*xDashC;
        let ctC = Gamma*Beta*xDashC;

        ctDashPoints.push([xB, ctB]);
        xDashPoints.push([xC, ctC]);
    }
    
    return [ctDashPoints, xDashPoints];
}

function GetAllGraphData(xValues, yValues, LineColours, EventList, EventColour, AxisPoints) {
    let data = [];
    let ctDashAxis = AxisPoints[0];
    let xDashAxis = AxisPoints[1];
    
    for (i = 0; i < yValues.length; i++){
        data.push(
            {
                type: "scatter",
                mode: "lines",
                x: xValues,
                y: yValues[i],
                line: {color: LineColours[i], width: 3, dash: "dashed"},
            }
        );
    }
    if (EventList.length > 0){
        

        for (i = 0; i < EventList.length; i++){
            data.push({
                type: "scatter",
                mode: "lines",
                line: {
                    dash: 'dash',
                    width: 2,
                    color: "blue"
                },
                x: [EventList[i][0], xDashAxis[i][0]],
                y: [EventList[i][1], xDashAxis[i][1]]
            });
            data.push({
                type: "scatter",
                mode: "lines",
                line: {
                    dash: 'dash',
                    width: 2,
                    color: "blue"
                },
                x: [EventList[i][0], ctDashAxis[i][0]],
                y: [EventList[i][1], ctDashAxis[i][1]]
            });
        }
        for (i = 0; i < EventList.length; i++){
            data.push({
                type: "scatter",
                mode: "markers",
                marker: {size: 10, color: EventColour},
                x:  [EventList[i][0]],
                y:  [EventList[i][1]]
            });
        }
    }

    return data;
}

function GetNewInputs(){
    let FrameBeta = parseFloat(document.getElementById("FrameBetaController").value);
    let ObjectBeta = parseFloat(document.getElementById("ObjectBetaController").value);
    return [FrameBeta, ObjectBeta];
}

function AddEvent(EventCoords){
    let EventA = new Event(EventCoords);
    //AddToEventTable(EventA);


}

function GetTableData(){
    let Events = [];
    let x;
    let ct;
    let xDash;
    let ctDash;
    for (let i = 1; i<=5; i++){
        x =  parseFloat(document.getElementById("x" + toString(i)).innerHTML);
        ct = parseFloat(document.getElementById("ct" + toString(i)).innerHTML);
        xDash =  parseFloat(document.getElementById("x" + toString(i)).innerHTML);
        ctDash = parseFloat(document.getElementById("ct" + toString(i)).innerHTML);

        Events.push([x, ct, xDash, ctDash]);
    }
    console.log(Events);
}



function Main(NewPlots = false){ 
    let NewInputs = GetNewInputs();
    let FrameBeta = NewInputs[0];
    let FrameGamma = GetGamma(FrameBeta);
    let ObjectBeta = NewInputs[1];
    let format = [];
    let colours = [];
    let EventColour = "blue";
    
    LineXValues = numeric.linspace(-100, 100, 2);

    xDash_yValues = GetStraightLineValues(LineXValues, FrameBeta, 0);
    ctDash_yValues = GetStraightLineValues(LineXValues, (1/FrameBeta), 0);
    Object_yValues = GetStraightLineValues(LineXValues, (1/ObjectBeta), 0);

    AllYValues = [xDash_yValues];
    format.push("line");
    colours.push("black");

    AllYValues.push(ctDash_yValues);
    format.push("line");
    colours.push("black");

    AllYValues.push(Object_yValues);
    format.push("line");
    colours.push("red");

    

    
    let AxisPoints = GetEventAxisPoints(EventList, FrameGamma, FrameBeta);
    //AxisPoints = [[[0,10],[50,50]],[[10,0],[60,60]]];

    let GraphData = GetAllGraphData(LineXValues, AllYValues, colours, EventList, EventColour, AxisPoints);
    //GraphData = AddPointsToGraphData(GraphData, EventList);

    //GetTableData();

    if (NewPlots){
        NewPlotAllGraphs(GraphData);
    }else{
        ReactAllGraphs(GraphData);
    }
}


function ReactAllGraphs(GraphData){
    Plotly.react("graph1", GraphData, setLayout('x', 'ct'));  
    Plotly.react("graph2", GraphData, setLayout('x', 'ct'));  
    
}

function NewPlotAllGraphs(GraphData){
    Plotly.purge("graph1");
    Plotly.newPlot("graph1", GraphData, setLayout('x', 'ct'));
    Plotly.purge("graph2");
    Plotly.newPlot("graph2", GraphData, setLayout('x', 'ct'));
}

function Setup(){
    $('#FrameBetaController').on("input", function(){
        $("#" + $(this).attr("id") + "Display").text($(this).val() + $("#" + $(this).attr("id") + "Display").attr("data-unit"));
        Main();
    });

    $('#ObjectBetaController').on("input", function(){
        $("#" + $(this).attr("id") + "Display").text($(this).val() + $("#" + $(this).attr("id") + "Display").attr("data-unit"));
        Main();
    });

    $("#SubmitButton").on("click", function(){
        let ct = parseFloat(document.getElementById("EventX").value);
        let x = parseFloat(document.getElementById("EventY").value);
        
        //EventList.push([EventX, EventY]);
        AddEvent([ct, x]);
        Main();
        //now clear box ready for new values.
    });

    $("#ClearButton").on("click", function(){
        EventList = [];
        Main();
    });
    
    Main(NewPlots = true);
}

$(document).ready(Setup); //Load setup when document is ready.