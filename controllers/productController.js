import Product from "../models/product.js";

export function addProduct(req, res) {
    console.log(req.user);
    
    if (req.user == null) {
        res.statuss(401).json({ message: "login first" })
        return
        
    }

    if (req.user.role != "admin") {
        res.status(403).json({ message: "unauthorized" })
        return
    }

    const data = req.body;
    const newProduct = new Product(data);
    newProduct.save().then(() => {
        res.json({ message: "Product added successfully" });
    }).catch((err) => {
        res.status(500).json({ message: "Product could not be added", error: err.message });
    });
}
