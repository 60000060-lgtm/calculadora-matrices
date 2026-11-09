function cambiarVentana(idVentana) {
    document.getElementById('ventana-inicio').style.display = 'none';
    document.getElementById('ventana-calculadora').style.display = 'none';
    document.getElementById('ventana-camara').style.display = 'none';
    
    document.getElementById('btn-inicio').classList.remove('active');
    document.getElementById('btn-calculadora').classList.remove('active');
    document.getElementById('btn-camara').classList.remove('active');
    
    if(idVentana === 'inicio') {
        document.getElementById('ventana-inicio').style.display = 'block';
        document.getElementById('btn-inicio').classList.add('active');
    }
    if(idVentana === 'calculadora') {
        document.getElementById('ventana-calculadora').style.display = 'block';
        document.getElementById('btn-calculadora').classList.add('active');
    }
    if(idVentana === 'camara') {
        document.getElementById('ventana-camara').style.display = 'block';
        document.getElementById('btn-camara').classList.add('active');
    }
    apagarCamara();
}

function crearMatrizDinamica() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const container = document.getElementById('matrixContainer');
    container.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.id = 'cell-' + i + '-' + j;
            input.value = 0;
            rowDiv.appendChild(input);
        }
        container.appendChild(rowDiv);
    }
}

function rellenarAleatorio() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            document.getElementById('cell-' + i + '-' + j).value = Math.floor(Math.random() * 11) - 5;
        }
    }
}

let streamCamara = null;
function encenderCamara() {
    const video = document.getElementById('video');
    const captureBtn = document.getElementById('captureBtn');
    document.getElementById('preview').style.display = 'none';
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then(stream => {
            streamCamara = stream;
            video.srcObject = stream;
            video.style.display = 'block';
            captureBtn.style.display = 'block';
        })
        .catch(err => alert("No se pudo acceder a la cámara: " + err));
}

function tomarFoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const preview = document.getElementById('preview');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    preview.src = canvas.toDataURL('image/png');
    preview.style.display = 'block';
    apagarCamara();
}

function apagarCamara() {
    if(streamCamara) {
        streamCamara.getTracks().forEach(track => track.stop());
        streamCamara = null;
    }
    document.getElementById('video').style.display = 'none';
    document.getElementById('captureBtn').style.display = 'none';
}

function previsualizarImagen() {
    const file = document.getElementById('imageInput').files;
    const preview = document.getElementById('preview');
    if (file) {
        apagarCamara();
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}

function ejecutarAnalisisMatematico(origen) {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    let contenedor = origen === 'calculadora' ? document.getElementById('resultadoCalculadora') : document.getElementById('resultadoCamara');
    contenedor.innerHTML = "";

    let A = [];
    for (let i = 0; i < rows; i++) {
        A[i] = [];
        for (let j = 0; j < cols; j++) {
            A[i][j] = parseFloat(document.getElementById('cell-' + i + '-' + j).value) || 0;
        }
    }

    let insignias = [];
    if (rows === cols) {
        if (rows === 1) insignias.push("Matriz Escalar (1x1)");
        else {
            insignias.push("Matriz Cuadrada");
            let esId = true, esNula = true, esSim = true;
            for(let i=0; i<rows; i++) {
                for(let j=0; j<cols; j++) {
                    if(A[i][j] !== 0) esNula = false;
                    if(i === j) { if(A[i][j] !== 1) esId = false; }
                    else { if(A[i][j] !== 0) esId = false; }
                    if(A[i][j] !== A[j][i]) esSim = false;
                }
            }
            if(esNula) insignias.push("Matriz Nula");
            if(esId) insignias.push("Matriz Identidad (I)");
            if(esSim && !esNula) insignias.push("Matriz Simétrica");
        }
    } else {
        insignias.push("Matriz Rectangular");
    }

    let badgesHtml = insignias.map(t => '<span class="type-badge">' + t + '</span>').join('');
    let latexOriginal = generarLatexMatriz(A, rows, cols);

    let AT = [];
    for(let j=0; j<cols; j++) {
        AT[j] = [];
        for(let i=0; i<rows; i++) { AT[j][i] = A[i][j]; }
    }
    let latexTranspuesta = generarLatexMatriz(AT, cols, rows);

    let htmlTraza = "";
    let idTraza = "traza-" + origen;
    if(rows === cols) {
        let suma = 0;
        let elementos = [];
        for(let i=0; i<rows; i++) { suma += A[i][i]; elementos.push(A[i][i]); }
        htmlTraza = '<div class="step-box"><h2>2. Operador Traza Formal: tr(A)</h2><p>Suma formal de componentes de la diagonal principal:</p><div class="math-render" id="' + idTraza + '"></div></div>';
        setTimeout(() => {
            katex.render("\\text{tr}(A) = " + elementos.join(' + ').replace(/\+ -/g, '- ') + " = " + suma, document.getElementById(idTraza));
        }, 50);
    }

    contenedor.innerHTML = '<div class="step-box"><h2>1. Resultados de la Topología Lineal</h2><div style="margin-bottom:15px;">' + badgesHtml + '</div><div class="math-render" id="orig-' + origen + '"></div><p style="margin-top:10px;">Aplicación del operador transpuesto espacial (A^T):</p><div class="math-render" id="trans-' + origen + '"></div></div>' + htmlTraza;

    setTimeout(() => {
        katex.render("A = " + latexOriginal, document.getElementById("orig-" + origen));
        katex.render("A^T = " + latexTranspuesta, document.getElementById("trans-" + origen));
    }, 50);
}

function generarLatexMatriz(matriz, r, c) {
    let latex = "\\begin{pmatrix} ";
    for (let i = 0; i < r; i++) {
        latex += matriz[i].join(" & ");
        if (i < r - 1) latex += " \\\\ ";
    }
    latex += " \\end{pmatrix}";
    return latex;
}

window.onload = function() {
    crearMatrizDinamica();
    setTimeout(() => {
        katex.render("\\text{Orden de una Matriz: } m \\times n \\quad \\text{(Filas } \\times \\text{ Columnas)}", document.getElementById('render-teoria-orden'));
    }, 60);
};
