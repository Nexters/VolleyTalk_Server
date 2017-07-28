/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_teams', {
    seq: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    extablish: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    homeground: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    stadium: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    teamlogo: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    likecount: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    postcount: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tb_teams'
  });
};
