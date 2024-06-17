
const express = require('express');
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const router = express.Router();

const PARENT_FOLDER = path.join(__dirname, '../Parent');
const MERGE_FOLDER = path.join(__dirname, '../Merge');



router.post('/merge', (req, res) => {
  const { documentName, variables, targetFileName } = req.body;

  const docPath = path.join(PARENT_FOLDER, documentName);

  fs.readFile(docPath, 'binary', (err, content) => {
    if (err) {
      return res.status(500).send('Error reading the document');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '!',
        end: '!'
      }
    });

    doc.setData(variables);

    try {
      doc.render();
    } catch (error) {
      return res.status(500).send('Error merging the document');
    }

    const buf = doc.getZip().generate({ type: 'nodebuffer' });

    const targetPath = path.join(MERGE_FOLDER, targetFileName);

    fs.writeFile(targetPath, buf, (err) => {
      if (err) {
        return res.status(500).send('Error saving the merged document');
      }

      res.status(200).send('Document merged successfully');
    });
  });
});

router.get('/templates', (req, res) => {
  fs.readdir(PARENT_FOLDER, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading templates folder');
    }
    res.status(200).json(files);
  });
});

router.get('/merged', (req, res) => {
  fs.readdir(MERGE_FOLDER, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading merged folder');
    }
    res.status(200).json(files);
  });
});

module.exports = router;
