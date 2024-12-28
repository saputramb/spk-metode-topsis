import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { kriterium, kriteriumId } from './kriterium';

export interface kategoriAttributes {
  uniqueid: string;
  kriteria: string;
  kategori: string;
  nilai: number;
}

export type kategoriPk = "uniqueid";
export type kategoriId = kategori[kategoriPk];
export type kategoriOptionalAttributes = "uniqueid";
export type kategoriCreationAttributes = Optional<kategoriAttributes, kategoriOptionalAttributes>;

export class kategori extends Model<kategoriAttributes, kategoriCreationAttributes> implements kategoriAttributes {
  uniqueid!: string;
  kriteria!: string;
  kategori!: string;
  nilai!: number;

  // kategori belongsTo kriterium via kriteria
  kriteria_kriterium!: kriterium;
  getKriteria_kriterium!: Sequelize.BelongsToGetAssociationMixin<kriterium>;
  setKriteria_kriterium!: Sequelize.BelongsToSetAssociationMixin<kriterium, kriteriumId>;
  createKriteria_kriterium!: Sequelize.BelongsToCreateAssociationMixin<kriterium>;

  static initModel(sequelize: Sequelize.Sequelize): typeof kategori {
    return sequelize.define('kategori', {
    uniqueid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    kriteria: {
      type: DataTypes.STRING(64),
      allowNull: false,
      references: {
        model: 'kriteria',
        key: 'kriteria'
      }
    },
    kategori: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    nilai: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    tableName: 'kategori',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "kategori_pkey",
        unique: true,
        fields: [
          { name: "uniqueid" },
        ]
      },
    ]
  }) as typeof kategori;
  }
}
