let model; // Global model variable

// Load the model
async function loadModel() {
    try {
        console.log("Loading model...");
        model = await tf.loadLayersModel('model9/model.json', { strict: false });

        console.log("Model loaded successfully!");
    } catch (error) {
        console.error("Error loading model:", error);
    }
}

// Function to validate and retrieve input data
function getInputData() {
    let inputData = [
        parseFloat(document.getElementById("radius").value) || 0,
        parseFloat(document.getElementById("texture").value) || 0,
        parseFloat(document.getElementById("perimeter").value) || 0,
        parseFloat(document.getElementById("area").value) || 0,
        parseFloat(document.getElementById("smoothness").value) || 0,
        parseFloat(document.getElementById("compactness").value) || 0,
        parseFloat(document.getElementById("symmetry").value) || 0,
        parseFloat(document.getElementById("fractal_dimension").value) || 0,
    ];

    if (inputData.some(value => isNaN(value))) {
        console.error("Invalid input detected!");
        return null;
    }

    return inputData;
}

// Function to make a prediction
async function predictProstateCancer(inputData) {
    if (!model) {
        console.log("Model not loaded yet!");
        return;
    }

    if (!inputData || inputData.length !== 8) {
        console.log("Invalid input data.");
        return;
    }

    // Reset UI before processing
    const resultContainer = document.getElementById("results-container");
    const resultText = document.getElementById("result");
    resultContainer.style.display = "block";
    resultText.innerText = "Processing..."; 

    // Create new tensor input
    const inputTensor = tf.tensor2d([inputData], [1, 8]);

    try {
        // Make prediction
        const prediction = model.predict(inputTensor);
        const output = await prediction.data();

        // Dispose tensors to prevent memory leaks
        inputTensor.dispose();
        prediction.dispose();

        console.log("Prediction Output:", output);

        if (output.length < 1) {
            console.error("Unexpected prediction output:", output);
            return;
        }

        // Calculate probabilities
        const probabilityCancer = output[0];
        const probabilityNoCancer = 1 - probabilityCancer;

        // Format percentages
        const cancerPercentage = (probabilityCancer * 100).toFixed(2);
        const noCancerPercentage = (probabilityNoCancer * 100).toFixed(2);

        // Provide treatment feedback
        let feedback = (cancerPercentage > noCancerPercentage)
            ? 'Recommended Treatment: Risk detected, consult a doctor immediately. Further testing and treatment may be necessary.'
            : 'Recommended Treatment: No significant risk detected. Maintain regular check-ups and a healthy lifestyle.';

        // Update UI with results
        resultText.innerText = `Prostate Cancer: ${cancerPercentage}% | No Prostate Cancer: ${noCancerPercentage}% \n${feedback}`;

    } catch (err) {
        console.error("Error during prediction:", err);
    }
}

// Function to collect input data and make a prediction
function makePrediction() {
    if (!model) {
        console.log("Model is still loading. Please wait.");
        return;
    }

    const inputData = getInputData();
    if (!inputData) return;

    console.log("Input Data:", inputData);

    // Make a prediction
    predictProstateCancer(inputData);
}

// Reset form fields and results
function resetForm() {
    document.getElementById("results-container").style.display = "none";
}

// Load model on page load
window.onload = () => {
    loadModel();

    document.getElementById("scanButton").addEventListener("click", () => {
        resetForm();
        makePrediction();
    });
};
