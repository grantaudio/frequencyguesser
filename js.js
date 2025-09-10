document.addEventListener("DOMContentLoaded", () => {
    let modemode = 0,
        oscillatormode = 0,
        showsettings = false,
        showstatistics = false,
        lives = Number.MAX_VALUE,
        roundlimit = Number.MAX_VALUE,
        answer = 0,
        guess = 0,
        delay = true,
        wins = 0,
        loses = 0,
        rounds = 0,
        light = true;
    //variable setup
    const coefficents = [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000]; //all 31 frequencies
    const gaincoefficents = [0.75, 0.5, 0.5, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01, 0.01, 0.01, 0.005, 0.0025, 0.01, 0.05, 0.5];
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
                        break;

                    default:
                        break;
                }
            });
        });
    });
    function restart(index = Math.floor(Math.random() * 30)) {
        //restart the game by redoing the audio
        context.close();
        context = new AudioContext();
        let oscillator = context.createOscillator();
        oscillator.type = ["sine", "sawtooth", "square", "triangle"][oscillatormode];
        answer = index;
        oscillator.frequency.value = coefficents[answer];
        let gain = context.createGain();
        gain.gain.value = gaincoefficents[answer]; //DO NOT GO OVER 1 DO NOT GO OVER 1 DO NOT GO OVER 1
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
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
            let oscillator = context.createOscillator();
            oscillator.type = ["sine", "sawtooth", "square", "triangle"][oscillatormode];
            answer = Math.floor(Math.random() * 30);
            oscillator.frequency.value = coefficents[answer];
            let gain = context.createGain();
            gain.gain.value = gaincoefficents[answer]
            oscillator.connect(gain);
            gain.connect(context.destination);
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
                name.innerHTML = coefficents[i];
                parent.appendChild(name);
            }
            [...document.querySelectorAll(".slider")].forEach((e, i) => {
                //fader functionality
                e.addEventListener("input", () => {
                    if (e.value == 1) {
                        document.getElementsByClassName("eqlight")[i].classList.add("on");
                        document.getElementsByClassName("eqlight")[i].classList.remove("off");
                        guess = i;
                        if (modemode == 6) {
                            restart(i);
                        }
                    } else {
                        document.getElementsByClassName("eqlight")[i].classList.remove("on");
                        document.getElementsByClassName("eqlight")[i].classList.add("off");
                    }
                    for (let j = 0; j < coefficents.length; j++) {
                        if (j !== i) {
                            document.querySelectorAll("input")[j].value = 0;
                            document.getElementsByClassName("eqlight")[j].classList.remove("on");
                            document.getElementsByClassName("eqlight")[j].classList.add("off");
                        }
                    }
                });
            });
            if (modemode <= 2) document.getElementById("gamedisplay").innerHTML = "Lives: " + lives;
            if (modemode >= 3) document.getElementById("gamedisplay").innerHTML = "Round: " + rounds;
            document.getElementById("settings").style.opacity = showsettings ? "1" : "0";
            document.getElementById("statisticsdisplay").style.opacity = showstatistics ? "1" : "0";
            document.getElementById("settings").innerHTML = "Oscillator: " + ["Sine", "Sawtooth", "Square", "Triangle"][oscillatormode] + "<br>Mode: " + ["1 Life", "3 Lives", "5 Lives", "10 Rounds", "25 Rounds", "Endless", "Explore"][modemode];
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
    document.getElementById("submit").addEventListener("click", () => {
        if (delay) {
            if (guess === answer) {
                //handle winning and losing
                document.body.classList.add("green2");
                wins++;
                setTimeout(() => {
                    document.body.classList.remove("green2");
                }, 3000);
            } else {
                document.body.classList.add("red");
                lives--;
                loses++;
                setTimeout(() => {
                    document.body.classList.remove("red");
                }, 3000);
            }
            rounds++;
            document.getElementById("statisticsdisplay").innerHTML = //statistic display on the left
                "- Last Round Statistics -<br><br> Difference: <br>" +
                (coefficents[answer] - coefficents[guess]).toString() +
                "Hz / " +
                (answer - guess).toString() +
                " bands away" +
                "<br>Guess: <br>" +
                coefficents[guess].toString() +
                "<br>Answer: <br>" +
                coefficents[answer].toString() +
                "<br> Passed: " +
                (answer === guess) +
                "<br><br> - This Round Statistics - <br><br> Round #" +
                rounds.toFixed(0) +
                "<br> Wins: " +
                wins.toFixed(0) +
                "<br> Loses: " +
                loses.toFixed(0) +
                "<br> W/L: " +
                (wins / loses).toFixed(2) +
                '<br><span id="fpsdisplay"></span>';
            if (lives <= 0 || rounds > roundlimit) {
                document.getElementById("fader").style.display = "block";
                fade4(0, 1, 0, 300);
                return;
            }
            restart();
            delay = false; //delay for submitting again
            setTimeout(() => {
                delay = true;
            }, 2500);
            if (modemode <= 2) document.getElementById("gamedisplay").innerHTML = "Lives: " + lives;
            if (modemode >= 3) document.getElementById("gamedisplay").innerHTML = "Round: " + rounds;
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
            if (delay) {
                if (guess === answer) {
                    //handle winning and losing
                    document.body.classList.add("green2");
                    wins++;
                    setTimeout(() => {
                        document.body.classList.remove("green2");
                    }, 2000);
                } else {
                    document.body.classList.add("red");
                    lives--;
                    loses++;
                    setTimeout(() => {
                        document.body.classList.remove("red");
                    }, 2000);
                }
                rounds++;
                document.getElementById("statisticsdisplay").innerHTML = //statistic display on the left
                    "- Last Round Statistics -<br><br> Difference: <br>" +
                    (coefficents[answer] - coefficents[guess]).toString() +
                    "Hz / " +
                    (answer - guess).toString() +
                    " bands away" +
                    "<br>Guess: <br>" +
                    coefficents[guess].toString() +
                    "<br>Answer: <br>" +
                    coefficents[answer].toString() +
                    "<br> Passed: " +
                    (answer === guess) +
                    "<br><br> - This Round Statistics - <br><br> Round #" +
                    rounds.toFixed(0) +
                    "<br> Wins: " +
                    wins.toFixed(0) +
                    "<br> Loses: " +
                    loses.toFixed(0) +
                    "<br> W/L: " +
                    (wins / loses).toFixed(2) +
                    '<br><span id="fpsdisplay"></span>';
                if (lives <= 0 || rounds > roundlimit) {
                    document.getElementById("fader").style.display = "block";
                    fade4(0, 1, 0, 300);
                    return;
                }
                restart();
                delay = false; //delay for submitting again
                setTimeout(() => {
                    delay = true;
                }, 2500);
                if (modemode <= 2) document.getElementById("gamedisplay").innerHTML = "Lives: " + lives;
                if (modemode >= 3) document.getElementById("gamedisplay").innerHTML = "Round: " + rounds;
            }
        }
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
