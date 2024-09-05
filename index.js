const workerUrl = 'https://cloud-native-spring-expert-worker.shant.workers.dev/'

document.addEventListener('submit', (e) => {
  e.preventDefault()
  progressConversation()
})

const conversationHistory = []

async function progressConversation() {
  const userInput = document.getElementById('user-input')
  const personalAssistantConversation = document.getElementById('expert-conversation-container')
  const question = userInput.value
  userInput.value = ''

  // Add human message
  const newHumanSpeechBubble = document.createElement('div')
  newHumanSpeechBubble.classList.add('speech', 'speech-human')
  personalAssistantConversation.appendChild(newHumanSpeechBubble)
  newHumanSpeechBubble.textContent = question
  personalAssistantConversation.scrollTop = personalAssistantConversation.scrollHeight

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question: question, conversationHistory: conversationHistory })
  }
  let answer = ''
  try {
    const response = await fetch(workerUrl, options)
    
    answer = await response.json()
    if (!response.ok) {
      throw new Error(answer.error)
    }
  } catch(error) {
    answer = error
  }
  // Add to memory
  conversationHistory.push(question)
  conversationHistory.push(answer)

  // Add AI message
  const newAiSpeechBubble = document.createElement('div')
  newAiSpeechBubble.classList.add('speech', 'speech-ai')
  personalAssistantConversation.appendChild(newAiSpeechBubble)
  newAiSpeechBubble.textContent = answer
  personalAssistantConversation.scrollTop = personalAssistantConversation.scrollHeight
}