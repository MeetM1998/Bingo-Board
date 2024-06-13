import { useEffect, useState } from "react";

interface NumberCell {
  value: number;
  matched: boolean;
}

const App: React.FC = () => {
  const [numbers, setNumbers] = useState<NumberCell[]>([]);
  const [generatedNumber, setGeneratedNumber] = useState<number | null>(null);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [matchedNumber, setMatchedNumber] = useState<number>(0);

  const generateBingoBoardNumbers = () => {
    const uniqueNumbers = new Set<number>();

    while (uniqueNumbers.size < 25) {
      const random = Math.floor(Math.random() * 100) + 1;
      uniqueNumbers.add(random);
    }
    const newNumbers: NumberCell[] = Array.from(uniqueNumbers).map((num) => ({
      value: num,
      matched: false,
    }));
    setNumbers(newNumbers);
  };

  useEffect(() => {
    generateBingoBoardNumbers();
  }, []);

  const generateRandomNumbers = () => {
    const random = Math.floor(Math.random() * 101);
    setGeneratedNumber(random);
    checkMatchNumbers(random);
  };

  useEffect(() => {
    let intervalId: number | undefined = undefined;

    if (isStart && matchedNumber < 25) {
      intervalId = window.setInterval(generateRandomNumbers, 350);
    } else if (intervalId !== undefined) {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isStart, matchedNumber]);

  const checkMatchNumbers = (num: number) => {
    const newNumber = [...numbers];
    const findIndexs = newNumber.findIndex((item) => item.value === num);

    if (findIndexs !== -1 && !newNumber[findIndexs].matched) {
      newNumber[findIndexs].matched = true;
      setNumbers(newNumber);

      const newMatchedCount = matchedNumber + 1;
      setMatchedNumber(newMatchedCount);

      if (newMatchedCount === 25) {
        handleWinner();
      }
    }
  };

  const handleWinner = () => {
    setGeneratedNumber(null);
    setIsStart(false);
  };

  return (
    <div className="text-center font-sans">
      <h2 className="bg-black text-white text-center py-3 uppercase text-xl w-full">
        Bingo Board
      </h2>
      <div className="flex flex-col justify-center items-center mt-7">
        {generatedNumber !== null && isStart ? (
          <p>{`Generated Number: ${generatedNumber}`}</p>
        ) : (
          matchedNumber === 25 && (
            <p className="text-2xl font-bold">You are winner!</p>
          )
        )}

        <div className="grid grid-cols-5 gap-5 mt-8 w-4/12">
          {numbers?.map((item, index) => (
            <div
              key={index}
              className={`${
                item?.matched
                  ? "bg-green-500 text-white"
                  : "border border-black"
              } p-2`}
            >
              {item?.value}
            </div>
          ))}
        </div>
        <div className="flex gap-x-3">
          <button
            className={`mt-4 px-4 py-2 ${
              isStart || matchedNumber === 25 ? "bg-gray-500" : "bg-green-800"
            } text-white rounded`}
            onClick={() => setIsStart(true)}
            disabled={isStart || matchedNumber === 25}
          >
            Start
          </button>
          <button
            className="mt-4 px-4 py-2 bg-blue-800 text-white rounded"
            onClick={() => {
              setNumbers([]);
              setGeneratedNumber(null);
              setIsStart(false);
              generateBingoBoardNumbers();
              setMatchedNumber(0);
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
