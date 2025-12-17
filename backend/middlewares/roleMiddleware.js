

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated!" });
    if (Array.isArray(role)) {
      if (!role.includes(req.user.role))
        return res.status(403).json({ message: "Forbidden" });
    }else{
        if(req.user.role !== role){
            return res.status(403).json({message:"Forbidden"});
        }
    }
    next();
  };
}
