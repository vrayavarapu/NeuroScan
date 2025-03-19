let model; // Global model variable

// Load the model
async function loadModel() {
    try {
        console.log("Loading model...");
        model = await tf.loadLayersModel('model8/model.json', {strict: false});
        
        console.log("Model loaded successfully!");

        // Periodically check if the model is built
        const checkModelInterval = setInterval(() => {
            if (model.built) {
                clearInterval(checkModelInterval);  // Stop checking once it's built
                console.log("Model Summary:");
                model.summary();  // Display model summary
                console.log("Model Input Shape:", model.inputs);
                console.log("Model Input Shape Detailed:", model.inputs[0]?.shape);
                console.log("Model Layers:", model.layers);
            } else {
                console.log("Model is still being built.");
            }
        }, 1000); // Check every second

    } catch (error) {
        console.error("Error loading model:", error);
    }
}

// Function to validate input data
function validateInputs() {
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
        parseInt(document.getElementById("thal").value)
    ];

    // Check if any field is invalid
    for (let i = 0; i < inputData.length; i++) {
        if (isNaN(inputData[i]) || inputData[i] === null || inputData[i] === "") {
            console.error(`Invalid input at index ${i}`);
            return false;
        }
    }

    return inputData;
}

// Function to make a prediction
async function predictHeartDisease(inputData) {
    if (!model) {
        console.log("Model not loaded yet!");
        return;
    }

    if (inputData.length !== 13) {
        console.log("Input data should have exactly 13 features!");
        return;
    }

    // Ensure input is a 2D tensor
    const inputTensor = tf.tensor2d([inputData]);
    console.log("Model input shape:", model.inputs);

    try {
        const prediction = model.predict(inputTensor);
        const output = await prediction.data();
        console.log("Prediction Output:", output);

        // Display result (ensure that it's updated correctly)
        const resultText = output[0] > 0.5 ? "Chance of Heart Disease: " + (output[0]*100).toFixed(2)+"%": "Chance of No Heart Disease: " + ((1-output[0])*100).toFixed(2)+"%";
        document.getElementById("result").innerText = resultText;

        // Show result container
        document.getElementById("results-container").style.display = "block";

        // Log for debugging
        console.log("Result Text Set To:", resultText);
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

    const inputData = validateInputs();
    if (!inputData) {
        console.log("Invalid input data.");
        return;
    }

    console.log("Input Data:", inputData);  // Verify the input data
    predictHeartDisease(inputData);
}

// Function to reset the form and results
function resetForm() {
    // Reset form fields and hide results container
    document.getElementById("results-container").style.display = "none";
}

// Load model on page load
window.onload = () => {
    loadModel();

    // Add event listener to the analyze button
    document.getElementById("scanButton").addEventListener("click", () => {
        resetForm();  // Reset before making a new prediction
        makePrediction();  // Make the prediction
    });
};
