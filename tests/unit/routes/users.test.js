const oldUsers = require('../../../models/user-models');

const newUsers = [
    {_id : 234098,
    email: "newMail",
    pass: "newPass",
    phone: "090",
    isAdmin: true,
    role : ["someRole1", "someRole2", "someRole3"]
    },
    {_id : 234099,
    email : "email2@email.com",
    pass: "email2",
    phone: "1110",
    isAdmin: false,
    role:[]
    },
    {_id : 234100,
    email : "email3@email.com",
    pass: "email3",
    phone: "539",
    isAdmin: true,
    role:[]
    },
    {_id : 234101,
    email : "email4@email.com",
    pass: "email4",
    phone: "897",
    isAdmin: false,
    role:[]
    },
    {_id : 234102,
    email : "email5@email.com",
    pass: "email5",
    phone: "205",
    isAdmin: false,
    role:[]
    }
  ]

describe('edit user', ()=>{
    it ('should return all users with the edited user inclusive', ()=>{
        const newDetails = {
            email: "newMail",
            pass: "newPass",
            phone: "090",
            isAdmin: true,
            role : ["someRole1", "someRole2", "someRole3"]
        }
        const requestedId = "234098";
        const userIndex = oldUsers.findIndex( u => u._id === parseInt(requestedId));
        if (!oldUsers[userIndex]) return "Invalid Request";
        oldUsers[userIndex].email    = newDetails.email;
        oldUsers[userIndex].pass     = newDetails.pass;
        oldUsers[userIndex].phone    = newDetails.phone;
        oldUsers[userIndex].isAdmin  = newDetails.isAdmin;
        oldUsers[userIndex].role     = newDetails.role;
        expect(oldUsers).toMatchObject(newUsers);
    })
});