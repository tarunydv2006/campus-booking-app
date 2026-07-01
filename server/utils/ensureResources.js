import Resource from '../models/Resource.js';
import { resourceSeedData } from './resourceSeedData.js';

export const ensureResources = async (adminId) => {
  await Resource.collection.updateMany({ location: { $exists: true } }, { $unset: { location: '' } });

  const existingResources = await Resource.find({}, 'title isActive').lean();
  const existingByTitle = new Map(existingResources.map((resource) => [resource.title.toLowerCase(), resource]));
  const missingResources = [];
  let normalizedCount = 0;

  for (const seedResource of resourceSeedData) {
    const existing = existingByTitle.get(seedResource.title.toLowerCase());
    if (existing) {
      const update = {
        title: seedResource.title,
        category: seedResource.category,
        capacity: seedResource.capacity,
        image: seedResource.image,
        description: seedResource.description,
        features: seedResource.features,
        createdBy: adminId
      };

      await Resource.findByIdAndUpdate(existing._id, update, { runValidators: true });
      normalizedCount += 1;
    } else {
      missingResources.push({
        ...seedResource,
        isActive: true,
        createdBy: adminId
      });
    }
  }

  if (missingResources.length === 0) {
    console.log(`Resource seed skipped. All ${resourceSeedData.length} seed resources already exist. Normalized ${normalizedCount} resources.`);
    return;
  }

  await Resource.insertMany(missingResources, { ordered: false });
  console.log(`Seeded ${missingResources.length} missing active resources. Normalized ${normalizedCount} resources.`);
};
