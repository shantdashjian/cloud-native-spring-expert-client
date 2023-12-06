import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

try {
  const loader = new PDFLoader("book.pdf", {
    splitPages: true,
  })
  const docs = await loader.load()
  
  const supabaseApiKey = process.env.SUPABASE_API_KEY
  const supabaseProjectUrl = process.env.SUPABASE_PROJECT_URL
  const openAIApiKey = process.env.OPENAI_API_KEY

  const client = createClient(supabaseProjectUrl, supabaseApiKey)
  await SupabaseVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({ openAIApiKey }),
    {
      client,
      tableName: 'cloud_native_spring_documents',
    }
  )
} catch (err) {
  console.log(err)
}