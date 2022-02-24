var texto = document.getElementById("ingresarDatos");
var boton = document.getElementById("boton");
var arregloFloat = new Array();
var tabla = document.getElementsByClassName("table")[0];
var renglonCreado = document.getElementsByClassName("renglon");

var NI = 0;
var N = 0;
var I = 0;
var medGeometricaVal = 0;
var medPonderadaVal = "No Hay";
var medianaVal = 0;
var mediaAritmetica = 0;
var modaVal = 0;
var mediaAgrupadosVal=0;
var medianaAgrupadosVal = 0;
var modaAgrupadosVal = 0;
var rango = 0;
var rangoMedio = 0;
var desviacionMediaVal = 0;
var varianzaVal=0;
var desviacionEstandarP = 0;
var desviacionEstandarM = 0;
var coheficienteVariacionVal = 0;
var CAP = 0;
var CAF = 0;
var Q1 = 0 , Q2 = 0, Q3 = 0;
var Q1Val = 0; Q2Val = 0; Q3Val = 0;
var CAB = 0;
var VarianzaAgrupadosVal = 0;
var rangoAgrupadosVal = 0;
var rangoMedioAgrupadosVal = 0;

var ric1 = 0; li1 = 0; ls1 = 0;
var ric2 = 0; li2 = 0; ls2 = 0;
var arregloLimites = [];

var claveValor = [];

var arregloMarcaDeClase = [];
//Poblacional O Muestral 1 = Poblacional
var PoM = 0;

var canvas1 = document.getElementById("histograma").getContext("2d");
var canvas2 = document.getElementById("poligono").getContext("2d");
var canvas3 = document.getElementById("ojiva").getContext("2d");
var canvas4 = document.getElementById("pareto").getContext("2d");

function sumatoria(arreglo){
    var total = 0;
    arreglo.forEach(row => total+= parseFloat(row));
    return total;
}
function F2(x){
    return parseFloat(x.toFixed(2));
}

boton.addEventListener("click", function () {
    //separamos el texto en arreglos (separados por espacios)
    var arregloTexto = texto.value.split(" ");
    for (var i = 0; i < arregloTexto.length; i++){
        //checamos si se pueden combertir en floats, de ser asi se agregan a otro arreglo
        if (!isNaN(parseFloat(arregloTexto[i]).toFixed(2))){
            arregloFloat.push(parseFloat(parseFloat(arregloTexto[i]).toFixed(2)));
        }
    }
    N = arregloFloat.length;
    //Ordena el arreglo de menor a mayor
    arregloFloat.sort((a, b) => a - b );
    
    //Se saca el valor de N.I y se pone solo 2 decimales y se redondea asi arriba
    NI = parseFloat(1 + 3.332 * Math.log10(N)).toFixed(2);
    NI = Math.ceil(NI);
    rango = arregloFloat[N - 1] - arregloFloat[0];
    I = F2(rango/NI);
    
    console.log(I);
    if(document.getElementById("radioPoblacional").checked){
        PoM = 1;
    }
    else{
        PoM = 2;
    }
    crearTabla(NI, I)
    Histograma(NI);
    PoligonoFrecuencias()
    Ojiva(NI)
//    Guardo datos
    mediaAritmetica = parseFloat((sumatoria(arregloFloat)/N).toFixed(2));
    MedGeometrica();
    Moda();
    medianaVal = Mediana();
    MediaAgrupados(NI);
    MedianaAgrupados(NI);
    ModaAgrupados(NI);
    rangoMedio = rango/2 ;
    DesviacionMedia();
    Varianza();
//    desviacionEstandar = F2(Math.pow(Varianza(), 1/2));
    CoheficienteVariacion();
    
    CAP = F2(((mediaAritmetica - medianaVal)*3)/desviacionEstandarM);
    CAF = F2((mediaAritmetica-modaVal)/desviacionEstandarM);
    Courtiles();
    Boswley();
    VarianzaAgrupados(NI)
    RangoAgrupados();
    CourtileAgrupados(NI);

    cajaBigotes();
    cajaBigotesAgru();

    
    document.getElementById("form").style.display = "none";
    document.getElementById("acordionTodo").toggleAttribute("hidden");
    // document.getElementById("graficas").toggleAttribute("hidden");

    if(document.getElementById("switchPonderada").checked){
        document.getElementById("PondManual").removeAttribute("hidden");
        MedPonder();
    }
    else {
        for(i = 0; i<N; i++){
            claveValor.push(0.50);
        }
        CalcularMediaPonderada();
    }

    InsertarDatos();

    document.getElementById("gPareto").addEventListener("click", function(){
        GenerarPareto();
    });

});


