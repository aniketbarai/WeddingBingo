import Wedding from "../models/Wedding.js";
import Inquiry from "../models/Inquiry.js";
import { Booking, Testimonial, Package } from "../models/MvpContent.js";
import { recordAudit } from "../utils/audit.js";

export const resources = { weddings: Wedding, inquiries: Inquiry, bookings: Booking, testimonials: Testimonial, packages: Package };
export const permissionNames = { weddings: "portfolio", inquiries: "inquiries", bookings: "bookings", testimonials: "testimonials", packages: "packages" };

export const listResource = async (req, res) => {
  const Model = resources[req.params.resource];
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100);
  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.search) {
    const term = String(req.query.search).slice(0, 80);
    query.$or = [{ title: { $regex: term, $options: "i" } }, { coupleNames: { $regex: term, $options: "i" } }, { coupleName: { $regex: term, $options: "i" } }, { name: { $regex: term, $options: "i" } }, { email: { $regex: term, $options: "i" } }];
  }
  const [items, total] = await Promise.all([Model.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Model.countDocuments(query)]);
  res.json({ success: true, items, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
};

export const createResource = async (req, res) => {
  const Model = resources[req.params.resource];
  const item = await Model.create(req.body);
  await recordAudit(req, "crud.create", req.params.resource, item._id);
  res.status(201).json({ success: true, item });
};

export const updateResource = async (req, res) => {
  const Model = resources[req.params.resource];
  const previous = await Model.findById(req.params.id).lean();
  if (!previous) return res.status(404).json({ success: false, message: "Record not found" });
  const item = await Model.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
  await recordAudit(req, "crud.update", req.params.resource, item._id, { changedFields: Object.keys(req.body) });
  res.json({ success: true, item });
};

export const deleteResource = async (req, res) => {
  const Model = resources[req.params.resource];
  const item = await Model.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Record not found" });
  await recordAudit(req, "crud.delete", req.params.resource, item._id);
  res.json({ success: true });
};

export const addInquiryNote = async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { $push: { notes: { body: req.body.body, author: req.admin.email } } }, { new: true, runValidators: true });
  if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
  await recordAudit(req, "inquiry.note_added", "inquiries", inquiry._id);
  res.json({ success: true, item: inquiry });
};

export const updateInquiryStatus = async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
  inquiry.status = req.body.status;
  inquiry.timeline.push({ event: "Status changed", status: inquiry.status, author: req.admin.email });
  await inquiry.save();
  await recordAudit(req, "inquiry.status_changed", "inquiries", inquiry._id, { status: inquiry.status });
  res.json({ success: true, item: inquiry });
};
