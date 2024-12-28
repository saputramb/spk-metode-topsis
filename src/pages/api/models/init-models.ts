import type { Sequelize } from "sequelize";
import { alternatif as _alternatif } from "./alternatif";
import type { alternatifAttributes, alternatifCreationAttributes } from "./alternatif";
import { kategori as _kategori } from "./kategori";
import type { kategoriAttributes, kategoriCreationAttributes } from "./kategori";
import { kriterium as _kriterium } from "./kriterium";
import type { kriteriumAttributes, kriteriumCreationAttributes } from "./kriterium";
import { siswa as _siswa } from "./siswa";
import type { siswaAttributes, siswaCreationAttributes } from "./siswa";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";

export {
  _alternatif as alternatif,
  _kategori as kategori,
  _kriterium as kriterium,
  _siswa as siswa,
  _user as user,
};

export type {
  alternatifAttributes,
  alternatifCreationAttributes,
  kategoriAttributes,
  kategoriCreationAttributes,
  kriteriumAttributes,
  kriteriumCreationAttributes,
  siswaAttributes,
  siswaCreationAttributes,
  userAttributes,
  userCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const alternatif = _alternatif.initModel(sequelize);
  const kategori = _kategori.initModel(sequelize);
  const kriterium = _kriterium.initModel(sequelize);
  const siswa = _siswa.initModel(sequelize);
  const user = _user.initModel(sequelize);

  kategori.belongsTo(kriterium, { as: "kriteria_kriterium", foreignKey: "kriteria"});
  kriterium.hasMany(kategori, { as: "kategoris", foreignKey: "kriteria"});

  return {
    alternatif: alternatif,
    kategori: kategori,
    kriterium: kriterium,
    siswa: siswa,
    user: user,
  };
}
