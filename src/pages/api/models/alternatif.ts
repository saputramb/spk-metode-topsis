import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface alternatifAttributes {
  uniqueid: string;
  nis: string;
  kriteria: string;
  kategori: string;
}

export type alternatifPk = "uniqueid";
export type alternatifId = alternatif[alternatifPk];
export type alternatifOptionalAttributes = "uniqueid";
export type alternatifCreationAttributes = Optional<alternatifAttributes, alternatifOptionalAttributes>;

export class alternatif extends Model<alternatifAttributes, alternatifCreationAttributes> implements alternatifAttributes {
  uniqueid!: string;
  nis!: string;
  kriteria!: string;
  kategori!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof alternatif {
    return sequelize.define('alternatif', {
    uniqueid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nis: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    kriteria: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    kategori: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
  }, {
    tableName: 'alternatif',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "alternatif_pkey",
        unique: true,
        fields: [
          { name: "uniqueid" },
        ]
      },
    ]
  }) as typeof alternatif;
  }
}
