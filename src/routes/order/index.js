const { transporter } = require("../../helpers/mail-service");
const authentication = require("../../auth/authentication");
const express = require("express");
const OrderRepo = require("../../database/repository/OrderRepo");
// import {
//   generateDefacEmailTemplate,
//   generateUserEmailTemplate,
//   generateUserOrderEmailTemplate,
// } from './email-templates';

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

    // Sending emails
    // const userEmail = req.user?.email;
    // const defacId = ordersData[0]?.defac;
    // const defac = await UserRepo.findById(defacId);
    // const defacEmail = defac?.email;
    // User email
    // const userMailOptions = {
    //   to: userEmail,
    //   from: process.env.EMAIL_USER,
    //   subject: "Order Confirmation",
    //   html: generateUserEmailTemplate(processedOrders),
    // };

    // // DEFAC email
    // const defacMailOptions = {
    //   to: defacEmail,
    //   from: process.env.EMAIL_USER,
    //   subject: "New Order Received",
    //   html: generateDefacEmailTemplate(processedOrders),
    // };

    // await transporter.sendMail(userMailOptions);
    // await transporter.sendMail(defacMailOptions);

    return res.status(201).json({
      message: "Order created successfully!",
      data: processedOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // if (orderStatus === "COMPLETE") {
    //   const userMailOptions = {
    //     to: updatedOrders[0]?.orderedBy.email,
    //     from: process.env.EMAIL_USER,
    //     subject: "Order Completion",
    //     html: generateUserOrderEmailTemplate(updatedOrders),
    //   };

    //   // DEFAC email

    //   await transporter.sendMail(userMailOptions);
    // }

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
