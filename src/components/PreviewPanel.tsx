import React, { ChangeEvent } from "react";

type Props = {
  parsedHTML: string;
  isProcessing: boolean;
  isHeavyChecked: boolean;
  onCheckHeavy: (checked: boolean) => void;
};

const PreviewPanel = ({
  parsedHTML,
  isProcessing,
  isHeavyChecked,
  onCheckHeavy,
}: Props) => {
  return (
    <div className="w-full h-full border border-gray-400 rounded-lg p-3 flex flex-col gap-2 relative">
      <div className="w-full px-4 pb-2 border-b border-gray-400 flex justify-between items-center">
        <h4 className="text-lg text-gray-100 font-light uppercase">Preview</h4>
        <label>
          <input
            type="checkbox"
            name=""
            id=""
            className="mr-2"
            checked={isHeavyChecked}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onCheckHeavy(e.target.checked)
            }
          />
          Simulate Heavy Processing
        </label>
      </div>
      <div
        className="flex-1 p-2 overflow-auto prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{
          __html:
            parsedHTML ||
            '<p class="text-gray-400">Preview will appear here</p>',
        }}
      />

      {isProcessing && (
        <div className="absolute top-1/2 left-1/2 -translate-1/2 px-8 py-4 bg-zinc-300 text-zinc-900 font-mono text-lg z-30">
          Parsing...
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
