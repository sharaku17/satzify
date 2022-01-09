import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import { motion, AnimatePresence } from "framer-motion";
import DropdownButton from "./DropdownButton";
import TextArea from "./TextArea";

const ParaphraseSection = () => {
  const [charCount, setCharCount] = useState(0);

  const [outputValueParaphrase, setOutputValueParaphrase] = useState([]);
  const [inputValueParaphrase, setInputValueParaphrase] = useState("");

  const [outputValueCorrect, setOutputValueCorrect] = useState("");
  const [inputValueCorrect, setInputValueCorrect] = useState("");

  const [outputValueShorten, setOutputValueShorten] = useState("");
  const [inputValueShorten, setInputValueShorten] = useState("");

  const [outputValueTranslate, setOutputValueTranslate] = useState("");
  const [inputValueTranslate, setInputValueTranslate] = useState("");

  const [outputValue, setOutputValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [outputHighlightingParaphrase, setOutputHighlightingParaphrase] =
    useState([]);

  const [outputHighlighting, setOutputHighlighting] = useState("");
  const [paraphraseLoading, setParaphraseLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("paraphrase");
  const [translatorInputLanguage, setTranslatorInputLanguage] = useState("");
  const [translatorOutputLanguage, setTranslatorOutputLanguage] = useState("");
  const [clickedCopy, setClickedCopy] = useState(false);
  const PROMPT_MESSAGE = "Copy to clipboard!!!";
  const CLICKED_MESSAGE = "Copied!";

  const tooltipTitle = clickedCopy === true ? CLICKED_MESSAGE : PROMPT_MESSAGE;

  const source_languages = [
    { language: "Auto", lang: "AUTO" },
    { language: "German", lang: "de" },
    { language: "English", lang: "en" },
    { language: "Italian", lang: "it" },
    { language: "French", lang: "fr" },
    { language: "Russian", lang: "ru" },
    { language: "Spanish", lang: "es" },
  ];
  const target_languages = [
    { language: "German", lang: "de" },
    { language: "English", lang: "en" },
    { language: "Italian", lang: "it" },
    { language: "French", lang: "fr" },
    { language: "Russian", lang: "ru" },
    { language: "Spanish", lang: "es" },
  ];

  const translate = require("deepl");
  const Diff = require("diff");

  const API_TOKEN = "YOUR_API_TOKEN";

  const LANGUAGES = [
    { language: "German", lang: "de" },
    { language: "English", lang: "en" },
    { language: "Italian", lang: "it" },
    { language: "French", lang: "fr" },
    { language: "Russian", lang: "ru" },
    { language: "Spanish", lang: "es" },
  ];

  async function query(data) {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/tuner007/pegasus_paraphrase",
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await res.json();
    console.log(result);
    return result[0]["generated_text"];
  }

  async function query_corrector(data) {
    console.log(JSON.stringify(data));
    const res = await fetch(
      "https://api.ai21.com/studio/v1/j1-large/complete",
      {
        body: JSON.stringify(data),
        headers: {
          Authorization: "Bearer YOUR_API_TOKEN",
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
    const result = await res.json();
    console.log(result);
    if (result.completions.length > 1) {
      let res = [];
      result.completions.map((data) => {
        res.push(data.data.text);
      });
      return res;
    }
    return result.completions[0].data.text;
  }

  async function query_translator(data, in_lang, out_lang) {
    // const res = await fetch(
    //   `https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-${in_lang}-${out_lang}`,
    //   {
    //     headers: { Authorization: `Bearer ${API_TOKEN}` },
    //     method: "POST",
    //     body: JSON.stringify(data),
    //   }
    // );
    // if (res.status >= 200 && res.status <= 299) {
    //   const result = await res.json();
    //   return result[0]["translation_text"];
    // } else {
    //   //TODO Throw Error Message that Service unaivalble
    //   return "";
    // }
    if (in_lang === "AUTO") {
      const res = await translate({
        free_api: true,
        text: data,
        target_lang: out_lang.toUpperCase(),
        auth_key: "YOUR_API_TOKEN",
      });

      return res.data.translations[0].text;
    } else {
      const res = await translate({
        free_api: true,
        text: data,
        source_lang: in_lang.toUpperCase(),
        target_lang: out_lang.toUpperCase(),
        auth_key: "YOUR_API_TOKEN",
      });

      return res.data.translations[0].text;
    }

    // .then((result) => {
    //     return result.data.translations[0].text;
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }
  const copyToClipboard = (text) => {
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = text;
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setClickedCopy(true);
  };

  const handleParaphrase = () => {
    setOutputValue("");
    setOutputHighlighting("");

    setClickedCopy(false);

    setParaphraseLoading(true);
    if (selectedTab === "paraphrase") {
      const input_paraphrase =
        "Rewrite the following sentences by keeping their meaning.  \n Original: The fund managers hope to get more return on their investments by borrowing money.\nRewrite: By borrowing money, the fund managers attempt to increase the return on their investments.\n \n Original: I need to finish background research on this company before I can decide.\nRewrite: Before I make a decision, I need to finish my background investigation on this organization.\n\nOriginal:  Can you please send this document? \nRewrite: Please deliver this material to me.\n\nOriginal: Satzify uses powerful language models to understand natural language text and perform different tasks on it, it can paraphrase, correct spelling mistakes, shorten sentences and also translate between different languages.\nRewrite: Satzify understands natural language text and performs various tasks on it, such as paraphrasing, correcting spelling errors, shortening sentences, and translating between languages.\n\nOriginal: A group of animals was walking inside a forest looking for water.\nRewrite: A herd of animals was walking through a forest in search of water.\n\nOriginal: This tool allows to perform different natural languages tasks on text\nRewrite:  This tool performs various natural language tasks on text.\n\nOriginal: this opportunity interests me\nRewrite:  I find this opportunity interesting. \n Original: " +
        inputValue +
        "\n Rewrite: ";
      const data = {
        prompt: input_paraphrase,
        numResults: 3,
        maxTokens: 75,
        stopSequences: [`\n`],
        topP: 1,
        temperature: 0.9,
      };

      query_corrector(data).then((generated_text) => {
        setOutputValueParaphrase(generated_text);
        console.log(outputValueParaphrase);
        setParaphraseLoading(false);
        let outputArray = [];

        generated_text.map((text) => {
          const diff = Diff.diffWords(text, inputValue);
          let output = { text: "", rawText: text, copied: false };
          diff.forEach((part) => {
            // green for additions, red for deletions
            // grey for common parts
            if (part.removed) {
              output.text += ` <span class="text-light_red font-semibold">${part.value}</span> `;
            } else if (!part.added) {
              output.text += `${part.value}`;
            }
          });

          outputArray.push(output);
        });

        setOutputHighlightingParaphrase(outputArray);
      });
    } else if (selectedTab === "translate") {
      const data = inputValue;
      const in_lang = "AUTO";
      const out_lang = "de";

      LANGUAGES.forEach((language) => {
        if (language.language === translatorInputLanguage) {
          in_lang = language.lang;
        }
        if (language.language === translatorOutputLanguage) {
          out_lang = language.lang;
        }
      });

      query_translator(data, in_lang, out_lang).then((generated_text) => {
        setOutputValueTranslate(generated_text);
        setParaphraseLoading(false);
        setOutputHighlighting("");
      });
    } else if (selectedTab === "correct") {
      const input =
        "Correct the spelling mistakes and the grammar of the following sentences \n wrong: weard thing is goin to happen\n correct: a weird thing is going to happen. \n wrong: you go must \n correct: you must go.\n  wrong: they is watching to a match tody \n correct: they are watching a match today.\n wrong: this sentence a grammar mistake contains \n  correct: this sentence contains a grammar mistake.\n wrong:  this sentnce contains a splling misetake \n correct: this sentence contains a spelling mistake.\n wrong: splling mistkes ar hart to coreect \n correct: spelling mistakes are hard  to correct. \n wrong:" +
        inputValue +
        " \n correct:";
      const data = {
        prompt: input,
        numResults: 1,
        maxTokens: 75,
        stopSequences: [`\n`],
        topP: 1,
        temperature: 0.0,
      };

      query_corrector(data).then((generated_text) => {
        setOutputValueCorrect(generated_text);
        setParaphraseLoading(false);
        const diff = Diff.diffWords(generated_text, inputValue);

        let output = "";
        diff.forEach((part) => {
          // green for additions, red for deletions
          // grey for common parts
          if (part.removed) {
            output += `<mark>${part.value}</mark>`;
          } else if (!part.added) {
            output += `${part.value}`;
          }
        });

        setOutputHighlighting(output);
      });
    } else if (selectedTab === "shorten") {
    }
  };

  const handleChange = (event) => {
    const val = event.target.value;
    let len = val.length;
    if (len > 250) {
    } else {
      setCharCount(len);
      setInputValue(val);
    }
  };

  return (
    <div className="">
      <div class="container  pt-32 flex flex-col items-center mx-auto">
        <h1 class="max-w-2xl text-center text-body md:text-6xl  text-3xl font-bold">
          Probiere aus zu was Satz<span class="text-light_red">ify</span> in der
          Lage ist{" "}
        </h1>
        <div class="paraphraser-box md:w-2/3 w-[95%] mt-20  bg-white shadow-lg rounded-2xl  h-[50vh]">
          <div class="paraphraser-tool-box">
            <div class="h-16 mx-4   border-b border-gray-200">
              <nav className=" h-full">
                <ul className="h-full ">
                  <li
                    class={
                      "paraphrase" === selectedTab
                        ? "selected text-light_red md:text-lg text-sm font-semibold transition-all ease-linear "
                        : "text-body  md:text-lg text-md  font-semibold transition-all ease-linear "
                    }
                    onClick={() => {
                      setSelectedTab("paraphrase");
                    }}
                  >
                    {"paraphrase" === selectedTab ? (
                      <motion.div className="underline" layoutId="underline" />
                    ) : null}
                    <svg
                      class=" w-6 h-6 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentcolor"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z" />
                    </svg>
                    Paraphrase
                  </li>
                  <li
                    class={
                      "correct" === selectedTab
                        ? "selected text-light_red md:text-lg text-md  font-semibold transition-all ease-linear"
                        : "text-body md:text-lg text-md  font-semibold transition-all ease-linear"
                    }
                    onClick={() => setSelectedTab("correct")}
                  >
                    {"correct" === selectedTab ? (
                      <motion.div className="underline" layoutId="underline" />
                    ) : null}
                    <svg
                      class="w-6 h-6 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentcolor"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Correct
                  </li>
                  <li
                    class={
                      "shorten" === selectedTab
                        ? "selected text-light_red md:text-lg text-md  font-semibold transition-all ease-linear"
                        : "text-body md:text-lg text-md  font-semibold transition-all ease-linear"
                    }
                    onClick={() => setSelectedTab("shorten")}
                  >
                    {"shorten" === selectedTab ? (
                      <motion.div className="underline" layoutId="underline" />
                    ) : null}
                    <svg
                      class="w-6 h-6 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      enable-background="new 0 0 24 24"
                      viewBox="0 0 24 24"
                      fill="currentcolor"
                    >
                      <g>
                        <rect fill="none" height="24" width="24" x="0" />
                      </g>
                      <g>
                        <g>
                          <g>
                            <path d="M4,9h16v2H4V9z M4,13h10v2H4V13z" />
                          </g>
                        </g>
                      </g>
                    </svg>
                    Shorten
                  </li>
                  <li
                    class={
                      "translate" === selectedTab
                        ? "selected text-light_red md:text-lg text-md  font-semibold transition-all ease-linear"
                        : "text-body md:text-lg text-md  font-semibold transition-all ease-linear"
                    }
                    onClick={() => setSelectedTab("translate")}
                  >
                    {"translate" === selectedTab ? (
                      <motion.div className="underline" layoutId="underline" />
                    ) : null}
                    <svg
                      className="w-6 h-6 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentcolor"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
                    </svg>
                    Translate
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div class="flex flex-col h-2/3">
            <AnimatePresence>
              {selectedTab === "translate" && (
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  class="w-full flex text-body"
                >
                  <div class="flex my-2 w-1/2 justify-end">
                    <DropdownButton
                      placeholder="Auto"
                      setTranslatorInput={setTranslatorInputLanguage}
                      TranslatorInput={translatorInputLanguage}
                      languages={source_languages}
                    ></DropdownButton>
                  </div>
                  <div class="flex my-2 w-1/2 justify-end">
                    <DropdownButton
                      placeholder="German"
                      setTranslatorInput={setTranslatorOutputLanguage}
                      TranslatorInput={translatorOutputLanguage}
                      languages={target_languages}
                    ></DropdownButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div class="flex h-full">
              {selectedTab === "paraphrase" ? (
                <>
                  <TextArea
                    width="w-1/2"
                    setInputValue={setInputValue}
                    setCharCount={setCharCount}
                    inputValue={inputValue}
                    handleChange={handleChange}
                  ></TextArea>
                  <div class="paraphraser-output  border-l border-gray-200 w-1/2 h-full">
                    <div class=" h-full relative">
                      <div
                        class="resize-none text-body  block absolute z-20 overflow-auto font-semibold outline-none  m-0 focus-none  h-full w-full"
                        name="paraphraseInput"
                        id="paraphraseInput"
                      >
                        <ul class=" flex flex-col w-full m-0 p-0">
                          {outputHighlightingParaphrase.map((data, index) => {
                            return (
                              <li
                                key={data.rawText}
                                class=" group flex justify-between items-center border-b hover:bg-gray-200 border-gray-300 w-full m-0 p-6"
                              >
                                <div>
                                  <span class=" text-right text-sm md:text-lg">
                                    {" "}
                                    {parse(data.text)}
                                  </span>
                                </div>
                                <div>
                                  <div
                                    title={tooltipTitle}
                                    data-tooltip="Clear all Input"
                                    data-tooltip-target="tooltip-default"
                                    class=" w-7 h-7 border-none focus-none   text-gray-300 "
                                    onClick={() => {
                                      copyToClipboard(data.rawText);
                                      let copy =
                                        outputHighlightingParaphrase.slice();
                                      copy[index].copied = true;
                                      setOutputHighlightingParaphrase(copy);
                                    }}
                                  >
                                    {data.copied ? (
                                      <motion.div
                                        initial={{ x: -30, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -30, opacity: 0 }}
                                        class=" group-hover:flex flex-col hidden   items-center"
                                      >
                                        <svg
                                          className="text-light_red "
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentcolor"
                                        >
                                          <path d="M0 0h24v24H0z" fill="none" />
                                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                                        </svg>
                                        <span class=" text-red-600 rounded-xl bg-red-200 px-2 text-xs">
                                          Copied!
                                        </span>
                                      </motion.div>
                                    ) : (
                                      <div class=" group-hover:flex  hidden  ">
                                        <svg
                                          className="text-gray-300 hover:text-light_red "
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentcolor"
                                        >
                                          <path d="M0 0h24v24H0z" fill="none" />
                                          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : selectedTab === "correct" ? (
                <>
                  <TextArea
                    width="w-1/2"
                    setInputValue={setInputValue}
                    setCharCount={setCharCount}
                    inputValue={inputValue}
                    handleChange={handleChange}
                  ></TextArea>
                  <div class="paraphraser-output  border-l border-gray-200 w-1/2 h-full">
                    <div class=" h-full relative">
                      {paraphraseLoading && (
                        <div class="absolute w-5/6 h-3/4 flex flex-col  left-2 top-2">
                          <div class=" w-3/4 h-4 mb-3 animate-pulse bg-gray-200 rounded-2xl"></div>

                          <div class=" w-1/2 h-4 mb-3 animate-pulse bg-gray-200 rounded-2xl"></div>
                          <div class=" w-full h-4 animate-pulse mb-3 bg-gray-200 rounded-2xl"></div>
                        </div>
                      )}
                      <div class="backdrop absolute  z-10 p-6 overflow-auto">
                        <div class="highlights text-transparent font-semibold  whitespace-pre-wrap ">
                          {parse(outputHighlighting)}
                        </div>
                      </div>
                      {outputValueCorrect !== "" && (
                        <AnimatePresence>
                          <button
                            title={tooltipTitle}
                            data-tooltip="Clear all Input"
                            data-tooltip-target="tooltip-default"
                            class=" w-7 h-7  text-gray-300 z-50 absolute  right-6 bottom-1 hover:text-light_red cursor-pointer"
                            onClick={() => {
                              copyToClipboard(outputValueCorrect);
                            }}
                          >
                            {clickedCopy ? (
                              <div className="flex flex-col items-center">
                                <motion.svg
                                  initial={{ x: -30, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  exit={{ x: -30, opacity: 0 }}
                                  class="w-6 h-6 mr-3 text-light_red"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentcolor"
                                >
                                  <path d="M0 0h24v24H0z" fill="none" />
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </motion.svg>
                                <motion.span
                                  initial={{ opacity: 1 }}
                                  animate={{
                                    opacity: 0,
                                    transition: {
                                      delay: 2,
                                      duration: 1,
                                    },
                                  }}
                                  class=" text-red-600 rounded-xl bg-red-200 px-2 text-xs"
                                >
                                  Copied!
                                </motion.span>
                              </div>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentcolor"
                              >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                              </svg>
                            )}
                          </button>
                        </AnimatePresence>
                      )}

                      <textarea
                        readOnly={true}
                        value={outputValueCorrect}
                        class="resize-none text-body  bg-transparent block absolute z-20 overflow-auto font-semibold outline-none border-none m-0 focus-none p-6  h-full w-full"
                        name="paraphraseInput"
                        id="paraphraseInput"
                      ></textarea>
                    </div>
                  </div>
                </>
              ) : selectedTab === "shorten" ? (
                <>
                  <TextArea
                    width="w-1/2"
                    setInputValue={setInputValue}
                    setCharCount={setCharCount}
                    inputValue={inputValue}
                    handleChange={handleChange}
                  ></TextArea>
                  <div class="paraphraser-output  border-l border-gray-200 w-1/2 h-full">
                    <div class=" h-full relative">
                      {paraphraseLoading && (
                        <div class="absolute w-5/6 h-3/4 flex flex-col  left-2 top-2">
                          <div class=" w-3/4 h-4 mb-3 animate-pulse bg-gray-200 rounded-2xl"></div>

                          <div class=" w-1/2 h-4 mb-3 animate-pulse bg-gray-200 rounded-2xl"></div>
                          <div class=" w-full h-4 animate-pulse mb-3 bg-gray-200 rounded-2xl"></div>
                        </div>
                      )}

                      {outputValueShorten !== "" && (
                        <AnimatePresence>
                          <button
                            title={tooltipTitle}
                            data-tooltip="Clear all Input"
                            data-tooltip-target="tooltip-default"
                            class=" w-7 h-7  text-gray-300 z-50 absolute right-3 bottom-1 hover:text-gray-800 cursor-pointer"
                            onClick={() => {
                              copyToClipboard(outputValueShorten);
                            }}
                          >
                            {clickedCopy ? (
                              <motion.svg
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -30, opacity: 0 }}
                                class="w-6 h-6 mr-3"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#000"
                              >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </motion.svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentcolor"
                              >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                              </svg>
                            )}
                          </button>
                        </AnimatePresence>
                      )}

                      <textarea
                        readOnly={true}
                        value={outputValueShorten}
                        class="resize-none text-body bg-transparent block absolute z-20 overflow-auto font-semibold outline-none border-none m-0 focus-none p-6  h-full w-full"
                        name="paraphraseInput"
                        id="paraphraseInput"
                      ></textarea>
                    </div>
                  </div>
                </>
              ) : selectedTab === "translate" ? (
                <>
                  <TextArea
                    width="w-1/2"
                    setInputValue={setInputValue}
                    setCharCount={setCharCount}
                    inputValue={inputValue}
                    handleChange={handleChange}
                  ></TextArea>
                  <div class="paraphraser-output  border-l border-gray-200 w-1/2 h-full">
                    <div class=" h-full relative">
                      {paraphraseLoading && (
                        <div class="absolute w-5/6 h-3/4 flex flex-col  left-2 top-2">
                          <div class=" w-3/4 h-4 mb-3 animate-pulse bg-gray-200 rounded-2xl"></div>

                          <div class=" w-1/2 h-4 mb-3 animate-pulse bg-gray-200 rounded-2xl"></div>
                          <div class=" w-full h-4 animate-pulse mb-3 bg-gray-200 rounded-2xl"></div>
                        </div>
                      )}

                      {outputValueTranslate !== "" && (
                        <AnimatePresence>
                          <button
                            title={tooltipTitle}
                            data-tooltip="Clear all Input"
                            data-tooltip-target="tooltip-default"
                            class=" w-7 h-7  text-gray-300 z-50 absolute right-3 bottom-1 hover:text-gray-800 cursor-pointer"
                            onClick={() => {
                              copyToClipboard(outputValueTranslate);
                            }}
                          >
                            {clickedCopy ? (
                              <motion.svg
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -30, opacity: 0 }}
                                class="w-6 h-6 mr-3"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#000"
                              >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </motion.svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentcolor"
                              >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                              </svg>
                            )}
                          </button>
                        </AnimatePresence>
                      )}

                      <textarea
                        readOnly={true}
                        value={outputValueTranslate}
                        class="resize-none text-body bg-transparent block absolute z-20 overflow-auto font-semibold outline-none border-none m-0 focus-none p-6  h-full w-full"
                        name="paraphraseInput"
                        id="paraphraseInput"
                      ></textarea>
                    </div>
                  </div>
                </>
              ) : (
                <span>Rewrite</span>
              )}
            </div>
          </div>
          <div class="paraphraser-button w-1/2 flex flex-col justify-between   items-end ">
            <div class="flex justify-end w-full"></div>
            <div class="flex justify-between items-end w-full ">
              <span class="text-sm text-gray-400 ml-4">{charCount}/250</span>
              <button
                onClick={handleParaphrase}
                class=" md:px-4 md:py-2 text-xs md:text-sm p-1 bg-light_red mr-4 mt-2 flex items-center justify-between hover:bg-red-500 rounded-md"
              >
                {paraphraseLoading && (
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}

                {!paraphraseLoading && (
                  <svg
                    class="w-6 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    enable-background="new 0 0 24 24"
                    viewBox="0 0 24 24"
                    fill="currentcolor"
                  >
                    <g>
                      <rect fill="none" height="24" width="24" />
                    </g>
                    <g>
                      <g>
                        <polygon points="17.59,18 19,16.59 14.42,12 19,7.41 17.59,6 11.59,12" />
                        <polygon points="11,18 12.41,16.59 7.83,12 12.41,7.41 11,6 5,12" />
                      </g>
                    </g>
                  </svg>
                )}
                {selectedTab === "paraphrase" ? (
                  <span>Rewrite</span>
                ) : selectedTab === "correct" ? (
                  <span>Correct</span>
                ) : selectedTab === "shorten" ? (
                  <span>Shorten</span>
                ) : selectedTab === "translate" ? (
                  <span>Translate</span>
                ) : (
                  <span>Rewrite</span>
                )}
              </button>
            </div>
          </div>
        </div>
        <span className="text-body text-xs mt-3">
          * This project is still in Beta, it may contain some functional or
          visual bugs. Currently only English is supported for paraphrasing and
          the corrector. The Shorten functionality is going to be added soon and
          is currently not available.
        </span>
      </div>
    </div>
  );
};

export default ParaphraseSection;
