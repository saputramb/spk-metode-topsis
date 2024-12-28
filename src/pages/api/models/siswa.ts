import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface siswaAttributes {
  uniqueid: string;
  nis: string;
  name: string;
  kelas: string;
}

export type siswaPk = "uniqueid";
export type siswaId = siswa[siswaPk];
export type siswaOptionalAttributes = "uniqueid";
export type siswaCreationAttributes = Optional<siswaAttributes, siswaOptionalAttributes>;

export class siswa extends Model<siswaAttributes, siswaCreationAttributes> implements siswaAttributes {
  uniqueid!: string;
  nis!: string;
  name!: string;
  kelas!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof siswa {
    return sequelize.define('siswa', {
    uniqueid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nis: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: "siswa_nis_key"
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    kelas: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  }, {
    tableName: 'siswa',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "siswa_nis_key",
        unique: true,
        fields: [
          { name: "nis" },
        ]
      },
      {
        name: "siswa_pkey",
        unique: true,
        fields: [
          { name: "uniqueid" },
        ]
      },
    ]
  }) as typeof siswa;
  }
}
