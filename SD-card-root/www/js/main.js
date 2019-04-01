function loadImgs() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("list").innerHTML = '';

            let imgs = this.responseText.split("\n").reverse().filter(e => e != '');
            imgs.forEach(function (src) {

                if (imgs.indexOf(src) < document.getElementById('num-imgs').value) {
                    let imgTag = document.createElement('img');
                    imgTag.src = 'imgs/' + src;
                    document.getElementById("list").append(imgTag);
                }
            });
        }
    };
    xhttp.open("GET", "/cgi-bin/get_img_list", true);
    xhttp.send();
}

function takePicture() {
    document.getElementById("btn-shutter").disabled = true;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("btn-shutter").innerHTML = 'Taking Picture&hellip;';
            setTimeout(function () {
                document.getElementById("btn-shutter").innerHTML = 'Take a Picture';
                document.getElementById("btn-shutter").disabled = false;
                loadImgs();

            }, 12000);

        }
    };
    setTimeout(function () {
        xhttp.open("GET", "/cgi-bin/shutter-button", true);
        xhttp.send();
    }, document.getElementById('timer-time').value * 1000);


}

function setISO() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText.split(' '));
            let reponse = this.responseText.split(' ');
            console.log(reponse[reponse.length - 1].replace('(', '').replace(')', '').trim());

            document.getElementById('iso_dropdown').value = reponse[reponse.length - 1].replace('(', '').replace(')', '').trim();
        }
    };
    xhttp.open("POST", "/cgi-bin/set_iso", true);
    xhttp.send(document.getElementById("iso_dropdown").value);
}

function setShutterMode() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText.split(' '));
            let reponse = this.responseText.split(' ');
            console.log(reponse[reponse.length - 1].replace('(', '').replace(')', '').trim());

            document.getElementById('shutter-mode').value = reponse[reponse.length - 1].replace('(', '').replace(')', '').trim();
        }
    };
    xhttp.open("POST", "/cgi-bin/set_shutter_mode", true);
    xhttp.send(document.getElementById("shutter-mode").value);
}

function killTimeLapse() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/cgi-bin/kill-30s-timelapse", true);
    xhttp.send();
}

function startTimeLapse() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/cgi-bin/start-30s-timelapse", true);
    xhttp.send();
}

function switchTimeLapse() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText.includes('30s-timelapse')) {
                //timelapse is running so kill it
                killTimeLapse();
                document.getElementById('time-lapse').innerText = 'Start 30s Time-Lapse';
            } else {
                startTimeLapse();
                document.getElementById('time-lapse').innerText = 'End 30s Time-Lapse';
            }
        }
    };
    xhttp.open("POST", "/cgi-bin/check_processes", true);
    xhttp.send();
}

function init() {
    document.getElementById("num-imgs").addEventListener("change", loadImgs);
    loadImgs();
    document.getElementById("iso_dropdown").addEventListener("change", setISO);
    setISO();
    // document.getElementById('shutter-mode').addEventListener('change', setShutterMode)
    // setShutterMode();

    document.getElementById("btn-shutter").addEventListener('click', takePicture);
    document.getElementById("btn-refresh").addEventListener('click', loadImgs);
    
    document.getElementById("time-lapse").addEventListener('click', switchTimeLapse);


}

init();
