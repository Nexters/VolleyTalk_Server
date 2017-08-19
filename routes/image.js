var fs = require('fs');

/**
 * @swagger
 * tags:
 *   name: Image
 *   description: Image 관련 API
 */

/**
 * @swagger
 * /img/{file}:
 *   get:
 *     summary: 이미지 불러오기
 *     description: 이미지 불러오기
 *     tags: [Image]
 *     parameters:
 *       - name: file
 *         description: file name
 *         in: path
 *         type: string
 *         required: true
 *         defaultValue : img_1502940891401.png
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success get image
 */

exports.getImage = function(req, res){
    var fileName = req.params.file;

    fs.readFile('img/'+fileName, function(err, data){
        if(err) console.error(err);
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.end(data);
    });
}