function crearTabla(numeroRenglones, suma){
    for(var i = 0; i < numeroRenglones+2; i++){
        var renglon = document.createElement("tr");
        renglon.setAttribute("class", "renglon");
        for (var x = 0; x < 7; x++){
            var recuadro = document.createElement("th");
            recuadro.setAttribute("class", "celda");
            renglon.appendChild(recuadro);
        }
        cuerpoTabla.appendChild(renglon);
    }
    IntConf(numeroRenglones, suma);
    Frecuencia(numeroRenglones);
    FrecuenciaRelativa(numeroRenglones, 1);
    MarcaDeClase(numeroRenglones);
    FrecuenciaAcomulada(numeroRenglones);
    FrecuenciaRelativa(numeroRenglones, 2);
    // tabla.removeAttribute("hidden");
}
function IntConf(numeroRenglones, suma){
    renglonCreado[1].getElementsByClassName("celda")[0].innerText = arregloFloat[0];
    renglonCreado[1].getElementsByClassName("celda")[1].innerText = F2(parseFloat(renglonCreado[1].getElementsByClassName("celda")[0].innerText) + I)
    console.log(parseFloat(arregloFloat[0]) + suma);
    
    //suma los valores al renglon indicado basandose en el superior.
    for (var i = 2; i <= numeroRenglones; i++){
        var sI = parseFloat(renglonCreado[i-1].getElementsByClassName("celda")[0].innerText) + parseFloat(suma) + 0.01;
        renglonCreado[i].getElementsByClassName("celda")[0].innerText = sI.toFixed(2);
        var sD = parseFloat(renglonCreado[i].getElementsByClassName("celda")[0].innerText) + parseFloat(suma);
        renglonCreado[i].getElementsByClassName("celda")[1].innerText = sD.toFixed(2);
    }
    renglonCreado[numeroRenglones+1].getElementsByClassName("celda")[0].innerText = Math.ceil(parseFloat(renglonCreado[numeroRenglones].getElementsByClassName("celda")[0].innerText) + I*4);
    renglonCreado[numeroRenglones+1].getElementsByClassName("celda")[1].innerText = Math.ceil(parseFloat(renglonCreado[numeroRenglones].getElementsByClassName("celda")[0].innerText) + I*4)+I;
     
    if(I+1 >= parseFloat(renglonCreado[1].getElementsByClassName("celda")[0].innerText)){
        renglonCreado[0].getElementsByClassName("celda")[0].innerText = 0;
        renglonCreado[0].getElementsByClassName("celda")[1].innerText = parseFloat(renglonCreado[1].getElementsByClassName("celda")[0].innerText) - 0.01;
    }
    else {
        renglonCreado[0].getElementsByClassName("celda")[0].innerText = 1;
        renglonCreado[0].getElementsByClassName("celda")[1].innerText = I+1;
    }
}
function Frecuencia(numeroRenglones){
    //se va recorriendo cada renglon de la tabla
    for (var i = 1; i<=numeroRenglones; i++){
        var limiteMenor = renglonCreado[i].getElementsByClassName("celda")[0].innerText;
        var limiteMayor = renglonCreado[i].getElementsByClassName("celda")[1].innerText;
        var cuenta = 0;
        //primero se ve recorre el arreglo con los numeros en orden y en cada uno de ellos lo compara con la casilla de los lados, ya sea la mayor o la menor y va agregando una cuenta
        for (var digito = 0; digito < N; digito++){
            if (parseFloat(arregloFloat[digito]) >= parseFloat(limiteMenor) && parseFloat(arregloFloat[digito]) <= parseFloat(limiteMayor)){
                cuenta++;
            }
        }
        renglonCreado[i].getElementsByClassName("celda")[2].innerText = cuenta;
    }
    renglonCreado[0].getElementsByClassName("celda")[2].innerText = 0;
    renglonCreado[numeroRenglones+1].getElementsByClassName("celda")[2].innerText = 0;
}
//Se inserta en "a" el numero 3 para la frecuencia relativa o el 6 para la frecuencia ACOMULADA relativa
function FrecuenciaRelativa(numeroRenglones, a){
    if (a == 1){
        var tomar = 2;
        var insertar = 3;
        var fin = 0
    }
    else {
        var tomar = 5;
        var insertar = 6;  
        var fin = 1;
    }
    for(var i = 1; i<=numeroRenglones; i++){
        //esta variable toma el valor de la celda fr y la divide entre el numero total de datos
        var renglonFrecuenciaRel = parseFloat(renglonCreado[i].getElementsByClassName("celda")[tomar].innerText)/N;
        renglonCreado[i].getElementsByClassName("celda")[insertar].innerText = renglonFrecuenciaRel.toFixed(2);
    }
    renglonCreado[0].getElementsByClassName("celda")[insertar].innerText = 0;
    renglonCreado[numeroRenglones+1].getElementsByClassName("celda")[insertar].innerText = fin;
}
function MarcaDeClase(numeroRenglones){
    for (var i = 0; i<=numeroRenglones+1; i++){
        var primerValor = parseFloat(renglonCreado[i].getElementsByClassName("celda")[0].innerText);
        var segundoValor = parseFloat(renglonCreado[i].getElementsByClassName("celda")[1].innerText);
        renglonCreado[i].getElementsByClassName("celda")[4].innerText = parseFloat((primerValor + segundoValor)/2).toFixed(2);
        if (i > 0 && i<=numeroRenglones){
            var valorMC = renglonCreado[i].getElementsByClassName("celda")[4].innerText;
            arregloMarcaDeClase.push(parseFloat(valorMC));
            }
    }
}
function FrecuenciaAcomulada(numeroRenglones){
        var actual = 0;
    for (var i = 0; i<=numeroRenglones + 1; i++){
        var agregado = parseInt(renglonCreado[i].getElementsByClassName("celda")[2].innerText);
        actual += agregado;
        renglonCreado[i].getElementsByClassName("celda")[5].innerText = actual
    }
}

