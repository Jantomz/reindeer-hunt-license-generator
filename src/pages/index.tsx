import Head from "next/head";
import readXlsxFile from "read-excel-file";
import { jsPDF } from "jspdf";

export default function Home() {
  const map = {
    FULL_NAME: "name",
    HOMEROOM: "homeroom",
  };

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

          hunter = firstSet[i].name;
          reindeer = secondSet[i].name;

          hunterHR = firstSet[i].homeroom;
          reindeerHR = secondSet[i].homeroom;

          requirements1 = `To be entered into the next round, you must successfully capture ${reindeer}`;
          requirements2 = `To be entered into the next round, you must successfully capture ${hunter}`;

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
          doc.setFontSize(12);
          doc.setTextColor("#FF4821");
          doc.setFont(undefined, "bold");

          doc.text(title, 55, 18 + j * 45, "center");
          doc.text(title, 150, 18 + j * 45, "center");

          doc.setFont(undefined, "normal");

          doc.setTextColor("#000");
          doc.setFontSize(8);

          // Writing instructions
          doc.text(splitInstructions1, 18, 30 + j * 45);
          doc.text(splitInstructions2, 113, 30 + j * 45);

          // Writing round title
          doc.setFontSize(10);
          doc.setFont(undefined, "bold");

          doc.text("ROUND " + round, 18, 25 + j * 45);
          doc.text("ROUND " + round, 113, 25 + j * 45);

          // Writing hunting period title
          doc.text("Hunting Period:", 60, 25 + j * 45);
          doc.text("Hunting Period:", 155, 25 + j * 45);

          // Writing hunting period

          doc.setFont(undefined, "normal");
          doc.setFontSize(8);

          doc.text(huntingPeriod, 60, 30 + j * 45);
          doc.text(huntingPeriod, 155, 30 + j * 45);

          // Left Box
          doc.line(10, 10 + j * 45, 105, 10 + j * 45); // (x, y, x, y)
          doc.line(10, 55 + j * 45, 105, 55 + j * 45); // bottom
          doc.line(10, 10 + j * 45, 10, 55 + j * 45); // left
          doc.line(105, 10 + j * 45, 105, 55 + j * 45); // right

          // Right Box
          doc.line(105, 10 + j * 45, 200, 10 + j * 45);
          doc.line(105, 55 + j * 45, 200, 55 + j * 45);
          doc.line(200, 10 + j * 45, 200, 55 + j * 45);
        }
        doc.save("Test");
      });
    } catch (e) {
      console.log(e);
    }
  }
}
