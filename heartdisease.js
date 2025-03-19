let model;

// Load the model
async function loadModel() {
    model = await tf.loadLayersModel('./model8/model.json');
    console.log("Model loaded!");
}

// Function to make a prediction
async function predictHeartDisease(inputData) {
    if (!model) {
        console.log("Model not loaded yet!");
        return;
    }

    // Ensure the input has exactly 13 features
    if (inputData.length !== 13) {
        console.log("Input data should have exactly 13 features!");
        return;
    }

    // Ensure the input is a 2D tensor with shape [1, 13] (1 sample with 13 features)
    const inputTensor = tf.tensor2d([inputData]);

    // Log model input shape for debugging
    console.log("Model input shape:", model.inputs);

    // Make a prediction
    try {
        const prediction = model.predict(inputTensor);

        // Get the output prediction data
        const output = await prediction.data();
        console.log("Prediction:", output);

        // Display result in HTML
        document.getElementById("result").innerText =
            output[0] > 0.5 ? "Heart Disease Detected" : "No Heart Disease Detected";

        // Show the result container
        document.getElementById("results-container").style.display = "block";
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

    // Collect input data (13 features)
    let inputData = [
        parseInt(document.getElementById("age").value),  // Example: Age
        parseInt(document.getElementById("sex").value),  // Example: Sex
        parseInt(document.getElementById("cp").value),   // Example: Chest Pain Type
        parseInt(document.getElementById("trestbps").value),  // Example: Resting Blood Pressure
        parseInt(document.getElementById("chol").value),  // Example: Serum Cholesterol
        parseInt(document.getElementById("fbs").value),  // Example: Fasting Blood Sugar
        parseInt(document.getElementById("restecg").value),  // Example: Resting Electrocardiographic Results
        parseInt(document.getElementById("thalach").value),  // Example: Maximum Heart Rate Achieved
        parseInt(document.getElementById("exang").value),  // Example: Exercise Induced Angina
        parseFloat(document.getElementById("oldpeak").value),  // Example: ST Depression Induced by Exercise Relative to Rest
        parseInt(document.getElementById("slope").value),  // Example: Slope of Peak Exercise ST Segment
        parseInt(document.getElementById("ca").value),  // Example: Number of Major Vessels Colored by Fluoroscopy
        parseInt(document.getElementById("thal").value)  // Example: Thalassemia
    ];

    console.log("Input Data:", inputData);  // Verify the input data
    predictHeartDisease(inputData);
}

// Call this function to load the model when the page is loaded
window.onload = () => {
    loadModel();
};

