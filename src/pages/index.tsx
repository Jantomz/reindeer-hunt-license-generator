import Head from "next/head";
import readXlsxFile from "read-excel-file";
import { jsPDF } from "jspdf";

export default function Home() {
  const map = {
    FULL_NAME: "name",
    HOMEROOM: "homeroom",
  };

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
          <h1 className="text-7xl font-medium text-white">The Reindeer Hunt</h1>
          <h4 className="text-xl font-thin text-green-300">
            Application to create Reindeer Hunt cards
          </h4>
          <div className="flex flex-col items-center justify-center gap-5 p-24">
            <h2 className="text-center text-4xl font-medium text-gray-300">
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

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-1/2 rounded-md bg-red-900 p-3 font-medium text-white hover:bg-red-800 active:bg-red-200 active:text-slate-900"
            >
              Download Cards
            </button>
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
    const fileInput = document.getElementById("input");
    const selectedFile = fileInput.files[0];
    const doc = new jsPDF("p", "mm", [297, 210]);

    let title = "SHHS REINDEER HUNTING LICENSE";
    let round = "1";
    let anniversary = "10th";
    let hunter = "Jaden Zhang";
    let reindeer = "Samantha Adams";
    let hunterHR = "1201";
    let reindeerHR = "1202";
    let endDate = "Friday, November 10";
    let huntingPeriod =
      "Before School: 7:30 - 8:05AM\nLunch: 10:50 - 11:30AM\nAfter School: 2:10 - 2:30PM";
    let instructions1;
    let instructions2;
    let splitInstructions1;
    let splitInstructions2;
    let requirements1;
    let requirements2;
    let j = 0;
    let incrementBetweenBoxes;
    let even = true;
    let firstSet: any = [];
    let secondSet: any = [];
    doc.setDrawColor("#FF4821");

    // testing git commits
    try {
      // Need to format the rows and values of receiving the information
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
        for (let i = 0; i < firstSet.length; i++) {
          j = i % 6;

          incrementBetweenBoxes = j * 45;

          hunter = firstSet[i].name;
          reindeer = secondSet[i].name;

          hunterHR = firstSet[i].homeroom;
          reindeerHR = secondSet[i].homeroom;

          requirements1 = `To be entered into the next round, you must successfully\ncapture ${reindeer} by 2:30PM ${endDate}`;
          requirements2 = `To be entered into the next round, you must successfully\ncapture ${hunter} by 2:30PM ${endDate}`;

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
          doc.setFont(undefined, "bold");

          doc.text(
            title,
            LEFT_BOX_CENTER,
            TITLE_Y + incrementBetweenBoxes,
            "center",
          );
          doc.text(
            title,
            RIGHT_BOX_CENTER,
            TITLE_Y + incrementBetweenBoxes,
            "center",
          );

          doc.setFont(undefined, "normal");

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
            "center",
          );
          doc.text(
            requirements2,
            RIGHT_BOX_CENTER,
            FOOTER_Y + incrementBetweenBoxes,
            "center",
          );

          // Writing round title
          doc.setFontSize(LARGE_FONT);
          doc.setFont(undefined, "bold");

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

          doc.setFont(undefined, "normal");
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
}
