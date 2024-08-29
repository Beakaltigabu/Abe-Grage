const { getOrders, getOrder, addOrder, modifyOrder, removeOrder } = require("../services/order.service");

const getAllOrders = async (req, res) => {
  try {
    console.log('Received getAllOrders request with query:', req.query);
    const orders = await getOrders(req.query);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in getAllOrders controller:', error);
    res.status(500).json({ error: error.message });
  }
};




const getOrderById = async (req, res) => {
  try {
    const order = await getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createOrder = async (req, res) => {
  try {
    console.log("Received create order request:", JSON.stringify(req.body, null, 2));
    const newOrder = await addOrder(req.body);
    res.status(201).json({ message: "Order created successfully", newOrder });
  } catch (error) {
    console.error("Error in createOrder controller:", error);
    res.status(500).json({ error: "Failed to create order", details: error.message });
  }
};


const updateOrder = async (req, res) => {
  try {
    console.log("Updating order with ID:", req.params.id);
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const updatedOrder = await modifyOrder(req.params.id, req.body);
    res.status(200).json({ message: "Order Updated Successfully", updatedOrder });
  } catch (error) {
    console.error("Error in updateOrder controller:", error);
    if (error.message === "Order not found") {
      res.status(404).json({ error: "Order not found" });
    } else if (error.message === "No updates were made to the order") {
      res.status(400).json({ error: "No updates were made to the order" });
    } else {
      res.status(500).json({ error: "Failed to update order", details: error.message });
    }
  }
};
const deleteOrder = async (req, res) => {
  try {
    const result = await removeOrder(req.params.id);
    if (result) {
      res.status(200).json({ message: "Order deleted successfully" });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error in deleteOrder controller:", error);
    res.status(500).json({ error: "Failed to delete order", details: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
