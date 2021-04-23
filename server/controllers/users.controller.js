// let uniqid = require('uniqid');
const userModel = require('../models/users.model');

const addUser = async (req, res) => {
    // const data = req.body;
    const {Name, passportId, email,accountDetails} = req.body;
   
    const user = new userModel({
        Name:Name,
        passportId: passportId,
        email:email,
        accountDetails:accountDetails
    });

    if(!passportId){
        return res.status(200).json({error: 'Passport Id` is required'})
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

// const user = await User.findByIdAndUpdate(id, { $inc: { cash: +cash } }, { new: true, runValidators: true });

const updateCredit = async (req,res)=>{
    if(req.body.credit > 0)
    {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['credit','cash'];
        const isValidOperation = updates.every((update)=>{
            console.log(update,allowedUpdates.includes(update));
            return allowedUpdates.includes(update)
        });
    
        if(!isValidOperation){
            return res.status(400).send("Error: Invalid Update");
        }
    
        try{
            const id= req.params.id;
            const user = await userModel.findOneAndUpdate({"passportId":id},{$inc: { "accountDetails.credit": +req.body.credit }},{new:true, runValidators:true});
            if(!user){
                return res.status(400).send('User not found');
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


// const depositing = (req,res) =>{
//     if((req.params.amount) > 0){
//         let result = findUserById(req.params.id);
//         if(result){
//             users.map((u)=>{
//                 if(u.id == req.params.id){
//                     u.cash+=parseInt(req.params.amount);
//                     try{
//                         fs.writeFileSync('./users.json', JSON.stringify(users));
//                         return res.status(200).json({success: 'The deposit was made successfully'});
//                     }catch(err){
//                         console.error(err);
//                         res.status(500).send('Internal Server Error');
//                     }   
//                 }   
//             })
//         }
//         else{
//             return res.status(404).send('User not found');
//         }
//     }
//     else{
//         return res.status(400).send('Bad request, Negative amount is not allowed');
//     }
// }


// const withdrawMoney = (req,res)=>{
//     if((req.params.cash) > 0){
//     let result = findUserById(req.params.id);
//         if(result){
//             users.map((u)=>{
//                 if(u.id == req.params.id){
//                     if((u.cash+u.credit) >= req.params.cash){
//                         u.cash-=parseInt(req.params.cash);
//                         try{
//                             fs.writeFileSync('./users.json', JSON.stringify(users));
//                             return res.status(200).json({success: 'Withdrawal of funds was successful'});
//                         }catch(err) {
//                             console.error(err);
//                             res.status(500).send('Internal Server Error');
//                         }   
//                     }
//                     else{
//                         return res.status(200).send('The requested amount could not be withdrawn');
//                     }
//                 }
//             })}
//             else{
//                 return res.status(404).send('User not found');
//             }
//     }
//     else{
//         return res.status(400).send('Bad request, Negative cash is not allowed');
//     } 
// }

// const transferring = (req,res)=>{
//     if((req.params.cash) > 0){
//         let result1 = findUserById(req.params.userId1);
//         let result2 = findUserById(req.params.userId2);

//             if(result1 && result2){
//                 users.map((u)=>{
//                     if(u.id == req.params.userId1){
//                         if((u.cash+u.credit) >= req.params.cash){
//                             u.cash-=parseInt(req.params.cash);
//                             users.map((u)=>{
//                                 if(u.id == req.params.userId2){
//                                     u.cash+=parseInt(req.params.cash);
//                                     fs.writeFileSync('./users.json', JSON.stringify(users));
//                                     return res.status(200).json({success: 'Transfer completed successfully'});
//                                 }
//                             })
//                         }
//                         else{
//                             return res.status(200).send('The requested amount could not be transfer');
//                         }
//                     }
//                 })}
//                 else{
//                     return res.status(404).send('User not found');
//                 }
//     }
//     else{
//         return res.status(400).send('Bad request, Negative cash is not allowed');
//     } 
// }

// const deleteUser = (req,res) =>{
//     const {userId} = req.params;
//     let user = findUserById(userId);
//     if(user){
//         users.map((u,index)=>{
//             if(u.id == userId){
//                 users.splice(index,1);
//                 fs.writeFileSync('./users.json', JSON.stringify(users));
//                 return res.status(200).json({success: 'User deleted successfully'});
//             }
//         })
//     }
//     else
//         return res.status(404).send('User not found');
// }



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
    // depositing,
    updateCredit,
    // withdrawMoney,
    // transferring,
    // deleteUser
}
