/*jshint esversion: 7 */

// class SpaceTimeDiagram{
//     constructor(Name, Frames, Events, FrameID){
//         this.Name = Name;//name of graph to link to html
//         this.Frames = Frames;//an array of frames
//         this.Events = Events;//an array of events
//         this.FrameID = FrameID;  //assigns a particular frame to be the frame of this diagram
//         //this.FrameColourList = FrameColourList;
//     }

//     GetGraphData(){
//         let Frames = this.Frames;
//         let Events = this.Events;
        
//         let DiagramData = [];
//         let n0;
//         let n1;
//         let CurrentData;
//         console.log("frameid");
//         console.log(this.FrameID);
//         for (let i = 0; i<Frames.length; i++){
//             CurrentData = Frames[i].GetPlotData();
//             n0 = 2*this.FrameID;
//             n1 = n0 + 1;
//             //console.log([n0, n1]);
//             //for (let j = 0; j<CurrentData.length; j++){
//             DiagramData.push(CurrentData[n0]);
//             DiagramData.push(CurrentData[n1]);
//             //}
//         }

//         // for (let i = 0; i<Events.length; i++){
//         //     CurrentData = Events[i].GetPlotData();
//         //     for (let j = 0; j<CurrentData.length; j++){
//         //         DiagramData.push(CurrentData[j]);
//         //     }
//         // }

//         //console.log(DiagramData);
//         return DiagramData;
//     }

//     // UpdateBetas(NewBetas){
//     //     this.Betas = NewBetas;
//     // }
//     UpdateFrames(NewFrames){//is this the right way of doing this?
//         this.Frames = NewFrames;
//     }

//     UpdateEvents(NewEvents){
//         this.Events = NewEvents;
//     }

//     NewPlot(DiagramData){
//         Plotly.purge(this.Name);

//         let xLabel = this.Frames[this.FrameID].AxisNames[0];
//         let ctLabel = this.Frames[this.FrameID].AxisNames[1];

//         Plotly.newPlot(this.Name, DiagramData, this.SetLayout(xLabel, ctLabel));
//     }

//     React(DiagramData){
//         let xLabel = this.Frames[this.FrameID].AxisNames[0];
//         let ctLabel = this.Frames[this.FrameID].AxisNames[1];

//         Plotly.react(this.Name, DiagramData, this.SetLayout(xLabel, ctLabel));
//     }

//     SetLayout(sometitlex, sometitley) {
//         const new_layout = {
//             autosize: true,
//             margin: {l: 45, r: 30, t: 30, b: 30},
//             hovermode: "closest",
//             showlegend: false,
//             xaxis: {range: [-100, 100], zeroline: true, title: sometitlex},
//             yaxis: {range: [-100, 100], zeroline: true, title: sometitley},
//             aspectratio: {x: 1, y: 1}
//         };
//         return new_layout;
//     }
    
// }

class Frame{
    constructor(xLimits, ctLimits, FrameColour, AxisNames, Betas, FrameBeta){
        //philosophy:  there are two frames on the screen, each seen in 2 different ways
        //set up coordinates of endpoints of lines that make axes
        //consider adding this.origin to allow for frame translation
        this.N = [0,ctLimits[1]];
        this.S = [0, ctLimits[0]];
        this.W = [xLimits[0], 0];
        this.E = [xLimits[1], 0];
        this.FrameColour = FrameColour;
        this.AxisNames = AxisNames; //an array of two strings, x axis name then ct axis name.
        //this.FrameID = FrameID;  //assigns a beta to this frame.  Index of desired beta in Betas
        this.Betas = Betas; //frame data will be produced in same order as betas.
        this.FrameBeta = FrameBeta;
    }

    // GetPlotData(){
    //     let Beta = this.Betas[this.FrameID];

    //     let North = this.N;
    //     let South = this.S;
    //     let West = this.W;
    //     let East = this.E;
    //     let FrameColour = this.FrameColour;

    //     let Data = [];

    //     let Gamma = this.GetGamma(Beta);

    //     North = this.LorentzTransform(North, Beta, Gamma);
    //     South = this.LorentzTransform(South, Beta, Gamma);
    //     West = this.LorentzTransform(West, Beta, Gamma);
    //     East = this.LorentzTransform(East, Beta, Gamma);

