// Function to gather all form data
function gatherFormData() {
  const formData = new FormData(document.querySelector('form'));
  let consolidatedData = {};
  for (let [key, value] of formData.entries()) {
      consolidatedData[key] = value;
  }
  return JSON.stringify(consolidatedData, null, 2);
}

// Function to send data to server
async function sendToServer(data) {
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
      return result.response;
  } catch (error) {
      throw error;
  }
}

// Function to display the API response
function displayResponse(response, isUserMessage = false) {
  const conversationHistory = document.getElementById('conversationHistory');
  const messageDiv = document.createElement('div');
  messageDiv.className = isUserMessage ? 'user-message' : 'ai-message';
  messageDiv.textContent = response;
  conversationHistory.appendChild(messageDiv);
  conversationHistory.scrollTop = conversationHistory.scrollHeight;

  const cardElement = document.querySelector('.card.mt-4');
  if (cardElement) {
      cardElement.style.display = 'block';
  }
}

// Function to handle sending follow-up messages
async function sendMessage() {
  const userInput = document.getElementById('userInput');
  const message = userInput.value.trim();
  if (message) {
      displayResponse(message, true);
      userInput.value = '';
      
      const sendButton = document.getElementById('sendButton');
      sendButton.disabled = true;
      sendButton.textContent = 'Sending...';

      try {
          const formData = JSON.stringify({ message: message });
          const apiResponse = await sendToServer(formData);
          displayResponse(apiResponse);
      } catch (error) {
          console.error('Error in server call:', error);
          displayResponse('An error occurred while processing your request.');
      } finally {
          sendButton.disabled = false;
          sendButton.textContent = 'Send';
      }
  }
}

// Function to handle initial form submission
async function handleSubmit(event) {
  event.preventDefault();
  const submitButton = document.getElementById('submitButton');
  submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Thinking...';
  submitButton.disabled = true;

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
  try {
      const apiResponse = await sendToServer(formData);
      displayResponse(apiResponse);
      submitButton.style.display = 'none';
      
      // Show Q&A interface
      const qaInterface = document.querySelector('.card.mt-4');
      if (qaInterface) {
          qaInterface.style.display = 'block';
      }

      // Set up event listener for the send button
      const sendButton = document.getElementById('sendButton');
      if (sendButton) {
          sendButton.addEventListener('click', sendMessage);
      }
  } catch (error) {
      console.error('Error in server call:', error);
      displayResponse('An error occurred while processing your request.');
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
          form.dispatchEvent(new Event('submit'));
      });
  } else {
      console.error('Submit button not found in the document');
  }

  // Set up event listener for the send button (for follow-up questions)
  const sendButton = document.getElementById('sendButton');
  if (sendButton) {
      sendButton.addEventListener('click', sendMessage);
  } else {
      console.error('Send button not found in the document');
  }
});