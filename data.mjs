import { PDFLoader } from "langchain/document_loaders/fs/pdf"

const loader = new PDFLoader("book.pdf", {
  splitPages: true,
})

try {
  const docs = await loader.load()
  console.log(docs)
} catch (err) {
  console.log(err)
}