/**
 * @swagger
 * components:
 *  schemas:
 *    Cart:
 *          type: object
 *          required:
 *            -   productId
 *            -   email
 *            -   price
 *            -   name
 *            -   image
 *            -   quantity
 *          properties:
 *            productId:
 *                type: string
 *                description:  The id of the Cart Item
 *            email:
 *                type: string
 *                description:  The email of the Cart Item
 *            price:
 *                type: number
 *                description:  The price of the Cart Item
 *            name:
 *                type:  string
 *                description:  The name of the Cart Item
 *            image:
 *                type: string
 *                description:  The image of the Cart Item
 *            quantity:
 *                type: number
 *                description:  The quantity of the Cart Item
 *          example:
 *                productId: "65e0522ebadaf45630876948"
 *                email: "Guy@gmail.com"
 *                price:  3000
 *                name:  "macbook"
 *                image:  "http://example.come/macbook.jpg"
 *                quantity: 2
 * tags:
 *  name:  Carts
 *  description: Returns the list of all the cart items
 */
const express = require("express");
const router = express.Router();
const CartItemModel = require("../models/Cart.model");

/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Retrieve  a list  of  product
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *              application/json:
 *                schema:
 *                      type: array
 *                      items:
 *                            $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Some  error happened
 */
router.get("/", async (req, res) => {
  try {
    const carts = await CartItemModel.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /carts/{email}:
 *   get:
 *     summary: Get products by email
 *     tags: [Carts]
 *     parameters:
 *          -   in: path
 *              name: email
 *              required: true
 *              schema:
 *                  type: string
 *              description: Return the list by Email
 *     responses:
 *       200:
 *         description: The list by email.
 *         content:
 *              application/json:
 *                schema:
 *                      type: array
 *                      items:
 *                            $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart items Not Found
 *       500:
 *         description: Some error happened
 */
router.get("/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const carts = await CartItemModel.find({ email });
    if (!carts || carts.length === 0) {
      return res.status(404).json({ message: "Cart items Not Found" });
    }
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Add a cart item
 *     tags: [Carts]
 *     requestBody:
 *       required:  true
 *       content:
 *         application/json:
 *                schema:
 *                    $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: The Product by  Id.
 *         content:
 *              application/json:
 *                schema:
 *                      $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Product Not Found
 *       500:
 *         description: Some  error happened
 */
router.post("/", async (req, res) => {
  const cart = req.body;
  try {
    const existingCart = await CartItemModel.findOne({
      productId: cart.productId,
      email: cart.email,
    });
    if (existingCart) {
      existingCart.quantity += cart.quantity;
      await existingCart.save();
      return res.status(200).json(cart);
    }
    const newCart = new CartItemModel(cart);
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /carts/{id}:
 *   put:
 *     summary: Update a cart item
 *     tags: [Carts]
 *     parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description:  The product Id
 *     requestBody:
 *       required:  true
 *       content:
 *         application/json:
 *                schema:
 *                    $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: The cart by  Id.
 *         content:
 *              application/json:
 *                schema:
 *                      $ref: '#/components/schemas/Cart'
 *       404:
 *         description: cart Not Found
 *       500:
 *         description: Some  error happened
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const cart = await CartItemModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!cart) {
      return res.status(404).json({ message: "cart Not Found" });
    }
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /carts/{id}:
 *   delete:
 *     summary: Delete a cart item
 *     tags: [Carts]
 *     parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description:  The cart item Id
 *     responses:
 *       200:
 *         description: The cart item is  delete.
 *         content:
 *              application/json:
 *                schema:
 *                      $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart Not Found
 *       500:
 *         description: Some  error Cart
 */
router.delete("/:id", async (req, res) => {
  try {
    const cart = await CartItemModel.findByIdAndDelete(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "The cart item Not Found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /carts/clear/{email}:
 *   delete:
 *     summary: Delete a cart item
 *     tags: [Carts]
 *     parameters:
 *          -   in: path
 *              name: email
 *              required: true
 *              schema:
 *                  type: string
 *              description:  The cart item email
 *     responses:
 *       200:
 *         description: The item is  delete.
 *         content:
 *              application/json:
 *                schema:
 *                      $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart Not Found
 *       500:
 *         description: Some  error Cart
 */
router.delete("/clear/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const deleteCart = await CartItemModel.deleteMany({ email });
        if(deleteCart.deletedCount > 0) {
            return res.status(200).json(deleteCart)
    }
    res.status(404).json({ message: "Item Not Found" });
    } catch (error) {
        res.status(500).json({  message: error.message })
    }
});

module.exports = router;
