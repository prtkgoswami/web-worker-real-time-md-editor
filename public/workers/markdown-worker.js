// Workers can't use npm imports directly, so we use importScripts
try {
  importScripts("https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js");
} catch (error) {
  console.error("Failed to load marked:", error);
}

console.log("Markdown worker initialized");

self.onmessage = function (event) {
  const { type, id, payload } = event.data;

  console.log("Worker Received:", type, id);

  try {
    if (type === "PARSE_MARKDOWN") {
      const { markdown, delayMs = 0 } = payload;

      // Simulate slow parsing with setTimeout
      setTimeout(() => {
        try {
          const parsedHtml = marked.parse(markdown);
          console.log("Worker Parse Complete:", id);

          self.postMessage({
            id,
            type: "PARSE_COMPLETE",
            result: {
              html: parsedHtml,
            },
          });
        } catch (err) {
          self.postMessage({
            id,
            type: "ERROR",
            result: {
              message: err.message,
            },
          });
        }
      }, delayMs);
    } else {
      throw new Error(`Unknown message type: ${type}`);
    }
  } catch (err) {
    self.postMessage({
      id,
      type: "ERROR",
      result: {
        message: err.message,
      },
    });
  }
};

self.onerror = function (error) {
  console.error("Worker Error", error);
};
