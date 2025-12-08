import React from "react";

type Props = {
    value: string;
    onChange: (text: string) => void;
};

const EditorPanel = ({value, onChange}: Props) => {
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value)
    }

  return (
    <div className="w-full h-full border border-gray-400 rounded-lg p-3 flex flex-col gap-2">
      <div className="w-full px-4 pb-2 border-b border-gray-400">
        <h4 className="text-lg text-gray-100 font-light uppercase">Editor</h4>
      </div>
      <textarea
        className="resize-none w-full flex-1 overflow-auto p-2 focus-within:outline-none font-mono"
        placeholder="Type your Markdown Here..."
        value={value}
        onChange={handleTextChange}
      />
    </div>
  );
};

export default EditorPanel;
