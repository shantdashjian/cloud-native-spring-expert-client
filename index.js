import { ChatOpenAI } from "langchain/chat_models/openai"
import { PromptTemplate } from "langchain/prompts"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { createClient } from "@supabase/supabase-js"
import { StringOutputParser } from 'langchain/schema/output_parser'

document.addEventListener('submit', (e) => {
  e.preventDefault()
  progressConversation()
})

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY
const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL

const embeddings = new OpenAIEmbeddings({ openAIApiKey })
const client = createClient(supabaseProjectUrl, supabaseApiKey)

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: 'cloud_native_spring_documents',
  queryName: 'match_cloud_native_spring_documents'
})

const retriever = vectorStore.asRetriever()

const llm = new ChatOpenAI({ openAIApiKey })

const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:'

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const chain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser()).pipe(retriever)

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