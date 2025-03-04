import Product from "../models/product.js";

export function addProduct(req, res) {
  console.log(req.user);

  if (req.user == null) {
    res.statuss(401).json({ message: "login first" });
    return;
  }

  if (req.user.role != "admin") {
    res.status(403).json({ message: "unauthorized" });
    return;
  }

  const data = req.body;
  const newProduct = new Product(data);
  newProduct
    .save()
    .then(() => {
      res.json({ message: "Product added successfully" });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Product could not be added", error: err.message });
    });
}

export async function getProducts(req, res) {
  try {
    const product = await Product.find();
    res.json(product);
    
  } catch (error) {
    res.status(500).json({ message: "Could not fetch products" });
    
  }
  
}