function Histograma(numeroRenglones){
    var arregloFrecuencia = [];
    var arregloMc = [];
    for (var i = 1; i<=numeroRenglones; i++){
        arregloFrecuencia.push(renglonCreado[i].getElementsByClassName("celda")[2].innerText);
        arregloMc.push(renglonCreado[i].getElementsByClassName("celda")[4].innerText);
    }
    var histograma = new Chart(canvas1,{
        type: "bar",
        data:{
            labels: arregloMc,
            datasets: [{
                label: "Frecuencia",
                data: arregloFrecuencia,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 0, 0)',
                hoverBackgroundColor: 'rgba(255, 255, 255)',
                borderWidth: 1,
                hoverBorderWidth: 2,
            }],
        },
        options: {
            scales: {
                yAxes:[{
                    ticks:{
                        beginAtZero: true,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Frecuencia",
                        fontSize: 14,
                    }
                }],
                xAxes: [{
                    categoryPercentage: 1.0,
                    barPercentage: 1.0,
                    scaleLabel:{
                        display: true,
                        labelString: "Marca de clase",
                        fontSize: 14,
                    }
                }]
            },
            title:{
                display: true,
                text: "Histograma",
            }
        },
        
    });


}
function PoligonoFrecuencias(){
    var arregloFrecuencia= [];
    var arregloMc = []
    for (var i = 1; i<=NI; i++){
        arregloFrecuencia.push(renglonCreado[i].getElementsByClassName("celda")[2].innerText);
        arregloMc.push(renglonCreado[i].getElementsByClassName("celda")[4].innerText);
    }
    var Pol = new Chart(canvas2,{
        type: "bar",
        data:{
            datasets: [{
                label: "Frecuencia",
                data: arregloFrecuencia,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 0, 0)',
                hoverBackgroundColor: 'rgba(255, 255, 255)',
                borderWidth: 1,
                hoverBorderWidth: 2,
                order: 2,
                },
                {
                order: 1,
                label: "Linea",
                data: arregloFrecuencia,
                borderColor: "rgba(213, 54, 57)",
                type: "line",
                pointBackgroundColor: "rgba(0, 0, 0, 0.8)",
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                fill: false,
                }],
            labels: arregloMc,
        },
        options: {
            scales: {
                yAxes:[{
                    ticks:{
                        beginAtZero: true,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Frecuencia",
                        fontSize: 14,
                    }
                }],
                xAxes: [{
                    categoryPercentage: 1.0,
                    barPercentage: 1.0,
                    scaleLabel:{
                        display: true,
                        labelString: "Marca de clase",
                        fontSize: 14,
                    }
                }]
            },
            title:{
                display: true,
                text: "Poligono de frecuencias",
            }
        },
        
    });
}

