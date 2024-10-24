const permission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.apiKey?.permissions)
        return res.status(403).json({ error: "Permission denied!" });

      const exists = req.apiKey.permissions.find(
        (entry) => entry === permission
      );
      if (!exists) return res.status(403).json({ error: "Permission denied!" });

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { permission };
