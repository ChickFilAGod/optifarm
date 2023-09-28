//checks if forms are good to submit
var labelFormXSubmit = false, 
    labelFormYSubmit = false, 
    profitFormSubmit = false;
checkForm = () => {
    var cansubmit = true;
    const check_p1 = document.getElementById('P1').value,
          check_p2 = document.getElementById('P2').value,
          check_n1 = document.getElementById('N1').value,
          check_n2 = document.getElementById('N2').value,
          check_n3 = document.getElementById('N3').value,
          check_m1 = document.getElementById('M1').value,
          check_m2 = document.getElementById('M2').value,
          check_m3 = document.getElementById('M3').value,
          check_labelx = document.getElementById('Label-x').value,
          check_labely = document.getElementById('Label-y').value
    if (check_n1 == "" || check_n2 == "" || check_n3 == "" || !labelFormXSubmit || !labelFormYSubmit || !profitFormSubmit) cansubmit = false; //cant submit unless labels, profit, and text filled
    document.getElementById('formula-button-1').disabled = !cansubmit;
    cansubmit = true;
    
    if (check_m1 == "" || check_m2 == "" || check_m3 == "" || !labelFormXSubmit || !labelFormYSubmit || !profitFormSubmit) cansubmit = false; //cant submit unless labels, profit, and text filled
    document.getElementById('formula-button-2').disabled = !cansubmit;
    cansubmit = true;

    if (check_p1 == "" || check_p2 == "" || !labelFormXSubmit || !labelFormYSubmit) cansubmit = false; //cant submit unless labels, profit, and text filled
    document.getElementById('profit-button').disabled = !cansubmit;
    cansubmit = true;

    if (check_labelx == "") cansubmit = false;
    document.getElementById('labelx-button').disabled = !cansubmit;
    cansubmit = true;
    
    if (check_labely == "") cansubmit = false;
    document.getElementById('labely-button').disabled = !cansubmit;
}

// removes old axis labels and creates new ones
var labelx, labely;
var labelx_jsxgraph, labely_jsxgraph; //jsxgraph elements of both axis labels
submitLabelFormX = () => { //set x-label
    labelx = document.getElementById('Label-x').value
    
    board.removeObject([labelx_jsxgraph]);
    labelx_jsxgraph = board.create('text',[250,-30,labelx], {anchorX:"middle", anchorY:"middle", fixed:true, display:"internal", fontSize:16});
    labelFormXSubmit = true;
    calcPoints();
    checkForm();
}
submitLabelFormY = () => { //set y-label
    labely = document.getElementById('Label-y').value
    
    board.removeObject([labely_jsxgraph]);
    labely_jsxgraph = board.create('text',[-35,250,labely], {anchorX:"middle", anchorY:"middle", fixed:true, display:"internal", rotate:90, fontSize:16});
    labelFormYSubmit = true;
    calcPoints();
    checkForm();
}

// (profit) sets global variables for profits
var p1, p2;
submitProfitForm = () => { //equation is profit = ax + by
    p1 = Number(document.getElementById('P1').value); //a
    p2 = Number(document.getElementById('P2').value); //b
    profitFormSubmit = true;
    calcPoints();
    checkForm();
}

//PLAYGROUND - flips problem from min to max / max to min
var findGreater = false;
flipProblem = () => {
    const problemType = document.getElementById('problemType').innerHTML;
    if (problemType == "Maximize") {
        document.getElementById('problemType').innerHTML = "Minimize";
        document.getElementById('operator1').innerHTML = "&#x2265;";
        document.getElementById('operator2').innerHTML = "&#x2265;";
        findGreater = true;
    } else {
        document.getElementById('problemType').innerHTML = "Maximize";
        document.getElementById('operator1').innerHTML = "&#x2264;";
        document.getElementById('operator2').innerHTML = "&#x2264;";
        findGreater = false;
    }
    submitFormulaForm1();
    submitFormulaForm2(); 
}

