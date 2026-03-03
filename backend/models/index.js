import Maintenance from "./maintenance.js";
import User from "./user.js";
import Unit from "./unit.js";
import Contract from "./contract.js";
import ContractTenant from "./contractTenant.js";

/* User ↔ Maintenance */

User.hasMany(Maintenance, {
  foreignKey: "userId",
  as: "maintenanceRequests",
});

Maintenance.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

/* Unit ↔ Contract */

Unit.hasMany(Contract, {
  foreignKey: "unit_id",
  as: "contracts",
});

Contract.belongsTo(Unit, {
  foreignKey: "unit_id",
  as: "unit",
});

/* Contract ↔ User (Many-to-Many) */

Contract.belongsToMany(User, {
  through: ContractTenant,
  foreignKey: "contract_id",
  as: "tenants",
});

User.belongsToMany(Contract, {
  through: ContractTenant,
  foreignKey: "user_id",
  as: "contracts",
});

export {
  User,
  Maintenance,
  Unit,
  Contract,
  ContractTenant,
};