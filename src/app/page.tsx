'use client';

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
export default function Home() {
  const [ancienIndex, setAncienIndex] = useState(-1);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [washName, setWashName] = useState<string>('');
  const [famsNum, setFamsNum] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRandomImage, setCurrentRandomImage] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);




  const spinDuration = 5000;

  useEffect(() => {
    async function fetchCSV() {
      try {
        const response = await fetch('/fams.csv');
        const text = await response.text();
        const rows = text.split('\n').map((row) => row.split(','));
        setCsvData(rows);
      } catch (error) {
        console.error("Error fetching CSV:", error);
      }
    }

    fetchCSV();
    audioRef.current = new Audio('/SlotMachine.mp3');
  }, []);

  function showNextRandomWash() {
    if (isSpinning || ancienIndex > csvData.length) return;

    setIsSpinning(true);
    setWashName("???");
    const nextIndex = Math.min(ancienIndex + 1, csvData.length);

    if (nextIndex === csvData.length) {
      setAncienIndex(csvData.length);
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    setFamsNum(csvData[nextIndex][0]);
    setAncienIndex(nextIndex);


    let spins = 0;
    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * csvData.length);
      setCurrentRandomImage(csvData[randomIndex][2]);
      spins++;

      if (spins >= spinDuration / 100) {
        clearInterval(spinInterval);
        setTimeout(() => {
          setCurrentRandomImage(csvData[nextIndex][2]);
          setWashName(csvData[nextIndex][2].split('/')[2].split('.')[0].replace('_', ' '));

          setIsSpinning(false);
        }, 0); // Show the final image after 1 second
      }
    }, 100); // Change image every 100ms
  }

  function showPreviousRandomWash() {
    if (isSpinning) return;
    setAncienIndex((prevIndex) => Math.max(prevIndex - 1, -1));

    if (ancienIndex <= 0) {
      return;
    }

    setWashName(csvData[ancienIndex - 1][2].split('/')[2].split('.')[0].replace('_', ' '));
    setFamsNum(csvData[ancienIndex - 1][0]);
  }

  if (csvData.length === 0) {
    return <main className="flex h-full w-full flex-col items-center justify-start p-24">
      <div className="flex flex-col h-full w-full items-center">
        <h1 className="text-3xl font-bold text-center py-4">Random Wash</h1>
      </div>
    </main>
  }

  if (ancienIndex === -1) {
    return <main className="flex h-full w-full flex-col items-center justify-start p-24">
      <div className="flex flex-col h-full w-full items-center">
        <h1 className="text-3xl font-bold text-center py-4">Random Wash</h1>
        <button className="m-4 p-3 bg-green-600 w-[150px] rounded-lg" onClick={showNextRandomWash}>Commencer</button>
      </div>
    </main>
  }
  
  if (ancienIndex === csvData.length) {
    return <main className="flex h-full w-full flex-col items-center justify-start p-24">
      <div className="flex flex-col h-full w-full items-center">
        <h1 className="text-3xl font-bold text-center py-4">Random Wash</h1>
        <p>C'est la fin !</p>
        <button className="m-4 p-3 bg-green-600 w-[150px] rounded-lg" onClick={() => setAncienIndex(-1)}>Recommencer</button>
      </div>
    </main>
  }
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  return (
    <main className="flex h-full w-full flex-col items-center justify-start p-24">
      <div className="flex flex-col h-full w-full">
        <h1 className="text-3xl font-bold text-center py-4">Repart's - H{famsNum} : {washName}</h1>
        <div className="flex flex-grow items-center h-full overflow-hidden">
          <div className="flex flex-col items-center justify-center flex-1">
            <Image className="object-cover object-center" src={csvData[ancienIndex][1]} alt="ancien" width={500} height={500} />
          </div>
          <div className="flex items-center justify-center flex-1">
            <Image className="object-cover object-center" src={isSpinning ? currentRandomImage : csvData[ancienIndex][2]} alt="wash" width={500} height={500} />
          </div>
        </div>

        <div className="flex flex-row justify-center space-x-4">
          <button className="m-4 p-3 bg-green-600 w-[150px] rounded-lg" onClick={showPreviousRandomWash} disabled={isSpinning}>Précédent</button>
          <button className="m-4 p-3 bg-green-600 w-[150px] rounded-lg" onClick={showNextRandomWash} disabled={isSpinning}>Suivant</button>
        </div>
      </div>
    </main>
  );
}