// (constraint) jsxgraph code for creating lines and inequalities
var n1, n2, n3, m1, m2, m3;
var algeq1, algeq2;
submitFormulaForm1 = () => { //equation is ax + by = c
    n1 = Number(document.getElementById('N1').value); //a
    n2 = Number(document.getElementById('N2').value); //b
    n3 = Number(document.getElementById('N3').value); //c
    algeq1 = n1 + "*x+" + n2 + "*y" + "-" + n3;
    calcPoints();

    board.removeObject([l1, ineq1]);
    l1 = board.create('line', [n3*-1, n1, n2], {fixed:true});
    ineq1 = board.create('inequality', [l1], {fillcolor: 'green', inverse: findGreater});
}
submitFormulaForm2 = () => { //equation is ax + by = c
    m1 = Number(document.getElementById('M1').value); //a
    m2 = Number(document.getElementById('M2').value); //b
    m3 = Number(document.getElementById('M3').value); //c
    algeq2 = m1 + "*x+" + m2 + "*y" + "-" + m3;
    calcPoints();

    board.removeObject([l2, ineq2]);
    l2 = board.create('line', [m3*-1, m1, m2], {fixed:true});
    ineq2 = board.create('inequality', [l2], {fillcolor: 'green', inverse: findGreater});
}

//finds greater/less of two values based on bool
boolLessGreater = (x, y) => {
    if (findGreater) {
        if (x<y) { return y }
        else { return x }
    } else {
        if (x<y) { return x }
        else { return y }
    }
}

//calc points of system and axis intersection
var sysSol = "no solution", 
    xAxisSol = Number.NaN, 
    yAxisSol = Number.NaN;
calcPoints = () => {
    if (algeq1 != null && algeq2 != null) {
        var tempformula1sol, tempformula2sol;
        //systems of equations solution
        //sysSol is a multidimesion array (ex. [[x, 2], [y, 3]])
        try { 
            sysSol = nerdamer.solveEquations([algeq1, algeq2]);
            if (Number(sysSol[0][1]) < 0 || Number(sysSol[1][1]) < 0) sysSol = "no solution"; //set no solution if intersection not in first quadrant
        } 
        catch(err) {sysSol = "no solution"}
        
        //y-axis solution (0, tempformulasol)
        try {tempformula1sol = n3/n2;}
        catch {tempformula1sol = 99999} //if line is vertical, set to high number so it isn't used
        try {tempformula2sol = m3/m2;}
        catch {tempformula2sol = 99999} //if line is vertical, set to high number so it isn't used
        //figure out which is closer/farther to origin (based on minimized/maximized) and set value
        yAxisSol = boolLessGreater(tempformula1sol, tempformula2sol).toFixed(2);

        //x-axis solution (tempformulasol, 0)
        try {tempformula1sol = n3/n1;}
        catch {tempformula1sol = 99999} //if line is horizontal, set to high number so it isn't used
        try {tempformula2sol = m3/m1;}
        catch {tempformula2sol = 99999} //if line is horizontal, set to high number so it isn't used
        //figure out which is closer/farther to origin (based on minimized/maximized) and set value
        xAxisSol = boolLessGreater(tempformula1sol, tempformula2sol).toFixed(2);

        const solutions = [
        [Number(sysSol[0][1]).toFixed(2), Number(sysSol[1][1]).toFixed(2)], 
        [xAxisSol, 0], 
        [0, yAxisSol]
        ]
        plotPoints(solutions);
        revealSolutions(solutions);
    }
}

//plot points
plotPoints = (solutions) => {
    board.removeObject([pSys, pX, pY]);
    pSys = board.create('point', solutions[0]); //solution a
    pX = board.create('point', solutions[1]); //solution b
    pY = board.create('point', solutions[2]); //solution c
}

//reveal solutions
revealSolutions = (solutions) => {
    var textSolutions = [], //array with full solution strings
        profits = []; //array with profits
    //calcs profit and creates text that will be displayed
    for (key in solutions){
        if (!isNaN(solutions[key][0]) && !isNaN(solutions[key][1])) {
            const profit = (solutions[key][0]*p1 + solutions[key][1]*p2).toFixed(2);
            
            profits.push(Number(profit));
            const text = "$" + profit + " | " + solutions[key][0] + " " + labelx + " and " + solutions[key][1] + " " + labely + "<br>";
            textSolutions.push(text);
        }
    }
    
    var allSolutionElement = document.getElementById('all-solutions');
    allSolutionElement.innerHTML = textSolutions.join("");
}

