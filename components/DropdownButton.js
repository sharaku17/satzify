import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DropdownButton = ({
  placeholder,
  setTranslatorInput,
  TranslatorInput,
  languages,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [wordEntered, setWordEntered] = useState("");
  const [filteredData, setFilteredData] = useState(languages);

  const handleFilter = (e) => {
    setTranslatorInput("");
    const searchWord = e.target.value;
    setWordEntered(searchWord);
    // setFormData({ ...FormData, crypto: searchWord });
    const newFilter = languages.filter((value) => {
      return value.language.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData(languages);
    } else {
      setFilteredData(newFilter.slice(0, 5));
      setCollapsed(false);
    }
  };

  return (
    <div>
      <div className=" w-40  max-w-xs mr-4 ">
        <div className="max-w-xs  mx-auto space-y-6">
          <div className="dropdown-menu">
            <div className="bg-white border border-gray-200 rounded-lg shadow-md  flex items-center px-2 py-1 cursor-pointer">
              <input
                type="text"
                placeholder={placeholder}
                value={TranslatorInput === "" ? wordEntered : TranslatorInput}
                className=" bg-white text-base placeholder-gray-400 outline-none w-full h-full flex-1"
                onChange={handleFilter}
              />
              <div
                onClick={() => setCollapsed(!collapsed)}
                className=" pl-6 pr-2 py-3"
              >
                <svg
                  className={
                    collapsed
                      ? "transform rotate-0 transition all ease-in-out duration-300"
                      : "transform -rotate-180 transition all ease-in-out duration-300"
                  }
                  width="20"
                  height="10"
                  viewBox="0 0 20 10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="0" y1="0" x2="10" y2="10" stroke="#9CA3AF" />
                  <line x1="20" y1="0" x2="10" y2="10" stroke="#9CA3AF" />
                </svg>
              </div>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-gray-200 rounded-lg shadow-xl z-40  px-4 absolute mt-8"
                >
                  <svg
                    className="absolute bottom-full text-gray-200 bg-white right-4"
                    width="30"
                    height="20"
                    viewBox="0 0 30 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon
                      points="15, 0 30, 20 0, 20"
                      fill="#fff"
                      stroke="currentcolor"
                    />
                  </svg>

                  {filteredData.map((language) => {
                    return (
                      <div
                        key={language.language}
                        onClick={() => {
                          setWordEntered(language.language);
                          setTranslatorInput(language.language);
                          setCollapsed(true);
                        }}
                        className="py-4 px-3 flex cursor-pointer w-full  items-center rounded-lg hover:text-light_red transition all ease-in-out"
                      >
                        <a className="flex-1">
                          <div className="  text-base">{language.language}</div>
                        </a>
                        <div>
                          <svg
                            width="40"
                            height="20"
                            viewBox="0 0 40 20"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentcolor"
                          >
                            <line
                              x1="30"
                              y1="2"
                              x2="40"
                              y2="10"
                              stroke="currentcolor"
                            />
                            <line
                              x1="30"
                              y1="18"
                              x2="40"
                              y2="10"
                              stroke="currentcolor"
                            />
                            <line
                              x1="20"
                              y1="10"
                              x2="40"
                              y2="10"
                              stroke="currentcolor"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownButton;
