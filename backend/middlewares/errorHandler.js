export default function errorHandler(err, req, res, next) {
  // Mongoose validation errors (missing/invalid required fields) — surface
  // the actual field problem instead of a bare "Internal Server Error".
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(" ");
    return res.status(400).json({ success: false, message: message || "Validation failed" });
  }

  // Mongoose cast errors (e.g. an invalid ObjectId, or a field sent as the
  // wrong type) — also a client-side input problem, not a server fault.
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: `Invalid value for "${err.path}"` });
  }

  // Duplicate key (unique index violation, e.g. an email or slug already in use)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ success: false, message: `That ${field} is already in use.` });
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  // Log the full error server-side for 500s so real server faults are
  // diagnosable from the console even though the client-facing message
  // is still shown (this is an admin-only API, not public-facing).
  if (status === 500) console.error(err);

  res.status(status).json({ success: false, message });
}
