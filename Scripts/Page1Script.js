/*jshint esversion: 7 */

class Event{
    constructor(ct, x, Betas){
        //Betas is an array!!! it should include 0 
        // this.ct = ct;
        // this.x = x;
        //this.Position = [ct, x];

        this.Betas = Betas;
        //console.log(this.Betas);
        this.Gammas = this.GetGammas(this.Betas);

        this.Positions = this.GetTransformedPositions(ct, x, this.Betas, this.Gammas);
    }

    GetTransformedPosition(Beta, Gamma){
        let ct = this.ct;
        let x = this.x;
    
        let ctDash = Gamma*(ct - Beta*x);
        let xDash = Gamma*(x - Beta*ct);
    
        return [ctDash, xDash];
    }

    GetTransformedPositions(ct, x, Betas, Gammas){

        let ctDash;
        let xDash;
        
        let ATransformedPosition;
        let TransformedPositions = [];

        for (let i = 0; i<Betas.length; i++){
            ctDash = Gammas[i]*(ct - Betas[i]*x);
            xDash = Gammas[i]*(x - Betas[i]*ct);
            ATransformedPosition = [ctDash, xDash];
            TransformedPositions.push(ATransformedPosition);
        }
        return TransformedPositions;
    }

    GetGammas(Betas){
        //console.log(Betas);
        let Gammas = [];
        let CurrentGamma;
        //.log(Betas.length);
        for (let i = 0; i < Betas.length; i++){
            //let i = 0;
            CurrentGamma = 1/(Math.sqrt(1-((Betas[i])**2)));
            Gammas.push(CurrentGamma);
            // i = 1;
            // CurrentGamma = 1/(Math.sqrt(1-((Betas[i])**2)));
            // Gammas.push(CurrentGamma);
        }
        //console.log(Gammas);
        return Gammas;
    }

    GetDrawData(){
        //this function finds the ct, x coordinates of a point on the ct' or x' axis corresponding
        //to an event
        let Positions = this.Positions;
        let Betas = this.Betas;
        let Gammas = this.Gammas;
        let DrawData = [];

        let ctA;
        let xA;
        let xDashB;
        let ctDashB;
        let xDashC;
        let ctDashC;
        let xB;
        let ctB;
        let xC;
        let ctC;
        let ctDashPoint;
        let xDashPoint;

        //console.log(Betas);

        for (let i = 0; i < Betas.length; i++){
            ctA = Positions[i][0];
            xA = Positions[i][1];

            xDashB = 0;
            ctDashB = Gammas[i]*(ctA - Betas[i]*xA);
            
            xDashC = Gammas[i]*(xA - Betas[i]*ctA);
            ctDashC = 0;

            xB = Gammas[i]*Betas[i]*ctDashB;
            ctB = Gammas[i]*ctDashB;

            xC = Gammas[i]*xDashC;
            ctC = Gammas[i]*Betas[i]*xDashC;

            ctDashPoint = [xB, ctB];
            xDashPoint=[xC, ctC];

            

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
            
            // if (TransformPoint){
            //     let TransformedPosition = this.GetTransformedPosition(Beta, Gamma);
            //     DrawData.push({
            //         type: "scatter",
            //         mode: "markers",
            //         marker: {size: 10, color: "blue"},//make changeable colours
            //         x:  [TransformedPosition[1]],
            //         y:  [TransformedPosition[0]]
            //     });
            // }else{

            DrawData.push({
                type: "scatter",
                mode: "markers",
                marker: {size: 10, color: "blue"},//make changeable colours
                x:  [xA],
                y:  [ctA]
            });

            //}
        }

        return DrawData;
    }

    // //add something to allow getting plot data in both frames
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
            x: [South[1], North[1]],
            y: [South[0], North[0]]
        });

        Data.push({
            type: "scatter",
            mode: "lines",
            line: {
                //dash: 'dash',
                width: 2,
                color: "black" //implement changeable colour
            },
            x: [West[1], East[1]],
            y: [West[0], East[0]]
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

function GetAllGraphData(FrameA, FrameB, FrameBeta, FrameGamma, EventList){
    let GraphData1 = [];
    let GraphData2 = [];
    let CurrentEvent;
    let PointData;

    let AxisData;
    AxisData = FrameA.GetAxisData(0);
    GraphData1.push(AxisData[0]);
    GraphData1.push(AxisData[1]);

    AxisData = FrameA.GetAxisData(FrameBeta);
    GraphData2.push(AxisData[0]);
    GraphData2.push(AxisData[1]);

    AxisData = FrameB.GetAxisData(-FrameBeta);
    GraphData1.push(AxisData[0]);
    GraphData1.push(AxisData[1]);

    AxisData = FrameB.GetAxisData(0);
    GraphData2.push(AxisData[0]);
    GraphData2.push(AxisData[1]);

    //console.log(EventList.length);

    for (let i = 0; i < EventList.length; i++){ //be careful about this object stuff taking forever
        CurrentEvent = new Event(EventList[i][1], EventList[i][0], [FrameBeta]);
        //CurrentEvent = new Event(50, 30, [0, 0.7]);
        PointData = CurrentEvent.GetDrawData();

        GraphData1.push(PointData[0]);//consider doing this a better way
        GraphData1.push(PointData[1]);
        GraphData1.push(PointData[2]);
        GraphData2.push(PointData[3]);//consider doing this a better way
        GraphData2.push(PointData[4]);
        GraphData2.push(PointData[5]);
        
    }
    console.log(GraphData1);
    console.log(GraphData2);
    return [GraphData1, GraphData2];
}

function GetNewInputs(){
    let FrameBeta = parseFloat(document.getElementById("FrameBetaController").value);
    ///let ObjectBeta = parseFloat(document.getElementById("ObjectBetaController").value);
    return FrameBeta;
}

function AddEvent(EventCoords){
    //let EventA = new Event(EventCoords);
    //AddToEventTable(EventA);
}

function GetAllEvents(MaxEvents){ //consider making the table an object...
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

function ClearEvents(MaxEvents){
    for (let i = 0; i< MaxEvents; i++){
        for (let j = 0; j< 4; j++){
            document.getElementById("EventTable").rows[i].cells[j].innerHTML = null;
        }
    }
}


function Main(NewPlots = false){ 
    let FrameBeta = GetNewInputs();
    let FrameGamma = GetGamma(FrameBeta);

    let MaxEvents = 5;
    let EventList = GetAllEvents(MaxEvents);
    // let NumberOfEvents = EventList.length;

    // let format = [];
    // let colours = [];
    // let EventColour = "blue";

    let xMax = 100;
    let ctMax = 100;

    let FrameA = new Frame([-xMax, xMax], [-ctMax, ctMax]);
    let FrameB = new Frame([-xMax, xMax], [-ctMax, ctMax]);

    let GraphData = GetAllGraphData(FrameA, FrameB, FrameBeta, FrameGamma, EventList);
    //console.log(GraphData);
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
        
        //AddEvent([ct, x]);
        Main();
    });

    $("#ClearButton").on("click", function(){
        ClearEvents();
        Main();
    });
    
    Main(NewPlots = true);
}

$(document).ready(Setup); //Load setup when document is ready.