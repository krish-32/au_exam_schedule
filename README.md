# 📘 au_exam_schedule

`au_exam_schedule` is a Node.js package designed to extract student details and exam schedules from **Anna University** hall ticket PDFs and exam schedule PDFs. It simplifies the process of parsing large volumes of academic PDF data into usable JavaScript objects.

---

## 🚀 Installation

Install the package via npm:

```bash
npm install au_exam_schedule
```

## 🔧 Usage

### 1. Import and Initialize

```js
import Schedule from "au_exam_schedule";
const schedule = new Schedule();
```

---

### 2. Extract Student Data from Hall Ticket PDFs

Pass an array of PDF buffers (hall ticket files) to the `getStudentInfo` function. This returns an array of student information objects containing:

- `registerNumber`: student registration number
- `firstname`: student first name
- `lastname`: student last name
- `department`: student's department
- `subjects`: list of subjects

```js
// 'files' must be an array of { buffer: <Buffer> } objects
const studentInfo = await schedule.getStudentInfo(files);
console.log(studentInfo);

// Returns an object like:
[
  {
    registerNumber: "xxxxxxxx0323",
    firstname: "Gokul",
    lastname: "M",
    department: "CSE",
    subjects: [
      /* subject list */
    ],
  },
  /* more student data */
];
```

---

### 3. Extract Exam Dates and Subject Names from PDFs

Pass an array of PDF buffers (exam schedule files) to the `getExamSchedule` function. This returns an object containing:

- `examDates`: a list of exam dates
- `subjectNames`: a mapping of subject codes to subject names

```js
// 'files' must be an array of { buffer: <Buffer> } objects
const examInfo = await schedule.getExamSchedule(files);
console.log(examInfo);

// Returns an object like:
{
  examDates: [ /* date list */ ],
  SubjectName: {
    "CODE101": "Mathematics",
    "CODE102": "Physics",
    ...
  }
}
```

---

### 📝 Notes

- This package is specifically designed for Anna University hall ticket and exam schedule PDFs.
- Supports processing multiple PDF files for comprehensive extraction of student and exam data.
- It is recommended (but not required) to use server-side rendering to generate the PDFs for the exam schedule and student info, as it can provide better control and consistency.
