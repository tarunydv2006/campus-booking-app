import Resource from '../models/Resource.js';

export const getResources = async (req, res) => {
  const { search = '', category = '', active = 'true' } = req.query;
  const query = {};
  if (active !== 'all') query.isActive = active === 'true';
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const resources = await Resource.find(query).sort({ createdAt: -1 }).populate('createdBy', 'name email');
  res.json(resources);
};

export const getResourceById = async (req, res) => {
  const resource = await Resource.findById(req.params.id).populate('createdBy', 'name email');
  if (!resource) return res.status(404).json({ message: 'Resource not found' });
  res.json(resource);
};

export const createResource = async (req, res) => {
  const { location, ...resourceBody } = req.body;
  const resource = await Resource.create({ ...resourceBody, createdBy: req.user._id });
  res.status(201).json(resource);
};

export const updateResource = async (req, res) => {
  const { location, ...resourceBody } = req.body;
  const resource = await Resource.findByIdAndUpdate(req.params.id, resourceBody, {
    new: true,
    runValidators: true
  });
  if (!resource) return res.status(404).json({ message: 'Resource not found' });
  res.json(resource);
};

export const deactivateResource = async (req, res) => {
  const resource = await Resource.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!resource) return res.status(404).json({ message: 'Resource not found' });
  res.json(resource);
};

export const toggleResourceActive = async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ message: 'Resource not found' });

  resource.isActive = !resource.isActive;
  await resource.save();
  res.json(resource);
};

export const deleteResource = async (req, res) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource) return res.status(404).json({ message: 'Resource not found' });
  res.json({ message: 'Resource deleted' });
};
