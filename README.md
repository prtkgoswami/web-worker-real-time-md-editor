# 📝 Real-Time Markdown Editor with Web Workers

A high-performance markdown editor built with **React**, **Next.js 14 App Router**, and **Web Workers** to keep markdown parsing off the main thread. Featuring live preview, request cancellation, and optional simulated heavy load.

---

## 🚀 Features

✔ Real-time Markdown editing  
✔ Parsing handled inside a Web Worker (non-blocking UI)  
✔ Debounced parsing to optimize rapid typing  
✔ Request cancellation for outdated worker jobs  
✔ Ability to simulate slow parsing (debug heavy load behavior)  
✔ Fully typed Worker messaging system with TypeScript  
✔ Component-based clean architecture

---

## 🧠 Why Web Workers?

Markdown parsing can be CPU-heavy. Running it directly in the UI thread can lead to:

- Input lag
- Frozen UI during large document edits
- Poor user experience and performance degradation

Using a Worker ensures parsing executes in parallel, keeping the UI silky smooth.

---

## 🛠️ How It Works

### Request Lifecycle

1️⃣ User types in the editor  
2️⃣ Input triggers a **debounced parse request**  
3️⃣ Request sent to worker using `WorkerManager.sendMessage()`  
4️⃣ Worker parses markdown → posts back HTML  
5️⃣ UI updates only if response matches the latest request ID  
6️⃣ Older responses are safely ignored

---

## 🧪 Simulated Heavy Load

Toggle a checkbox in the UI → Sends `delayMs: 2000` in the payload → Worker artificially delays parsing using `setTimeout()` to simulate CPU work.

Useful for:

- Debugging cancellation
- Stress-testing UI responsiveness
- Demonstrating properly managed async worker requests

---

## ▶️ Running Locally

```bash
npm install
npm run dev
```

Open:
```
http://localhost:3000
```

---

## 👨‍💻 Tech Stack

| Tech            | Purpose                            |
| --------------- | ---------------------------------- |
| React / Next.js | App UI & structure                 |
| Web Workers     | Parallel markdown parsing          |
| TypeScript      | Strong typing for worker messaging |
| Marked.js       | Markdown → HTML parsing            |
| TailwindCSS     | UI styling                         |
