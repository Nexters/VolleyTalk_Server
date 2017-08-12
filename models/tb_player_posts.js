/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_player_posts', {
    seq: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    playerseq: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'tb_players',
        key: 'seq'
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contents: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    img_url: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    img_url_thumb: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userid: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    likecount: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    commentcount: {
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
    tableName: 'tb_player_posts'
  });
};
