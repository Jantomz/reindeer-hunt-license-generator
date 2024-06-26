import Head from "next/head";
import readXlsxFile from "read-excel-file";
import { jsPDF } from "jspdf";
import { useState } from "react";

export default function Home() {
  const map = {
    FULL_NAME: "name",
    HOMEROOM: "homeroom",
  };

  const [round, setRound] = useState(0);
  const [endDate, setEndDate] = useState("");

  const LEFT_BOX_CENTER = 57.5;
  const RIGHT_BOX_CENTER = 152.5;
  const LEFT_BOX_RIGHT_MARGIN = 18;
  const RIGHT_BOX_RIGHT_MARGIN = 113;
  const LEFT_BOX_SECOND_MARGIN = 60;
  const RIGHT_BOX_SECOND_MARGIN = 155;
  const BOX_TOP_LEFTX = 10;
  const BOX_TOP_LEFTY = 10;
  const BOX_TOP_RIGHTX = 200;
  const BOX_TOP_RIGHTY = 10;

  const BOX_BOTTOM_LEFTX = 10;
  const BOX_BOTTOM_LEFTY = 55;
  const BOX_BOTTOM_RIGHTX = 200;
  const BOX_BOTTOM_RIGHTY = 55;

  const MEDIUM_FONT = 8;
  const SMALL_FONT = 6;
  const LARGE_FONT = 10;
  const XLARGE_FONT = 12;

  const TITLE_Y = 18;
  const SUBTITLE_Y = 25;
  const INFO_Y = 30;
  const FOOTER_Y = 50;

  const CENTER = 105;

  const FONT = "helvetica";

  return (
    <>
      <Head>
        <title>Reindeer Hunt</title>
        <meta
          name="description"
          content="An app to help schools create their reindeer hunt cards"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#ff4646] to-[#ce5353]">
        <div className="flex flex-col items-center justify-center py-12">
          <img src="ReindeerHuntLogo.png" className="w-1/12"></img>
          <h1 className="text-7xl font-medium text-white max-md:text-3xl">
            The Reindeer Hunt
          </h1>
          <h4 className="text-xl font-thin text-green-300 max-md:text-lg">
            Application to create Reindeer Hunt cards
          </h4>
          <div className="flex flex-col items-center justify-center gap-5 p-24">
            <h2 className="text-center text-4xl font-medium text-gray-300 max-md:text-xl">
              Upload your Spreadsheet File
            </h2>
            <div className="flex items-center justify-center gap-16 p-12">
              <img className="w-1/4" src="spreadsheet.png"></img>
              <input
                type="file"
                id="input"
                className="w-64 font-medium"
              ></input>
            </div>
            <input
              type="number"
              value={round}
              max="9"
              min="1"
              onChange={(event) => {
                if (
                  parseInt(event.target.value) > 9 ||
                  parseInt(event.target.value) < 1
                ) {
                  // @ts-ignore
                  document.getElementById("roundInput").value = 1;
                }
                setRound(parseInt(event.target.value));
              }}
              id="roundInput"
              placeholder="Round#"
              className="w-32 rounded-md bg-slate-100/20 p-1 text-center text-white placeholder-white"
            ></input>
            <input
              type="text"
              placeholder="End of Round Date"
              onChange={(event) => {
                setEndDate(event.target.value);
              }}
              className="w-42 rounded-md bg-slate-100/20 p-1 text-center  text-white placeholder-white"
            ></input>
            <input
              type="date"
              placeholder="End of Round Date"
              className="w-40 p-1"
            ></input>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-1/2 rounded-md bg-red-900 p-3 font-medium text-white hover:bg-red-800 active:bg-red-200 active:text-slate-900"
            >
              Download Cards
            </button>
            <a
              href="https://docs.google.com/spreadsheets/d/1wWk-H4WL2gIsGfYt6WQW6qsXQEmYr_p-d5sAwJlqpqM/edit?usp=sharing"
              target="_blank"
            >
              <button className="mt-12 rounded-md bg-red-600/30 p-3 font-medium text-white hover:bg-red-500 active:bg-red-400 active:text-slate-500">
                View Spreadsheet Template
              </button>
            </a>
          </div>
        </div>
        <footer className="pb-2 text-center">
          Created with &#9829; by Jaden Zhang
        </footer>
      </main>
    </>
  );

  function handleSubmit() {
    // Need to give different options to users for formatting their cards
    const fileInput = document.getElementById("input") as HTMLInputElement;
    const doc = new jsPDF("p", "mm", [297, 210]);

    // need to change to variables later when it needs to change
    const title = "SHHS REINDEER HUNTING LICENSE";
    const anniversary = "10th";
    const huntingPeriod =
      "Before School: 7:30 - 8:05AM\nLunch: 10:50 - 11:30AM\nAfter School: 2:10 - 2:30PM";
    let hunter;
    let reindeer;
    let hunterHR;
    let reindeerHR;
    let instructions1;
    let instructions2;
    let splitInstructions1;
    let splitInstructions2;
    let requirements1;
    let requirements2;
    let j = 0;
    let incrementBetweenBoxes;
    let even = true;
    const firstSet: any = [];
    const secondSet: any = [];
    doc.setDrawColor("#FF4821");

    // testing git commits
    try {
      // @ts-ignore
      const selectedFile = fileInput.files[0]; // Need to format the rows and values of receiving the information
      // @ts-ignore
      readXlsxFile(selectedFile, { map }).then(({ rows }) => {
        rows.forEach((element) => {
          if (even) {
            firstSet.push(element);
            even = false;
          } else {
            secondSet.push(element);
            even = true;
          }
        });

        if (firstSet.length > secondSet.length) {
          secondSet.push({
            name: "FREE PASS",
            homeroom: "FREE PASS",
          });
        }

        // Shuffle array of names
        shuffleArray(firstSet);
        shuffleArray(secondSet);

        for (let i = 0; i < firstSet.length; i++) {
          j = i % 6;

          incrementBetweenBoxes = j * 45;

          hunter = firstSet[i].name;
          reindeer = secondSet[i].name;

          hunterHR = firstSet[i].homeroom;
          reindeerHR = secondSet[i].homeroom;

          requirements1 = `To be entered into the next round, you must successfully\ncapture ${reindeer} by 2:30PM on ${endDate}`;
          requirements2 = `To be entered into the next round, you must successfully\ncapture ${hunter} by 2:30PM on ${endDate}`;

          instructions1 = `This license permits ${hunter} (${hunterHR}) to hunt ${reindeer} (${reindeerHR}) in round ${round} of Sacred Heart's ${anniversary} Annual Reindeer Hunt.`;
          instructions2 = `This license permits ${reindeer} (${reindeerHR}) to hunt ${hunter} (${hunterHR}) in round ${round} of Sacred Heart's ${anniversary} Annual Reindeer Hunt.`;

          if (i == 0) {
            splitInstructions1 = doc.splitTextToSize(instructions1, 80);
            splitInstructions2 = doc.splitTextToSize(instructions2, 80);
          } else {
            splitInstructions1 = doc.splitTextToSize(instructions1, 40);
            splitInstructions2 = doc.splitTextToSize(instructions2, 40);
          }

          if (i % 6 == 0 && i != 0) {
            doc.addPage();
          }

          // Writing title
          doc.setFontSize(XLARGE_FONT);
          doc.setTextColor("#FF4821");
          doc.setFont(FONT, "bold");

          doc.text(
            title,
            LEFT_BOX_CENTER,
            TITLE_Y + incrementBetweenBoxes,
            // @ts-ignore
            "center",
          );

          doc.text(
            title,
            RIGHT_BOX_CENTER,
            TITLE_Y + incrementBetweenBoxes,
            // @ts-ignore
            "center",
          );

          // @ts-ignore
          doc.setFont(FONT, "normal");

          doc.setTextColor("#000");
          doc.setFontSize(MEDIUM_FONT);

          // Writing instructions
          doc.text(
            splitInstructions1,
            LEFT_BOX_RIGHT_MARGIN,
            INFO_Y + incrementBetweenBoxes,
          );
          doc.text(
            splitInstructions2,
            RIGHT_BOX_RIGHT_MARGIN,
            INFO_Y + incrementBetweenBoxes,
          );

          doc.setFontSize(SMALL_FONT);

          doc.text(
            requirements1,
            LEFT_BOX_CENTER,
            FOOTER_Y + incrementBetweenBoxes,
            // @ts-ignore
            "center",
          );

          doc.text(
            requirements2,
            RIGHT_BOX_CENTER,
            FOOTER_Y + incrementBetweenBoxes,
            // @ts-ignore
            "center",
          );

          // Writing round title
          doc.setFontSize(LARGE_FONT);
          doc.setFont(FONT, "bold");

          doc.text(
            "ROUND " + round,
            LEFT_BOX_RIGHT_MARGIN,
            SUBTITLE_Y + incrementBetweenBoxes,
          );
          doc.text(
            "ROUND " + round,
            RIGHT_BOX_RIGHT_MARGIN,
            SUBTITLE_Y + incrementBetweenBoxes,
          );

          // Writing hunting period title
          doc.text(
            "Hunting Period:",
            LEFT_BOX_SECOND_MARGIN,
            SUBTITLE_Y + incrementBetweenBoxes,
          );
          doc.text(
            "Hunting Period:",
            RIGHT_BOX_SECOND_MARGIN,
            SUBTITLE_Y + incrementBetweenBoxes,
          );

          // Writing hunting period

          doc.setFont(FONT, "normal");
          doc.setFontSize(MEDIUM_FONT);

          doc.text(
            huntingPeriod,
            LEFT_BOX_SECOND_MARGIN,
            INFO_Y + incrementBetweenBoxes,
          );
          doc.text(
            huntingPeriod,
            RIGHT_BOX_SECOND_MARGIN,
            INFO_Y + incrementBetweenBoxes,
          );

          // Boxes

          // top line
          doc.line(
            BOX_TOP_LEFTX,
            BOX_TOP_LEFTY + incrementBetweenBoxes,
            BOX_TOP_RIGHTX,
            BOX_TOP_RIGHTY + incrementBetweenBoxes,
          );

          // bottom line
          doc.line(
            BOX_BOTTOM_LEFTX,
            BOX_BOTTOM_LEFTY + incrementBetweenBoxes,
            BOX_BOTTOM_RIGHTX,
            BOX_BOTTOM_RIGHTY + incrementBetweenBoxes,
          );

          // left line
          doc.line(
            BOX_TOP_LEFTX,
            BOX_TOP_LEFTY + incrementBetweenBoxes,
            BOX_BOTTOM_LEFTX,
            BOX_BOTTOM_LEFTY + incrementBetweenBoxes,
          );
          // center line
          doc.line(
            CENTER,
            BOX_TOP_RIGHTY + incrementBetweenBoxes,
            CENTER,
            BOX_BOTTOM_RIGHTY + incrementBetweenBoxes,
          ); // right line
          doc.line(
            BOX_TOP_RIGHTX,
            BOX_TOP_RIGHTY + incrementBetweenBoxes,
            BOX_BOTTOM_RIGHTX,
            BOX_BOTTOM_RIGHTY + incrementBetweenBoxes,
          );
        }
        doc.save("Test");
      });
    } catch (e) {
      console.log(e);
    }
  }

  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
