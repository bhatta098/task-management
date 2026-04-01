const { v4: uuidv4 } = require("uuid");

const { profiles } = require("../data/store");

// GET /api/profiles?search=&page=1&limit=6
const listProfiles = (req, res) => {
  const search = (req.query.search || "").toLowerCase().trim();
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 6));

  let all = [...profiles.values()];
  if (search) {
    all = all.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search) ||
        (p.phone && p.phone.toLowerCase().includes(search)) ||
        (p.address && p.address.toLowerCase().includes(search)),
    );
  }

  // Sort by creation date descending
  all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = all.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const data = all.slice(startIndex, startIndex + limit);

  return res.status(200).json({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

// POST /api/profiles
const createProfile = (req, res) => {
  const { name, email, phone, address, dob } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "name and email are required" });
  }

  const duplicate = [...profiles.values()].find((p) => p.email === email);
  if (duplicate) {
    return res
      .status(409)
      .json({ message: "A profile with this email already exists" });
  }

  const now = new Date().toISOString();
  const profile = {
    id: uuidv4(),
    name,
    email,
    phone: phone || "",
    address: address || "",
    dob: dob || "",
    createdAt: now,
    updatedAt: now,
  };

  profiles.set(profile.id, profile);
  return res.status(201).json({ message: "Profile created", data: profile });
};

// PUT /api/profiles/:id
const updateProfile = (req, res) => {
  const { id } = req.params;
  const profile = profiles.get(id);

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const { name, email, phone, address, dob } = req.body;

  if (email && email !== profile.email) {
    const duplicate = [...profiles.values()].find(
      (p) => p.email === email && p.id !== id,
    );
    if (duplicate) {
      return res
        .status(409)
        .json({ message: "A profile with this email already exists" });
    }
  }

  const updated = {
    ...profile,
    name: name !== undefined ? name : profile.name,
    email: email !== undefined ? email : profile.email,
    phone: phone !== undefined ? phone : profile.phone,
    address: address !== undefined ? address : profile.address,
    dob: dob !== undefined ? dob : profile.dob,
    updatedAt: new Date().toISOString(),
  };

  profiles.set(id, updated);
  return res.status(200).json({ message: "Profile updated", data: updated });
};

// DELETE /api/profiles/:id
const deleteProfile = (req, res) => {
  const { id } = req.params;
  if (!profiles.has(id)) {
    return res.status(404).json({ message: "Profile not found" });
  }
  profiles.delete(id);
  return res.status(204).send();
};

module.exports = { listProfiles, createProfile, updateProfile, deleteProfile };
