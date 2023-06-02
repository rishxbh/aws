const express = require("express");
const { dirname } = require("path");
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const Student = require('./model/student');
const username = encodeURIComponent("rishabh");
const password = encodeURIComponent("rishabh");
const methodOverride = require('method-override');

const db = `mongodb+srv://${username}:${password}@cluster0.pcbnhmh.mongodb.net/record?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false);
mongoose.connect(db).then(() => {
    console.log('Successful');
}).catch((err) => {
    console.log('No connection');
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static('css'));
app.use(express.static('bootstrap'));
app.use(methodOverride('_method'));

app.listen(port, () => {
    console.log(`${port} is listening`);
})

app.get('/', (req, res) => {
    console.log('Homepage');
    res.render('homepage')
})

app.get('/teacher', async (req, res) => {
    let students = [];
    await Student.find({}).then(r => {
        console.log(r);
        students = r;
    }).catch(err => {
        console.log(err);
    })
    console.log('Student List');
    await res.render('studentList', {students});
})

app.get('/student', (req, res) => {
    message = {comment : ""}
    res.render('studentLogin', message);
})

app.get('/addNewRecord', (req, res) => {
    res.render('addNewRecord');
})

app.post('/add', (req, res) => {
    const s = new Student(req.body);
    s.save()
        .then(s => {
            console.log(s);
        }).catch(err => {
            console.log(err);
        })
    res.redirect('/teacher');
})

app.post('/getVerified', async (req,res) => {
    rollNo = req.body.rollNo;
    dob = req.body.dob;
    console.log(req.body);
    console.log(rollNo + "  " + dob);
    const s = await Student.find({rollNo: rollNo, dob: dob});
    if(s.length != 0) {
        console.log(s);
        res.render('studentResult', s[0]);
    }else {
        message = {comment : "Invalid Credentials"};
        res.render('studentLogin', message);
    }
})

app.get('/delete/:rollNo', async (req, res) => {
    const {rollNo} = req.params;
    const deletedRecord = await Student.findOneAndDelete({rollNo: rollNo});
    console.log(deletedRecord);
    res.redirect('/teacher');
})

app.get('/update/:rollNo', async (req,res) => {
    const {rollNo} = req.params;
    const student = await Student.find({rollNo: rollNo});
    if(student.length == 0) {
        console.log("Record doesn't exist");
        res.redirect('/teacher')
    } else {
        res.render('editRecord', student[0]);
    }
})

app.put('/saveEdit/:rollNo', async (req, res) => {
    const {rollNo} = req.params;
    const student = await Student.findOneAndUpdate({rollNo: rollNo}, req.body, {runValidators:true, new :true});
    console.log(req.body);
    res.redirect('/teacher');
})