async function constructStudentDataFromPDF(pdf) {
  let studentData = [];
  let i, j;
  for (j = 0; j <= pdf.Pages.length - 1; j++) {
    let registerNumber;
    let firstName;
    let lastName;
    let regulation;
    let subjects = [];
    let numberOfSubjects;
    let department;
    let index;
    for (i = 0; i <= pdf.Pages[j].Texts.length - 1; i++) {
      // this code for checking the text objects
      if (pdf.Pages[j].Texts[i].R[0].T == "Number") {
        // getting the student register number
        registerNumber = pdf.Pages[j].Texts[i + 1].R[0].T;
      } else if (pdf.Pages[j].Texts[i].R[0].T == "Subjects") {
        numberOfSubjects = Number(pdf.Pages[j].Texts[i + 1].R[0].T);
      } else if (pdf.Pages[j].Texts[i].R[0].T == "the") {
        // this code is for getting the student name
        if (pdf.Pages[j].Texts[i + 1].R[0].T == "Candidate") {
          firstName = pdf.Pages[j].Texts[i + 2].R[0].T;
          lastName = pdf.Pages[j].Texts[i + 3].R[0].T;
        }
      } else if (pdf.Pages[j].Texts[i].R[0].T == "Regulations") {
        // this is for regulations.
        regulation = pdf.Pages[j].Texts[i + 1].R[0].T;
      } else if (pdf.Pages[j].Texts[i].R[0].T == "B.E.") {
        // this is for department
        department = pdf.Pages[j].Texts[i + 1].R[0].T;
      } else if (pdf.Pages[j].Texts[i].R[0].T.lastIndexOf("Title") !== -1) {
        // this is for getting index for get the students subjects
        index = i + 1;
      }
    }
    // TODO loop for get  the subjects of the students
    for (let k = 0; k <= numberOfSubjects - 1; k++) {
      // storing the student subjects in array
      subjects.push(pdf.Pages[j].Texts[index + numberOfSubjects + k].R[0].T);
    }
    // TODO constructing the students data.
    const individualStudentData = {
      id: registerNumber,
      registerNumber: registerNumber,
      firstName: firstName,
      lastName: lastName,
      department: department,
      regulation: regulation,
      subjects: subjects,
    };

    //console.log(individualStudentData);
    // pushing the constructed student data into studentData
    studentData.push(individualStudentData);
    // console.log(pdf.Pages[j].Texts[index + numberOfSubjects].R[0].T);
  }
  //student data as per the Hall Ticket
  return studentData;
}
export default constructStudentDataFromPDF;
