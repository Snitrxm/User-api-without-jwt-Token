const express = require('express');
const User = require('./models/user');
var cors = require('cors');
require('./config/database');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());


app.post('/user/all', async (req, res) => {
    const user = await User.find();
    res.json(user);
})

app.post('/user/register', async (req, res) => {
    const { name, email, password } = req.body;

    try{
        let user = new User({name, email, password});
        await user.save();
        res.json(user);
    } catch(error){
        res.status(400).json(error);
    }
})


app.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({err: 'User not found'});
        }else{
            user.isCorrectPassword(password, function(err, same){
                if(!same){
                    return res.status(400).json({err: 'Incorrect password'});
                } else{
                    return res.json(user);
                }
            })
        }
    } catch(error){
        res.status(400).json(error);
    }
})


app.delete('/user/delete/:id', async (req, res) => {
    const _id = req.params.id;
    try{
        await User.findByIdAndRemove({_id});
        res.send("User deleted");
    } catch(error){
        res.status(400).json(error);
    }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));