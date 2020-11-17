
const fs = require('fs');
const PATH = require('path');
const USERS_DB = require('../data/users.json');
let CURRENT_ID = 0;


let uids = USERS_DB.map((obj)=>{return obj.uid});
CURRENT_ID = Math.max(...uids)+1;
console.log(`Current id: ${CURRENT_ID}`);
// console.table(USERS_DB);

class UsersController {


    generateId(){
        let id = CURRENT_ID;
        CURRENT_ID++;
        fs
        return id;
    }
    persist(){
        let path = PATH.join(__dirname,'..','data','users.json');
        console.log(path);
        fs.writeFileSync(path,JSON.stringify(USERS_DB));
    }
    insertUser(user){
        user.uid = this.generateId();
        USERS_DB.push(user);
        this.persist();
        return user;
    }
    updateUser(user){
        let index = USERS_DB.findIndex(element => element.uid === user.uid);
        if(index>-1){
            USERS_DB[index] = Object.assign(USERS_DB[index],user);
            this.persist();
            return user;
        }else{
            return undefined;
        }
    }

    deleteUser(user){
        let index = USERS_DB.findIndex(element => element.uid === user.uid);
        if(index>-1){
            USERS_DB.splice(index,1);
            return true;
        }else{
            return false;
        }
    }

    getList(){
        return USERS_DB;
    }
    getUserByCredentials(email, password){
        let users = USERS_DB.filter((item,index,arr)=>{
            console.log(item);
            if( item.password.toLowerCase()=== password.toLowerCase() &&
                item.email.toLowerCase() === email.toLowerCase()){
                return true;
            }
            return false;
        });
        return users[0];
    }
    getUniqueUser(name,lastname,email){
        let users = USERS_DB.filter((item,index,arr)=>{
            if(item.nombre.toLowerCase()=== name.toLowerCase() &&
                item.apellidos.toLowerCase()=== lastname.toLowerCase() &&
                item.email.toLowerCase() === email.toLowerCase()){
                return true;
            }
            return false;
        });
        return users[0];
    }
    getUser(id){
        let user = USERS_DB.find(ele=>ele.uid ===id);
        return user;
    }
    getUserByEmail(email){
        let user = USERS_DB.find(ele=>ele.email ===email);
        return user;
    }
}

module.exports = UsersController;