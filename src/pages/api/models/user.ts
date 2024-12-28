import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface userAttributes {
  uniqueid: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export type userPk = "uniqueid";
export type userId = user[userPk];
export type userOptionalAttributes = "uniqueid";
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
  uniqueid!: string;
  name!: string;
  email!: string;
  password!: string;
  role!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return sequelize.define('user', {
    uniqueid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: "users_email_key"
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  }, {
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "uniqueid" },
        ]
      },
    ]
  }) as typeof user;
  }
}