function Ojiva(numeroRenglones){
    var kha = [];
    for (var i = 1; i <= numeroRenglones; i++){
        var mc =  renglonCreado[i].getElementsByClassName("celda")[4].innerText;
        var fare = renglonCreado[i].getElementsByClassName("celda")[6].innerText;
        kha.push({x: mc, y: fare});
    }
    var ojiva = new Chart(canvas3,{        
    type: 'line',
    data: {
        datasets: [{
            label: 'Frecuencia acomulada relativa',
            data: kha,
            fill: false,
            borderColor: "rgba(213, 54, 57)",
            pointBackgroundColor: "rgba(0, 0, 0, 0.8)",
            pointHoverBorderWidth: 2,
            pointHoverRadius: 6,
            lineTension: 0,
        }],
        labels:[1,2,8],
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: "Marca de clase",
                    fontSize: 14,
                }
            }],
            yAxes : [{
                scaleLabel: {
                    display: true,
                    labelString: "Frecuencia acomulada relativa",
                    fontSize: 14,
                }
            }]
        },
        title :{
            display: true,
            text: "Ojiva"
        }
    }
    });

    console.log(kha);
}
function MedGeometrica(){
    var multiplicacion = 1;
    arregloFloat.forEach(elemento => multiplicacion*= elemento);
    medGeometricaVal = parseFloat((Math.pow(multiplicacion, 1/N)).toFixed(2));
}
function MedPonder(){
    var t = N;
    CrearPonderada();
    function CrearPonderada(){
        for (i = 0; i<N; i++){
            var botones = document.createElement("button");
            var checkbox = document.createElement("input");
            botones.setAttribute("class", "btn btn-outline-success bPonderada");
            botones.setAttribute("no", i);
            botones.innerText = arregloFloat[i];
            
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("class", "chPonderada");
            checkbox.toggleAttribute("hidden");
            checkbox.setAttribute("no", i);
    
            document.getElementById("Ponderada").appendChild(botones);
            document.getElementById("Ponderada").appendChild(checkbox);
    
            document.getElementsByClassName("bPonderada")[i].addEventListener("click", function () {
                if (t>0){
                    if (! document.getElementsByClassName("chPonderada")[parseInt(this.getAttribute("no"))].checked && !this.classList.contains("btn-secondary")) {
                        this.classList.remove("btn-outline-success");
                        this.classList.add("btn-success");
                        document.getElementsByClassName("chPonderada")[parseInt(this.getAttribute("no"))].checked = true;
                    }
                    else {
                        this.classList.remove("btn-success");
                        this.classList.add("btn-outline-success");
                        document.getElementsByClassName("chPonderada")[parseInt(this.getAttribute("no"))].checked = false;
                    }
                }
                else {
                    alert("Nel");
                }
            });
            document.getElementById("BotonDarPond").addEventListener("click", function() {
                var valor = parseFloat(document.getElementById("valorPond").value);
                console.log(valor);
                pond(valor);
            });
            document.getElementById("BotonCalcularPond").addEventListener("click", function(){
                CalcularMediaPonderada();
            });

        }
    } 
    function pond(a){
        for (i = 0; i < N; i++){
            if (document.getElementsByClassName("chPonderada")[i].checked){
                claveValor [parseInt(document.getElementsByClassName("chPonderada")[i].getAttribute("no"))] = a;
                document.getElementsByClassName("bPonderada")[i].classList.remove("btn-success");
                document.getElementsByClassName("bPonderada")[i].classList.add("btn-secondary");
                document.getElementsByClassName("chPonderada")[i].checked = false;
                t--;
                
                }
            }
            if (t <= 0){
                document.getElementById("BotonDarPond").toggleAttribute("disabled");
                document.getElementById("BotonCalcularPond").toggleAttribute("disabled");
        }
    }
}

function CalcularMediaPonderada(){
    var arreglo = [];
    for (i = 0; i < N; i++){
        var multiplicacion = claveValor[i]*arregloFloat[i];
        arreglo.push(F2(multiplicacion));
    }
    medPonderadaVal = F2(sumatoria(arreglo)/sumatoria(claveValor));

    document.getElementById("dMedPonderada").innerText = medPonderadaVal;
}

