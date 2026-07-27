// express-mongo-sanitize v2 tries to reassign req.query wholesale, but
// Express 5 made req.query a getter-only property with no setter - that
// throws "Cannot set property query ..." on every single request.
// This does the same job (stripping Mongo operator keys like $where, $gt,
// keys starting with "$" or containing ".") but mutates objects in place,
// which works for req.body, req.params, and the object behind req.query.
function stripMongoOperators(input) {
  if (Array.isArray(input)) {
    input.forEach(stripMongoOperators);
    return input;
  }
  if (input && typeof input === "object") {
    for (const key of Object.keys(input)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete input[key];
        continue;
      }
      stripMongoOperators(input[key]);
    }
  }
  return input;
}

export function sanitizeInput(req, res, next) {
  if (req.body) stripMongoOperators(req.body);
  if (req.params) stripMongoOperators(req.params);
  if (req.query) stripMongoOperators(req.query); // mutates in place, no reassignment
  next();
}
