import Payment from "../models/Payment.js";

export const getPaymentByAdmin = async (req, res) => {
  try {
    const getAll = await Payment.find()
      .populate("user", "-password")
      .populate("booking");
    res.status(200).json({
      success: true,
      count: getAll.length,
      data: getAll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addNewPayment = async (req, res) => {
  try {
    const addNew = new Payment(req.body);
    const savedPayment = await addNew.save();

    res.status(201).json({
      success: true,
      data: savedPayment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPaymentUser = async (req, res) => {
  try {
    const getAll = await Payment.find({
      user: req.params.id,
    }).populate("booking");
    res.status(200).json({
      success: true,
      count: getAll.length,
      data: getAll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.status(200).json({
      success: true,
      data: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      res.status(404).json({
        success: false,
        message: "Có lỗi xảy ra khi xóa payment",
      });
    }
    res.status(200).json({
      success: true,
      message: "Xóa payment thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
