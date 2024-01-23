const db = require("../helpers/db");

exports.categoryAddController = async (req, res) => {
    const { name, type, price_per_unit } = req.body;
    db.query("insert into category(name,type,price_per_unit) values(?,?,?)", [name, type, price_per_unit], (err, result) => {
        if (err) {
            res.json({ error: err });
        } else {
            res.json("Category Added");
        }
    })
}

exports.categoryUpdateController = async (req, res) => {
    const id = req.params.id;
    const { name, type, price_per_unit } = req.body;
    db.query("update category set  name=?, type=? ,price_per_unit=? where id=? ", [name, type, price_per_unit,id], (err, result) => {
        if (err) {
            res.json({ error: err });
        } else {
            res.json("Category Updated");
        }
    })
}

exports.categoryGetController = async (req, res) => {
    const id = req.params.id;
    db.query("select name, type ,price_per_unit from category where id=? ", [id], (err, result) => {
        if (err) {
            res.json({ error: err });
        } else {
            res.json(result[0]);
        }
    })
}

exports.categoryNamesGetController = async (req, res) => {
    db.query("select id,name from category", (err, result) => {
        if (err) {
            res.json({ error: err });
        } else {
            res.json(result);
        }
    })
}