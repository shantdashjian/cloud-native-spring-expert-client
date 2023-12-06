document.addEventListener('submit', (e) => {
  e.preventDefault()
  progressConversation()
})

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY

async function progressConversation() {
  const userInput = document.getElementById('user-input')
  const personalAssistantConversation = document.getElementById('personal-assistant-conversation-container')
  const question = userInput.value
  userInput.value = ''

  // add human message
  const newHumanSpeechBubble = document.createElement('div')
  newHumanSpeechBubble.classList.add('speech', 'speech-human')
  personalAssistantConversation.appendChild(newHumanSpeechBubble)
  newHumanSpeechBubble.textContent = question
  personalAssistantConversation.scrollTop = personalAssistantConversation.scrollHeight

  // add AI message
  const newAiSpeechBubble = document.createElement('div')
  newAiSpeechBubble.classList.add('speech', 'speech-ai')
  personalAssistantConversation.appendChild(newAiSpeechBubble)
  newAiSpeechBubble.textContent = result
  personalAssistantConversation.scrollTop = personalAssistantConversation.scrollHeight
}