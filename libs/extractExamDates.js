//Function for Exame date PDF's
async function constructExamDatesFromPDF(pdf) {
  let dates_object = {};
  //Object for Forenoon session exams with F.N key
  let Forenoon_exam = {};
  //Object for Afternoon session exams with A.N key
  let afternoon_exam = {};
  let i, j;
  for (j = 0; j < pdf.Pages.length; j++) {
    //Count variable to getting number of exam from each pdf page
    let count = 0;
    for (i = 0; i <= pdf.Pages[j].Texts.length - 1; i++) {
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
        let init = i + count + 1;
        let total = i + count + count;
        let date = i + count + count + 1;
        let session = i + count + count + count + 3;
        for (let sub = init; sub <= total; sub++) {
          let arr = [];
          let sorted_array = [];
          //Conditional statement for set the values of A.N exams in afternoon object
          if (pdf.Pages[j].Texts[session].R[0].T === "A.N.") {
            let date_data = pdf.Pages[j].Texts[date].R[0].T;
            if (afternoon_exam[date_data]) {
              afternoon_exam[date_data] =
                afternoon_exam[date_data] +
                "," +
                pdf.Pages[j].Texts[sub].R[0].T;
              arr = afternoon_exam[date_data].split(",");
            } else {
              arr.push(pdf.Pages[j].Texts[sub].R[0].T);
            }
            //eliminating the dublicates in array
            sorted_array = Array.from(new Set(arr));
            afternoon_exam[date_data] = sorted_array;
            date = date + 1;
            session = session + 1;
          }
          //Conditional statement for set the values of F.N exams in forenoon object
          else {
            let date_data = pdf.Pages[j].Texts[date].R[0].T;
            let k = 0;
            if (Forenoon_exam[date_data]) {
              Forenoon_exam[date_data] =
                Forenoon_exam[date_data] +
                "," +
                pdf.Pages[j].Texts[sub + k].R[0].T;
              arr = Forenoon_exam[date_data].split(",");
            } else {
              //eliminating the dublicates in array
              arr.push(pdf.Pages[j].Texts[sub + k].R[0].T);
            }
            sorted_array = Array.from(new Set(arr));
            Forenoon_exam[date_data] = sorted_array;
            date = date + 1;
            session = session + 1;
          }
        }
      }
    }
    // const TimeTable={
    //     department:department,
    //     date:dict_data
    // }
    //time_table.push(TimeTable);
  }
  dates_object["foreNoon"] = Forenoon_exam;
  dates_object["afterNoon"] = afternoon_exam;
  return dates_object;
  // fs.writeFile(
  //     path.join(__dirname,"output_files","examDates.json"),
  //     JSON.stringify(dict_data),
  //     (err,data) =>
  //     {
  //         if (err) throw Error(err);
  //         console.log('Data Created')
  //     }
  // );
  // process.on('error',err=>{
  //     console.error(`Error:${err}`);
  //     process.exit(1);
  // });
}
export default constructExamDatesFromPDF;
