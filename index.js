

     // add comment on line no. 1
     // add comment on line no. 2
     const express = require("express");
     const app = express();
     const cors = require("cors");
     const mysql = require("mysql2");
     const bodyParser = require("body-parser");
     const jwt = require("jsonwebtoken");
     const bcrypt = require("bcrypt");
     const authMiddleware = require('./authMiddleware')
     const dayjs = require("dayjs");
     const webPush = require('web-push');


     require("dotenv").config();

     var corsOptions = {
       origin: ['https://empmgt.base2brand.com', 'https://empadmin.base2brand.com'],
       methods: ["GET", "POST", "PUT", "DELETE"],
       credentials: true,
       optionsSuccessStatus: 200
     };


     app.use(cors(corsOptions));
     app.use(bodyParser.json());
     app.use(express.json());

     const server = app.listen(6000, () => {
       console.log("server is running on 6000 ");
     });

     io = require("socket.io")(server, {
       cors: {
         origin: ['https://empadmin.base2brand.com', 'https://empmgt.base2brand.com'],
         methods: ["GET", "POST", "PUT", "DELETE"],
         allowedHeaders: ["my-custom-header"],
         credentials: true
       },
     });

     io.on("connection", (socket) => {
       console.log("connected and socket is :", socket.id);
     });

     const db = mysql.createConnection({
       user: "employee_management_DB",
       host: "localhost",
       password: "techbase2brand",
       database: "employee_management_db",
     });


     // new  testing



    //  const express = require("express");
    //  const app = express();
    //  const cors = require("cors");
    //  const mysql = require("mysql2");
    //  const bodyParser = require("body-parser");
    //  const jwt = require("jsonwebtoken");
    //  const bcrypt = require("bcrypt");
    //  const authMiddleware = require('./authMiddleware');
    //  const dayjs = require("dayjs");
    //  const webPush = require('web-push')


    //  app.use(bodyParser.json());
    //  app.use(cors({ origin: true, credentials: true }));
    //  app.use(express.json());

    //  require("dotenv").config();

    //  const server = app.listen(5000, () => {
    //    console.log("server is running on 5000 ");
    //  });


    //  io = require("socket.io")(server, {
    //    cors: {
    //      origin: "*",
    //    },
    //  });

    //  io.on("connection", (socket) => {
    //    console.log("connected and socket is :", socket.id);
    //  });

    //  const db = mysql.createConnection({
    //    user: "root",
    //    host: "localhost",
    //    password: "",
    //    // password: "base2brand",
    //    database: "employee_managementttt",
    //    // database: "taskmanagerdb",
    //  });


     // Generate VAPID keys
     const vapidKeys = webPush.generateVAPIDKeys();
     const publicKey = vapidKeys.publicKey;
     const privateKey = vapidKeys.privateKey;

     console.log('VAPID Public Key:', publicKey);
     console.log('VAPID Private Key:', privateKey);

     // Set VAPID details
     const vapidEmail = 'mailto:your-email@example.com'; // Replace with your contact email
     webPush.setVapidDetails(vapidEmail, publicKey, privateKey);

     // Prepare the notification payload
     const notificationPayload = JSON.stringify({
       title: 'Notification Title',
       message: 'This is a push notification from your server!',
     });

     // Your code to send the notification goes here (not included in this example)


     // authMiddleware,

     app.get("/get/admin",  (req, res) => {
       try {
         db.query("SELECT * FROM userlogin", (error, results, fields) => {
           if (error) throw error;
           res.json(results);
           console.log(results);
         });
       } catch (e) {
         console.error(e);
         res.status(500).send({ message: 'Database Error' });
       }
     });


     app.post("/create", async (req, res) => {
       const {
         email,
         EmployeeID,
         password,
         firstName,
         lastName,
         jobPosition,
         phone,
         permanentaddress,
         currentAddress,
         dob,
         role,
         parentPhone,
         doj,
         bloodGroup,
         highestQualification,

       } = req.body;

       // Check if email or EmployeeID already exists
       db.query(
         "SELECT * FROM addemployee WHERE email = ? OR EmployeeID = ?",
         [email, EmployeeID],
         async (error, results) => {
           if (error) throw error;
           if (results.length > 0) {
             res.status(400).send("Email or Employee ID already exists");
           } else {
             // If no existing email or EmployeeID, proceed with creating
             const salt = await bcrypt.genSalt(10); // 10 is the number of rounds
             const hashedPassword = await bcrypt.hash(password, salt);
             db.query(
               "INSERT INTO addemployee (firstName, lastName, jobPosition, email, phone, permanentaddress, currentAddress, dob, role, parentPhone, EmployeeID, password, confirmPassword, doj, bloodGroup, highestQualification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
               [
                 firstName,
                 lastName,
                 jobPosition,
                 email,
                 phone,
                 permanentaddress,
                 currentAddress,
                 dob,
                 role,
                 parentPhone,
                 EmployeeID,
                 hashedPassword, // use hashed password
                 hashedPassword,
                 doj,
                 bloodGroup,
                 highestQualification,
               ],
               (err, result) => {
                 if (err) {
                   console.log(err, "lll");
                 } else {
                   res.send("Value inserted");
                 }
               }
             );
           }
         }
       );
     });



     app.post("/createLeave" , (req, res) => {
       // console.log("ASDFGHJKL;JGFDGG");
       const employeeName = req.body.employeeName;
       const startDate = req.body.startDate;
       const endDate = req.body.endDate;
       const leaveType = req.body.leaveType;
       const leaveReason = req.body.leaveReason;
       const teamLead = req.body.teamLead;
       const employeeID = req.body.employeeID;
       const adminID = req.body.adminID;
       const approvalOfTeamLead = req.body.approvalOfTeamLead;
       const approvalOfHR = req.body.approvalOfHR;
       const leaveCategory = req.body.leaveCategory;
       db.query(
         "INSERT INTO leaveinfo (employeeName, startDate, endDate, leaveType, leaveReason, teamLead, employeeID, adminID , approvalOfTeamLead , approvalOfHR , leaveCategory) VALUES (?,?,?,?,?,?,?,? ,? ,? ,?)",
         [
           employeeName,
           startDate,
           endDate,
           leaveType,
           leaveReason,
           teamLead,
           employeeID,
           adminID,
           approvalOfTeamLead,
           approvalOfHR,
           leaveCategory,
         ],
         (err, result) => {
           if (err) {
             console.log(err);
           } else {
             res.send("Leave data inserted");
           }
         }
       );
     });



     app.get("/get/leaveinfo", (req, res) => {
       db.query("SELECT * FROM leaveinfo", (error, results, fields) => {
         if (error) throw error;
         res.json(results);
       });
     });
     // Approve leave
     app.put("/approveLeave/:LeaveInfoID",  (req, res) => {
       const LeaveInfoID = req.params.LeaveInfoID;
       console.log("approved console");
       db.query(
         "UPDATE leaveinfo SET approvalOfTeamLead = 'approved' WHERE LeaveInfoID = ?",
         [LeaveInfoID],
         (err, result) => {
           if (err) {
             console.log(err);
           } else {
             res.send("Leave data approved");
           }
         }
       );
     });


     // app.put("/approveShiftChangeTL/:LeaveInfoID",  (req, res) => {
     // console.log("chl ja bhaiiiiiiii----");
     //   // const LeaveInfoID = req.params.LeaveInfoID;
     //   // console.log("approved console");
     //   // db.query(
     //   //   "UPDATE leaveinfo SET approvalOfTeamLead = 'approved' WHERE LeaveInfoID = ?",
     //   //   [LeaveInfoID],
     //   //   (err, result) => {
     //   //     if (err) {
     //   //       console.log(err);
     //   //     } else {
     //   //       res.send("Leave data approved");
     //   //     }
     //   //   }
     //   // );
     // });


     // Deny leave
     app.put("/denyLeave/:LeaveInfoID", (req, res) => {

       const LeaveInfoID = req.params.LeaveInfoID;
       db.query(
         "UPDATE leaveinfo SET approvalOfTeamLead = 'denied' WHERE LeaveInfoID = ?",
         [LeaveInfoID],
         (err, result) => {
           if (err) {
             console.log(err);
           } else {
             res.send("Leave data denied");
           }
         }
       );
     });


     app.put("/approveShiftChangeTL/:ShiftChangeTableID", (req, res) => {

       const ShiftChangeTableID = req.params.ShiftChangeTableID;
       db.query(
         "UPDATE shiftchangetable SET approvalOfTeamLead = 'approved' WHERE ShiftChangeTableID = ?",
         [ShiftChangeTableID],
         (err, result) => {
           if (err) {
             console.log(err);
           } else {
             res.send("Leave data approved");
             console.log("Leave data approved");
           }
         }
       );
     });


     app.put("/denyShiftChangeTL/:ShiftChangeTableID", (req, res) => {
       const ShiftChangeTableID = req.params.ShiftChangeTableID;
       console.log("approved consoleeeeepppee");

       db.query(
         "UPDATE shiftchangetable SET approvalOfTeamLead = 'denied' WHERE ShiftChangeTableID = ?",
         [ShiftChangeTableID],
         (err, result) => {
           if (err) {
             console.log(err);
           } else {
             res.send("Leave data denied");
           }
         }
       );
     });

     app.put("/approveLeaveHR/:LeaveInfoID", (req, res) => {
       const LeaveInfoID = req.params.LeaveInfoID;
       // console.log("approved console");
       db.query(
         "UPDATE leaveinfo SET approvalOfHR = 'approved' WHERE LeaveInfoID = ?",
         [LeaveInfoID],
         (err, result) => {
           if (err) {
             console.log(err);
           } else {
             res.send("Leave data approved");
           }
         }
       );
     });

     app.put("/denyLeaveHR/:LeaveInfoID",   (req, res) => {
       const LeaveInfoID = req.params.LeaveInfoID;
       db.query(
         "UPDATE leaveinfo SET approvalOfHR = 'denied' WHERE LeaveInfoID = ?",
         [LeaveInfoID],
         (err, result) => {
           if (err) {
             console.log(err);
           } else {
             res.send("Leave data denied");
           }
         }
       );
     });

     app.put("/denyShiftChangeHR/:ShiftChangeTableID",  (req, res) => {
       const ShiftChangeTableID = req.params.ShiftChangeTableID;
       db.query(
         "UPDATE shiftchangetable SET approvalOfHR = 'denied' WHERE ShiftChangeTableID = ?",
         [ShiftChangeTableID],
         (err, result) => {
           if (err) {
             console.log(err);
           } else {
             res.send("Shift Change denied");
           }
         }
       );
     });

     app.put("/approveShiftChangeHR/:ShiftChangeTableID", (req, res) => {
       const ShiftChangeTableID = req.params.ShiftChangeTableID;
       db.query(
         "UPDATE shiftchangetable SET approvalOfHR = 'approved' WHERE ShiftChangeTableID = ?",
         [ShiftChangeTableID],
         (err, result) => {
           if (err) {
             console.log(err);
           } else {
             res.send("Shift Change approved");
           }
         }
       );
     });

     app.get("/employees", (req, res) => {
       db.query("SELECT * FROM addemployee", (error, results, fields) => {
         if (error) throw error;
         res.json(results);
       });
     });


     app.post("/user/login", (req, res) => {
       const { email, password } = req.body;

       if (email && password) {
         db.query(
           "SELECT * FROM addemployee WHERE email = ?",
           [email],
           async (error, results) => {
             if (error) throw error;

             if (results?.length > 0) {
             console.log(results,"results");

               const comparison = await bcrypt.compare(password, results[0].password);

               if (comparison) {
                 // create a token
                 const token = jwt.sign(
                   { id: results[0].id },
                   process.env.JWT_SECRET,
                   { expiresIn: "30d" }
                 );

                 // Verify and log the token
                 try {
                   var decoded = jwt.verify(token, process.env.JWT_SECRET);
                   console.log(decoded);
                 } catch(err) {
                   console.log(err);
                 }

                 // send the user's information along with the token
                 res.json({ user: results[0], token });
               } else {
                 res.send("Invalid username or password");
               }
             } else {
               res.send("Invalid username or password");
             }
           }
         );
       } else {
         res.send("Username and password are required");
       }
     });

     app.post("/user/info", (req, res) => {
       console.log(req.body, "kk-jjjj----");
       const { email, password } = req.body.values;
       console.log(email, password, "777---");
       if (email && password) {
         db.query(
           "SELECT * FROM addemployee WHERE email = ? AND password = ?",
           [email, password],
           (error, results) => {
             if (error) throw error;
             console.log(results, "ll---");
             if (results?.length > 0) {
               res.send(results);

               console.log("00---999");
             } else {
               res.send("Invalid username or password");
             }
           }
         );
       } else {
         res.send("Username and password are required");
       }
     });

     app.post("/login", (req, res) => {
       const { email, password } = req.body;

       if (email && password) {
         db.query(
           "SELECT * FROM userlogin WHERE email = ?",
           [email],
           (error, results) => {
             if (error) {
               console.error(error);
               res.status(500).send("Server error");
               return;
             }

             if (results.length > 0) {
               const hashedPasswordFromDb = results[0].password;
               console.log(`Hashed password from DB: ${hashedPasswordFromDb}`);
               console.log(`Plain password from client: ${password}`);

               // Replace '$2y$' with '$2a$' in the hashed password
               const modifiedHashedPassword = hashedPasswordFromDb.replace('$2y$', '$2a$');

               bcrypt.compare(password, modifiedHashedPassword, function(err, isMatch) {
                 console.log(`Bcrypt comparison result: ${isMatch}`);

                 if (err) {
                   console.error(err);
                   res.status(500).send("Server error");
                   return;
                 } else if (!isMatch) {
                   res.status(401).send("Invalid username or password");
                   return;
                 } else {
                   const token = jwt.sign(
                     { id: results[0].id },
                     process.env.JWT_SECRET,
                     { expiresIn: "30d" }
                   );

                   res.json({
                     user: {
                       email: results[0].email,
                       adminID: results[0].adminID,
                       adminName: results[0].adminName,
                       role: results[0].Role,
                     },
                     token
                   });
                 }
               });
             } else {
               res.status(401).send("Invalid username or password");
             }
           }
         );
       } else {
         res.status(400).send("Username and password are required");
       }
     });





     // app.post("/login", (req, res) => {
     //   const { email, password } = req.body;
     //   if (email && password) {
     //     db.query(
     //       "SELECT * FROM userlogin WHERE email = ? AND password = ?",
     //       [email, password],
     //       (error, results) => {
     //         if (error) throw error;
     //         if (results?.length > 0) {
     //           // create a token
     //           const token = jwt.sign(
     //             { id: results[0].id },
     //             process.env.JWT_SECRET,
     //             { expiresIn: "30d" }
     //           );

     //           // send the user's information and the token separately
     //           res.json({
     //             user: {
     //               email: results[0].email,
     //               adminID: results[0].adminID,
     //               adminName: results[0].adminName,
     //             },
     //             token
     //           });
     //         } else {
     //           res.send("Invalid username or password");
     //         }
     //       }
     //     );
     //   } else {
     //     res.send("Username and password are required");
     //   }
     // });




     app.delete("/users/:id", (req, res) => {
       console.log(req?.params, "888--");
       const EmpID = req.params.id;
       const query = "DELETE FROM addemployee WHERE EmpID = ?";

       db.query(query, [EmpID], (err, results, fields) => {
         if (err) throw err;
         res.send(`User with ID ${EmpID} has been deleted`);
       });
     });

     app.put("/update/:id", (req, res) => {
       console.log(req.params, "888--");
       const EmpID = req.params.id;
       const { firstName, lastName, email } = req.body;
       const query =
         "UPDATE addemployee SET firstName = ?, lastName = ?, email = ? WHERE EmpID = ?";

       db.query(
         query,
         [firstName, lastName, email, EmpID],
         (err, results, fields) => {
           if (err) throw err;
           res.send(`User with ID ${EmpID} has been updated`);
         }
       );
     });

     app.put("/employeeUpdate/:id", (req, res) => {
       const EmpID = req.params.id;
       const {
         firstName,
         lastName,
         jobPosition,
         email,
         phone,
         permanentaddress,
         currentAddress,
         dob,
         role,
         parentPhone,
         EmployeeID,
         doj,
         bloodGroup,
         highestQualification,
       } = req.body;

       // Check if email or EmployeeID already exists in another record
       db.query(
         "SELECT * FROM addemployee WHERE (email = ? OR EmployeeID = ?) AND EmpID != ?",
         [email, EmployeeID, EmpID],
         (error, results) => {
           if (error) throw error;
           if (results.length > 0) {
             res.status(400).send("Email or Employee ID already exists");
           } else {
             // If no existing email or EmployeeID in other records, proceed with update
             db.query(
               "UPDATE addemployee SET firstName = ?, lastName = ?, jobPosition = ?, email = ?, phone = ?, permanentaddress = ?, currentAddress = ?, dob = ?, role = ?, parentPhone = ?, EmployeeID = ?, doj = ?, bloodGroup = ?, highestQualification = ? WHERE EmpID = ?",
               [
                 firstName,
                 lastName,
                 jobPosition,
                 email,
                 phone,
                 permanentaddress,
                 currentAddress,
                 dob,
                 role,
                 parentPhone,
                 EmployeeID,
                 doj,
                 bloodGroup,
                 highestQualification,
                 EmpID,
               ],
               (err, results, fields) => {
                 if (err) throw err;
                 res.send(`User with ID ${EmpID} has been updated`);
               }
             );
           }
         }
       );
     });


     app.put("/employeeUpdateStatus/:id", (req, res) => {
      const EmpID = req.params.id;
      const { status } = req.body;

      // Update only the status column for the specific employee
      db.query(
        "UPDATE addemployee SET status = ? WHERE EmpID = ?",
        [status, EmpID],
        (err, results, fields) => {
          if (err) throw err;
          res.send(`User status with ID ${EmpID} has been updated`);
        }
      );
    });







     app.put("/updateProject/:id", (req, res) => {
       console.log('vvvvvvvvvvv');
       const ProID = req.params.id;

       console.log(req.params.id,"ssdddfffggghhh======");
       const { clientName, projectName, projectDescription } = req.body;

       // Store the old project name before update
       let oldProjectName;

       // Start a transaction
       db.beginTransaction((err) => {
         if (err) {
           console.error(err);
           res.status(500).send("Internal Server Error");
           return;
         }

         // Get the old project name
       // Get the old project name
     db.query(
       "SELECT projectName FROM projects WHERE ProID = ?",
       [ProID],
       (err, result) => {
         if (err) {
           console.error(err);
           db.rollback(() => {
             res.status(500).send("Internal Server Error");
           });
           return;
         }

         oldProjectName = result[0]?.projectName;

         // If the project name is being updated, check if the new name already exists
         if (projectName !== oldProjectName) {
           db.query(
             "SELECT COUNT(*) as count FROM projects WHERE projectName = ?",
             [projectName],
             (err, result) => {
               if (err) {
                 console.error(err);
                 db.rollback(() => {
                   res.status(500).send("Internal Server Error");
                 });
                 return;
               }

               const count = result[0].count;
               if (count > 0) {
                 db.rollback(() => {
                   res.status(409).send("Project with same name already exists");
                 });
                 return;
               }

               // Continue with the update of the project
               updateProject();
             }
           );
         } else {
           // Continue with the update of the project
           updateProject();
         }
       }
     );

     const updateProject = () => {
       const query =
         "UPDATE projects SET clientName = ?, projectName = ?, projectDescription = ? WHERE ProID = ?";

       db.query(
         query,
         [clientName, projectName, projectDescription, ProID],
         (err, results, fields) => {
           if (err) {
             console.error(err);
             db.rollback(() => {
               res.status(500).send("Internal Server Error");
             });
             return;
           }

           db.commit(err => {
             if (err) {
               console.error(err);
               db.rollback(() => {
                 res.status(500).send("Internal Server Error");
               });
               return;
             }

             res.send("Project updated successfully"); // Send a response back to the client
           });
         }
       );
     };


       });
     });

     app.put("/updatePhase/:id", (req, res) => {
       console.log(req.params, "888--");
       const ProID = req.params.id;
       const { clientName, projectName, projectDescription } = req.body;

       const query =
         "UPDATE projects SET clientName = ?, projectName = ?, projectDescription = ? WHERE ProID = ?";

       db.query(
         query,
         [clientName, projectName, projectDescription, ProID], // add ProID parameter here
         (err, results, fields) => {
           if (err) throw err;
           res.send(`User with ID ${ProID} has been updated`);
         }
       );
     });

     app.put("/updateModule/:id", (req, res) => {
       console.log(req.params, "888--");
       const ProID = req.params.id;
       const { clientName, projectName, projectDescription } = req.body;

       const query =
         "UPDATE projects SET clientName = ?, projectName = ?, projectDescription = ? WHERE ProID = ?";

       db.query(
         query,
         [clientName, projectName, projectDescription, ProID], // add ProID parameter here
         (err, results, fields) => {
           if (err) throw err;
           res.send(`User with ID ${ProID} has been updated`);
         }
       );
     });

     app.post("/add/projects", (req, res) => {
       console.log(req.body, "----");
       const ProID = req.body.ProID;
       const clientName = req.body.clientName;
       const projectName = req.body.projectName;
       const projectDescription = req.body.projectDescription;

       // Check if projectName already exists
       db.query(
         "SELECT COUNT(*) as count FROM projects WHERE projectName = ?",
         [projectName],
         (err, result) => {
           if (err) {
             console.log(err, "lll");
             res.send("An error occurred");
           } else {
             const count = result[0].count;
             if (count > 0) {
               res.send("Project with same name already exists");
             } else {
               // Insert new project
               db.query(
                 "INSERT INTO projects (ProID, clientName, projectName, projectDescription) VALUES (?, ?, ?, ?)",
                 [ProID, clientName, projectName, projectDescription],
                 (err, result) => {
                   if (err) {
                     console.log(err, "lll");
                     res.send("An error occurred");
                   } else {
                     res.send("Project added successfully");
                   }
                 }
               );
             }
           }
         }
       );
     });

     app.get("/get/projects", (req, res) => {
       db.query("SELECT * FROM projects", (error, results, fields) => {
         if (error) throw error;
         res.json(results);
       });
     });

     // app.delete("/project/:id", (req, res) => {
     //   console.log(req?.params, "888--");
     //   const ProID = req.params.id;
     //   const query = "DELETE FROM projects WHERE ProID = ?";

     //   db.query(query, [ProID], (err, results, fields) => {
     //     if (err) throw err;
     //     res.send(`Project with ID ${ProID} has been deleted`);
     //   });
     // });

     // app.put("/update/project/:id", (req, res) => {
     //   console.log(req.params, "88844--");
     //   const ProID = req.params.id;
     //   const { clientName, projectName, projectDescription } = req.body;
     //   const query =
     //     "UPDATE projects SET clientName = ?, projectName =? , projectDescription = ? WHERE ProID = ?";

     //   db.query(
     //     query,
     //     [clientName, projectName, projectDescription, ProID],
     //     (err, results, fields) => {
     //       if (err) throw err;
     //       res.send(`Project with ID ${ProID} has been updated`);
     //     }
     //   );
     // });

     app.delete("/project/:projectName", (req, res) => {
       const projectName = req.params.projectName;
       console.log(req?.params?.projectName,"req?.params?.projectName");

       db.beginTransaction((err) => {
         if (err) {
           console.error(err);
           res.status(500).send("Internal Server Error");
           return;
         }

         db.query(
           "DELETE FROM projects WHERE projectName = ?",
           [projectName],
           (err, result) => {
             if (err) {
               console.error(err);
               db.rollback(() => {
                 res.status(500).send("Internal Server Error");
               });
               return;
             }

             db.query(
               "DELETE FROM phases WHERE projectName = ?",
               [projectName],
               (err, result) => {
                 if (err) {
                   console.error(err);
                   db.rollback(() => {
                     res.status(500).send("Internal Server Error");
                   });
                   return;
                 }

                 db.query(
                   "DELETE FROM modules WHERE projectName = ?",
                   [projectName],
                   (err, result) => {
                     if (err) {
                       console.error(err);
                       db.rollback(() => {
                         res.status(500).send("Internal Server Error");
                       });
                       return;
                     }

                     db.query(
                       "DELETE FROM addphaseassignee WHERE projectName = ?",
                       [projectName],
                       (err, result) => {
                         if (err) {
                           console.error(err);
                           db.rollback(() => {
                             res.status(500).send("Internal Server Error");
                           });
                           return;
                         }

                         db.query(
                           "DELETE FROM addmorningtask WHERE projectName = ?",
                           [projectName],
                           (err, result) => {
                             if (err) {
                               console.error(err);
                               db.rollback(() => {
                                 res.status(500).send("Internal Server Error");
                               });
                               return;
                             }

                             db.query(
                               "DELETE FROM addeveningtable WHERE projectName = ?",
                               [projectName],
                               (err, result) => {
                                 if (err) {
                                   console.error(err);
                                   db.rollback(() => {
                                     res.status(500).send("Internal Server Error");
                                   });
                                   return;
                                 }

                                 db.commit((err) => {
                                   if (err) {
                                     console.error(err);
                                     db.rollback(() => {
                                       res.status(500).send("Internal Server Error");
                                     });
                                     return;
                                   }

                                   res.status(200).send("OK");
                                 });
                               }
                             );
                           }
                         );
                       }
                     );
                   }
                 );
               }
             );
           }
         );
       });
     });


     // Helper function to avoid repetition
     // function rollbackAndSendError(err, db, res) {
     //   console.error(err);
     //   db.rollback(() => {
     //     res.status(500).send("Internal Server Error");
     //     db.release();
     //   });
     // }


     // app.post("/update/projectName", (req, res) => {
     //   const { oldProjectName, newProjectName } = req.body;

     //   db.beginTransaction((err) => {
     //     if (err) {
     //       console.error(err);
     //       res.status(500).send("Internal Server Error");
     //       return;
     //     }

     //     db.query(
     //       "UPDATE projects SET projectName = ? WHERE projectName = ?",
     //       [newProjectName, oldProjectName],
     //       (err, result) => {
     //         if (err) {
     //           console.error(err);
     //           db.rollback(() => {
     //             res.status(500).send("Internal Server Error");
     //             db.release();
     //           });
     //           return;
     //         }

     //         db.query(
     //           "UPDATE phases SET projectName = ? WHERE projectName = ?",
     //           [newProjectName, oldProjectName],
     //           (err, result) => {
     //             if (err) {
     //               console.error(err);
     //               db.rollback(() => {
     //                 res.status(500).send("Internal Server Error");
     //                 db.release();
     //               });
     //               return;
     //             }

     //             db.query(
     //               "UPDATE modules SET projectName = ? WHERE projectName = ?",
     //               [newProjectName, oldProjectName],
     //               (err, result) => {
     //                 if (err) {
     //                   console.error(err);
     //                   db.rollback(() => {
     //                     res.status(500).send("Internal Server Error");
     //                     db.release();
     //                   });
     //                   return;
     //                 }

     //                 db.query(
     //                   "UPDATE addphaseassignee SET projectName = ? WHERE projectName = ?",
     //                   [newProjectName, oldProjectName],
     //                   (err, result) => {
     //                     if (err) {
     //                       console.error(err);
     //                       db.rollback(() => {
     //                         res.status(500).send("Internal Server Error");
     //                         db.release();
     //                       });
     //                       return;
     //                     }

     //                     db.query(
     //                       "SELECT * FROM projects WHERE projectName = ?",
     //                       [newProjectName],
     //                       (err, result) => {
     //                         if (err) {
     //                           console.error(err);
     //                           db.rollback(() => {
     //                             res.status(500).send("Internal Server Error");
     //                             db.release();
     //                           });
     //                           return;
     //                         }

     //                         const updatedProject = result[0];

     //                         db.commit((err) => {
     //                           if (err) {
     //                             console.error(err);
     //                             db.rollback(() => {
     //                               res.status(500).send("Internal Server Error");
     //                               db.release();
     //                             });
     //                             return;
     //                           }

     //                           res.status(200).send(updatedProject);
     //                         });
     //                       }
     //                     );
     //                   }
     //                 );
     //               }
     //             );
     //           }
     //         );
     //       }
     //     );
     //   });
     // });

     app.post("/api/add-phase", (req, res) => {
       const { projectName, phases } = req.body;

       db.query(
         "SELECT * FROM phases WHERE projectName = ? AND phases IN (?)",
         [projectName, phases],
         (err, result) => {
           if (err) {
             console.error(err);
             res.status(500).send("Internal Server Error");
             return;
           }

           if (result.length > 0) {
             // data already exists, send error response
             res.status(400).send("This phase already exists for the project");
             return;
           }

           // data does not exist, proceed with insert
           db.beginTransaction((err) => {
             if (err) {
               console.error(err);
               res.status(500).send("Internal Server Error");
               return;
             }

             // loop through each phase and insert into the database
             const insertQueries = phases.map((phase) => {
               return new Promise((resolve, reject) => {
                 db.query(
                   "INSERT INTO phases (projectName, phases) VALUES (?, ?)",
                   [projectName, phase],
                   (err, result) => {
                     if (err) {
                       console.error(err);
                       reject(err);
                     } else {
                       resolve(result);
                     }
                   }
                 );
               });
             });

             Promise.all(insertQueries)
               .then(() => {
                 db.commit((err) => {
                   if (err) {
                     console.error(err);
                     db.rollback(() => {
                       res.status(500).send("Internal Server Error");
                       db.release();
                     });
                   } else {
                     res.status(200).send("OK");
                     // db.release();
                   }
                 });
               })
               .catch((err) => {
                 console.error(err);
                 db.rollback(() => {
                   res.status(500).send("Internal Server Error");
                   db.release();
                 });
               });
           });
         }
       );
     });


     app.put("/update/phase/:id", (req, res) => {
       console.log(req.params, "888gggg--");
       const phaseID = req.params.id;
       const { projectName, phases } = req.body;
       const query = "UPDATE phases SET projectName=?, phases=? WHERE phaseID=?";

       // Check if the updated projectName and phases already exist
       db.query(
         "SELECT * FROM phases WHERE projectName = ? AND phases IN (?) AND phaseID <> ?",
         [projectName, phases, phaseID],
         (err, result) => {
           if (err) {
             console.error(err);
             res.status(500).send("Internal Server Error");
             return;
           }

           if (result.length > 0) {
             // data already exists, send error response
             res.status(400).send("This combination already exists");
             return;
           }

           // data does not exist, proceed with update
           db.query(
             query,
             [projectName, phases, phaseID],
             (err, results, fields) => {
               if (err) {
                 console.error(err);
                 res.status(500).send("Internal Server Error");
                 return;
               }
               res.send("OK");
               // res.send(`Project with ID ${phaseID} has been updated`);
             }
           );
         }
       );
     });

     app.put("/api/update-phase/:id", (req, res) => {
       console.log(req.body, "kkk--");
       const phaseID = req.params.id;

       const { projectName, phases } = req.body;

       let oldProjectName;
       let oldPhaseName;

       db.beginTransaction((err) => {
         if (err) {
           console.error(err);
           res.status(500).send("Internal Server Error");
           return;
         }

         db.query(
           "SELECT projectName, phases FROM phases WHERE phaseID = ?",
           [phaseID],
           (err, result) => {
             if (err) {
               console.error(err);
               db.rollback(() => {
                 res.status(500).send("Internal Server Error");
               });
               return;
             }

             oldProjectName = result[0]?.projectName;
             oldPhaseName = result[0]?.phases;

             // Check if combination of projectName and phases exists
             db.query(
               "SELECT * FROM phases WHERE projectName = ? AND phases = ? AND phaseID != ?",
               [projectName, phases, phaseID],
               (err, result) => {
                 if (err) {
                   console.error(err);
                   db.rollback(() => {
                     res.status(500).send("Internal Server Error");
                   });
                   return;
                 }

                 if (result.length > 0) {
                   res.status(400).send("This combination of projectName and phases already exists.");
                   return;
                 }

                 const query = "UPDATE phases SET projectName = ?, phases = ? WHERE phaseID = ?";
                 db.query(query, [projectName, phases, phaseID], (err, results, fields) => {
                   if (err) {
                     console.error(err);
                     db.rollback(() => {
                       res.status(500).send("Internal Server Error");
                     });
                     return;
                   }

                   const tables = ['modules', 'addmorningtask', 'addeveningtable', 'addphaseassignee'];
                   const updateTable = (index) => {
                     if (index >= tables.length) {
                       db.commit((err) => {
                         if (err) {
                           console.error(err);
                           db.rollback(() => {
                             res.status(500).send("Internal Server Error");
                           });
                           return;
                         }
                         res.status(200).send("OK");
                       });
                       return;
                     }

                     const table = tables[index];
                     db.query(
                       `UPDATE ${table} SET phaseName = ? WHERE phaseName = ? AND projectName = ?`,
                       [phases, oldPhaseName, oldProjectName],
                       (err, result) => {
                         if (err) {
                           console.error(err);
                           if (err.code === 'ER_BAD_FIELD_ERROR') {
                             updateTable(index + 1);
                           } else {
                             db.rollback(() => {
                               res.status(500).send("Internal Server Error");
                             });
                           }
                           return;
                         }
                         updateTable(index + 1);
                       }
                     );
                   };

                   updateTable(0);
                 });
               }
             );
           }
         );
       });
     });






     app.put("/update/module/:id", (req, res) => {
       const modID = req.params.id;
       const { projectName, phaseName, modules } = req.body;

       db.beginTransaction((err) => {
         if (err) {
           console.error(err);
           res.status(500).send("Internal Server Errror");
           return;
         }

         // Check if combination of projectName, phaseName, and module exists
         db.query(
           "SELECT * FROM modules WHERE projectName = ? AND phaseName = ? AND modules = ? AND modID != ?",
           [projectName, phaseName, modules, modID],
           (err, result) => {
             if (err) {
               console.error(err);
               db.rollback(() => {
                 res.status(500).send("Internal Server Error");
               });
               return;
             }

             if (result.length > 0) {
               res.status(400).send("This combination of projectName, phaseName and module already exists.");
               return;
             }

             // If the combination doesn't exist, then update the module
             db.query(
               "UPDATE modules SET modules = ? WHERE modID = ?",
               [modules, modID],
               (err, result) => {
                 if (err) {
                   console.error(err);
                   db.rollback(() => {
                     res.status(500).send("Internal Server Error");
                   });
                   return;
                 }

                 const tables = ['addmorningtask', 'addeveningtable'];
                 const updateTable = (index) => {
                   if (index >= tables.length) {
                     db.commit((err) => {
                       if (err) {
                         console.error(err);
                         db.rollback(() => {
                           res.status(500).send("Internal Server Error");
                         });
                         return;
                       }
                       res.status(200).send("OK");
                     });
                     return;
                   }

                   const table = tables[index];
             const oldModule = result[0]?.modules;

                   db.query(
                     `UPDATE ${table} SET module = ? WHERE module = ? AND projectName = ? AND phaseName = ?`,
                     [modules, oldModule, projectName, phaseName],
                     (err, result) => {
                       if (err) {
                         console.error(err);
                         if (err.code === 'ER_BAD_FIELD_ERROR' || err.code === 'ER_NO_SUCH_TABLE') {
                           // Continue with the next table if this table does not contain the relevant fields or does not exist
                           updateTable(index + 1);
                         } else {
                           db.rollback(() => {
                             res.status(500).send("Internal Server Error");
                           });
                         }
                         return;
                       }

                       // Updated successfully, move to the next table
                       updateTable(index + 1);
                     }
                   );
                 };

                 // Start updating the tables
                 updateTable(0);
               }
             );
           }
         );
       });
     });




     app.get("/get/phases", (req, res) => {
       db.query("SELECT * FROM phases", (error, results, fields) => {
         if (error) throw error;
         res.json(results);
       });
     });

     app.delete("/api/delete-phase/:id", (req, res) => {
       console.log(req.body, "kkk--");
       const phaseID = req.params.id;

       // Store the project name and phase name before deletion
       let projectName;
       let phaseName;

       // Start a transaction
       db.beginTransaction((err) => {
         if (err) {
           console.error(err);
           res.status(500).send("Internal Server Error");
           return;
         }

         // Get the project name and phase name
         db.query(
           "SELECT projectName, phases FROM phases WHERE phaseID = ?",
           [phaseID],
           (err, result) => {
             if (err) {
               console.error(err);
               db.rollback(() => {
                 res.status(500).send("Internal Server Error");
               });
               return;
             }

             projectName = result[0]?.projectName;
             phaseName = result[0]?.phases;

             // Start with the deletion of the phase from the 'phases' table
             const query = "DELETE FROM phases WHERE phaseID = ?";

             db.query(query, [phaseID], (err, results, fields) => {
               if (err) {
                 console.error(err);
                 db.rollback(() => {
                   res.status(500).send("Internal Server Error");
                 });
                 return;
               }

               // List of tables to delete from
               const tables = ['modules', 'addmorningtask', 'addeveningtable', 'addphaseassignee'];
               const deleteFromTable = (index) => {
                 if (index >= tables.length) {
                   // Done deleting, commit the transaction
                   db.commit((err) => {
                     if (err) {
                       console.error(err);
                       db.rollback(() => {
                         res.status(500).send("Internal Server Error");
                       });
                       return;
                     }

                     res.status(200).send("Deletion OK");
                   });
                   return;
                 }

                 const table = tables[index];
                 db.query(
                   `DELETE FROM ${table} WHERE phaseName = ? AND projectName = ?`,
                   [phaseName, projectName],
                   (err, result) => {
                     if (err) {
                       console.error(err);
                       if (err.code === 'ER_BAD_FIELD_ERROR') {
                         // Continue with the next table if this table does not contain the relevant fields
                         deleteFromTable(index + 1);
                       } else {
                         // If other error, rollback the transaction
                         db.rollback(() => {
                           res.status(500).send("Internal Server Error");
                         });
                       }
                       return;
                     }

                     // Continue with the next table
                     deleteFromTable(index + 1);
                   }
                 );
               };

               // Start deleting from the tables
               deleteFromTable(0);
             });
           }
         );
       });
     });


     app.post("/api/add-module", (req, res) => {
       const { projectName, phaseName, modules } = req.body;

       db.beginTransaction((err) => {
         if (err) {
           console.error(err);
           res.status(500).send("Internal Server Error");
           return;
         }

         modules.forEach((module) => {
           // Check if combination of projectName, phaseName, and module exists
           db.query(
             "SELECT * FROM modules WHERE projectName = ? AND phaseName = ? AND modules = ?",
             [projectName, phaseName, module],
             (err, result) => {
               if (err) {
                 console.error(err);
                 db.rollback(() => {
                   res.status(500).send("Internal Server Error");
                 });
                 return;
               }

               if (result.length > 0) {
                 res.status(400).send("This combination of projectName, phaseName and module already exists.");
                 return;
               }

               // Insert the module if it does not exist
               db.query(
                 "INSERT INTO modules (projectName, phaseName, modules) VALUES (?, ?, ?)",
                 [projectName, phaseName, module],
                 (err, result) => {
                   if (err) {
                     console.error(err);
                     db.rollback(() => {
                       res.status(500).send("Internal Server Error");
                     });
                     return;
                   }
                 }
               );
             }
           );
         });

         db.commit((err) => {
           if (err) {
             console.error(err);
             db.rollback(() => {
               res.status(500).send("Internal Server Error");
             });
             return;
           }

           res.status(200).send("OK");
         });
       });
     });


     app.post("/api/add-phaseAssignee", (req, res) => {
       console.log(req.body, "kkkkk---");
       const { projectName, phaseName, assignedNames, EmployeeID } = req.body;

       db.beginTransaction((err) => {
         if (err) {
           console.error(err);
           res.status(500).send("Internal Server Error");
           return;
         }

         let pendingQueries = assignedNames.length;
         let duplicateFound = false;

         assignedNames.forEach((assignedName, index) => {
           // Check if combination of projectName, phaseName, and assignedName exists
           db.query(
             "SELECT * FROM addphaseassignee WHERE projectName = ? AND phaseName = ? AND assignedNames = ?",
             [projectName, phaseName, assignedName],
             (err, result) => {
               if (err) {
                 console.error(err);
                 db.rollback(() => {
                   res.status(500).send("Internal Server Error");
                 });
                 return;
               }

               if (result.length > 0) {
                 duplicateFound = true;
               }

               if (--pendingQueries === 0) {
                 if (duplicateFound) {
                   db.rollback(() => {
                     res.status(400).send("This combination of projectName, phaseName and assignedName already exists.");
                   });
                 } else {
                   assignedNames.forEach((assignedName, index) => {
                     db.query(
                       "INSERT INTO addphaseassignee (projectName, phaseName, assignedNames, EmployeeID) VALUES (?, ?, ?, ?)",
                       [projectName, phaseName, assignedName, EmployeeID[index]],
                       (err, result) => {
                         if (err) {
                           console.error(err);
                           db.rollback(() => {
                             res.status(500).send("Internal Server Error");
                           });
                           return;
                         }
                       }
                     );
                   });
                   db.commit((err) => {
                     if (err) {
                       console.error(err);
                       db.rollback(() => {
                         res.status(500).send("Internal Server Error");
                       });
                       return;
                     }

                     res.status(200).send("OK");
                   });
                 }
               }
             }
           );
         });
       });
     });



     app.delete("/delete/phaseAssignee/:id", (req, res) => {
       console.log(req?.params, "8889--");
       const PhaseAssigneeID = req.params.id;
       const query = "DELETE FROM addphaseassignee WHERE PhaseAssigneeID = ?";

       db.query(query, [PhaseAssigneeID], (err, results, fields) => {
         if (err) throw err;
         res.send(`User with ID ${PhaseAssigneeID} has been deleted`);
       });
     });

     app.get("/get/modules",  (req, res) => {
       console.log("hello");
       db.query("SELECT * FROM modules", (error, results, fields) => {
         if (error) throw error;
         res.json(results);
       });
     });


     app.get("/get/PhaseAssignedTo", (req, res) => {
       console.log("hello");
       db.query("SELECT * FROM addphaseassignee", (error, results, fields) => {
         if (error) throw error;
         res.json(results);
       });
     });

     app.delete("/delete/module/:id", (req, res) => {
       const modID = req.params.id;

       db.beginTransaction((err) => {
         if (err) {
           console.error(err);
           res.status(500).send("Internal Server Error");
           return;
         }

         db.query(
           "SELECT * FROM modules WHERE modID = ?",
           [modID],
           (err, result) => {
             if (err) {
               console.error(err);
               db.rollback(() => {
                 res.status(500).send("Internal Server Error");
               });
               return;
             }

             if (result.length === 0) {
               db.rollback(() => {
                 res.status(404).send("Module not found");
               });
               return;
             }

             const oldModule = result[0].modules;
             const projectName = result[0].projectName;
             const phaseName = result[0].phaseName;

             const tables = ['addmorningtask', 'addeveningtable'];
             const deleteFromTable = (index) => {
               if (index >= tables.length) {
                 db.query(
                   "DELETE FROM modules WHERE modID = ?",
                   [modID],
                   (err, result) => {
                     if (err) {
                       console.error(err);
                       db.rollback(() => {
                         res.status(500).send("Internal Server Error");
                       });
                       return;
                     }

                     db.commit((err) => {
                       if (err) {
                         console.error(err);
                         db.rollback(() => {
                           res.status(500).send("Internal Server Error");
                         });
                         return;
                       }

                       res.status(200).send("OK");
                     });
                   }
                 );
                 return;
               }

               const table = tables[index];
               db.query(
                 `DELETE FROM ${table} WHERE module = ? AND projectName = ? AND phaseName = ?`,
                 [oldModule, projectName, phaseName],
                 (err, result) => {
                   if (err) {
                     console.error(err);
                     if (err.code === 'ER_BAD_FIELD_ERROR' || err.code === 'ER_NO_SUCH_TABLE') {
                       // Continue with the next table if this table does not contain the relevant fields or does not exist
                       deleteFromTable(index + 1);
                     } else {
                       db.rollback(() => {
                         res.status(500).send("Internal Server Error");
                       });
                     }
                     return;
                   }

                   // Deleted successfully, move to the next table
                   deleteFromTable(index + 1);
                 }
               );
             };

             // Start deleting from the tables
             deleteFromTable(0);
           }
         );
       });
     });


     app.post("/create/addTaskMorning", (req, res) => {
       console.log(req.body, "----");
       const projectName = req.body.projectName;
       const phaseName = req.body.phaseName;
       const module = req.body.module;
       const task = req.body.task;
       const estTime = req.body.estTime;
       const upWorkHrs = req.body.upWorkHrs;
       const employeeID = req.body.employeeID;
       const currDate = req.body.currDate;
       if (
         !projectName ||
         !phaseName ||
         !module ||
         !task ||
         !estTime ||
         !upWorkHrs
       ) {
         res.send("All fields are required.");
       } else {
         db.query(
           "INSERT INTO addmorningtask (projectName,phaseName, module, task,estTime, upWorkHrs,employeeID , currDate) VALUES (?,?,?,?,?,?,?,?)",
           [
             projectName,
             phaseName,
             module,
             task,
             estTime,
             upWorkHrs,
             employeeID,
             currDate,
           ],
           (err, result) => {
             if (err) {
               console.log(err, "lll");
             } else {
               res.send("value inserted");
             }
           }
         );
       }
     });

     app.get("/get/addTaskMorning",  (req, res) => {
       console.log("hello");
       db.query("SELECT * FROM addmorningtask", (error, results, fields) => {
         if (error) {
           console.error("Error executing the query:", error);
           throw error;
         }
         res.json(results);
         console.log(results, "kkk");
       });
     });
     app.delete("/delete/morningDashboard/:id", (req, res) => {
       console.log(req?.params, "8889--");
       const MrngTaskID = req.params.id;
       const query = "DELETE FROM addmorningtask WHERE MrngTaskID = ?";

       db.query(query, [MrngTaskID], (err, results, fields) => {
         if (err) throw err;
         res.send(`User with ID ${MrngTaskID} has been deleted`);
       });
     });

     app.put("/update/addMrngTask/:id", (req, res) => {
       console.log(req.params, "88844--");
       const MrngTaskID = req.params.id;
       const {
         projectName,
         phaseName,
         module,
         task,
         estTime,
         upWorkHrs,
         employeeID,
         currDate,
       } = req.body;

       if (
         !projectName ||
         !phaseName ||
         !module ||
         !task ||
         !estTime ||
         !upWorkHrs
       ) {
         res.send("All fields are required.");
       } else {
         const query =
           "UPDATE addmorningtask SET projectName = ?, phaseName = ?, module = ?, task = ?, estTime = ?, upWorkHrs = ?, employeeID = ?, currDate = ? WHERE MrngTaskID = ?";

         db.query(
           query,
           [
             projectName,
             phaseName,
             module,
             task,
             estTime,
             upWorkHrs,
             employeeID,
             currDate,
             MrngTaskID,
           ],
           (err, results, fields) => {
             if (err) {
               console.error(err);
               res.status(500).send("Error updating project");
               return;
             }
             res.send(`Project with ID ${MrngTaskID} has been updated`);
           }
         );
       }
     });

     app.put("/update/addEvngTask/:id", (req, res) => {
       console.log(req.params, "88844--");
       const EvngTaskID = req.params.id;
       const {
         projectName,
         phaseName,
         module,
         task,
         estTime,
         actTime,
         upWorkHrs,
         employeeID,
         currDate,
       } = req.body;
       const query =
         "UPDATE addeveningtable SET projectName = ?, phaseName = ?, module = ?, task = ?, estTime = ?, actTime= ?, upWorkHrs = ?, employeeID = ?, currDate = ? WHERE EvngTaskID = ?";

       db.query(
         query,
         [
           projectName,
           phaseName,
           module,
           task,
           estTime,
           actTime,
           upWorkHrs,
           employeeID,
           currDate,
           EvngTaskID,
         ],
         (err, results, fields) => {
           if (err) {
             console.error(err);
             res.status(500).send("Error updating project");
             return;
           }
           res.send(`Project with ID ${EvngTaskID} has been updated`);
         }
       );
     });

     app.delete("/delete/eveningDashboard/:id", (req, res) => {
       console.log(req?.params, "8889--");
       const EvngTaskID = req.params.id;
       const query = "DELETE FROM addeveningtable WHERE EvngTaskID = ?";

       db.query(query, [EvngTaskID], (err, results, fields) => {
         if (err) throw err;
         res.send(`User with ID ${EvngTaskID} has been deleted`);
       });
     });

     app.post("/create/addTaskEvening", (req, res) => {
       console.log(req.body, "----");
       const projectName = req.body.projectName;
       const phaseName = req.body.phaseName;
       const module = req.body.module;
       const task = req.body.task;
       const estTime = req.body.estTime;
       const actTime = req.body.actTime;
       const upWorkHrs = req.body.upWorkHrs;
       const employeeID = req.body.employeeID;
       const currDate = req.body.currDate;

       if (
         !projectName ||
         !phaseName ||
         !module ||
         !task ||
         !estTime ||
         !upWorkHrs
       ) {
         res.send("All fields are required.");
       } else {
         db.query(
           "INSERT INTO addeveningtable (projectName,phaseName, module, task,estTime , actTime, upWorkHrs,employeeID,currDate) VALUES (?,?,?,?,?,?,?,?,?)",
           [
             projectName,
             phaseName,
             module,
             task,
             estTime,
             actTime,
             upWorkHrs,
             employeeID,
             currDate,
           ],
           (err, result) => {
             if (err) {
               console.log(err, "lll");
             } else {
               console.log("inserted");
               res.send("value inserted");
             }
           }
         );
       }
     });

     app.get("/get/addTaskEvening", (req, res) => {
       console.log("hello");
       db.query("SELECT * FROM addeveningtable", (error, results, fields) => {
         console.log("55555-----");
         if (error) throw error;
         res.json(results);
       });
     });

     // app.post("/create/addBacklogTasks", (req, res) => {
     //   console.log("API calleddddddddddddd");
     //   // Rest of the code
     //   const tasks = req.body.tasks;

     //   if (!tasks || tasks.length === 0) {
     //     res.status(400).send("Tasks array is required.");
     //   } else {
     //     tasks.forEach((task, index) => {
     //       db.query(
     //         "INSERT INTO backlogtask (taskName, assigneeName, employeeID, deadlineStart, deadlineEnd, currdate, UserEmail, AssignedBy, isCompleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
     //         [
     //           task.task,
     //           task.assigneeName,
     //           task.assigneeEmployeeID,
     //           task.deadline[0],
     //           task.deadline[1],
     //           task.createdDate,
     //           task.userEmail,
     //           task.assignedBy,
     //           task.isCompleted,
     //         ],
     //         (err, result) => {
     //           if (err) {
     //             console.log(err, `Error in task ${index}`);
     //           } else {
     //             console.log(`Task ${index} inserted`);
     //           }
     //         }
     //       );

     //     });

     //     tasks.forEach((task) => {
     //       console.log(task.assigneeEmployeeID, "xxxxxxx");

     //       io.emit("taskAssigned", task.assigneeEmployeeID);
     //     });

     //     res.send("Tasks inserted");
     //   }
     // });



     // app.post("/create/addBacklogTasks", (req, res) => {
     //   console.log("API called");
     //   const tasks = req.body.tasks;

     //   if (!tasks || tasks.length === 0) {
     //     res.status(400).send("Tasks array is required.");
     //   } else {
     //     tasks.forEach((task, index) => {
     //     try {
     //       console.log("Processing task", index, ":", task);

     //       if (!task) {
     //         console.log("Invalid task object at index", index);
     //         return;
     //       }

     //       const deadlineStart = dayjs(task.deadlineStart); // Convert to Dayjs object
     //       const deadlineEnd = dayjs(task.deadlineEnd); // Convert to Dayjs object

     //       console.log("Deadline start:", deadlineStart);
     //       console.log("Deadline end:", deadlineEnd);

     //       db.query(
     //         "INSERT INTO backlogtask (taskName, assigneeName, employeeID, deadlineStart, deadlineEnd, currdate, UserEmail, AssignedBy, isCompleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
     //         [
     //           task.task,
     //           task.assigneeName,
     //           task.assigneeEmployeeID,
     //           deadlineStart.isValid() ? deadlineStart.format("YYYY-MM-DD") : null,
     //           deadlineEnd.isValid() ? deadlineEnd.format("YYYY-MM-DD") : null,
     //           task.createdDate,
     //           task.userEmail,
     //           task.assignedBy,
     //           task.isCompleted,
     //         ],
     //         (err, result) => {
     //           if (err) {
     //             console.log(err, `Error in task ${index}`);
     //           } else {
     //             console.log(`Task ${index} inserted`);
     //           }
     //         }
     //       );
     //     } catch (error) {
     //       console.log("Error processing task", index, ":", error);
     //     }
     //     });

     //     tasks.forEach((task) => {
     //       if (task && task.assigneeEmployeeID) {
     //         console.log(task.assigneeEmployeeID, "xxxxxxx");
     //         io.emit("taskAssigned", task.assigneeEmployeeID);
     //       }
     //     });

     //     res.send("Tasks inserted");
     //   }
     // });





     // app.get("/get/BacklogTasks", (req, res) => {
     //   console.log("hello gggg");
     //   db.query("SELECT * FROM backlogtask", (error, results, fields) => {
     //     if (error) {
     //       console.error("Error in query:", error);
     //       throw error;
     //     }

     //     console.log("Results from the query:", results);
     //     res.json(results);
     //   });
     // });


     app.post("/create/addBacklogTasks", (req, res) => {
       console.log("API called");
       const tasks = req.body.tasks;

       if (!tasks || tasks.length === 0) {
         res.status(400).send("Tasks array is required.");
       } else {
         tasks.forEach((task, index) => {
           try {
             console.log("Processing task", index, ":", task);

             if (!task) {
               console.log("Invalid task object at index", index);
               return;
             }

             const deadlineStart = dayjs(task.deadlineStart); // Convert to Dayjs object
             const deadlineEnd = dayjs(task.deadlineEnd); // Convert to Dayjs object

             console.log("Deadline start:", deadlineStart);
             console.log("Deadline end:", deadlineEnd);

             db.query(
               "INSERT INTO backlogtask (taskName, assigneeName, employeeID, deadlineStart, deadlineEnd, currdate, UserEmail, AssignedBy, isCompleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
               [
                 task.task,
                 task.assigneeName,
                 task.assigneeEmployeeID,
                 deadlineStart.isValid() ? deadlineStart.format("YYYY-MM-DD") : null,
                 deadlineEnd.isValid() ? deadlineEnd.format("YYYY-MM-DD") : null,
                 task.createdDate,
                 task.userEmail,
                 task.assignedBy,
                 task.isCompleted,
               ],
               (err, result) => {
                 if (err) {
                   console.log(err, `Error in task ${index}`);
                 } else {
                   console.log(`Task ${index} inserted`);
                   console.log(`Task ${index} inserted, emitting taskAssigned event with data:`, task);
     io.emit("taskAssigned", task);

                   // Emit the whole task to the client side
                   // io.emit("taskAssigned", task);
                 }
               }
             );
           } catch (error) {
             console.log("Error processing task", index, ":", error);
           }
         });

         res.send("Tasks inserted");
       }
     });


     app.get("/get/BacklogTasks", (req, res) => {
       console.log("hello gggg");
       db.query("SELECT * FROM backlogtask", (error, results, fields) => {
         if (error) {
           console.error("Error in query:", error);
           throw error;
         }

         // console.log("Results from the query:", results);
         res.json(results);
       });
     });



     app.get("/get/userlogin", (req, res) => {
       console.log("hello gggg");
       db.query("SELECT * FROM userlogin", (error, results, fields) => {
         if (error) {
           console.error("Error in query:", error);
           throw error;
         }
         console.log("Results from the query:", results);
         res.json(results);
       });
     });

     app.put("/update/task-completion/:backlogTaskID",  (req, res) => {
       const { backlogTaskID } = req.params;
       const { isCompleted } = req.body;

       // Update the isCompleted field in the database for the specified task
       const query =
         "UPDATE backlogtask SET isCompleted = ? WHERE backlogTaskID = ?";
       db.query(query, [isCompleted, backlogTaskID], (error, results) => {
         if (error) {
           console.error("Error updating task completion status:", error);
           res.status(500).json({ error: "Internal Server Error" });
         } else {
           console.log("Received request to update task completion status");
           console.log("Backlog Task ID:", backlogTaskID);
           console.log("Is Completed:", isCompleted);

           res.status(200).json({ message: "Task completion status updated" });
         }
       });
     });

     app.post("/createShiftChange", (req, res) => {
       console.log("enter ho gya");
       const {
         employeeName,
         employeeID,
         applyDate,
         inTime,
         outTime,
         reason,
         currDate,
         teamLead,
         adminID,
         approvalOfTeamLead,
         approvalOfHR,
       } = req.body;

       db.query(
         "INSERT INTO shiftchangetable (employeeName, employeeID, applyDate, inTime, outTime, reason, currDate, teamLead, adminID, approvalOfTeamLead, approvalOfHR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
         [
           employeeName,
           employeeID,
           applyDate,
           inTime,
           outTime,
           reason,
           currDate,
           teamLead,
           adminID,
           approvalOfTeamLead,
           approvalOfHR,
         ],
         (err, result) => {
           if (err) {
             console.log(err);
           } else {
             res.send("Shift change data inserted");
           }
         }
       );
     });

     app.get("/get/changeShiftInfo", (req, res) => {
       db.query("SELECT * FROM shiftchangetable", (error, results, fields) => {
         if (error) throw error;
         res.json(results);
       });
     });

     // app.post("/update/notificationCount", (req, res) => {
     //   const { employeeID, count } = req.body;

     //   if (!employeeID) {
     //     res.status(400).send("EmployeeID is required.");
     //   } else {
     //     db.query(
     //       "UPDATE employee SET notificationCount = ? WHERE EmployeeID = ?",
     //       [count, employeeID],
     //       (err, result) => {
     //         if (err) {
     //           console.log(err);
     //           res.status(500).send("Error updating notification count.");
     //         } else {
     //           res.send("Notification count updated");
     //         }
     //       }
     //     );
     //   }
     // });

     // // server.js

     // app.get("/get/notificationCountByID", (req, res) => {
     //   const employeeID = req.query.employeeID;

     //   if (!employeeID) {
     //     res.status(400).send("EmployeeID is required.");
     //   } else {
     //     db.query(
     //       "SELECT notificationCount FROM employee WHERE EmployeeID = ?",
     //       [employeeID],
     //       (err, result) => {
     //         if (err) {
     //           console.error("Error executing the query: ", err);
     //           res.status(500).send("Error fetching notification count.");
     //         } else {
     //           if (result.length === 0) {
     //             console.error("No matching EmployeeID found in the database.");
     //             res.status(404).send("No matching EmployeeID found.");
     //           } else {
     //             res.send(result[0]);
     //           }
     //         }
     //       }
     //     );
     //   }
     // });

        // coment to check
     // campus data submit post api
     app.post("/submit-form", (req, res) => {
      console.log("Received form submission");
      console.log(req.body);

      const {
          gender,
          name,
          email,
          phone,
          parentPhone,
          location,
          highestQualification,
          duration,
          totalFee,
          status,
          EmployeeID,
      } = req.body;

      // Convert empty strings to NULL
      const processedData = {
          gender,
          name,
          email: email || null,
          phone,
          parentPhone: parentPhone || null,
          location: location || null,
          highestQualification: highestQualification || null,
          duration: duration || null,
          totalFee: totalFee || null,
          status,
          EmployeeID
      };

      // Generate current timestamp in YYYY-MM-DD HH:MM:SS format
      const now = new Date();
      const offsetIST = 330;
      now.setMinutes(now.getMinutes() + offsetIST);
      const currentTimestamp = now.toISOString().slice(0, 19).replace("T", " ");

      // Use INSERT ... ON DUPLICATE KEY UPDATE syntax
      const insertOrUpdateQuery = `
          INSERT INTO \`salecampusform\` (
              \`gender\`, \`name\`, \`email\`, \`phone\`, \`parentPhone\`,
              \`location\`, \`highestQualification\`, \`duration\`, \`totalFee\`,
              \`created_at\`, \`updated_at\`, \`status\`, \`EmployeeID\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
              \`email\` = ?,
              \`parentPhone\` = ?,
              \`location\` = ?,
              \`highestQualification\` = ?,
              \`duration\` = ?,
              \`totalFee\` = ?,
              \`updated_at\` = ?,
              \`status\` = ?,
              \`EmployeeID\` = ?
      `;

      db.query(
          insertOrUpdateQuery,
          [
              processedData.gender,
              processedData.name,
              processedData.email,
              processedData.phone,
              processedData.parentPhone,
              processedData.location,
              processedData.highestQualification,
              processedData.duration,
              processedData.totalFee,
              currentTimestamp,  // for created_at
              currentTimestamp,  // for updated_at
              processedData.status,
              processedData.EmployeeID,  // This was missing from your original code
              processedData.email,
              processedData.parentPhone,
              processedData.location,
              processedData.highestQualification,
              processedData.duration,
              processedData.totalFee,
              currentTimestamp,  // for updated_at
              processedData.status,
              processedData.EmployeeID
          ],
          (error, result) => {
              if (error) {
                  console.error("Error processing form:", error);
                  res.status(500).json({
                      error: `An error occurred: ${error.message}`,
                      inputData: req.body,
                  });
                  return;
              }

              if (result.affectedRows === 0) {
                  res.status(200).json({ message: "No data was inserted or updated." });
              } else if (result.changedRows === 0) {
                  res
                      .status(200)
                      .json({ message: "Data already exists with the same values." });
              } else {
                  res
                      .status(200)
                      .json({ message: "User registered or updated successfully." });
              }
          }
      );
  });


     // campus database data get api
    //  app.get("/salecampusdata", (req, res) => {
    //    db.query("SELECT * FROM salecampusform", (error, results, fields) => {
    //      if (error) throw error;
    //      res.json(results);
    //    });
    //  });

      app.get("/salecampusdata", (req, res) => {
        const query = "SELECT * FROM salecampusform WHERE EmployeeID IS NOT NULL AND EmployeeID <> ''";

        db.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching records:", err);
                return res.status(500).json({ error: "An error occurred while fetching the records." });
            }
            res.status(200).json(results);
        });
     });



     // campus data delete api
     app.delete("/delete/:id", function (req, res) {
       const deleteId = req.params.id;

       if (!deleteId) {
         return res.status(400).json({ message: "Id parameter missing." });
       }

       const deleteQuery = "DELETE FROM `salecampusform` WHERE `id` = ?";

       db.query(deleteQuery, [deleteId], (deleteErr, deleteResult) => {
         if (deleteErr) {
           console.error("Error deleting record:", deleteErr);
           res
             .status(500)
             .json({ error: "An error occurred while deleting the record." });
           return;
         }

         if (deleteResult.affectedRows === 0) {
           // No record was found with the provided id
           res.status(404).json({ message: "No user found with this id." });
           return;
         }

         res.status(200).json({ message: "Deleted successfully." });
       });
     });

     // campus update data api
     app.put("/updatecampus/:id", (req, res) => {
       let idToUpdate = req.params.id;
       let updateData = { ...req.body };
       console.log(updateData);

       // Remove the created_at key if it exists in the update data
       delete updateData.created_at;

       // Generate current timestamp in YYYY-MM-DD HH:MM:SS format
       let now = new Date();
       let offsetIST = 330;
       now.setMinutes(now.getMinutes() + offsetIST);
       let updateTimestamp = now.toISOString().slice(0, 19).replace("T", " ");

       // Check if update data is provided
       if (!updateData || Object.keys(updateData).length === 0) {
         return res.status(400).json({ message: "No update data provided." });
       }

       // Add updated_at to the update columns and its value (updateTimestamp) to updateData
       updateData.updated_at = updateTimestamp;

       let updateColumns = Object.keys(updateData)
         .map((key) => `${key} = ?`)
         .join(", ");

       let updateQuery = `UPDATE salecampusform SET ${updateColumns} WHERE id = ?`;

       db.query(
         updateQuery,
         [...Object.values(updateData), idToUpdate],
         (err, result) => {
           if (err) {
             console.error("Error updating record:", err);
             return res
               .status(500)
               .json({ error: "An error occurred while updating the record." });
           }

           if (result.affectedRows === 0) {
             return res.status(404).json({ message: "No user found with this ID." });
           }

           res.status(200).json({ message: "Updated successfully." });
         }
       );
     });



  //   app.put("/updateEmployeeID", (req, res) => {
  //     let idsToUpdate = req.body.ids;  // Expecting an array of IDs to update
  //     let employeeID = req.body.employeeID;  // The EmployeeID to set for all the provided IDs

  //     if (!idsToUpdate || idsToUpdate.length === 0) {
  //         return res.status(400).json({ message: "No IDs provided." });
  //     }
  //     if (!employeeID) {
  //         return res.status(400).json({ message: "No EmployeeID provided." });
  //     }

  //     // Generate current timestamp in YYYY-MM-DD HH:MM:SS format
  //     let now = new Date();
  //     let offsetIST = 330;
  //     now.setMinutes(now.getMinutes() + offsetIST);
  //     let updateTimestamp = now.toISOString().slice(0, 19).replace("T", " ");

  //     let placeholders = idsToUpdate.map(() => '?').join(',');
  //     let updateQuery = `UPDATE salecampusform SET EmployeeID = ?, updated_at = ? WHERE id IN (${placeholders})`;

  //     db.query(
  //         updateQuery,
  //         [employeeID, updateTimestamp, ...idsToUpdate],
  //         (err, result) => {
  //             if (err) {
  //                 console.error("Error updating records:", err);
  //                 return res.status(500).json({ error: "An error occurred while updating the records." });
  //             }

  //             if (result.affectedRows === 0) {
  //                 return res.status(404).json({ message: "No rows found with the provided IDs." });
  //             }

  //             res.status(200).json({ message: `Successfully updated ${result.affectedRows} rows.` });
  //         }
  //     );
  // });


     // saleinfo post api
     app.post("/submit-salesform", (req, res) => {
       const {
         portalType,
         profileName,
         url,
         clientName,
         handleBy,
         status,
         statusReason,
         communicationMode,
         communicationReason,
         othermode,
         commModeSkype,
         commModePhone,
         commModeWhatsapp,
         commModeEmail,
         commModePortal,
       } = req.body;

       const insertQuery =
         "INSERT INTO `salesinfoform` ( `portalType`, `profileName`, `url`, `clientName`, `handleBy`, `status`, `statusReason`, `communicationMode`, `communicationReason`, `othermode`, `commModeSkype`, `commModePhone`, `commModeWhatsapp`, `commModeEmail`, `commModePortal`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

       db.query(
         insertQuery,
         [
           portalType,
           profileName,
           url,
           clientName,
           handleBy,
           status,
           statusReason,
           communicationMode,
           communicationReason,
           othermode,
           commModeSkype,
           commModePhone,
           commModeWhatsapp,
           commModeEmail,
           commModePortal,
         ],
         (err, result) => {
           if (err) {
             console.error("Error submitting form:", err);
             res.status(500).json({
               error: `An error occurred while submitting the form: ${err.message}`,
             });
             return;
           }

           res.status(200).json({ message: "Form data inserted successfully." });
         }
       );
     });

     // saleinfo database data get api
     app.get("/salesinfodata", (req, res) => {
       db.query("SELECT * FROM salesinfoform", (error, results, fields) => {
         if (error) throw error;
         res.json(results);
       });
     });

     // saleinfo data delete api
     app.delete("/deletesalesinfo/:id", function (req, res) {
       const deleteId = req.params.id;

       if (!deleteId) {
         return res.status(400).json({ message: "Id parameter missing." });
       }

       const deleteQuery = "DELETE FROM `salesinfoform` WHERE `id` = ?";

       db.query(deleteQuery, [deleteId], (deleteErr, deleteResult) => {
         if (deleteErr) {
           console.error("Error deleting record:", deleteErr);
           res
             .status(500)
             .json({ error: "An error occurred while deleting the record." });
           return;
         }

         if (deleteResult.affectedRows === 0) {
           // No record was found with the provided id
           res.status(404).json({ message: "No user found with this id." });
           return;
         }
         res.status(200).json({ message: "Deleted successfully." });
       });
     });

     // saleinfo update data api

     app.put("/updatesale/:id", (req, res) => {
       let idToUpdate = req.params.id;
       let updateData = req.body;

       // Check if update data is provided
       if (!updateData || Object.keys(updateData).length === 0) {
         return res.status(400).json({ message: "No update data provided." });
       }

       // Format 'created_at' datetime value if it exists in the update data
       if (updateData.created_at) {
         const created_at = new Date(updateData.created_at);
         const formattedCreatedAt = created_at.toISOString().slice(0, 19).replace("T", " ");
         updateData.created_at = formattedCreatedAt;
       }

       // Format 'updated_at' datetime value if it exists in the update data
       if (updateData.updated_at) {
         const updated_at = new Date(updateData.updated_at);
         const formattedUpdatedAt = updated_at.toISOString().slice(0, 19).replace("T", " ");
         updateData.updated_at = formattedUpdatedAt;
       }

       let updateColumns = Object.keys(updateData)
         .map((key) => `${key} = ?`)
         .join(", ");

       let updateValues = Object.values(updateData);

       let updateQuery = `UPDATE salesinfoform SET ${updateColumns} WHERE id = ?`;

       db.query(
         updateQuery,
         [...updateValues, idToUpdate],
         (err, result) => {
           if (err) {
             console.error("Error updating record:", err);
             return res
               .status(500)
               .json({ error: `An error occurred while updating the record: ${err.message}` });
           }

           if (result.affectedRows === 0) {
             return res.status(404).json({ message: "No record found with this ID." });
           }

           res.status(200).json({ message: "Updated successfully." });
         }
       );
     });


