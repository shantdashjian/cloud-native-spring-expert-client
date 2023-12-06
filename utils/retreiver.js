import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { createClient } from '@supabase/supabase-js'

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY

const embeddings = new OpenAIEmbeddings({ openAIApiKey })
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY
const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const client = createClient(supabaseProjectUrl, supabaseApiKey)

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: 'cloud_native_spring_documents',
  queryName: 'match_cloud_native_spring_documents'
})

const retriever = vectorStore.asRetriever()

export { retriever }