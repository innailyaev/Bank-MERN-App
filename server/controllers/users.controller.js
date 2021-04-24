// let uniqid = require('uniqid');
const userModel = require('../models/users.model');
const transactionsModel = require('../models/transactions.model');

const addUser = async (req, res) => {
    // const data = req.body;
    const {Name, passportId, email,isActive,accountDetails} = req.body;
   
    const user = new userModel({
        Name:Name,
        passportId: passportId,
        email:email,
        isActive:isActive,
        accountDetails:accountDetails
    });

    if(!passportId){
        return res.status(200).json({error: 'Passport Id is required'})
    }

    try{
        await user.save();
        res.json({"success": user});
    }catch (e){
        res.json({"error": e});}
}

const getUsers = async (req, res) => {
    try{
        const users = await userModel.find();
        if(users.length == 0){
            return res.status(200).send('No users yet');
        }
        res.send(users);
    }catch (e){
        res.status(500).send(e);}
}

const getUserById = async (req,res)=>{
    const id= req.params.userId;
    try{
        const user = await userModel.find({"passportId":id});
        console.log(user);
        if(user.length == 0){
            return res.status(404).send('User not found')
        }
        res.send(user);
    }catch (e){
        res.status(500).send(e);}
}

const updateCredit = async (req,res)=>{
   
        const updates = Object.keys(req.body);
        const allowedUpdates = ['credit','cash','isActive'];
        const isValidOperation = updates.every((update)=>{
            console.log(update,allowedUpdates.includes(update));
            return allowedUpdates.includes(update)
        });
    
        if(!isValidOperation){
            return res.status(400).send("Error: Invalid Update");
        }

    if(req.body.credit > 0){
        try{
            const id= req.params.id;
            const user = await userModel.findOneAndUpdate({ $and: [ {"passportId":id}, {"isActive":true} ] },{$inc: { "accountDetails.credit": +req.body.credit }},{new:true, runValidators:true});
            if(!user){
                return res.status(400).send('User not found or account is not active');
            }
            res.send(user);
        }catch(e){
            res.status(400).send(e);
        }
    }  
    else{
        return res.status(400).send('Bad request, Negative credit is not allowed');
    }

}

const depositing = async (req,res) =>{
    if((req.body.amount) > 0){
        try{
            const id= req.params.id;
            const user = await userModel.findOneAndUpdate({"passportId":id},{$inc: { "accountDetails.cash": req.body.amount }},{new:true, runValidators:true});
            if(!user){
                return res.status(400).send('User not found');
            }
            else{
            const transaction = new transactionsModel({
                passportId:id,
                transactionType:"Depositing",
                amount:req.body.amount,
            });
            const result = await transaction.save();
            res.status(200).json({ user: user, transaction: result });
        }
        }catch(e){
            res.status(400).send(e);
        }
    }  
    else{
        return res.status(400).send('Bad request, Negative amount is not allowed');
    }
}

const withdrawMoney = async(req,res)=>{
    if((req.body.amount) > 0){
        try{
            const id= req.params.id;
            const user = await userModel.find({"passportId":id});
            if(!user){
                return res.status(400).send('User not found');
            }
            if((user[0].accountDetails.cash + user[0].accountDetails.credit) >= req.body.amount )
            {
                const userUpdated = await userModel.findOneAndUpdate({"passportId":id},{$inc: { "accountDetails.cash": -req.body.amount }},{new:true, runValidators:true});
                
                const transaction = new transactionsModel({
                    passportId:id,
                    transactionType:"Withdrawal",
                    amount:req.body.amount
                });
                const result = await transaction.save();
                res.status(200).json({ user: userUpdated, transaction: result });     
            }
            else{
                return res.status(200).send('The requested amount could not be withdrawn');
            }
            
        }catch(e){
            res.status(400).send(e);
        }
    }  
    else{
        return res.status(400).send('Bad request, Negative amount is not allowed');
    }
}

const transference = async (req,res) =>{
    const {fromId,toId,amount} = req.body;
    
    if(amount > 0){
        const user1 = await userModel.find({"passportId":fromId});
            if(!user1){
                return res.status(400).send('User not found');
            }
            if((user1[0].accountDetails.cash + user1[0].accountDetails.credit) >= amount )
            {
                const user2 = await userModel.find({"passportId":toId});
                console.log(user2);
                if(!user2){
                    return res.status(400).send('User not found');
                }
                
                else{
                    const user1Updated = await userModel.findOneAndUpdate({"passportId":fromId},{$inc: { "accountDetails.cash": -amount }},{new:true, runValidators:true});
                    const user2Updated = await userModel.findOneAndUpdate({"passportId":toId},{$inc: { "accountDetails.cash": +amount }},{new:true, runValidators:true});
                    const users = [];
                    users.push(user1Updated);
                    users.push(user2Updated);
                    res.status(200).json({users:users});

                }
            }
            else{
                return res.status(200).send('The requested amount could not be transfer');
            }
    }
    else{
        return res.status(400).send('Bad request, Negative cash is not allowed');
    }
}

const deleteUser = async (req,res)=>{
    const {userId} = req.params;
    const user = await userModel.findOneAndDelete({"passportId":userId});
    if(!user){
        return res.status(400).send('User not found');
    }
    else{
        return res.status(200).json({success: 'User deleted successfully'});
    }
}

// const getUsersByAmount= (req,res)=>{
//     const {amount} = req.params;
//     let usersByAmount = users.filter((u)=>{
//         return u.cash == amount;      
//     })
//     if(usersByAmount.length > 0)
//         return res.send(usersByAmount);
//     else
//         return res.send('No results');
// }


module.exports = {
    addUser,
    getUsers,
    getUserById,
    // getUsersByAmount,
    depositing,
    updateCredit,
    withdrawMoney,
    transference,
    deleteUser
}