    //     Data.push({
    //         type: "scatter",
    //         mode: "lines",
    //         line: {
    //             //dash: 'dash',
    //             width: 2,
    //             color: FrameColour //implement changeable colour
    //         },
    //         x: [South[1], North[1]],
    //         y: [South[0], North[0]]
    //     });

    //     Data.push({
    //         type: "scatter",
    //         mode: "lines",
    //         line: {
    //             //dash: 'dash',
    //             width: 2,
    //             color: FrameColour //implement changeable colour
    //         },
    //         x: [West[1], East[1]],
    //         y: [West[0], East[0]]
    //     });
       
    //     return Data;
    // }
    DrawFrame(Frames, Events, GraphID){
        let FrameBeta = this.FrameBeta;


    }

    GetPlotData(Betas = this.Betas){
        console.log("betas");
        console.log(Betas);
        let North = this.N;
        let South = this.S;
        let West = this.W;
        let East = this.E;
        let FrameColour = this.FrameColour;

        let Data = [];

        let Gammas = this.GetGammas(Betas);

        let NewNorth, NewSouth, NewWest, NewEast;

        for (let i = 0; i<Betas.length; i++){
            NewNorth = this.LorentzTransform(North, Betas[i], Gammas[i]);
            NewSouth = this.LorentzTransform(South, Betas[i], Gammas[i]);
            NewWest = this.LorentzTransform(West, Betas[i], Gammas[i]);
            NewEast = this.LorentzTransform(East, Betas[i], Gammas[i]);

            Data.push({
                type: "scatter",
                mode: "lines",
                line: {
                    //dash: 'dash',
                    width: 2,
                    color: FrameColour //implement changeable colour
                },
                x: [NewSouth[1], NewNorth[1]],
                y: [NewSouth[0], NewNorth[0]]
            });

            Data.push({
                type: "scatter",
                mode: "lines",
                line: {
                    //dash: 'dash',
                    width: 2,
                    color: FrameColour //implement changeable colour
                },
                x: [NewWest[1], NewEast[1]],
                y: [NewWest[0], NewEast[0]]
            });

        }
       
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

    GetGammas(Betas){
        let Gammas = [];
        let CurrentGamma;
        for (let i = 0; i < Betas.length; i++){
            CurrentGamma = 1/(Math.sqrt(1-((Betas[i])**2)));
            Gammas.push(CurrentGamma);
        }
        return Gammas;
    }

    React(Data){
        plotly.react(this.GraphName, Data, this.SetLayout(xLabel, ctLabel));
    }

    NewPlot(Data){
        Plotly.newPlot(this.GraphName, Data, this.SetLayout(xLabel, ctLabel));
    }
}


class Event{
    constructor(ID, ct, x, Betas){
        this.ID = ID; //assigns the row in the table
        this.Betas = Betas;
        this.Gammas = this.GetGammas(this.Betas);

        this.Positions = this.GetTransformedPositions(ct, x, this.Betas, this.Gammas);

        this.RefreshTable(this.ID, this.Positions);
    }

    RefreshTable(ID, Positions){
        document.getElementById("EventTable").rows[this.ID].cells[0].innerHTML = this.Positions[0][0];
        document.getElementById("EventTable").rows[this.ID].cells[1].innerHTML = this.Positions[0][1];
        document.getElementById("EventTable").rows[this.ID].cells[2].innerHTML = this.Positions[1][0];
        document.getElementById("EventTable").rows[this.ID].cells[3].innerHTML = this.Positions[1][1];//this needs improving
        //for any amount of betas.
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
        let Gammas = [];
        let CurrentGamma;
        for (let i = 0; i < Betas.length; i++){
            CurrentGamma = 1/(Math.sqrt(1-((Betas[i])**2)));
            Gammas.push(CurrentGamma);
        }
        return Gammas;
    }

