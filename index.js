import PDFParser from "pdf2json";
import { PDFDocument } from "pdf-lib";
import constructStudentDataFromHallTicket from "./libs/StudentHallTicketExtract.js";
import constructSubjectName from "./libs/SubjectNameForSubjectCode.js";
import constructExamDatesFromPDF from "./libs/extractExamDates.js";

class Schedule {
  async getStudentInfo(files) {
    const pdfParser = new PDFParser();
    const studentBufferData = await mergeFunction(files);

    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", async (pdfData) => {
        try {
          const dataOfStudent = await constructStudentDataFromHallTicket(
            pdfData
          );
          pdfParser.removeAllListeners();
          resolve(dataOfStudent);
        } catch (err) {
          pdfParser.removeAllListeners();
          reject(err);
        }
      });

      pdfParser.on("pdfParser_dataError", (errData) => {
        pdfParser.removeAllListeners();
        reject(errData);
      });

      pdfParser.parseBuffer(studentBufferData);
    });
  }

  async getExamSchedule(files) {
    const pdfParser = new PDFParser();
    const datesBufferData = await mergeFunction(files);

    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", async (pdfData) => {
        try {
          const datesOfExam = await constructExamDatesFromPDF(pdfData);
          const subjectName = await constructSubjectName(pdfData);
          pdfParser.removeAllListeners();
          resolve({ ...datesOfExam, SubjectName: subjectName });
        } catch (err) {
          pdfParser.removeAllListeners();
          reject(err);
        }
      });

      pdfParser.on("pdfParser_dataError", (errData) => {
        pdfParser.removeAllListeners();
        reject(errData);
      });

      pdfParser.parseBuffer(datesBufferData);
    });
  }
}

async function mergeFunction(files) {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const pdf = await PDFDocument.load(file.buffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  return mergedPdfBytes;
}

export default Schedule;
