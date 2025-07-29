async function StudentHallTicketExtract(pdf) {
  const StudentsDetails = [];
  let j;
  for (j = 0; j < pdf.Pages.length; j = j + 2) {
    let registerNumber;
    let firstName;
    let lastName;
    let subjects = [];
    let department;
    //Text position for loop execution
    let SetPosition = 0;
    //Total exams of the student
    let ExamcountInHallTicket = 0;
    let SetlimitForCodeAtRightColumn = 0;
    let SubjectCode = 0;
    let SetlimitForCodeAtLeftColumn = 0;
    let i = 0;
    let OnePersonCompleted = false;
    let secondColumn = false;
    let GoToSheetTwo = false;
    let GetDataFromSheetTwo = false;
    let SheetTwoRightColumn = false;
    while (!OnePersonCompleted) {
      //console.log(i,pdf.Pages[j].Texts[i].R[0].T)
      if (pdf.Pages[j].Texts[i].R[0].T === "Number") {
        registerNumber = pdf.Pages[j].Texts[i + 1].R[0].T;
      }
      if (pdf.Pages[j].Texts[i].R[0].T === "Name") {
        firstName = pdf.Pages[j].Texts[i + 1].R[0].T;
        lastName = pdf.Pages[j].Texts[i + 2].R[0].T;
        if (lastName.includes("%")) {
          lastName = lastName.split("")[0];
        }
      }
      if (pdf.Pages[j].Texts[i].R[0].T === "Branch") {
        department = pdf.Pages[j].Texts[i + 2].R[0].T;
      }
      //To getting a no.of exams count per hall ticket
      if (
        pdf.Pages[j].Texts[i].R[0].T === "Registered%3A" &&
        ExamcountInHallTicket == 0
      ) {
        ExamcountInHallTicket = pdf.Pages[j].Texts[i + 1].R[0].T;
        i = 0;
      }
      //Condition for getting a subject code at the rightside column
      if (ExamcountInHallTicket > 0) {
        if (pdf.Pages[j].Texts[i].R[0].T === "Title") {
          if (Number(ExamcountInHallTicket) > 15) {
            SubjectCode = i + 21;
            SetlimitForCodeAtRightColumn = 15;
            secondColumn = true;
          } else if (Number(ExamcountInHallTicket) === 15) {
            SubjectCode = i + 21;
            SetlimitForCodeAtRightColumn = 15;
            OnePersonCompleted = true;
          } else {
            SubjectCode = i + Number(ExamcountInHallTicket) + 6;
            SetlimitForCodeAtRightColumn = Number(ExamcountInHallTicket);
            OnePersonCompleted = true;
          }
          for (
            let i = SubjectCode;
            i < SubjectCode + Number(SetlimitForCodeAtRightColumn);
            i++
          ) {
            //console.log(pdf.Pages[j].Texts[i].R[0].T);
            subjects.push(pdf.Pages[j].Texts[i].R[0].T);
            SetPosition = i + 1;
          }
          if (SetPosition != 0) {
            i = i + SetPosition;
          }
        }
      }
      //Condition for getting a subject code at the leftside column
      if (ExamcountInHallTicket > 0) {
        if (secondColumn) {
          if (
            pdf.Pages[j].Texts[i].R[0].T === "01" ||
            pdf.Pages[j].Texts[i].R[0].T === "02" ||
            pdf.Pages[j].Texts[i].R[0].T === "03" ||
            pdf.Pages[j].Texts[i].R[0].T === "04" ||
            pdf.Pages[j].Texts[i].R[0].T === "05" ||
            pdf.Pages[j].Texts[i].R[0].T === "06" ||
            pdf.Pages[j].Texts[i].R[0].T === "07" ||
            pdf.Pages[j].Texts[i].R[0].T === "08"
          ) {
            if (ExamcountInHallTicket > 30) {
              SetlimitForCodeAtLeftColumn = 15;
              GoToSheetTwo = true;
            } else if (ExamcountInHallTicket === 30) {
              SetlimitForCodeAtLeftColumn = 15;
              OnePersonCompleted = true;
            } else {
              SetlimitForCodeAtLeftColumn = ExamcountInHallTicket - 15;
              OnePersonCompleted = true;
            }
            SubjectCode = i + SetlimitForCodeAtLeftColumn;
            for (
              let i = SubjectCode;
              i < SubjectCode + SetlimitForCodeAtLeftColumn;
              i++
            ) {
              //console.log(pdf.Pages[j].Texts[i].R[0].T);
              subjects.push(pdf.Pages[j].Texts[i].R[0].T);
              SetPosition = i + 1;
            }
            i = 0;
            //Condition for checking the next page wether a single person hold a additional sheet in hall ticket
            if (GoToSheetTwo) {
              if (pdf.Pages[j + 2].Texts[23].R[0].T === registerNumber) {
                while (!GetDataFromSheetTwo) {
                  if (pdf.Pages[j + 2].Texts[i].R[0].T === "Title") {
                    if (
                      ExamcountInHallTicket >= 30 &&
                      ExamcountInHallTicket <= 45
                    ) {
                      SubjectCode = i + Number(ExamcountInHallTicket) - 30 + 6;
                      SetlimitForCodeAtRightColumn = ExamcountInHallTicket - 30;
                      GetDataFromSheetTwo = true;
                    } else {
                      SubjectCode = i + Number(SetlimitForCodeAtLeftColumn) + 6;
                      SetlimitForCodeAtRightColumn = 15;
                      SheetTwoRightColumn = true;
                    }
                    for (
                      let i = SubjectCode;
                      i < Number(SubjectCode + SetlimitForCodeAtRightColumn);
                      i++
                    ) {
                      //console.log(i,pdf.Pages[j+2].Texts[i].R[0].T);
                      subjects.push(pdf.Pages[j + 2].Texts[i].R[0].T);
                      SetPosition = i + 1;
                    }
                    if (SetPosition != 0) {
                      i = i + SetPosition;
                    }
                  }

                  if (SheetTwoRightColumn) {
                    if (
                      pdf.Pages[j].Texts[i].R[0].T === "01" ||
                      pdf.Pages[j].Texts[i].R[0].T === "02" ||
                      pdf.Pages[j].Texts[i].R[0].T === "03" ||
                      pdf.Pages[j].Texts[i].R[0].T === "04" ||
                      pdf.Pages[j].Texts[i].R[0].T === "05" ||
                      pdf.Pages[j].Texts[i].R[0].T === "06" ||
                      pdf.Pages[j].Texts[i].R[0].T === "07" ||
                      pdf.Pages[j].Texts[i].R[0].T === "08"
                    ) {
                      if (ExamcountInHallTicket >= 46) {
                        SetlimitForCodeAtLeftColumn = 15;
                        OnePersonCompleted = true;
                      } else if (ExamcountInHallTicket === 60) {
                        SetlimitForCodeAtLeftColumn = 15;
                        OnePersonCompleted = true;
                      } else {
                        SetlimitForCodeAtLeftColumn =
                          ExamcountInHallTicket - 45;
                        OnePersonCompleted = true;
                      }
                      SubjectCode = i + SetlimitForCodeAtLeftColumn;
                      for (
                        let i = SubjectCode;
                        i < SubjectCode + SetlimitForCodeAtLeftColumn;
                        i++
                      ) {
                        //console.log(pdf.Pages[j].Texts[i].R[0].T);
                        subjects.push(pdf.Pages[j].Texts[i].R[0].T);
                        SetPosition = i + 1;
                      }
                      GetDataFromSheetTwo = true;
                    }
                  }
                  i++;
                }

                j = j + 2;
              }
            }
            OnePersonCompleted = true;
          }
        }
      }
      i = i + 1;
    }
    const StudentExams = {
      registerNumber: registerNumber,
      firstname: firstName,
      lastname: lastName,
      department: department,
      subjects: subjects,
    };
    StudentsDetails.push(StudentExams);
  }
  return StudentsDetails;
}
export default StudentHallTicketExtract;
