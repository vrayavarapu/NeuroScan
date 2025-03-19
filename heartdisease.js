let model;

// Load the TensorFlow.js model
async function loadModel() {
    model = await tf.loadLayersModel('model8/model.json');
    console.log("Model Loaded Successfully!");
}

// Function to make predictions
async function predictHeartDisease(inputData) {
    if (!model) {
        console.log("Model not loaded yet!");
        return;
    }

    // Convert input array into a Tensor
    const inputTensor = tf.tensor2d([inputData], [1, inputData.length]);

    // Make a prediction
    const prediction = model.predict(inputTensor);
    const output = await prediction.data();

    console.log("Prediction:", output);

    // Display result in HTML
    document.getElementById("result").innerText =
        output[0] > 0.5 ? "Heart Disease Detected" : "No Heart Disease Detected";

    // Show the result container
    document.getElementById("results-container").style.display = "block";
}

// Function to handle user input and trigger prediction
function makePrediction() {
    let inputData = [
        parseInt(document.getElementById("age").value),
        parseInt(document.getElementById("sex").value),
        parseInt(document.getElementById("cp").value),
        parseInt(document.getElementById("trestbps").value),
        parseInt(document.getElementById("chol").value),
        parseInt(document.getElementById("fbs").value),
        parseInt(document.getElementById("restecg").value),
        parseInt(document.getElementById("thalach").value),
        parseInt(document.getElementById("exang").value),
        parseFloat(document.getElementById("oldpeak").value),
        parseInt(document.getElementById("slope").value),
        parseInt(document.getElementById("ca").value),
        parseInt(document.getElementById("thal").value),
    ];

    // Make the prediction
    predictHeartDisease(inputData);
}

// Wait for the model to load
loadModel();

// Attach event listener to the button
document.getElementById("scanButton").addEventListener("click", makePrediction);

document.addEventListener("DOMContentLoaded", () => {
    loadModel();
    document.getElementById("scanButton").addEventListener("click", makePrediction);
});