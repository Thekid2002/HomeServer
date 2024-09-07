import { RoleEnum } from "../models/roleEnum";
import { User } from "../models/user";
import { Repository } from "../models/repository";
import { SaveFile } from "../models/saveFile";
import { DataTypes, Sequelize } from "sequelize";
import { Page } from "../models/page";

// Create a Sequelize instance
export const sequelize = new Sequelize(
    "postgres",
    "postgres",
    "mysecretpassword",
    {
        host: "localhost",
        port: 3306,
        dialect: "postgres",
        logging: false
    }
);

// Test the connection and sync models
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // Sync all models with the database
        await sequelize.sync({ alter: true }); // Use alter: true for safe schema updates without dropping tables
        console.log("Database synced successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: RoleEnum.USER
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        signupDateTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        expirationDateTime: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: "User",
        timestamps: true
    }
);

Repository.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        entryPointFileId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        runtimeFileId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        runtimeImportFileId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: "Repository",
        timestamps: true
    }
);

SaveFile.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        repositoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "SaveFile",
        timestamps: true
    }
);

Page.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pageUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pageName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        stylesheets: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        scripts: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Page",
        timestamps: true
    }
);

// Define associations
Repository.hasMany(SaveFile, { as: "saveFiles", foreignKey: "repositoryId" });
SaveFile.belongsTo(Repository, {
    as: "repository",
    foreignKey: "repositoryId"
});

// Define association between User and Repository
User.hasMany(Repository, {
    foreignKey: "userId",
    as: "repositories",
    onDelete: "CASCADE"
});
Repository.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE"
});