function Moda(){
    var arreglo = [];
    var arregloCuenta = []
    for (var i = 0; i<N; i++){
        if (arreglo.indexOf(arregloFloat[i]) ==-1){
            arreglo.push(arregloFloat[i]);
        }
    }
    for (var i = 0; i <arreglo.length; i++){
        var cuenta = 0
        for (var x = 0; x<N; x++){
            if (arreglo[i] == arregloFloat[x]){
                cuenta++;
            }   
        }
        arregloCuenta.push(cuenta);
    }
    var lugar = arregloCuenta.indexOf(Math.max.apply(null,arregloCuenta));
//    return arreglo[lugar];
    modaVal = arreglo[lugar];
}
function Mediana(){
    if(N%2 == 0){
        return (arregloFloat[N/2] + arregloFloat[N/2 - 1]) / 2;
    }
    else {
        return arregloFloat[Math.ceil(N/2)-1];
    }
}
function MediaAgrupados(numeroRenglones){
    var arreglo = [];
    for (var i = 1; i <= numeroRenglones; i++ ){
        var xi = parseFloat(renglonCreado[i].getElementsByClassName("celda")[4].innerText);
        var fr = parseFloat(renglonCreado[i].getElementsByClassName("celda")[2].innerText);
        arreglo.push(parseFloat((xi*fr).toFixed(2)));
    }
    mediaAgrupadosVal = parseFloat((sumatoria(arreglo)/N).toFixed(2));
}
function MedianaAgrupados(numeroRenglones){
    var lineaSeleccionada = 0;
    for (var i = 0; i<=numeroRenglones; i++){
       if(medianaVal <= parseFloat(renglonCreado[i].getElementsByClassName("celda")[1].innerText)){
            lineaSeleccionada = i;
            break;
       }
    }
    var li = parseFloat(renglonCreado[lineaSeleccionada].getElementsByClassName("celda")[0].innerText);
    var faant = parseFloat(renglonCreado[lineaSeleccionada-1].getElementsByClassName("celda")[5].innerText);
    var fr = parseFloat(renglonCreado[lineaSeleccionada].getElementsByClassName("celda")[2].innerText);
    
    medianaAgrupadosVal = parseFloat(((((N/2)-faant)/fr)*I + li).toFixed(2));

    renglonCreado[lineaSeleccionada].classList.add("rMed")
}
function ModaAgrupados(numeroRenglones){
    var arreglo = [];
    for (var i = 1; i<=numeroRenglones; i++){
       arreglo.push(parseInt(renglonCreado[i].getElementsByClassName("celda")[2].innerText));
    }
    var lineaSeleccionada = arreglo.indexOf(Math.max.apply(null, arreglo)) + 1;
    var li = parseFloat(renglonCreado[lineaSeleccionada].getElementsByClassName("celda")[0].innerText);
    var d1 = parseInt(renglonCreado[lineaSeleccionada].getElementsByClassName("celda")[2].innerText) - parseInt(renglonCreado[lineaSeleccionada+1].getElementsByClassName("celda")[2].innerText);
    var d2 = parseInt(renglonCreado[lineaSeleccionada].getElementsByClassName("celda")[2].innerText) - parseInt(renglonCreado[lineaSeleccionada-1].getElementsByClassName("celda")[2].innerText);
    
    modaAgrupadosVal = parseFloat((d1/(d1+d2)*I + li).toFixed(2));

    if (renglonCreado[lineaSeleccionada].classList.contains("rMed")) {
        renglonCreado[lineaSeleccionada].classList.remove("rMed");
        renglonCreado[lineaSeleccionada].classList.add("rAmbos");
    }
    else {
        renglonCreado[lineaSeleccionada].classList.add("rModa");
    }
    console.log(lineaSeleccionada);
}
function DesviacionMedia(){
    var arreglo = [];
    for (var i = 0; i < N; i++){
        if (arregloFloat[i]-mediaAritmetica < 0){
            arreglo.push((arregloFloat[i]-mediaAritmetica) * -1);
        }
        else {
            arreglo.push(arregloFloat[i]-mediaAritmetica);
        }
    }
     desviacionMediaVal = parseFloat((sumatoria(arreglo)/N).toFixed(2));
}
function Varianza(){
    var arreglo = [];
    for (var i = 0; i < N; i++){
        arreglo.push(Math.pow(arregloFloat[i] - mediaAritmetica, 2));
    }
    var total = sumatoria(arreglo);
    if (PoM == 1){
        varianzaVal = F2(total/N);
    }
    else {
        varianzaVal = F2(total/(N-1));
    }
    desviacionEstandarP = F2(Math.pow(total/N, 1/2));
    desviacionEstandarM = F2(Math.pow(total/(N-1), 1/2));
}
function CoheficienteVariacion(){
    if (PoM==1){
        var  t = (desviacionEstandarP/mediaAritmetica)*100;   
    }
    else {
        var  t = (desviacionEstandarM/mediaAritmetica)*100;   
    }
    if (t < 0){
        t= t*-1;
    }
    coheficienteVariacionVal = F2(t);
}
function Courtiles(){
    if (N%2 == 0){
        Q1 = (N/4);;
        Q2 = ((2*N)/4);
        Q3 = ((3*N)/4);
    }
    else{
        Q1 = ((N+1)/4);
        Q2 = (((N+1)*2)/4);
        Q3 = (((N+1)*3)/4);   
    }

    Q1Val = arregloFloat[Math.ceil(Q1)-1];
    Q2Val = arregloFloat[Math.ceil(Q2)-1];
    Q3Val = arregloFloat[Math.ceil(Q3)-1];

}
function VarianzaAgrupados(numeroRenglones){
	var arreglo = [];
	for (var i = 1 ; i <= numeroRenglones; i++){
        var mc = parseFloat(renglonCreado[i].getElementsByClassName("celda")[4].innerText);
		var fr = parseInt(renglonCreado[i].getElementsByClassName("celda")[2].innerText);
		arreglo.push(Math.pow(mc-mediaAgrupadosVal,2)*fr);
	}
    var r = sumatoria(arreglo)/(N-1);
    VarianzaAgrupadosVal = F2(r);
}	
function RangoAgrupados(){
    rangoAgrupadosVal = parseFloat(renglonCreado[NI].getElementsByClassName("celda")[1].innerText) -parseFloat(renglonCreado[1].getElementsByClassName("celda")[0].innerText);
    rangoMedioAgrupadosVal = F2(rangoAgrupadosVal/2);
}
function Boswley(){
    a = arregloFloat[Math.ceil(Q1)-1];
    b = arregloFloat[Math.ceil(Q2)-1];
    c = arregloFloat[Math.ceil(Q3)-1];
    CAB = (c + a - (2*b))/(c-a);
}
function CourtileAgrupados(numeroRenglones){
    var valoresQ = [Q1, Q2, Q3];
    var arreglo = [];
    function SelecRenglon(a) {
        for (var i = 1; i <=numeroRenglones; i++){
            if (a <= parseInt(renglonCreado[i].getElementsByClassName("celda")[5].innerText)){
                return i;
                break;
            }
        }
    }
    for (var x = 0; x < 3; x++){
        var renglon = SelecRenglon(valoresQ[x]);
        var li = parseFloat(renglonCreado[renglon].getElementsByClassName("celda")[0].innerText);
        var faant = parseFloat(renglonCreado[renglon-1].getElementsByClassName("celda")[5].innerText);
        var fr = parseFloat(renglonCreado[renglon].getElementsByClassName("celda")[2].innerText);
        var r = (((((N/4)*(x+1))-faant)/fr)*I) + li;
        r = F2(r);
        arreglo.push(r);
    }
    Q1Agrupado = arreglo[0];
    Q2Agrupado = arreglo[1];
    Q3Agrupado = arreglo[2];
}


