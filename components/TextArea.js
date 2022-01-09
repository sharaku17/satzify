import React from "react";

const TextArea = ({
  setInputValue,
  setCharCount,
  inputValue,
  handleChange,
  width,
  noBorder,
}) => {
  return (
    <div
      class={`paraphraser-input relative ${
        noBorder ? "" : "border-r border-gray-200"
      } ${width} h-full`}
    >
      <button
        title="Clear Input"
        data-tooltip="Clear all Input"
        data-tooltip-target="tooltip-default"
        class="text-red-300 absolute right-1 bottom-1 hover:text-red-500 cursor-pointer"
        onClick={() => {
          setInputValue("");
          setCharCount(0);
        }}
      >
        <svg
          class="w-8 h-8 mx-2 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <textarea
        value={inputValue}
        onChange={handleChange}
        maxLength="250"
        class="resize-none text-body  outline-none focus-none p-6  h-full w-full"
        name="paraphraseInput"
        id="paraphraseInput"
      ></textarea>
    </div>
  );
};

export default TextArea;
