const { transporter } = require("../../helpers/mail-service");
const authentication = require("../../auth/authentication");
const express = require("express");
const OrderRepo = require("../../database/repository/OrderRepo");
const {
  generateUserEmailTemplate,
  generateAdminEmailTemplate,
  generateUserOrderEmailTemplate,
} = require("./email-templates");
const { UserModel } = require("../../database/model/UserSchema");

const router = express.Router();

router.post("/", authentication, async (req, res) => {
  try {
    const ordersData = req.body.orders;
    const userId = req.user?._id;
    const processedOrders = await Promise.all(
      ordersData?.map(async (order) => {
        const newOrderId = "#" + Math.random().toString(36).substr(2, 9);
        return await OrderRepo.create({
          ...order,
          orderedBy: userId,
          orderId: newOrderId,
        });
      })
    );

    // get admin details
    const admin = await UserModel.findOne({ role: "ADMIN" })
      .select("+email +name +contact +role")
      .lean()
      .exec();

    // User email
    const userMailOptions = {
      to: req.user?.email,
      from: process.env.EMAIL,
      subject: "Order Confirmation",
      html: generateUserEmailTemplate(processedOrders),
    };

    // Admin email
    const adminMailOptions = {
      to: admin?.email,
      from: process.env.EMAIL,
      subject: "New Order Received",
      html: generateAdminEmailTemplate(processedOrders),
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    return res.status(201).json({
      msg: "Order created successfully!",
      data: processedOrders,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const orderList = await OrderRepo.getAll();
    return res.status(200).json({
      message: "Fetched all order",
      data: orderList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user", authentication, async (req, res) => {
  try {
    const orders = await OrderRepo.getByUser(req.user?._id);
    return res.status(200).json({
      message: "Fetched orders by user",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const order = await OrderRepo.getById(req.params.orderId);
    return res.status(200).json({
      message: "Fetched order by id",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:orderId", async (req, res) => {
  try {
    const response = await OrderRepo.deleteById(req.params.orderId);
    return res.status(200).json({
      message: "Order deleted",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/", async (req, res) => {
  try {
    const { orderId, status: orderStatus } = req.body;

    if (!orderId || !orderStatus) {
      return res
        .status(400)
        .json({ message: "orderId and orderStatus are required" });
    }

    const updatedOrders = await OrderRepo.updateOrdersStatus(
      orderId,
      orderStatus
    );

    if (orderStatus === "COMPLETE") {
      const userMailOptions = {
        to: updatedOrders[0]?.orderedBy.email,
        from: process.env.EMAIL_USER,
        subject: "Order Completion",
        html: generateUserOrderEmailTemplate(updatedOrders),
      };

      // User email

      await transporter.sendMail(userMailOptions);
    }

    if (updatedOrders) {
      return res.status(200).json({
        message: "Order status updated",
        data: updatedOrders,
      });
    } else {
      return res.status(404).json({ message: "Orders not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
