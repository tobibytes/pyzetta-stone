# pyzetta-stone

A "Rosetta Stone" for Python: paste Python code, pick a target language (Rust, C++, Go, Kotlin, Dart, Zig), get the translated source back.

The backend uses [`py2many`](https://github.com/adsharma/py2many) under the hood; the frontend is a Monaco editor with language switching.

```
React + Monaco  ──POST /translate──▶  FastAPI
                                        │
                                        ├─ write request body to test.py
                                        ├─ run py2many on it
                                        └─ read test.<ext> back
                                        │
   ◀───── translated source ────────────┘
```

## API

`POST /translate`

```json
{ "code": "def main():\n    return 'hi'", "language": "rust" }
```

Returns the translated source as a string. Supported languages:

| Language | Extension |
| --- | --- |
| Rust    | `.rs`  |
| C++     | `.cpp` |
| Go      | `.go`  |
| Kotlin  | `.kt`  |
| Dart    | `.dart`|
| Zig     | `.zig` |

## Run it

### Backend (FastAPI, port 8000)

```sh
cd backend
uv sync           # or: pip install -r requirements (see pyproject.toml)
uv run uvicorn main:app --reload
```

### Frontend (Vite + React + Monaco, port 5173)

```sh
cd pysetta-stone
npm install
npm run dev
```

Open http://localhost:5173.

## Stack

**Backend** — Python · FastAPI · `pydantic` · `py2many` · `dotenv`

**Frontend** — React 19 · TypeScript · Vite · `@monaco-editor/react`
