let model; // Global model variable

// Load the model
async function loadModel() {
    try {
        console.log("Loading model...");
        model = await tf.loadLayersModel('model10/model.json', { strict: false });

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
        parseInt(document.getElementById("Gender").value),
        parseInt(document.getElementById("Age").value),
        parseInt(document.getElementById("Schooling").value),
        parseInt(document.getElementById("Breastfeeding").value),
        parseInt(document.getElementById("Varicella").value),
        parseInt(document.getElementById("Initial_Symptom").value),
        parseInt(document.getElementById("Mono_or_Polysymptomatic").value),
        parseInt(document.getElementById("Oligoclonal_Bands").value),
        parseInt(document.getElementById("LLSSEP").value),
        parseInt(document.getElementById("ULSSEP").value),
        parseInt(document.getElementById("VEP").value),
        parseInt(document.getElementById("BAEP").value),
        parseInt(document.getElementById("Periventricular_MRI").value),
        parseInt(document.getElementById("Cortical_MRI").value),
        parseInt(document.getElementById("Infratentorial_MRI").value),
        parseInt(document.getElementById("Spinal_Cord_MRI").value),
        parseInt(document.getElementById("Initial_EDSS").value),
        parseInt(document.getElementById("Final_EDSS").value)
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

    if (inputData.length !== 18) {
        console.log("Input data should have exactly 18 features!");
        return;
    }

    // Ensure input is a 2D tensor and force fresh memory allocation
    const inputTensor = tf.tensor2d([inputData], [1, 18]);

    try {
        const prediction = model.predict(inputTensor);
        const output = await prediction.data();

        // Dispose of tensors to clear memory
        inputTensor.dispose();
        prediction.dispose();

        console.log("Prediction Output:", output);

        // Ensure output is valid
        if (output.length < 1) {
            console.error("Unexpected prediction output:", output);
            return;
        }

        // Calculate probabilities
        const probabilityHeartDisease = output[0];  // Flip it
        const probabilityNoHeartDisease = 1 - output[0];

        // Round to two decimal places
        const heartDiseasePercentage = (probabilityHeartDisease * 100).toFixed(2);
        const noHeartDiseasePercentage = (probabilityNoHeartDisease * 100).toFixed(2);
        let feedbackDisease = 'null';
        if(heartDiseasePercentage>noHeartDiseasePercentage)
            feedbackDisease = 'Recommended Treatment: Risk detected, please see a doctor before making any decisions. A comprehensive treatment plan may include lifestyle changes such as a heart-healthy diet, regular exercise, medications like statins or beta-blockers, and possibly surgical interventions like angioplasty or bypass surgery, depending on severity.';
        else
            feedbackDisease = 'Recommended Treatment: No risk detected, continue maintaining a healthy lifestyle through regular exercise, a balanced diet, and routine check-ups. Continue to prevent future heart disease risk and ensure overall well-being.';
        // Update the results
        const resultContainer = document.getElementById("results-container");
        const resultText = document.getElementById("result");

        resultText.innerText = `Multiple Schlerosis: ${heartDiseasePercentage}% | No Multiple Schlerosis: ${noHeartDiseasePercentage}% `+feedbackDisease;

        // Ensure result container is visible
        resultContainer.style.display = "block";

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

    // Reset results container before making a new prediction
    const resultContainer = document.getElementById("results-container");
    const resultText = document.getElementById("result");
    resultText.innerText = "Processing...";  // Display processing message

    // Call prediction function
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
