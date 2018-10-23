
//   M E M O   P I A N O   |   C O N T R O L L E R 
var checkColores      = document.getElementById('checkColores');
var checkTextos       = document.getElementById('checkTextos');
var teclasPiano       = document.getElementsByClassName('note'); // or querySelectorAll
var textoNotasPiano   = document.querySelectorAll('.note .nota');
var botonIniciarJuego = document.getElementById('startGame');
var textNivel         = document.getElementById('txtNivel');
//---------------------
var soundComponent    = document.getElementsByClassName('sound-component');
var acertadosComponent= document.getElementsByClassName('acertados-component');
var fallidosComponent = document.getElementsByClassName('fallidos-component');
var juegosGanadosComp = document.getElementsByClassName('win-game');
var indicadorArrow    = document.getElementsByClassName('arrow-indicator');

//console.log("elemento ",acertadosComponent);

checkColores.addEventListener('change', function(e){
	let valor=this.checked;
	if(valor){
		for(var i = 0; i < teclasPiano.length; i++){
		    teclasPiano[i].classList.add('hide-color');
		}
	}else{
		for(var i = 0; i < teclasPiano.length; i++){
		    teclasPiano[i].classList.remove('hide-color');
		}
	}
});

checkTextos.addEventListener('change', function(e){
	let valor=this.checked;
	if(valor){
		for(var i = 0; i < textoNotasPiano.length; i++){
		    textoNotasPiano[i].classList.add('hide');
		}
	}else{
		for(var i = 0; i < textoNotasPiano.length; i++){
		    textoNotasPiano[i].classList.remove('hide');
		}
	}
});
// TODO: pendiente refactorizar for´s

// TODO: / Refactor

// TODO: Game-logic
// definir todas las teclas:
var teclaDo 	= document.getElementById('do');
var teclaDoSos  = document.getElementById('doSos');
var teclaRe     = document.getElementById('re');
var teclaReSos  = document.getElementById('reSos');
var teclaMi     = document.getElementById('mi');
var teclaFa     = document.getElementById('fa');
var teclaFaSos  = document.getElementById('faSos');
var teclaSol    = document.getElementById('sol');
var teclaSolSos = document.getElementById('solSos');
var teclaLa     = document.getElementById('la');
var teclaLaSos  = document.getElementById('laSos');
var teclaSi     = document.getElementById('si');
// fin teclas define 

// constantes Audios:
const audioDo     = new Audio('audios/do.mp3');
const audioDoSos  = new Audio('audios/do_s.mp3');
const audioRe     = new Audio('audios/re.mp3');
const audioReSos  = new Audio('audios/re_s.mp3');
const audioMi     = new Audio('audios/mi.mp3');
const audioFa     = new Audio('audios/fa.mp3');
const audioFaSos  = new Audio('audios/fa_s.mp3');
const audioSol    = new Audio('audios/sol.mp3');
const audioSolSos = new Audio('audios/sol_s.mp3');
const audioLa     = new Audio('audios/la.mp3');
const audioLaSos  = new Audio('audios/la_s.mp3');
const audioSi     = new Audio('audios/si.mp3');
const gameOver    = new Audio('audios/gameOver.mp3');
const gameWon     = new Audio('audios/gameWon.mp3');
const error       = new Audio('audios/error.mp3');

const sonidosTeclado = [
	audioDo,  audioDoSos,
	audioRe,  audioReSos,
	audioMi,
	audioFa,  audioFaSos,
	audioSol, audioSolSos,
	audioLa,  audioLaSos,
	audioSi,
];

const ULTIMO_NIVEL_PIANO = 12;
let fallidosGlobal       = 0;
let ganadosGlobal        = 0;
let flagInGame           = false;
let flagGameInit         = false;
let nivelPorReferencia   = 0;