var l1, ineq1; //jsxgraph elements of line and inequality of formula 1
var l2, ineq2; //jsxgraph elements of line and iequality of formula 2
var pSys, pX, pY; //jsxgraph elements of all 3 corner points of the region

//ONLOAD CODE - sets label/profit values and shows popup on load
window.onload = () => {
    board = JXG.JSXGraph.initBoard('board', {
        boundingbox: [-50, 500, 500, -50], 
        axis:true, 
        showNavigation:false, 
        showCopyright:false
    });
    if (window.location.pathname == "/practice/land-allocation" || window.location.pathname== "/practice/feed-mix") {
        labelx = document.getElementById('Label-x').value
        labelx_jsxgraph = board.create('text',[250,-30,labelx], {anchorX:"middle", anchorY:"middle", fixed:true, display:"internal", fontSize:16});
        labelFormXSubmit = true;
        labely = document.getElementById('Label-y').value
        labely_jsxgraph = board.create('text',[-35,250,labely], {anchorX:"middle", anchorY:"middle", fixed:true, display:"internal", rotate:90, fontSize:16});
        labelFormYSubmit = true;
        p1 = Number(document.getElementById('P1').value);
        p2 = Number(document.getElementById('P2').value);
        profitFormSubmit = true;
        
        if (window.location.pathname == "/practice/feed-mix"){ //set to minimize problem for feed mix
            findGreater = true;
        }

        //show popup
        const popup = new bootstrap.Modal(document.getElementById('info-problem'));
        popup.show();
    }
    checkForm(); //loads values for intro-4
}


//INTRO - updates slider values
var cows = 25;
var hogs = 25;
updateSlider = () => {
    cows = document.getElementById('cowSlid').value;
    hogs = document.getElementById('hogSlid').value;
    const man_hours = Number(3*hogs + 12*cows);
    const bushels_of_feed = Number(15*hogs + 45*cows);

    document.getElementById('rangeValue1').innerHTML = cows;
    document.getElementById('rangeValue2').innerHTML = hogs;
    document.getElementById('man-hours').innerHTML = man_hours;
    document.getElementById('bushels-of-feed').innerHTML = bushels_of_feed;

    document.getElementById('sumbit-sliders').disabled = false;
    document.getElementById('man-hours').style.color = 'black';
    document.getElementById('bushels-of-feed').style.color = 'black';
    if (man_hours > 600){
        document.getElementById('sumbit-sliders').disabled = true;
        document.getElementById('man-hours').style.color = 'red';
    }
    if (bushels_of_feed > 2700){
        document.getElementById('sumbit-sliders').disabled = true;
        document.getElementById('bushels-of-feed').style.color = 'red';
    }
}

//INTRO - submit slider guess
submitSlider = () => {
    const text = "Your guess of <b>" + cows + " cows</b> and <b>" + hogs + 
                 " hogs</b> would result in a profit of <b>$" + (79*cows + 25*hogs) +
                 "</b>. Let's see if that's the optimal amount!"; 
    document.getElementById('sliderSubmit').innerHTML = text;
    const popup = new bootstrap.Modal(document.getElementById('win-problem')); //win popup
    popup.show();
}

//PROBLEMS - check solution form
checkForm2 = () => {
    var cansubmit = true;
    const check_s1 = document.getElementById('S1').value,
          check_s2 = document.getElementById('S2').value;
    if (check_s1 == "" || check_s2 == "") cansubmit = false;
    document.getElementById('solution-button').disabled = !cansubmit;
}

//PROBLEMS - check if profit form is correct
submitSolutionForm = () => {
    const s1 = Number(document.getElementById('S1').value),
          s2 = Number(document.getElementById('S2').value);
    if (window.location.pathname == "/practice/land-allocation") { //land-allocation solution
        if (s1 == 252 && s2 == 98) {
            const popup = new bootstrap.Modal(document.getElementById('win-problem')); //win popup
            popup.show();
        }
    } else { //feed-mix solution
        if (s1 == 38 && s2 == 65) {
            const popup = new bootstrap.Modal(document.getElementById('win-problem')); //win popup
            popup.show();
        }
    }
}