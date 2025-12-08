"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EditorPanel from "../components/EditorPanel";
import Header from "../components/Header";
import PreviewPanel from "../components/PreviewPanel";
import useWorker from "../hooks/useWorker";
import { debounce } from "../lib/utils";

export default function Home() {
  const [markdown, setMarkdown] = useState(
    "# Hello World\n\nStart typing your **markdown** here..."
  );
  const [parsedHTML, setParsedHTML] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [useSlowWorker, setUseSlowWorker] = useState(false);
  const latestRequestId = useRef<number>(0);

  const { sendMessage, cancelPending } = useWorker(
    "/workers/markdown-worker.js"
  );

  const parseMarkdown = useCallback(
    async (markdownText: string) => {
      cancelPending();

      const requestId = ++latestRequestId.current;

      try {
        setIsProcessing(true);

        const result = await sendMessage<{ html: string }>("PARSE_MARKDOWN", {
          markdown: markdownText,
          delayMs: useSlowWorker ? 2000 : 0,
        });

        if (requestId === latestRequestId.current) {
          console.log(`Setting result from request #${requestId}`);
          setParsedHTML(result.html);
        } else {
          console.log(
            `Discarding old result from request #${requestId} (latest ID: ${latestRequestId.current})`
          );
        }
      } catch (err: unknown) {
        if (!(err as Error).message.includes("Cancelled")) {
          console.error("Parsing error:", err);
          setParsedHTML(
            "<p class='text-red-500'>Error while parsing markdown</p>"
          );
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [sendMessage, cancelPending, useSlowWorker]
  );

  const debouncedParse = useMemo(
    () => debounce(parseMarkdown, 300),
    [parseMarkdown]
  );

  const handleChange = useCallback(
    (markdownText: string) => {
      setMarkdown(markdownText);
      debouncedParse(markdownText);
    },
    [debouncedParse]
  );

  useEffect(() => {
    parseMarkdown(markdown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex flex-col md:flex-row gap-2 grow px-2 pb-4">
        <div className="w-full">
          <EditorPanel value={markdown} onChange={handleChange} />
        </div>
        <div className="w-full">
          <PreviewPanel
            parsedHTML={parsedHTML}
            isProcessing={isProcessing}
            isHeavyChecked={useSlowWorker}
            onCheckHeavy={setUseSlowWorker}
          />
        </div>
      </main>
    </div>
  );
}
