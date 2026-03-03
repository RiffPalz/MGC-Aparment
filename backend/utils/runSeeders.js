import createDefaultAdmin from "../seeders/defaultAdmin.js";
import createDefaultCaretaker from "../seeders/defaultCaretaker.js";
import createDefaultUnits from "../seeders/defaultUnits.js";

const runSeeders = async () => {
  await createDefaultAdmin();
  await createDefaultCaretaker();
  await createDefaultUnits();
};

export default runSeeders;