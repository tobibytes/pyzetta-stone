import { useRef, useState, useEffect } from 'react'
import './App.css'
import { Editor } from '@monaco-editor/react'
const backend_url = "https://kd35z1pp-8000.usw3.devtunnels.ms"

function App() {
  const [pythonCode, setPythonCode] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [transpiledCode, setTranspiledCode] = useState('')
  const [code, setCode] = useState({
    language: '',
    code: pythonCode
  })
  
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monacoInstance) => {
    editorRef.current = editor;
  }

  const handleEditorChange = (value) => {
    setCode(prevCode => ({ ...prevCode, code: value }))
    // Log the new value directly since state updates are async
    console.log({ ...code, code: value })
  }
  
  const handleTranspile = async () => {
    if (!code.code || !code.language) {
      alert('Please enter Python code and select a target language.')
      return
    }

    try {
      const response = await fetch(`${backend_url}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(code)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setTranspiledCode(data.code)
    } catch (error) {
      console.error('Error during transpilation:', error)
      alert('An error occurred during transpilation. Please try again.')
    }
  }
  // Alternative: Use useEffect to log when code state changes
  useEffect(() => {
    console.log('Code state updated:', code)
  }, [code])

  // Update code.language when selectedLanguage changes
  useEffect(() => {
    setCode(prevCode => ({ ...prevCode, language: selectedLanguage }))
  }, [selectedLanguage])

  return (
    <main>
      <div>
        <h1 className='title'>Pysetta Stone</h1>
        <p className='sub-title'>Turn python to anything</p>
        <select
          className='language-selector'
          onChange={(e) => setSelectedLanguage(e.target.value)}
          value={selectedLanguage}
        >
          <option value="">Select Language</option>
          <option value="cpp">cpp</option>
          <option value="rust">rust</option>
          <option value="kotlin">kotlin</option>
          <option value="dart">dart</option>
          <option value="go">go</option>
        </select>
        <div className='editors-container'>
          <Editor 
            onChange={handleEditorChange} 
            onMount={handleEditorDidMount} 
            className='python-editor' 
            height={"60vh"} 
            width={"40vw"} 
            defaultLanguage='python' 
            defaultValue='# Write your python code here' 
          />
          <Editor 
            readOnly={true} 
            className='output-editor' 
            height={"60vh"} 
            width={"40vw"} 
            language={selectedLanguage} 
            defaultValue='// See the output her' 
            value={transpiledCode}
          />
        </div>
        <button onClick={handleTranspile}>Translate</button>
      </div>
    </main>
  )
}

export default App