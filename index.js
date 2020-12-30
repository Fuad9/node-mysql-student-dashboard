const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const mysqlConnection = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "password",
   database: "nodejsdb",
   multipleStatements: true,
});

mysqlConnection.connect((err) => {
   if (!err) {
      console.log("connected");
   } else {
      console.log("connection failed");
   }
});

app.listen(3000);

/*to get all students =================== */
app.get("/student", (req, res) => {
   mysqlConnection.query("SELECT * FROM student", (err, rows, fields) => {
      if (!err) {
         // console.log(rows[0].sid);
         res.send(rows);
      } else {
         console.log(err);
      }
   });
});

/*to get a specific student =================== */
app.get("/student/:id", (req, res) => {
   mysqlConnection.query(
      "SELECT * FROM student WHERE sid = ?",
      [req.params.sid],
      (err, rows, fields) => {
         if (!err) {
            res.send(rows);
         } else {
            console.log(err);
         }
      }
   );
});

/*to delete specific student ==================== */
app.delete("/student/:sid", (req, res) => {
   mysqlConnection.query(
      "DELETE FROM student WHERE sid = ?",
      [req.params.sid],
      (err, rows, fields) => {
         if (!err) {
            res.send("deleted successfully");
         } else {
            console.log(err);
         }
      }
   );
});

/* to insert a student data =====================*/
app.post("/student", (req, res) => {
   let std = req.body;

   let sql =
      "SET @sid = ?; SET @name = ?; SET @semester = ?; SET @branch = ?; \
   CALL StudentAddOrEdit(@sid, @name, @semester, @branch);";

   mysqlConnection.query(
      sql,
      [std.sid, std.name, std.semester, std.branch],
      (err, rows, fields) => {
         if (!err) {
            rows.forEach((element) => {
               if (element.constructor === Array)
                  res.send("successfully inserted student id: " + element[0].sid);
            });
         } else {
            console.log(err);
         }
      }
   );
});

/* to update a student data =====================*/
app.put("/student", (req, res) => {
   let std = req.body;

   let sql =
      "SET @sid = ?; SET @name = ?; SET @semester = ?; SET @branch = ?; \
   CALL StudentAddOrEdit(@sid, @name, @semester, @branch);";

   mysqlConnection.query(
      sql,
      [std.sid, std.name, std.semester, std.branch],
      (err, rows, fields) => {
         if (!err) {
            res.send("updated successfully");
         } else {
            console.log(err);
         }
      }
   );
});
