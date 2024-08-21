import {DataTypes, Sequelize} from 'sequelize';
import {roleEnum} from "../models/role.js";

// Create a Sequelize instance
export const sequelize = new Sequelize('postgres', 'postgres', 'mysecretpassword', {
    host: 'localhost',
    port: 3306,
    dialect: 'postgres',
    logging: false,
});

// Test the connection and sync models
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync all models with the database
        await sequelize.sync({ alter: true }); // Use alter: true for safe schema updates without dropping tables
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: roleEnum.USER,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    signupDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    expirationDateTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Define Repository model
export const Repository = sequelize.define('Repository', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    entryPointFile: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    runtimeFile: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    runtimeImportFile: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Define SaveFile model
export const SaveFile = sequelize.define('SaveFile', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    repositoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

// Define associations
Repository.hasMany(SaveFile, { as: 'saveFiles', foreignKey: 'repositoryId' });
SaveFile.belongsTo(Repository, { as: 'repository', foreignKey: 'repositoryId' });

// Define association between User and Repository
User.hasMany(Repository, { foreignKey: 'userId', as: 'repositories' });
Repository.belongsTo(User, { foreignKey: 'userId', as: 'user' });