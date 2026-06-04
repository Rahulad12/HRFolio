export const createLookupController = (Model) => {
  const getAll = async (req, res) => {
    try {
      const values = await Model.find({ isActive: true }).sort({ order: 1 });
      res.json({ success: true, data: values });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  const create = async (req, res) => {
    try {
      const { systemName, displayName, order, color } = req.body;
      if (!systemName || !displayName || order == null) {
        return res.status(400).json({ success: false, message: "systemName, displayName and order are required" });
      }
      const existing = await Model.findOne({ systemName });
      if (existing) {
        return res.status(400).json({ success: false, message: "systemName already exists" });
      }
      const value = await Model.create({ systemName, displayName, order, color, isActive: true });
      res.status(201).json({ success: true, data: value, message: "Created successfully" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  const update = async (req, res) => {
    try {
      const { id } = req.params;
      const { displayName, order, color } = req.body;
      const value = await Model.findByIdAndUpdate(
        id,
        { displayName, order, color },
        { new: true, runValidators: true }
      );
      if (!value) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: value, message: "Updated successfully" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  const deactivate = async (req, res) => {
    try {
      const { id } = req.params;
      const value = await Model.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!value) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, message: "Deactivated successfully" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  return { getAll, create, update, deactivate };
};