// Inicio del juego
botonIniciarJuego.addEventListener('click', function(e){
	e.preventDefault();	
	console.log("inicio"+ txtNivel.value)

	if(!flagInGame){
		if(txtNivel.value === '' || txtNivel.value === undefined || txtNivel.value === 0){
			console.log("set 12 default");
			//juegoMemoPiano.setNivelJuegoMemo(Number(6));
			nivelPorReferencia = 5;
		}else{
			nivelPorReferencia = Number(txtNivel.value);
			if(nivelPorReferencia>0 && nivelPorReferencia<=12){
				//indicadorArrow[0].classList.remove('hide');
				flagGameInit = true;
			}else{
				indicadorArrow[0].classList.remove('hide');
				error.play();
				txtNivel.value = "";
				swal("Nivel incorrecto", "Debes seleccionar un nivel \n entre 1 y 12 como máximo", "error")
				.then(()=>{
					txtNivel.focus();
				});

			}
			//juegoMemoPiano.setNivelJuegoMemo(Number(txtNivel));
		}
		console.log(":::::::::::::::::::: entra normal, antes de ganar")
		// Debbuguear
		//var juegoMemoPiano = new MemoPiano(nivelPorReferencia);
		//window.juegoMemoPiano = juegoMemoPiano;
		if(flagGameInit){
			window.juegoMemoPiano = new MemoPiano(nivelPorReferencia);
		}
		// getNivel:  txtNivel.value
	}else{
		console.log(":::::::::::::::::::: entra despues del primer ganado :) , despues de  ganar 1")
		nivelPorReferencia++;
		window.juegoMemoPiano =  new MemoPiano(nivelPorReferencia);
	}
});

