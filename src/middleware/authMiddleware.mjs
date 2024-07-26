export function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      // User is logged in
      next();
    } else {
      // User is not logged in
      res.status(401).send({ message: 'Unauthorized' });
    }
  }