// function randomValues(count, min, max) {
//     const delta = max - min;
//     return Array.from({length: count}).map(() => Math.random() * delta + min);
//   }

function cajaBigotes(){
// number[{min: 15, q1: 30, median: 40, q3: 55, max: 80}];

    ric1 = F2(Q3Val - Q1Val);
    li1 = F2(Q1Val - (1.50*ric1));
    ls1 = F2(Q3Val + (1.50*ric1));

  var boxplotData = {
    // define label tree
    labels: ['Series'],
    datasets: [{
      label: 'Outros',
      backgroundColor: 'rgba(0, 123, 255, 0.55)',
      borderColor: '#007bff',
      borderWidth: 1,
      outlierColor: '#999999',
      padding: 10,
      itemRadius: 0,
      data: [
        arregloFloat,
      ]
    }]
  };
    var ctx = document.getElementById("caja").getContext("2d");
    window.myBar = new Chart(ctx, {
      type: 'horizontalBoxplot',
      data: boxplotData,
      options: {
        responsive: true,
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Caja Bigotes'
        },
        scales: {
          yAxes: [{
            ticks: {
                // max: 15,
               quantiles: 'hinges',
                
            }
          }]
        }
      }
    });
}

function cajaBigotesAgru(){
    ric2 = F2(Q3Agrupado - Q1Agrupado);
    li2 =  F2(Q1Agrupado - (1.50*ric2));
    ls2 = F2(Q3Agrupado + (1.50*ric2));

    for (x = 1; x < NI; x++) {
        var valorV = parseFloat(renglonCreado[x].getElementsByClassName("celda")[0].innerText);
        arregloLimites.push(valorV);
    }
    valorV = parseFloat(renglonCreado[NI].getElementsByClassName("celda")[1].innerText);
    arregloLimites.push(valorV);

    console.log(arregloLimites);

    var boxplotData2 = {
        // define label tree
        labels: ['Series'],
        datasets: [{
          label: 'Outros',
          backgroundColor: 'rgba(0, 123, 255, 0.55)',
          borderColor: '#007bff',
          borderWidth: 1,
          outlierColor: '#999999',
          padding: 10,
          itemRadius: 3,
          data: [
            arregloLimites
          ]
        }]
      };

        var ctx2 = document.getElementById("CajaAgru").getContext("2d");
        var cajaAgru = new Chart(ctx2, {
          type: 'horizontalBoxplot',
          data: boxplotData2,
          options: {
            responsive: true,
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Caja Bigotes D/Agrupados'
            },
            scales: {
              yAxes: [{
                ticks: {
                    // max: 15,
                   quantiles: 'hinges',
                    
                }
              }]
            }
          }
        });

}


