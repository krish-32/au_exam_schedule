//Function for Exame date PDF's
async function SubjectNameForSubjectCode(pdf) {
  //Subject Name for a Subject code
  let SubjectName = {};
  let i, j;
  for (j = 0; j < pdf.Pages.length; j++) {
    //Count variable to getting number of exam from each pdf page
    let count = 0;
    for (i = 0; i <= pdf.Pages[j].Texts.length - 1; i++) {
      //console.log(pdf.Pages[j].Texts[i].R[0].T)
      if (pdf.Pages[j].Texts[i].R[0].T === "Branch%20Name") {
        i = i + 2;
        //Getting Count
        while (pdf.Pages[j].Texts[i].R[0].T != "Semes") {
          count = count + 1;
          i = i + 1;
        }
        i = i + 4;
      }
      if (pdf.Pages[j].Texts[i].R[0].T === "Code") {
        let PositionForSubjectName = i + 1;
        let PositionForSubjectCode = i + count + 1;
        let EndPositionForSubjectCode = i + count + count;

        for (
          let sub = PositionForSubjectCode;
          sub <= EndPositionForSubjectCode;
          sub++
        ) {
          let SubjectNameWithoutUnwantedChar = await ReplacingChar(
            pdf.Pages[j].Texts[PositionForSubjectName].R[0].T
          );
          SubjectName[pdf.Pages[j].Texts[sub].R[0].T] =
            SubjectNameWithoutUnwantedChar;
          PositionForSubjectName++;
        }
      }
    }
  }
  return SubjectName;
}

async function ReplacingChar(SubName) {
  let SubjectNameVar = SubName;
  let ConvertSubjectNameVarIntoArray = SubjectNameVar.split("");
  let SubjectNameWithoutUnwantedChar = "";
  for (let char of ConvertSubjectNameVarIntoArray) {
    if (char === "%") {
      SubjectNameWithoutUnwantedChar += "";
    } else if (char === "2") {
      SubjectNameWithoutUnwantedChar += "";
    } else if (char === "0") {
      SubjectNameWithoutUnwantedChar += " ";
    } else {
      SubjectNameWithoutUnwantedChar += char;
    }
  }
  return SubjectNameWithoutUnwantedChar;
}

export default SubjectNameForSubjectCode;
