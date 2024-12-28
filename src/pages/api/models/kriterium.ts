import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { kategori, kategoriId } from './kategori';

export interface kriteriumAttributes {
  uniqueid: string;
  kriteria: string;
  bobot: number;
  kode: string;
}

export type kriteriumPk = "uniqueid";
export type kriteriumId = kriterium[kriteriumPk];
export type kriteriumOptionalAttributes = "uniqueid";
export type kriteriumCreationAttributes = Optional<kriteriumAttributes, kriteriumOptionalAttributes>;

export class kriterium extends Model<kriteriumAttributes, kriteriumCreationAttributes> implements kriteriumAttributes {
  uniqueid!: string;
  kriteria!: string;
  bobot!: number;
  kode!: string;

  // kriterium hasMany kategori via kriteria
  kategoris!: kategori[];
  getKategoris!: Sequelize.HasManyGetAssociationsMixin<kategori>;
  setKategoris!: Sequelize.HasManySetAssociationsMixin<kategori, kategoriId>;
  addKategori!: Sequelize.HasManyAddAssociationMixin<kategori, kategoriId>;
  addKategoris!: Sequelize.HasManyAddAssociationsMixin<kategori, kategoriId>;
  createKategori!: Sequelize.HasManyCreateAssociationMixin<kategori>;
  removeKategori!: Sequelize.HasManyRemoveAssociationMixin<kategori, kategoriId>;
  removeKategoris!: Sequelize.HasManyRemoveAssociationsMixin<kategori, kategoriId>;
  hasKategori!: Sequelize.HasManyHasAssociationMixin<kategori, kategoriId>;
  hasKategoris!: Sequelize.HasManyHasAssociationsMixin<kategori, kategoriId>;
  countKategoris!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof kriterium {
    return sequelize.define('kriterium', {
    uniqueid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    kriteria: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "kriteria_kriteria_key"
    },
    bobot: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    kode: {
      type: DataTypes.STRING(5),
      allowNull: false
    }
  }, {
    tableName: 'kriteria',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "kriteria_kriteria_key",
        unique: true,
        fields: [
          { name: "kriteria" },
        ]
      },
      {
        name: "kriteria_pkey",
        unique: true,
        fields: [
          { name: "uniqueid" },
        ]
      },
    ]
  }) as typeof kriterium;
  }
}
