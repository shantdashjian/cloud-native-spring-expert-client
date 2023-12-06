import { ChatOpenAI } from "langchain/chat_models/openai"
import { PromptTemplate } from "langchain/prompts"
import { StringOutputParser } from 'langchain/schema/output_parser'
import { retriever } from "./utils/retreiver"
import { combineDocuments } from "./utils/combineDocuments"
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable"
import formatConversationHistory from "./utils/formatConversationHistory"

document.addEventListener('submit', (e) => {
  e.preventDefault()
  progressConversation()
})

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY

const llm = new ChatOpenAI({ openAIApiKey })

const standaloneQuestionTemplate = `Given a question and the converstaion history, convert the question to a standalone question. You can use the converstaion history as a resource as well. 
question: {question} 
conversation history: {conversation_history}
standalone question: `

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answerTemplate = `You are a friendly and enthusiastic expert who can answer a given question about Cloud Native Spring based on the context provided. Try to find the answer in the context as it is the primary source of knowledge. You could also use the conversation history if you cannot find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." Don't try to make up an answer. Be friendly and make the response conversational and relatively short.
context: {context}
conversation history: {conversation_history}
question: {question}
answer: `

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser())

const retrieverChain = RunnableSequence.from([
  prevResult => prevResult.standalone_question,
  retriever,
  combineDocuments
])

const answerChain = answerPrompt
  .pipe(llm)
  .pipe(new StringOutputParser())

const conversationHistory = []

const chain = RunnableSequence.from([
  {
    standalone_question: standaloneQuestionChain,
    original_input: new RunnablePassthrough()
  },
  {
    context: retrieverChain,
    question: ({ original_input }) => original_input.question,
    conversation_history: ({ original_input }) => original_input.conversation_history
  },
  answerChain
])


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
  const response = await chain.invoke({
    question: question,
    conversation_history: formatConversationHistory(conversationHistory)
  })

  // add to memory
  conversationHistory.push(question)
  conversationHistory.push(response)

  // add AI message
  const newAiSpeechBubble = document.createElement('div')
  newAiSpeechBubble.classList.add('speech', 'speech-ai')
  personalAssistantConversation.appendChild(newAiSpeechBubble)
  newAiSpeechBubble.textContent = response
  personalAssistantConversation.scrollTop = personalAssistantConversation.scrollHeight
}