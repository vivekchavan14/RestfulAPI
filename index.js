const express = require('express')
const app = express()
const fs = require('fs')
const users = require('./MOCK_DATA.json')
const port = 3000

app.get('/users', (req, res) => {

    const html = `
    <ul>
        ${users.map((user)=>`<li>${user.first_name}</li>`)}
    </ul>
    `;
    res.send(html);
})

app.post("/api/users",(req,res)=>{
    const body = req.body;
    users.push({...body, id: users.length});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
     return res.json({status : "pending"});
    })
 })

 app
 .route("/api/users/:id")
 .get((req, res) => {
   const id = Number(req.params.id);
   const user = users.find((user) => user.id === id);
   if (user) {
     return res.json(user);
   } else {
     return res.status(404).json({ error: "User not found" });
   }
 })
 .patch((req, res) => {
   const id = Number(req.params.id);
   const userIndex = users.findIndex((user) => user.id === id);

   if (userIndex !== -1) {
     users[userIndex] = { ...users[userIndex], ...req.body };
     fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
       return res.json({ status: "success", updatedUser: users[userIndex] });
     });
   } else {
     return res.status(404).json({ error: "User not found" });
   }
 })
 .delete((req, res) => {
   const id = Number(req.params.id);
   const userIndex = users.findIndex((user) => user.id === id);

   if (userIndex !== -1) {
     users.splice(userIndex, 1);
     fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
       return res.json({ status: "success", message: "User deleted" });
     });
   } else {
     return res.status(404).json({ error: "User not found" });
   }
 });


app.listen(port, () => {
  console.log(`Server app listening on port ${port}`)
})