function InsertarDatos(){
    function Insertar(a,b){
        document.getElementById(a).innerText = b;
    }

    Insertar("dMedAritmetica", mediaAritmetica);
    Insertar("dMedGeometrica", medGeometricaVal);
    Insertar("dMedPonderada", medPonderadaVal);
    Insertar("dModa", modaVal);
    Insertar("dMediana", medianaVal);
    if(medianaAgrupadosVal == medianaVal && medianaVal == modaVal){
        Insertar("conclusion1", "Simetrico");
    }
    else if (mediaAritmetica > medianaVal && medianaVal > modaVal){
        Insertar("conclusion1", "Positiva");
    }
    else if(mediaAritmetica < medianaVal && medianaVal < modaVal){
        Insertar("conclusion1", "Negativa");
    }
    else {
        Insertar("conclusion1", "No tiene simetria");

    }

    Insertar("dMedAritmeticaAgru", mediaAgrupadosVal);
    Insertar("dMedianaAgru", medianaAgrupadosVal);
    Insertar("dModaAgru", modaAgrupadosVal);

    Insertar("dRango", rango);
    Insertar("dRangoMedio", rangoMedio);
    Insertar("dDesvMedia", desviacionMediaVal);
    Insertar("dVarianza", varianzaVal);
    if (PoM == 1) {Insertar("dDesviacionEst",desviacionEstandarP);}
    else {Insertar("dDesviacionEst",desviacionEstandarM);}
    Insertar("dCoefVariacion", coheficienteVariacionVal);
    Insertar("dCAP", CAP);
    Insertar("dCOF", CAF);
    Insertar("dCOB", CAB);
    if(CAP == 0){Insertar("c1", "Simetria");}
    else if (CAP > 0){Insertar("c1", "Simetria Positiva"); }
    else {Insertar("c1", "Simetria Negativa");} 
    
    if(CAF == 0){Insertar("c2", "Simetria");}
    else if (CAF > 0){Insertar("c2", "Simetria Positiva"); }
    else {Insertar("c2", "Simetria Negativa");}
    
    if(CAB == 0){Insertar("c3", "Simetria");}
    else if (CAB > 0){Insertar("c3", "Simetria Positiva"); }
    else {Insertar("c3", "Simetria Negativa");}


    Insertar("dRangoAgru", rangoAgrupadosVal);
    Insertar("dRangoMedioAgru", rangoMedioAgrupadosVal);
    Insertar("dVarianzaAgru", VarianzaAgrupadosVal);
    var desv = F2(Math.pow(VarianzaAgrupadosVal, 1/2));
    Insertar("dDesviacionEstAgru", desv);
    
    Insertar("dQ1", Q1);
    Insertar("dQ2", Q2);
    Insertar("dQ3", Q3); 

    Insertar("dQ1Val", Q1Val);
    Insertar("dQ2Val", Q2Val);
    Insertar("dQ3Val", Q3Val);
    
    Insertar("dQ1Agru", Q1Agrupado);
    Insertar("dQ2Agru", Q2Agrupado);
    Insertar("dQ3Agru", Q3Agrupado);
    
    // var Vmin1 = ;
    var Vmax1 = arregloFloat[N-1];

    Insertar("ric1", ric1);
    Insertar("li1", li1);
    Insertar("dVMin1", arregloFloat[0]);
    Insertar("dQ1-2", Q1Val);
    Insertar("dQ2-2", Q2Val);
    Insertar("dQ3-2", Q3Val);
    Insertar("dMax1", Vmax1);
    Insertar("dls1", ls1);

    Insertar("ric2", ric2);
    Insertar("li2", li2);
    Insertar("dVMin2", arregloLimites[0]);
    Insertar("dQ1Agru-2", Q1Agrupado);
    Insertar("dQ2Agru-2", Q2Agrupado);
    Insertar("dQ3Agru-2", Q3Agrupado);
    Insertar("dMax2", arregloLimites[arregloLimites.length-1]);
    Insertar("dLs2", ls2);






}
function GenerarPareto(){
    var abecedario = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var datos = document.getElementById("datosPareto").value.split(" ");
    var arregloBien = [];
    for (var i = 0; i < datos.length; i++){
        if (!isNaN(parseFloat(datos[i]).toFixed(2))){
            arregloBien.push(parseFloat(parseFloat(datos[i]).toFixed(2)));
        }
    }
    for(var i = 0; i < arregloBien.length; i++){
        var renglon = document.createElement("tr");
        renglon.setAttribute("class", "renglonPareto");
        for (var x = 0; x < 4; x++){
            var recuadro = document.createElement("th");
            recuadro.setAttribute("class", "celdaP");
            renglon.appendChild(recuadro);
        }
        document.getElementById("cuerpoTablaPareto").appendChild(renglon);
    }
    console.log(arregloBien);
    arregloBien.sort((a, b) => b - a );
    console.log(arregloBien);

    var renglonPareto = document.getElementsByClassName("renglonPareto");
    var total = sumatoria(arregloBien);
    renglonPareto[0].getElementsByClassName("celdaP")[3].innerText = F2(arregloBien[0]/total);
    for (i = 0; i < arregloBien.length; i++){
        renglonPareto[i].getElementsByClassName("celdaP")[0].innerText = abecedario[i];
        renglonPareto[i].getElementsByClassName("celdaP")[1].innerText = arregloBien[i];
        renglonPareto[i].getElementsByClassName("celdaP")[2].innerText = F2(arregloBien[i]/total);
    }
    for (i = 1; i < arregloBien.length; i++){
        var uno = parseFloat(renglonPareto[i-1].getElementsByClassName("celdaP")[3].innerText);
        var dos = parseFloat(renglonPareto[i].getElementsByClassName("celdaP")[2].innerText);
        renglonPareto[i].getElementsByClassName("celdaP")[3].innerText = F2(uno + dos);
    }
    var codigo = [];
    var frecuencia = [];
    var frrel = [];
    var farel = [];
    for(i=0; i<arregloBien.length; i++){
        codigo.push(renglonPareto[i].getElementsByClassName("celdaP")[0].innerText);
        frecuencia.push(parseFloat(renglonPareto[i].getElementsByClassName("celdaP")[1].innerText));
        frrel.push(parseFloat(renglonPareto[i].getElementsByClassName("celdaP")[2].innerText));
        farel.push(parseFloat(renglonPareto[i].getElementsByClassName("celdaP")[3].innerText));
    }

    if(sumatoria(frrel)>1){
        frrel[0] = F2(frrel[0]-0.01);
        renglonPareto[0].getElementsByClassName("celdaP")[2].innerText = frrel[0];
    }
    else if (sumatoria(frrel)<1){
        frrel[0] = F2(frrel[0]+0.01);
        renglonPareto[0].getElementsByClassName("celdaP")[2].innerText = frrel[0];
    }
    if(sumatoria(farel)>1){
        farel[0] = F2(farel[0]-0.01);
        renglonPareto[0].getElementsByClassName("celdaP")[2].innerText = frrel[0];
    }
    else if(sumatoria(farel)<1){
        farel[0] = F2(farel[0]+0.01);
        renglonPareto[0].getElementsByClassName("celdaP")[2].innerText = frrel[0];
    }
    pareto(codigo, frecuencia, farel);
}

function pareto(a,b,c) {
    


    var vmax = b[0];
    vmax = ((Math.ceil(vmax/100)*100)*2)

    console.log(vmax);
    
    var pareto = new Chart(canvas4, {
        type: 'bar',
        data: {
            labels: a,
            datasets: [{
                label: 'A',
                yAxisID: 'A',
                data: b,
                order: 1,
            }, {
                label: 'B',
                yAxisID: 'B',
                data: c,
                borderColor: "rgba(188, 67, 68)",
                fill: false,
                type: "line",
                order: 2,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    id: 'A',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        max: vmax,
                        length: vmax,
                        // min: 0,
                        min: 0,
                        stepSize: 10,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Frecuencia",
                        fontSize: 14,
                    },
                }, 
                {
                    id: 'B',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        max: 1,
                        min: 0,
                        stepSize: 0.10,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Frecuencia Absoluta Relativa",
                        fontSize: 14,
                    }
                }],
                xAxes:[{
                    scaleLabel: {
                        display: true,
                        labelString: "Codigo",
                        fontSize: 14,
                    },
                    categoryPercentage: 1.0,
                    barPercentage: 1.0,
                }]
            },
            title:{
                display: true,
                text: "Diagrama de pareto",
            }

        }
    });
}
