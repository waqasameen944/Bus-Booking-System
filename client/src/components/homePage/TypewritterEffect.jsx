import { useState, useEffect } from "react";

export default function TypewriterEffect({
  words = ["Morning", "Noon", "Evening"],
  typingSpeed = 250,
  deletingSpeed = 75,
  pauseTime = 1000,
}) {
  const [currentText, setCurrentText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        setCurrentText(currentWord.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else {
        setCurrentText(currentWord.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }
    };

    let timer;

    if (!isDeleting && charIndex === words[wordIndex].length) {
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && charIndex === 0) {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, pauseTime / 2);
    } else {
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timer = setTimeout(handleTyping, speed);
    }

    return () => clearTimeout(timer);
  }, [
    charIndex,
    isDeleting,
    wordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    pauseTime,
  ]);

  return (
    <div className="flex text-white rounded w-fit px-6 pb-1 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-purple-700">
      <h1 className=" text-2xl  text-white">
        {currentText}
        <span className="inline-block w-[2px] h-5 ml-1 bg-white animate-blink" />
      </h1>
    </div>
  );
}
