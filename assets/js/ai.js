// Function to gather all form data
function gatherFormData() {
  console.log('Gathering form data...');
  const formData = new FormData(document.querySelector('form'));
  let consolidatedData = {};
  for (let [key, value] of formData.entries()) {
    consolidatedData[key] = value;
    console.log(`Field: ${key}, Value: ${value}`);
  }
  console.log('Consolidated form data:', consolidatedData);
  return JSON.stringify(consolidatedData, null, 2);
}

// Function to send data to server
async function sendToServer(data) {
  console.log('Sending data to server...');
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data
    });
    console.log('Server response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log('Server response body:', result);
    return result.response;
  } catch (error) {
    console.error('Error in sendToServer:', error);
    throw error; // Rethrow to be caught in handleSubmit
  }
}

// Function to display the API response
function displayResponse(response) {
  console.log('Displaying response:', response);
  const recommendationText = document.getElementById('recommendationText');
  const cardElement = document.querySelector('.card.mt-4');
  
  if (recommendationText && cardElement) {
    console.log('Updating recommendation text...');
    
    // Set the value of the textarea
    recommendationText.value = response;
    
    // Adjust the number of rows
    recommendationText.rows = response.split('\n').length;
    
    // Adjust the height of the textarea
    recommendationText.style.height = 'auto';
    recommendationText.style.height = recommendationText.scrollHeight + 'px';
    
    // Remove the display: none style to show the card
    cardElement.style.display = 'block';
    
  // Make the textarea 100% of the viewport height and ensure it's scrollable if content is very long
  recommendationText.style.overflowY = 'auto';
  recommendationText.style.height = '100vh';
  recommendationText.style.maxHeight = '100vh';
  } else {
    console.error('Recommendation text area or card element not found');
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  console.log('Form submission handled');
  
  // Get the submit button
  const submitButton = document.getElementById('submitButton');
  
  // Show spinner and change button text
  submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Thinking...';
  submitButton.disabled = true;
  
  // Hide all input cards
  const cardsToHide = [
    'privacyCard', 
    'riskToleranceCard', 
    'mortgageInfoCard', 
    'existingFundsCard', 
    'personalInfoCard'
  ];
  cardsToHide.forEach(cardId => {
    const card = document.getElementById(cardId);
    if (card) {
      card.style.display = 'none';
    } else {
      console.log(`${cardId} element not found`);
    }
  });
  
  const formData = gatherFormData();
  console.log('Gathered form data:', formData);
  
  console.log('Sending data to server...');
  try {
    const apiResponse = await sendToServer(formData);
    console.log('Received server response:', apiResponse);
    displayResponse(apiResponse);
    
    // Hide the submit button after response is received
    submitButton.style.display = 'none';
  } catch (error) {
    console.error('Error in server call:', error);
    displayResponse('An error occurred while processing your request.');
    
    // Revert button to original state in case of error
    submitButton.innerHTML = 'Submit';
    submitButton.disabled = false;
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  
  const form = document.querySelector('form');
  const submitButton = document.getElementById('submitButton');
  
  if (form) {
    console.log('Form found, attaching submit event listener');
    form.addEventListener('submit', handleSubmit);
  } else {
    console.error('Form not found in the document');
  }

  if (submitButton) {
    console.log('Submit button found, attaching click event listener');
    submitButton.addEventListener('click', (e) => {
      console.log('Submit button clicked');
      // Trigger form submission
      form.dispatchEvent(new Event('submit'));
    });
  } else {
    console.error('Submit button not found');
  }
});

console.log('Script loaded');