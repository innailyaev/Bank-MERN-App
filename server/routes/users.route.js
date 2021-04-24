const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');

router.post('/', (req, res) => {
    userController.addUser(req, res);
}).get('/', (req, res) => {
    userController.getUsers(req, res);
}).put('/depositing/:id',(req,res)=>{
    userController.depositing(req,res);
}).put('/updateCredit/:id',(req,res)=>{
    userController.updateCredit(req,res);
}).put('/withdrawMoney/:id',(req,res)=>{
    userController.withdrawMoney(req,res);
}).put('/transference/',(req,res)=>{
    userController.transference(req,res);
}).delete('/:userId',(req,res)=>{
    userController.deleteUser(req,res);
}).get('/byAmount/:amount',(req,res)=>{
    userController.getUsersByAmount(req,res);
}).get('/:userId', (req, res) => {
    userController.getUserById(req, res);
})

module.exports = router;