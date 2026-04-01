const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

// In-memory data store
const users = new Map();
const profiles = new Map();

// Seed demo profiles
const seedProfiles = [
  {
    id: uuidv4(),
    name: "Sujan Shrestha",
    email: "sujan.shrestha@example.com",
    phone: "+977-9841234567",
    address: "Putalisadak, Kathmandu, Nepal",
    dob: "1990-03-15",
  },
  {
    id: uuidv4(),
    name: "Nirmala Karki",
    email: "nirmala.karki@example.com",
    phone: "+977-9851043210",
    address: "Lakeside, Pokhara, Nepal",
    dob: "1985-07-22",
  },
  {
    id: uuidv4(),
    name: "Rajan Gurung",
    email: "rajan.gurung@example.com",
    phone: "056-524782",
    address: "Bharatpur, Chitwan, Nepal",
    dob: "1992-11-08",
  },
  {
    id: uuidv4(),
    name: "Pratima Adhikari",
    email: "pratima.adhikari@example.com",
    phone: "071-542310",
    address: "Butwal, Rupandehi, Nepal",
    dob: "1988-04-30",
  },
  {
    id: uuidv4(),
    name: "Bikash Poudel",
    email: "bikash.poudel@example.com",
    phone: "041-526901",
    address: "Janakpur, Dhanusha, Nepal",
    dob: "1995-09-17",
  },
  {
    id: uuidv4(),
    name: "Asmita Bhandari",
    email: "asmita.bhandari@example.com",
    phone: "+977-9801122334",
    address: "Jackson Heights, Queens, New York, USA",
    dob: "1983-01-25",
  },
  {
    id: uuidv4(),
    name: "Sandeep Khadka",
    email: "sandeep.khadka@example.com",
    phone: "+977-9867788990",
    address: "Irving, Dallas, Texas, USA",
    dob: "1997-06-12",
  },
  {
    id: uuidv4(),
    name: "Mina Lama",
    email: "mina.lama@example.com",
    phone: "01-4267788",
    address: "Aldie, Loudoun County, Virginia, USA",
    dob: "1991-12-03",
  },
  {
    id: uuidv4(),
    name: "Kiran Rai",
    email: "kiran.rai@example.com",
    phone: "+977-9813344556",
    address: "Columbus, Ohio, USA",
    dob: "1994-08-20",
  },
  {
    id: uuidv4(),
    name: "Sarita Thapa",
    email: "sarita.thapa@example.com",
    phone: "061-531245",
    address: "Jersey City, New Jersey, USA",
    dob: "1986-05-14",
  },
];

// Seed a demo admin user
const seedUser = async () => {
  const hash = await bcrypt.hash("demo1234", 10);
  const demoUser = {
    id: uuidv4(),
    name: "Demo User",
    email: "demo@example.com",
    passwordHash: hash,
    refreshToken: null,
  };
  users.set(demoUser.id, demoUser);
};

const initStore = async () => {
  const now = new Date().toISOString();
  seedProfiles.forEach((p) => {
    profiles.set(p.id, { ...p, createdAt: now, updatedAt: now });
  });
  await seedUser();
};

module.exports = { users, profiles, initStore };
