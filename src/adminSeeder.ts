import User from "./database/models/userModel";
import bcrypt from "bcrypt";

const adminSeeder = async (): Promise<void> => {
  const [data] = await User.findAll({
    where: {
      email: "adminSeeds@email.com",
    },
  });

  if (!data) {
    await User.create({
      email: "adminSeeds@email.com",
      password: bcrypt.hashSync("adminSeedspassword", 9),
      username: "adminSeeds",
      role: "admin",
    });
    console.log("admin credentials seeded successfully");
  } else {
    console.log("admin credentials Already Seeded");
  }
};

export default adminSeeder;
