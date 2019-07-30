/*jshint esversion: 7 */

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

    GetDrawData(Gamma, Beta){
        //this function finds the ct, x coordinates of a point on the ct' or x' axis corresponding
        //to an event
         
        let xA = this.x;
        let ctA = this.ct;

        let xDashB = 0;
        let ctDashB = Gamma*(ctA - Beta*xA);
        
        let xDashC = Gamma*(xA - Beta*ctA);
        let ctDashC = 0;

        let xB = Gamma*Beta*ctDashB;
        let ctB = Gamma*ctDashB;

        let xC = Gamma*xDashC;
        let ctC = Gamma*Beta*xDashC;

        let ctDashPoint = [xB, ctB];
        let xDashPoint=[xC, ctC];

        let DrawData = [];

        DrawData.push({
            type: "scatter",
            mode: "lines",
            line: {
                dash: 'dash',
                width: 2,
                color: "blue"
            },
            x: [xA, xDashPoint[0]],
            y: [ctA, xDashPoint[1]]
        });

        DrawData.push({
            type: "scatter",
            mode: "lines",
            line: {
                dash: 'dash',
                width: 2,
                color: "blue"
            },
            x: [xA, ctDashPoint[0]],
            y: [ctA, ctDashPoint[1]]
        });
    
        DrawData.push({
            type: "scatter",
            mode: "markers",
            marker: {size: 10, color: "blue"},//make changeable colours
            x:  [xA],
            y:  [ctA]
        });
    }

    //add something to allow getting plot data in both frames
}

class Frame{
    constructor(xLimits, ctLimits){
        //set up coordinates of endpoints of lines that make axes
        this.N = [0,ctLimits[1]];
        this.S = [0, ctLimits[0]];
        this.W = [xLimits[0], 0];
        this.E = [xLimits[1], 0];
    }

    GetAxisData(Beta = 0){
        let North = this.N;
        let South = this.S;
        let West = this.W;
        let East = this.E;

        let Data = [];

        let Gamma = this.GetGamma(Beta);

        North = this.LorentzTransform(North, Beta, Gamma);
        South = this.LorentzTransform(South, Beta, Gamma);
        West = this.LorentzTransform(West, Beta, Gamma);
        East = this.LorentzTransform(East, Beta, Gamma);

        Data.push({
            type: "scatter",
            mode: "lines",
            line: {
                //dash: 'dash',
                width: 2,
                color: "black" //implement changeable colour
            },
            x: [South[0], North[0]],
            y: [South[1], North[1]]
        });

        Data.push({
            type: "scatter",
            mode: "lines",
            line: {
                //dash: 'dash',
                width: 2,
                color: "black" //implement changeable colour
            },
            x: [West[0], East[0]],
            y: [West[1], East[1]]
        });
       
        return Data;
    }

    LorentzTransform(EventCoords, Beta, Gamma){
        let ct = EventCoords[0];
        let x = EventCoords[1];
    
        let ctDash = Gamma*(ct - Beta*x);
        let xDash = Gamma*(x - Beta*ct);
    
        return [ctDash, xDash];
    }

    GetGamma(Beta){
        let Gamma = 1/(Math.sqrt(1-Beta**2));
        return Gamma;
    }
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

function GetAllGraphData(FrameA, FrameB, FrameBeta, FrameGamma, EventList){
    let GraphData1 = [];
    let GraphData2 = [];

    GraphData1.push(FrameA.GetAxisData());
    GraphData1.push(FrameB.GetAxisData(FrameBeta));

    GraphData2.push(FrameA.GetAxisData(-FrameBeta));
    GraphData2.push(FrameB.GetAxisData());

    for (i = 0; i < EventList.length; i++){ //be careful about this object stuff taking forever
        let CurrentEvent = new Event(EventList[i][1], EventList[i][0]);
        GraphData1.push(CurrentEvent.GetDrawData(0, 1));
        GraphData2.push(CurrentEvent.GetDrawData(FrameBeta, FrameGamma));//should only need beta?  maybe
    }

    return [GraphData1, GraphData2];
}

function GetAllGraphData2(xValues, yValues, LineColours, EventList, EventColour, AxisPoints){
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

function GetTableData(MaxEvents){ //consider making the table an object...
    let Events = [];
    let x;
    let ct;
    let xDash;
    let ctDash;

    for (let i = 0; i < MaxEvents; i++){
        x =  parseFloat(document.getElementById("EventTable").rows[i].cells[0].innerHTML);
        ct = parseFloat(document.getElementById("EventTable").rows[i].cells[1].innerHTML);
        xDash =  parseFloat(document.getElementById("EventTable").rows[i].cells[2].innerHTML);
        ctDash = parseFloat(document.getElementById("EventTable").rows[i].cells[3].innerHTML);

        Events.push([x, ct, xDash, ctDash]);
    }

    return Events;
}

function ClearTable(MaxEvents){
    for (let i = 0; i< MaxEvents; i++){
        for (let j = 0; j< 4; j++){
            document.getElementById("EventTable").rows[i].cells[j].innerHTML = null;
        }
    }
}


function Main(NewPlots = false){ 
    let NewInputs = GetNewInputs();
    let FrameBeta = NewInputs[0];
    let FrameGamma = GetGamma(FrameBeta);
    let ObjectBeta = NewInputs[1];

    let MaxEvents = 5;
    let EventList = GetTableData(MaxEvents);

    let format = [];
    let colours = [];
    let EventColour = "blue";

    let xMax = 100;
    let ctMax = 100;
    

    let FrameA = new Frame([-xMax, xMax], [-ctMax, ctMax]);
    let FrameB = new Frame([-xMax, xMax], [-ctMax, ctMax]);

    let GraphData = GetAllGraphData(FrameA, FrameB, FrameBeta, FrameGamma, EventList);//LineXValues, AllYValues, colours, EventList, EventColour, AxisPoints);
    let GraphData1 = GraphData[0];
    let GraphData2 = GraphData[1];

    if (NewPlots){
        NewPlotAllGraphs(GraphData1, GraphData2);
    }else{
        ReactAllGraphs(GraphData1, GraphData2);
    }
}


function ReactAllGraphs(GraphData1, GraphData2){
    Plotly.react("graph1", GraphData1, setLayout("x", "ct"));  
    Plotly.react("graph2", GraphData2, setLayout("x'", "ct'"));  
}

function NewPlotAllGraphs(GraphData1, GraphData2){
    Plotly.purge("graph1");
    Plotly.newPlot("graph1", GraphData1, setLayout("x", "ct"));
    Plotly.purge("graph2");
    Plotly.newPlot("graph2", GraphData2, setLayout("x'", "ct'"));
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
        
        AddEvent([ct, x]);
        Main();
    });

    $("#ClearButton").on("click", function(){
        ClearTable();
        Main();
    });
    
    Main(NewPlots = true);
}

$(document).ready(Setup); //Load setup when document is ready.