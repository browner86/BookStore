const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
  );

const getProductsFromFile = (cb)=> {
    fs.readFile(p,(err, fileContent) =>{
        if (err) {
            cb([]);
        }
        cb( JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(title,price,description,ratings) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.ratings = ratings;
    }
    

    save() {
        getProductsFromFile(products => {
          products.push(this);
          fs.writeFile(p, JSON.stringify(products), err => {
            console.log(err);
          });
        });
      }

    static fetchAll(cb) {
       getProductsFromFile(cb);
    }
}