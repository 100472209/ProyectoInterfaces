let isModelLoaded = false;
let isCameraActive = false;
let video, canvas, ctx, labelContainer, model, webcam, maxPredictions;

async function init() {
    if (!isModelLoaded) {
        await loadModel();
        isModelLoaded = true;
    }

    if (!isCameraActive) {
        await startCamera();
        isCameraActive = true;
    }
}

async function loadModel() {
    const modelURL = "./my-pose-model/model.json";
    const metadataURL = "./my-pose-model/metadata.json";

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

async function loop() {
    // Obtener la pose estimada y la salida de posenet
    const { pose, posenetOutput } = await model.estimatePose(video);

    // Realizar la predicción de la pose
    const prediction = await model.predict(posenetOutput);

    // Actualizar la visualización
    if (pose) {
        // Dibujar los puntos clave y el esqueleto de la pose en el canvas
        const minPartConfidence = 0.5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }

    // Actualizar la precisión en el elemento HTML
    const confidence = prediction[0].probability.toFixed(2);
    document.getElementById("confidence-display").innerText = `Precisión: ${confidence}`;

    // Solicitar la próxima animación de fotograma
    window.requestAnimationFrame(loop);
}


async function startCamera() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    videoBox = document.getElementById("video-box");

    const size = 200;
    const flip = true;

    webcam = new tmPose.Webcam(size, size, flip);
    await webcam.setup();
    await webcam.play();

    console.log("Webcam:", webcam);
    console.log("Webcam srcObject:", webcam.webcam.srcObject);

    video.srcObject = webcam.webcam.srcObject; // Usamos webcam.webcam.srcObject como fuente de datos
    videoBox.style.display = "block"; // Mostrar el contenedor de video
    
    // Esperar hasta que el video haya cargado los datos
    video.addEventListener("loadeddata", () => {
        // Comenzar el bucle de animación
        isCameraActive = true;
        loop(); 
    });
}


function stopCamera() {
    if (webcam) {
        webcam.stop(); // Detener la reproducción de la cámara
        video.srcObject = null; // Limpiar la fuente de datos del video
        videoBox.style.display = "none"; // Ocultar el contenedor de video
        isCameraActive = false; // Actualizar el estado de la cámara
    }
}




async function predict() {
    // Paso 1: Obtener la pose estimada y la salida de posenet
    const { pose, posenetOutput } = await model.estimatePose(video);

    // Paso 2: Realizar la predicción de la pose
    const prediction = await model.predict(posenetOutput);

    // Paso 3: Imprimir resultados de la predicción
    console.log("Prediction:", prediction);

    // Paso 4: Actualizar la visualización
    if (pose) {
        console.log("Pose detected:", pose);

        // Dibujar los puntos clave y el esqueleto de la pose en el canvas
        const minPartConfidence = 0.5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }

    // Paso 5: Actualizar la precisión en el elemento HTML
    document.getElementById("confidence-display").innerText = `Precisión: ${pose.score.toFixed(5)*100}%`;

    // Paso 6: Retornar la precisión de la clasificación (opcional)
    return prediction[0].probability;
}





function drawPose(pose) {
    if (video) {
        ctx.drawImage(video, 0, 0);
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

document.getElementById("start-button").addEventListener("click", init);
document.getElementById("stop-button").addEventListener("click", stopCamera);
