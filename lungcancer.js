const URL = "./model2/"; // Base URL for model files
let model, maxPredictions;

// Initialize the Teachable Machine model
async function initModel() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  try {
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log("Model loaded successfully.");
  } catch (error) {
    console.error("Error loading model:", error);
  }
}

// Function to generate treatment recommendations
function generateTreatmentRecommendation(className) {
  switch (className) {
    case "Chance of No Lung Cancer":
      return "No signs of lung cancer detected. Maintain a healthy lifestyle and schedule regular checkups.";
    case "Chance of Lung Cancer":
      return "Recommended Treatment: Consult an oncologist for further tests. Possible treatments include chemotherapy, radiation therapy, surgery, or targeted therapy based on diagnosis.";
    default:
      return "No specific recommendation available. Please consult a medical professional.";
  }
}

// Function to make predictions
async function predictImage() {
  if (!model) {
    console.log("Model is not loaded yet!");
    return;
  }
  
  const img = document.querySelector("#imageDisplay img");
  if (!img || !img.complete || img.naturalWidth === 0) {
    console.log("No image available for scanning.");
    return;
  }

  try {
    const predictions = await model.predict(img);
    let resultText = "";
    let bestPrediction = predictions.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);
    
    predictions.forEach(p => {
      resultText += `${p.className}: ${(p.probability * 100).toFixed(2)}%<br>`;
    });
    
    const treatmentRecommendation = generateTreatmentRecommendation(bestPrediction.className);
    
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.style.display = "block";
    document.getElementById("result").innerHTML = resultText + "<br><strong>Treatment Recommendation:</strong> " + treatmentRecommendation;
  } catch (error) {
    console.error("Prediction error:", error);
  }
}

// Handle image upload
document.getElementById("imageUpload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDisplay = document.getElementById("imageDisplay");
      imageDisplay.innerHTML = `
        <img src="${e.target.result}" style="max-width: 100%; max-height: 100%; display: block; margin: 0 auto;" />
      `;
      document.getElementById("scanButton").style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Scan image when the button is clicked
document.getElementById("scanButton").addEventListener("click", async () => {
    const img = document.querySelector("#imageDisplay img");
    if (!img) {
      alert("Please upload an image before scanning.");
      return;
    }
    
    const scanButton = document.getElementById("scanButton");
    scanButton.disabled = true;
  
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.style.display = "block";
    const resultDiv = document.getElementById("result");
  
    resultDiv.innerHTML = "Analyzing patterns...";
    await new Promise(resolve => setTimeout(resolve, 600));
  
    resultDiv.innerHTML = "Comparing patterns...";
    await new Promise(resolve => setTimeout(resolve, 600));
  
    resultDiv.innerHTML = "Looking at accuracy...";
    await new Promise(resolve => setTimeout(resolve, 800));
  
    await predictImage();
  
    scanButton.disabled = false;
});
  
// Start model initialization
initModel();
