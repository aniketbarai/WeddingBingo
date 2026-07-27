import jwt from 'jsonwebtoken';

export function requireAdminAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload; // { id, email }
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}

