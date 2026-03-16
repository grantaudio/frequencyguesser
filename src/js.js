document.addEventListener("DOMContentLoaded", () => {
	let modemode = 0,
		oscillatormode = 0,
		showsettings = false,
		showstatistics = false,
		skippostround = false,
		easymode = false,
		lives = Number.MAX_VALUE,
		roundlimit = Number.MAX_VALUE,
		answer = 0,
		guess = 0,
		delay = true,
		wins = 0,
		loses = 0,
		rounds = 1,
		wrongBucket = new Map(),
		light = true,
		fadetime = 0.02,
		squareratio = 0.0025;
	let gain;
	//variable setup
	let coefficents = [31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000]; //all 31 frequencies
	let gaincoefficents = [0.5, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01, 0.01, 0.01, 0.005, 0.0025, 0.01, 0.05, 0.5];
	document.querySelectorAll(".buttoncontainer").forEach((e, i) => {
		//setting buttons
		Array.from(e.children).forEach((f, j) => {
			f.addEventListener("click", () => {
				switch (i) {
					case 0:
						document.querySelectorAll(".buttoncontainer")[i].children[modemode].classList.remove("green"); //switch around
						modemode = j;
						document.querySelectorAll(".buttoncontainer")[i].children[modemode].classList.add("green");
						break;
					case 1:
						document.querySelectorAll(".buttoncontainer")[i].children[oscillatormode].classList.remove("green");
						oscillatormode = j;
						document.querySelectorAll(".buttoncontainer")[i].children[oscillatormode].classList.add("green");
						break;
					case 2:
						if (j === 0) {
							showsettings = !showsettings; //toggle
							showsettings ? document.querySelectorAll(".buttoncontainer")[i].children[0].classList.add("green") : document.querySelectorAll(".buttoncontainer")[i].children[0].classList.remove("green");
						}
						if (j === 1) {
							showstatistics = !showstatistics;
							showstatistics ? document.querySelectorAll(".buttoncontainer")[i].children[1].classList.add("green") : document.querySelectorAll(".buttoncontainer")[i].children[1].classList.remove("green");
						}
						if (j === 2) {
							easymode = !easymode;
							easymode ? document.querySelectorAll(".buttoncontainer")[i].children[2].classList.add("green") : document.querySelectorAll(".buttoncontainer")[i].children[2].classList.remove("green");
						}
						if (j === 3) {
							skippostround = !skippostround;
							skippostround ? document.querySelectorAll(".buttoncontainer")[i].children[3].classList.add("green") : document.querySelectorAll(".buttoncontainer")[i].children[3].classList.remove("green");
						}
						break;

					default:
						break;
				}
			});
		});
	});
	function restart(index = Math.floor(Math.random() * coefficents.length)) {
		if ([...wrongBucket].length !== 0 && wins / loses <= 0.25) index = [...wrongBucket][Math.floor(Math.random() * [...wrongBucket].length)][0];
		document.getElementById("afterbuttons").style.display = "none";
		guess = -1;
		//restart the game by redoing the audio
		context.close();
		context = new AudioContext();
		let oscillator = context.createOscillator();
		oscillator.type = ["sine", "sawtooth", "square", "triangle"][oscillatormode];
		answer = index;
		oscillator.frequency.value = coefficents[answer];
		gain = context.createGain();
		oscillator.connect(gain);
		gain.gain.value = 0;
		let currentime = context.currentTime;
		gain.gain.setValueAtTime(0, currentime);
		gain.gain.linearRampToValueAtTime(gaincoefficents[answer], fadetime);
		gain.connect(context.destination);
		oscillator.start();
		if (oscillatormode === 0) {
			let oscillator = context.createOscillator();
			oscillator.type = "square";
			oscillator.frequency.value = coefficents[answer];
			gain = context.createGain();
			oscillator.connect(gain);
			gain.gain.value = 0;
			let currentime = context.currentTime;
			gain.gain.setValueAtTime(0, currentime);
			gain.gain.linearRampToValueAtTime(gaincoefficents[answer] * squareratio, fadetime);
			gain.connect(context.destination);
			oscillator.start();
		}
		if (modemode !== 6) {
			for (let i = 0; i < coefficents.length; i++) {
				document.getElementsByClassName("eqlight")[i].classList.add("off");
				document.getElementsByClassName("eqlight")[i].classList.remove("on");
				document.getElementsByClassName("eqlight")[i].classList.remove("correct");
				[...document.querySelectorAll(".slider")][i].value = 0;
			}
		}
	}
	let context; //set audio context
	function fade2(start, end, current, time) {
		//second portion of the fading animation
		document.getElementById("game").style.display = "flex";
		document.getElementById("fader").style.opacity = current;
		if (current <= end) {
			//once animation is finished, run process similar to restart, with some functionalities added
			context = new AudioContext();
			document.getElementById("fader").style.display = "none";
			lives = [1, 3, 5, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE][modemode];
			roundlimit = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, 10, 25, Number.MAX_VALUE][modemode];
			if (easymode) {
				coefficents = [31.25, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
				gaincoefficents = [0.5, 0.3, 0.15, 0.1, 0.1, 0.07, 0.04, 0.01, 0.005, 0.05];
			}
			let oscillator = context.createOscillator();
			oscillator.type = ["sine", "sawtooth", "square", "triangle"][oscillatormode];
			answer = Math.floor(Math.random() * coefficents.length);
			oscillator.frequency.value = coefficents[answer];
			gain = context.createGain();
			oscillator.connect(gain);
			gain.gain.value = 0;
			let currentime = context.currentTime;
			gain.gain.setValueAtTime(0, currentime);
			gain.gain.linearRampToValueAtTime(gaincoefficents[answer], fadetime);
			gain.connect(context.destination);
			if (oscillatormode === 0) {
				let oscillator = context.createOscillator();
				oscillator.type = "square";
				oscillator.frequency.value = coefficents[answer];
				gain = context.createGain();
				oscillator.connect(gain);
				gain.gain.value = 0;
				let currentime = context.currentTime;
				gain.gain.setValueAtTime(0, currentime);
				gain.gain.linearRampToValueAtTime(gaincoefficents[answer] * squareratio, fadetime);
				gain.connect(context.destination);
				oscillator.start();
			}
			oscillator.start();
			for (let i = 0; i < coefficents.length; i++) {
				//fader creation
				let parent = document.createElement("div");
				document.getElementById("eq").appendChild(parent);
				let light = document.createElement("div");
				light.classList.add("eqlight");
				parent.appendChild(light);
				let slider = document.createElement("input");
				slider.classList.add("slider");
				slider.setAttribute("type", "range");
				slider.setAttribute("min", "0");
				slider.setAttribute("max", "1");
				slider.setAttribute("step", "1");
				slider.setAttribute("value", "0");
				parent.appendChild(slider);
				let name = document.createElement("span");
				name.textContent = coefficents[i];
				parent.appendChild(name);
			}
			[...document.querySelectorAll(".slider")].forEach((e, i) => {
				//fader functionality
				e.addEventListener("input", () => {
					if (e.value == 1) {
						guess = i;
						if (modemode == 6) {
							restartdone = false;
							restart(i);
						}
					} else {
						guess = -1;
						if (modemode === 6) context.close();
					}
					for (let j = 0; j < coefficents.length; j++) {
						if (j !== i) {
							document.querySelectorAll("input")[j].value = 0;
						}
					}
				});
			});
			if (modemode <= 2) document.getElementById("gamedisplay").textContent = "Lives: " + lives;
			if (modemode >= 3) document.getElementById("gamedisplay").textContent = "Round: " + rounds;
			document.getElementById("settings").style.opacity = showsettings ? "1" : "0";
			document.getElementById("statisticsdisplay").style.opacity = showstatistics ? "1" : "0";
			document.getElementById("settings").textContent = `Oscillator: ${["Sine", "Sawtooth", "Square", "Triangle"][oscillatormode]}\nMode: ${["1 Life", "3 Lives", "5 Lives", "10 Rounds", "25 Rounds", "Endless", "Explore"][modemode]}\nEasy Mode: ${easymode}\nSkip Post-Round: ${skippostround}`;
			// left + right section setup
			return;
		}
		setTimeout(fade2, 1, start, end, current + (end - start) / time, time);
	}
	function fade1(start, end, current, time) {
		//first part of the fading animation
		document.getElementById("fader").style.opacity = current;
		if (current >= end) {
			document.getElementById("selectmenu").style.display = "none";
			setTimeout(fade2, 1, 1, 0, 1, 150);
			return;
		}
		setTimeout(fade1, 1, start, end, current + (end - start) / time, time);
	}
	function fade3(start, end, current, time) {
		// second part of the ending animation
		document.getElementById("fader").style.opacity = current;
		if (current <= end) {
			//reset all variables and some text
			document.getElementById("fader").style.display = "none";
			document.getElementById("eq").innerHTML = "";
			document.getElementById("selectmenu").style.display = "flex";
			document.getElementById("gamedisplay").innerHTML = "Menu";
			document.getElementById("statisticsdisplay").innerHTML = 'Round #1<span id="fpsdisplay"></span>';
			rounds = 1;
			lives = Number.MAX_VALUE;
			wins = 0;
			loses = 0;
			delay = true;
			roundlimit = Number.MAX_VALUE;
			guess = 0;
			answer = 0;
			context.close();
			return;
		}
		setTimeout(fade3, 1, start, end, current + (end - start) / time, time);
	}
	function fade4(start, end, current, time) {
		//first part of the ending animation
		document.getElementById("fader").style.opacity = current;
		if (current >= end) {
			document.getElementById("game").style.display = "none";
			setTimeout(fade3, 1, 1, 0, 1, 300);
			return;
		}
		setTimeout(fade4, 1, start, end, current + (end - start) / time, time);
	}
	document.getElementById("play").addEventListener("click", () => {
		//play button
		document.getElementById("fader").style.display = "block";
		fade1(0, 1, 0, 150);
	});
	let fps, fps1;
	function tick() {
		//fps tracking for performance issues
		let fps2 = Date.now();
		fps = fps2 - fps1;
		document.getElementById("fpsdisplay").innerHTML = "FPS: " + (1000 / fps).toFixed(4) + " (" + fps + "ms)";
		fps1 = fps2;
		window.requestAnimationFrame(tick);
	}
	fps1 = new Date();
	window.requestAnimationFrame(tick);
	function submit() {
		if (delay && guess !== -1) {
			if (guess === answer) {
				//handle winning and losing
				document.body.classList.add("green2");
				document.getElementById("thingy").textContent = "Correct!";
				document.getElementById("thingy").style.color = "var(--main3)";
				wins++;
				if (wrongBucket.has(answer)) wrongBucket.delete(answer);
				setTimeout(() => {
					document.body.classList.remove("green2");
				}, 2000);
			} else {
				loses++;
				if (!wrongBucket.has(answer)) wrongBucket.set(answer, 1);
				document.body.classList.add("red");
				document.getElementById("thingy").textContent = "Incorrect!";
				document.getElementById("thingy").style.color = "var(--main4)";
				lives--;
				setTimeout(() => {
					document.body.classList.remove("red");
				}, 2000);
			}
			document.getElementById("statisticsdisplay").textContent =
				//statistic display on the left
				`- Last Round Statistics -\n\n Difference: ${(coefficents[answer] - coefficents[guess]).toString()}Hz / ${(answer - guess).toString()} bands away\nGuess: ${coefficents[guess].toString()}\nAnswer: ${coefficents[answer].toString()}\nPassed: ${answer === guess}
				\n\n- This Round Statistics -\n\n Round #${rounds.toFixed(0)}\nWins: ${wins.toFixed(0)}\nLoses: ${loses.toFixed(0)}\nW/L: ${(wins / loses).toFixed(2)}`;
			let fpsd = document.createElement("span");
			fpsd.id = "fpsdisplay";
			document.getElementById("statisticsdisplay").appendChild(fpsd);
			if (!skippostround) {
				context.close();
				document.getElementById("afterbuttons").style.display = "flex";
				document.getElementsByClassName("eqlight")[guess].classList.add("on");
				document.getElementsByClassName("eqlight")[guess].classList.remove("off");
				document.getElementsByClassName("eqlight")[answer].classList.add("correct");
				document.getElementsByClassName("eqlight")[answer].classList.remove("off");
				document.getElementsByClassName("eqlight")[answer].classList.remove("on");
				let replaced = document.getElementById("guessedfreq");
				let e = replaced.cloneNode(true);
				replaced.parentNode.replaceChild(e, replaced);
				document.getElementById("guessedfreq").addEventListener("click", () => {
					context.close();
					context = new AudioContext();
					let oscillator = context.createOscillator();
					oscillator.type = ["sine", "sawtooth", "square", "triangle"][oscillatormode];
					oscillator.frequency.value = coefficents[guess];
					gain = context.createGain();
					oscillator.connect(gain);
					gain.gain.value = 0;
					let currentime = context.currentTime;
					gain.gain.setValueAtTime(0, currentime);
					gain.gain.linearRampToValueAtTime(gaincoefficents[guess], fadetime);
					gain.connect(context.destination);
					oscillator.start();
					if (oscillatormode === 0) {
						let oscillator = context.createOscillator();
						oscillator.type = "square";
						oscillator.frequency.value = coefficents[guess];
						gain = context.createGain();
						oscillator.connect(gain);
						gain.gain.value = 0;
						let currentime = context.currentTime;
						gain.gain.setValueAtTime(0, currentime);
						gain.gain.linearRampToValueAtTime(gaincoefficents[guess] * squareratio, fadetime);
						gain.connect(context.destination);
						oscillator.start();
					}
					document.getElementById("guessedfreq").style.backgroundColor = "var(--main3)";
					document.getElementById("correctfreq").style.backgroundColor = "var(--light2)";
				});
				replaced = document.getElementById("correctfreq");
				e = replaced.cloneNode(true);
				replaced.parentNode.replaceChild(e, replaced);
				document.getElementById("correctfreq").addEventListener("click", () => {
					context.close();
					context = new AudioContext();
					let oscillator = context.createOscillator();
					oscillator.type = ["sine", "sawtooth", "square", "triangle"][oscillatormode];
					oscillator.frequency.value = coefficents[answer];
					gain = context.createGain();
					oscillator.connect(gain);
					gain.gain.value = 0;
					let currentime = context.currentTime;
					gain.gain.setValueAtTime(0, currentime);
					gain.gain.linearRampToValueAtTime(gaincoefficents[answer], fadetime);
					gain.connect(context.destination);
					if (oscillatormode === 0) {
						let oscillator = context.createOscillator();
						oscillator.type = "square";
						oscillator.frequency.value = coefficents[answer];
						gain = context.createGain();
						oscillator.connect(gain);
						gain.gain.value = 0;
						let currentime = context.currentTime;
						gain.gain.setValueAtTime(0, currentime);
						gain.gain.linearRampToValueAtTime(gaincoefficents[answer] * squareratio, fadetime);
						gain.connect(context.destination);
						oscillator.start();
					}
					oscillator.start();
					document.getElementById("guessedfreq").style.backgroundColor = "var(--light2)";
					document.getElementById("correctfreq").style.backgroundColor = "var(--main3)";
				});
				delay = false;
				replaced = document.getElementById("restart");
				e = replaced.cloneNode(true);
				replaced.parentNode.replaceChild(e, replaced);
				document.getElementById("restart").addEventListener("click", () => {
					delay = true;
					document.getElementById("guessedfreq").style.backgroundColor = "var(--light2)";
					document.getElementById("correctfreq").style.backgroundColor = "var(--light2)";
					if (lives <= 0 || rounds > roundlimit) {
						document.getElementById("fader").style.display = "block";
						fade4(0, 1, 0, 300);
						return;
					}
					rounds++;
					if (modemode <= 2) document.getElementById("gamedisplay").innerHTML = "Lives: " + lives;
					if (modemode >= 3) document.getElementById("gamedisplay").innerHTML = "Round: " + rounds;
					restart();
				});
			} else {
				document.getElementById("guessedfreq").style.backgroundColor = "var(--light2)";
				document.getElementById("correctfreq").style.backgroundColor = "var(--light2)";
				if (lives <= 0 || rounds > roundlimit) {
					document.getElementById("fader").style.display = "block";
					fade4(0, 1, 0, 300);
					return;
				}
				rounds++;
				restart();
			}
			delay = false; //delay for submitting again
			setTimeout(() => {
				delay = true;
			}, 2500);
			if (modemode <= 2) document.getElementById("gamedisplay").innerHTML = "Lives: " + lives;
			if (modemode >= 3) document.getElementById("gamedisplay").innerHTML = "Round: " + rounds;
		}
	}
	document.getElementById("submit").addEventListener("click", () => {
		submit();
	});
	document.addEventListener("keydown", (e) => {
		if (e.code === "Enter") submit();
	});
	document.getElementById("theme").addEventListener("click", () => {
		//change theme
		light = !light;
		if (light) {
			document.querySelector(":root").style.setProperty("--light1", "rgb(199, 199, 199)");
			document.querySelector(":root").style.setProperty("--light2", "rgb(223, 223, 223)");
			document.querySelector(":root").style.setProperty("--light3", "rgb(238, 238, 238)");
			document.getElementById("fader").style.backgroundColor = "white";
			document.body.style.color = "black";
			document.querySelectorAll("button").forEach((e) => {
				e.style.color = "black";
			});
		} else {
			//same thing but dark mode
			document.querySelector(":root").style.setProperty("--light1", "rgb(61, 61, 61)");
			document.querySelector(":root").style.setProperty("--light2", "rgb(49, 49, 49)");
			document.querySelector(":root").style.setProperty("--light3", "rgb(26, 26, 26)");
			document.getElementById("fader").style.backgroundColor = "black";
			document.body.style.color = "white";
			document.querySelectorAll("button").forEach((e) => {
				e.style.color = "white";
			});
		}
	});
});