txtNivel.addEventListener('keypress', function(e){
	e = e || window.event;
    var charCode = e.which || e.keyCode;
	console.log("keypress:: "+ this.value+ " e: "+ e + " charcode: " +charCode);

	if(charCode>= 48 && charCode <= 57){
		console.log("solo numeros <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
		indicadorArrow[0].classList.add('hide');		
	}else{
		error.play();
		indicadorArrow[0].classList.remove('hide');
	}
});

class MemoPiano {	

	constructor(setNivel) {
		this.acertados = 0;
		this.fallidos = 0;
		this.juegosGanados = 0;

		this.nivelGlobal = setNivel;
		this.inicializarJuego = this.inicializarJuego.bind(this);
		botonIniciarJuego.classList.add('disabled');
		this.inicializarJuego();
		this.generarSecuenciaNotas(); //  							<===  Genera numeros aleatorios
		setTimeout(this.siguienteNivelMemo, 700);
		//this.siguienteNivelMemo();
	}

	inicializarJuego(){

		this.siguienteNivelMemo = this.siguienteNivelMemo.bind(this);
		this.elegirTeclaColorYSonido = this.elegirTeclaColorYSonido.bind(this);		
		console.log("inicializado el Juego :::: "+ this.nivelGlobal);
		this.nivel = 1; // <-- this.nivel = this.nivelGlobal;
		this.teclasPiano = {
			teclaDo,
			teclaDoSos,
			teclaRe,
			teclaReSos,
			teclaMi,
			teclaFa,
			teclaFaSos,
			teclaSol,
			teclaSolSos,
			teclaLa,
			teclaLaSos,
			teclaSi
		}
	}

	// set Nivel
	setNivelJuegoMemo(nivelEscogido){
		this.nivelGlobal = nivelEscogido;
	}
	getNivelJuegoMemo(){
		return this.nivelGlobal;
	}

	generarSecuenciaNotas(){
		//Generando arrays, fill para inicializar cada valor del array
		this.secuencia = new Array(this.getNivelJuegoMemo()).fill(0).map(n => {
			// redondear hacia abajo => floor
			return Math.floor(Math.random() * 12);
		});
	}

	siguienteNivelMemo(){
		this.subnivelGame = 0;
		this.iluminarSecuenciaTeclas();
		// agregar eventos click a las teclas
		this.agregarEventosClick();
	}

	transformarNumeroAcolorTecla(numero){
		switch(numero){
			case 0:
				return 'teclaDo';
			case 1:
				return 'teclaDoSos';
			case 2:
				return 'teclaRe';
			case 3:
				return 'teclaReSos';
			case 4:
				return 'teclaMi';
			case 5:
				return 'teclaFa';
			case 6:
				return 'teclaFaSos';
			case 7:
				return 'teclaSol';
			case 8:
				return 'teclaSolSos';
			case 9:
				return 'teclaLa';
			case 10:
				return 'teclaLaSos';
			case 11:
				return 'teclaSi';
		}
	}

	transformarColorTeclaAnumero(colorTecla){
		switch(colorTecla){
			case 'teclaDo':
				return 0;
			case 'teclaDoSos':
				return 1;
			case 'teclaRe':
				return 2;
			case 'teclaReSos':
				return 3;
			case 'teclaMi':
				return 4;
			case 'teclaFa':
				return 5;
			case 'teclaFaSos':
				return 6;
			case 'teclaSol':
				return 7;
			case 'teclaSolSos':
				return 8;
			case 'teclaLa':
				return 9;
			case 'teclaLaSos':
				return 10;
			case 'teclaSi':
				return 11;
		}
	}

	transformarColorTeclaAnumeroSonido(colorTecla){
		switch(colorTecla){
			case 'teclaDo':
				return 0;
			case 'teclaDoSos':
				return 1;
			case 'teclaRe':
				return 2;
			case 'teclaReSos':
				return 3;
			case 'teclaMi':
				return 4;
			case 'teclaFa':
				return 5;
			case 'teclaFaSos':
				return 6;
			case 'teclaSol':
				return 7;
			case 'teclaSolSos':
				return 8;
			case 'teclaLa':
				return 9;
			case 'teclaLaSos':
				return 10;
			case 'teclaSi':
				return 11;
		}
	}

	iluminarSecuenciaTeclas(){
		//setTimeout(()=>{console.log("::::::::: ILUMINANDO SECUENCIA :::::::::::::")},1000);
		//this.iluminarTeclaActiva = this.iluminarTeclaActiva.bind(this);
		for (let i = 0; i < this.nivel; i++) {
			let colorTextoTecla = this.transformarNumeroAcolorTecla(this.secuencia[i]);
			let indiceSonidoTecla = this.transformarColorTeclaAnumeroSonido(colorTextoTecla);
			
			setTimeout(() => this.iluminarTeclaActiva(colorTextoTecla, indiceSonidoTecla ), 1000 * i);
			//setTimeout(()=> this.callbackIluminarYapagarTeclasSonidoColor(colorTextoTecla, indiceSonidoTecla, this.iluminarTeclaActiva), 1000 * i);


			//----------------------------------------------------------------------------------------
			// primer color, i = 0, segundo color = 1 ... i = n
			if (i === 0){
				console.log("la primer vez");
				//sonidosTeclado[indiceSonidoTecla].play();
				//await setTimeout(() => this.iluminarTeclaActiva(colorTextoTecla, indiceSonidoTecla, i), 1000 * 1);
			}else{
				//await setTimeout(() => this.iluminarTeclaActiva(colorTextoTecla, indiceSonidoTecla, i), 1000 * i);
			}
		}
	}

	 iluminarTeclaActiva(textColor, indiceSonido){
		//teclaDo.classList.add('light');
		// Reproducir nota
		console.log("tecla: "+ textColor+ " indice: ( debería sonar )"+ indiceSonido);
		//debugger
		//if (iteracion>0){

		this.teclasPiano[textColor].classList.add('light');
		this.mostrarVolumenActivo();
		this.callbackAudios(indiceSonido, this.reproducirAudioTeclado);
		//await sonidosTeclado[indiceSonido].play();
		//}

		console.log(indiceSonido)
		//debugger
		// temporizar iluminado
		 setTimeout(() => this.apagarColorTeclaActiva(textColor, indiceSonido), 350);
		
		 //setTimeout(()=> this.callbackIluminarYapagarTeclasSonidoColor(textColor, indiceSonido,this.apagarColorTeclaActiva), 350);
	}

	apagarColorTeclaActiva(textColor, indiceSonido){
		this.ocultarVolumenActivo();
		this.teclasPiano[textColor].classList.remove('light');
		//await sonidosTeclado[indiceSonido].pause();
		this.callbackAudios(indiceSonido, this.pausarAudioTeclado);
	}


	// Lógica del juego
	elegirTeclaColorYSonido(e){

		console.log(e.target.dataset.tecla);
		const nombreTecla = e.target.dataset.tecla;
		const indiceTecla = this.transformarColorTeclaAnumero(nombreTecla);
		const sonidoTest = this.transformarColorTeclaAnumeroSonido(nombreTecla);		
		this.iluminarTeclaActiva(nombreTecla, sonidoTest, 0);

		// punto de partida
		if(sonidoTest === this.secuencia[this.subnivelGame]){
			console.log("ok, incrementar subnivel");
			this.subnivelGame++;

			if (this.subnivelGame === this.nivel){
				this.nivel++;

				this.eliminarEventosClick();
				if(this.nivel === (this.getNivelJuegoMemo() + 1)){
					//GANO
					this.sumarJuegosGanados();
				}else{
					// Reiniciar secuencia + 1 subNivel de dificultad
					//setTimeout(this.siguienteNivelMemo,1500);
					this.sumarNivelGanado(this.nivel);
				}
			}
		}else{
			console.log("Juego perdido! :(");
			this.sumarJuegoPerdido();
		}
	}


	// EVENTOS:
	agregarEventosClick(){
		this.teclasPiano.teclaDo.addEventListener('click',    this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaDoSos.addEventListener('click', this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaRe.addEventListener('click',    this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaReSos.addEventListener('click', this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaMi.addEventListener('click',    this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaFa.addEventListener('click',    this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaFaSos.addEventListener('click', this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaSol.addEventListener('click',   this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaSolSos.addEventListener('click',this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaLa.addEventListener('click',    this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaLaSos.addEventListener('click', this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaSi.addEventListener('click',    this.elegirTeclaColorYSonido);
	}
	eliminarEventosClick(){
		this.teclasPiano.teclaDo.removeEventListener('click',    this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaDoSos.removeEventListener('click', this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaRe.removeEventListener('click',    this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaReSos.removeEventListener('click', this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaMi.removeEventListener('click',    this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaFa.removeEventListener('click',    this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaFaSos.removeEventListener('click', this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaSol.removeEventListener('click',   this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaSolSos.removeEventListener('click',this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaLa.removeEventListener('click',    this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaLaSos.removeEventListener('click', this.elegirTeclaColorYSonido);
		this.teclasPiano.teclaSi.removeEventListener('click',    this.elegirTeclaColorYSonido);
	}

	callbackAudios( indiceSonido, callback){
		callback(indiceSonido);
	}
	callbackIluminarYapagarTeclasSonidoColor( textoColor, indiceSonido, callback){
		console.log("params callback #2: "+ textoColor+ " , "+ indiceSonido)
		callback(textoColor, indiceSonido);
	}

	reproducirAudioTeclado(indiceSonido){
		console.log("el indice es: "+ indiceSonido)
		//audioDo.play();
		sonidosTeclado[indiceSonido].play();
	}

	pausarAudioTeclado(indiceSonido){
		console.log("el indice es: "+ indiceSonido)
		//audioDo.play();
		sonidosTeclado[indiceSonido].pause();
	}
	mostrarVolumenActivo(){
		soundComponent[0].classList.remove('sound-off-status');
		soundComponent[0].classList.add('sound-on-status');
	}
	ocultarVolumenActivo(){
		soundComponent[0].classList.add('sound-off-status');
		soundComponent[0].classList.remove('sound-on-status');
	}

	sumarNivelGanado(nivel){
		this.acertados++;		
		this.setAcertadosComponent();
		swal('Siguiente nivel', `Muy bien, has pasado de nivel con un acumulado de: ${this.acertados} aciertos, \n Tu siguiente nivel es: ${nivel}`, 'success')		
		.then(()=> setTimeout(this.siguienteNivelMemo, 1500));
	}
	sumarJuegoPerdido(){
		gameOver.play();
		this.fallidos++;
		fallidosGlobal++;
		console.log("cantidad fallidos:"+ fallidosGlobal);
		this.acertados=0;
		this.setFallidosComponent();
		swal('Juego perdido', `Estuvo cerca, has perdido este juego con un total de: ${this.acertados} aciertos :( \n Intenta de nuevo...`, 'error')
		.then(()=> {
			this.eliminarEventosClick();
			this.inicializarJuego();
			botonIniciarJuego.classList.remove('disabled');
			this.setAcertadosComponent();
		}, 1500);
	}
	sumarJuegosGanados(){
		gameWon.play();
		ganadosGlobal++;
		this.nivelGlobal++;
		//this.setFallidosComponent();
		this.setJuegosGanados();
		flagInGame=true;
		swal('¡Has ganado un Juego!', ` con un total de aciertos de: ${this.acertados}\n Intenta de nuevo con un nivel más de dificultad`, 'success')
		.then(()=> {
			this.eliminarEventosClick();
			this.inicializarJuego();
			botonIniciarJuego.classList.remove('disabled');
		}, 1500);
	}

	//---------- Set components ------------
	setAcertadosComponent(){
		acertadosComponent[0].textContent = this.acertados;
	}
	setFallidosComponent(){
		fallidosComponent[0].textContent = fallidosGlobal; //this.fallidos;
	}
	setJuegosGanados(){
		juegosGanadosComp[0].textContent = ganadosGlobal;
	}
	mostrarIndicadorArrow(){
		indicadorArrow[0].classList.remove('hide');
	}
	ocultarIndicadorArrow(){
		indicadorArrow[0].classList.add('hide');
	}
}
// TODO: / Game-logic 

// JQuery Block --------------------------------------------
$(function(){
	$('[data-toggle="tooltip"]').tooltip();
	// avatares actions ::
	$('footer .card-avatares').hover(function() {
		$(this).toggleClass('flipped');
	});
})