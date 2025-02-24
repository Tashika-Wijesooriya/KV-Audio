import Product from "../models/product.js";

export function addProduct(req, res) {
    const data = req.body;
    const newProduct = new Product(data);
    newProduct.save().then(() => {
        res.json({ message: "Product added successfully" });
    }).catch((err) => {
        res.status(500).json({ message: "Product could not be added", error: err.message });
    });
}