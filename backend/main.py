from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
language_to_ext = {
    "rust": "rs",
    "cpp": "cpp",
    "go": "go",
    "kotlin": "kt",
    "dart": "dart",
    "zig": "zig"
}
available_languages = {
    "rust": "rust",
    "cpp": "cpp",
    "go": "go",
    "kotlin": "kotlin",
    "dart": "dart",
    "zig": "zig"

}
class TranslateBody(BaseModel):
    code: str
    language: str
    success: Optional[bool] = True
    
app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://localhost:5173"
]
# adding cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/translate")
def translate_code(translate_body: TranslateBody):
    return translate(translate_body)

def translate(body: TranslateBody): # handler for translating code
    code = body.code
    language = body.language
    if language not in available_languages:
        return {"success": False, "message": "Could not find language"}
    create_pyfile_with_text(code)
    command = build_command(available_languages[language]) # get the command to run
    os.system(command) # run the command in the terminal
    res_code = read_file(f"test.{language_to_ext[language]}")
    return TranslateBody(code=res_code, language=language, success=True)
    
def read_file(file_path): # read the contents of a file
    try:
        with open(file_path) as f:
            return f.read()
    except Exception as e:
        print("error reading file: ", e)

def create_pyfile_with_text(code: str): # write the code to a file
    try:
        with open("test.py", "w") as f:
            f.write(code)
    except Exception as e:
        print("error writing to file: ", e)
        
        
def build_command(language: str): # return the command to run
    return f"uv run py2many --{language}=1 test.py"