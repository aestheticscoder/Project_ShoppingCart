const mongoose = require('mongoose');

const ObjectIdCheck = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};



// Product Validation

function sizeCheck (str){
  const arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]
  for(let i = 0; i<str.length; i++){
      if(!arr.includes(str[i])){
          return false
      }
  }
  return true
}

module.exports = { sizeCheck , ObjectIdCheck}