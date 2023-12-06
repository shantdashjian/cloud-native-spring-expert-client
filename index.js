import { ChatOpenAI } from "langchain/chat_models/openai"
import { PromptTemplate } from "langchain/prompts"
import { StringOutputParser } from 'langchain/schema/output_parser'
import { retriever } from "./utils/retreiver"
import { combineDocuments } from "./utils/combineDocuments"

document.addEventListener('submit', (e) => {
  e.preventDefault()
  progressConversation()
})

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY

const llm = new ChatOpenAI({ openAIApiKey })

const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:'

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answerTemplate = `You are a helpful and enthusiastic expert who can answer a given question about Cloud Native Spring based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." Don't try to make up an answer.
context: {context}
question: {question}
answer: 
`

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

const chain = standaloneQuestionPrompt
              .pipe(llm)
              .pipe(new StringOutputParser())
              .pipe(retriever)
              .pipe(answerPrompt)

const response = await chain.invoke({
    question: 'What are the goals of following the cloud native approach to software development?'
})

console.log(response)

async function progressConversation() {
  const userInput = document.getElementById('user-input')
  const personalAssistantConversation = document.getElementById('expert-conversation-container')
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