    GetPlotData(){
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

    for (let i = 0; i < EventList.length; i++){ //be careful about this object stuff taking forever
        CurrentEvent = new Event(i, EventList[i][1], EventList[i][0], [0, FrameBeta]);
        PointData = CurrentEvent.GetDrawData();

        GraphData1.push(PointData[0]);//consider doing this a better way
        GraphData1.push(PointData[1]);
        GraphData1.push(PointData[2]);
        GraphData2.push(PointData[3]);//consider doing this a better way
        GraphData2.push(PointData[4]);
        GraphData2.push(PointData[5]);
        
    }
 
    return [GraphData1, GraphData2];
}

function GetNewInputs(){
    let FrameBeta = parseFloat(document.getElementById("FrameBetaController").value);
    ///let ObjectBeta = parseFloat(document.getElementById("ObjectBetaController").value);
    return FrameBeta;
}

function AddEvent(ct, x){
    let MaxEvents = 5;
    let FrameBeta = GetNewInputs();
    let Betas = [0, FrameBeta];
    
    let CurrentEvents = GetAllEvents(MaxEvents);
    let RowToFill = CurrentEvents.length + 1;

    let NewEvent = new Event(CurrentEvents.length + 1, ct, x, Betas);


    if (RowToFill <= MaxEvents){
        document.getElementById("EventTable").rows[RowToFill].cells[0].innerHTML = NewEvent.Positions[0][0];
        document.getElementById("EventTable").rows[RowToFill].cells[1].innerHTML = NewEvent.Positions[0][1];
        document.getElementById("EventTable").rows[RowToFill].cells[2].innerHTML = NewEvent.Positions[1][0];
        document.getElementById("EventTable").rows[RowToFill].cells[3].innerHTML = NewEvent.Positions[1][1];
    }
}

function GetAllEvents(MaxEvents, Betas){ //consider making the table an object...
    let Events = [];
    let x;
    let ct;
    let xDash;
    let ctDash;
    for (let i = 1; i < (MaxEvents+1); i++){
        x =  parseFloat(document.getElementById("EventTable").rows[i].cells[0].innerHTML);
        ct = parseFloat(document.getElementById("EventTable").rows[i].cells[1].innerHTML);
        //xDash =  parseFloat(document.getElementById("EventTable").rows[i].cells[2].innerHTML);
        //ctDash = parseFloat(document.getElementById("EventTable").rows[i].cells[3].innerHTML);

        if (!(isNaN(x) && isNaN(ct) && isNaN(xDash) && isNaN(ctDash))){
            //Events.push([x, ct, xDash, ctDash]);
            Events.push(new Event(i, ct, x, Betas));
        }
    }

    return Events;
}

function ClearEvents(MaxEvents){
    for (let i = 1; i<= MaxEvents; i++){
        for (let j = 0; j< 4; j++){
            document.getElementById("EventTable").rows[i].cells[j].innerHTML = null;
        }
    }
}


function Main(NewPlots = false){ 
    let FrameBeta = GetNewInputs();
    //let FrameGamma = GetGamma(FrameBeta);
    //consider calculating gammas just once and passing them around with the betas.

    let MaxEvents = 5;
    let Betas = [0, FrameBeta];
    let Events = GetAllEvents(MaxEvents, Betas);

    let xMax = 100;
    let ctMax = 100;

    let FrameA = new Frame([-xMax, xMax], [-ctMax, ctMax], "blue", ["x", "ct"], Betas);
    //let FrameB = new Frame([-xMax, xMax], [-ctMax, ctMax], "green", ["x", "ct"], Betas);
    let Frames = [FrameA];//, FrameB];

    let FirstDiagram = new SpaceTimeDiagram("graph1", Frames, Events, 0);
    //let SecondDiagram = new SpaceTimeDiagram("graph2", Frames, Events, 1);

    let GraphData1 = FirstDiagram.GetGraphData();
    //let GraphData2 = SecondDiagram.GetGraphData();

    if (NewPlots){
        FirstDiagram.NewPlot(GraphData1);
        //SecondDiagram.NewPlot(GraphData2);
    }else{
        FirstDiagram.React(GraphData1);
        //SecondDiagram.React(GraphData2);
    }
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
        
        AddEvent(ct, x);

        Main();
    });

    $("#ClearButton").on("click", function(){
        MaxEvents = 5;
        ClearEvents(MaxEvents);
        Main();
    });
    
    Main(NewPlots = true);
}

$(document).ready(Setup); //Load setup when document is ready.