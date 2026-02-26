const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

User.hasMany(Article, { foreignKey: 'authorId', onDelete: 'CASCADE' });
Article.belongsTo(User, { foreignKey: 'authorId' });

module.exports = Article;
