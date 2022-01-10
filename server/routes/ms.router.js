const express = require("express");
const moment = require("moment");

const { User, MaterialSupport } = require("../models");
const { errorHandler } = require("./utils");
const { JwtService } = require("../services");
const { JwtMiddleware } = require("../middleware");

const formatMs = (ms) => {
  return ms
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .reduce((acc, cur) => {
      const key = moment(cur.date).format("MMMM YYYY");
      const value = acc[key] ? [...acc[key], cur] : [cur];
      return { ...acc, [key]: value };
    }, {});
};

const getSelf = async (req, res) => {
  const token = req.header("X-Auth-Token");
  const { payload } = JwtService.decode(token);
  const materialSupport = await MaterialSupport.find({ userId: payload.id }).lean();
  const formatted = formatMs(materialSupport);
  res.status(200).json({ success: true, data: { materialSupport: formatted } });
};

const getAll = async (req, res) => {
  const token = req.header("X-Auth-Token");
  const { payload } = JwtService.decode(token);
  const materialSupport = await MaterialSupport.find({}).lean();
  if (payload.role === "admin") {
    await Promise.all(
      materialSupport.map((ms, index) => User.findById(ms.userId).exec())
    ).then((results) =>
      results.forEach((user, index) => (materialSupport[index].userEmail = user.email))
    );
  }
  const formatted = formatMs(materialSupport);
  res.status(200).json({ success: true, data: { materialSupport: formatted } });
};

const createMs = async (req, res) => {
  const { _id: id } = await MaterialSupport.create(req.body);
  const materialSupport = await MaterialSupport.findById(id);
  res.status(200).json({ success: true, data: { materialSupport } });
};

const updateMs = async (req, res) => {
  const materialSupport = await MaterialSupport.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
  });
  if (!materialSupport) throw new Error("Material support not found");
  else res.status(200).json({ success: true, data: { materialSupport } });
};

const deleteMs = async (req, res) => {
  const materialSupport = await MaterialSupport.findByIdAndDelete(req.params.id, {
    useFindAndModify: false,
  });
  if (!materialSupport) throw new Error("Material support not found");
  else res.status(200).json({ success: true });
};

const router = express.Router();
const { verify, hasRole, hasAnyRole } = JwtMiddleware;
router.get("/self", verify, errorHandler(getSelf));
router.get("/all", verify, hasAnyRole(["admin", "manager"]), errorHandler(getAll));
router.post("/", verify, hasRole("admin"), errorHandler(createMs));
router.put("/:id", verify, hasRole("admin"), errorHandler(updateMs));
router.delete("/:id", verify, hasRole("admin"), errorHandler(deleteMs));

module.exports = router;
