const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const formsFilePath = path.join(__dirname, '../data/forms.json');
const formDataFilePath = path.join(__dirname, '../data/formData.json');

// Página de inicio
router.get('/', (req, res) => {
    const forms = JSON.parse(fs.readFileSync(formsFilePath, 'utf-8'));
    res.render('index', { forms });
});

// Formulario para crear nuevo formulario
router.get('/new-form', (req, res) => {
    res.render('new-form');
});

// Guardar nuevo formulario
router.post('/new-form', (req, res) => {
    const { formName, fields } = req.body;
    let forms = JSON.parse(fs.readFileSync(formsFilePath, 'utf-8'));
    forms.push({ name: formName, fields: JSON.parse(fields), url: `/form/${formName}` });
    fs.writeFileSync(formsFilePath, JSON.stringify(forms, null, 2));
    res.redirect('/');
});

// Mostrar formulario específico
router.get('/form/:name', (req, res) => {
    const formName = req.params.name;
    const forms = JSON.parse(fs.readFileSync(formsFilePath, 'utf-8'));
    const form = forms.find(f => f.name === formName);
    if (form) {
        res.render('form', { form });
    } else {
        res.status(404).send('Formulario no encontrado');
    }
});

// Guardar datos del formulario
router.post('/form/:name', (req, res) => {
    const formName = req.params.name;
    const data = req.body;
    let formData = JSON.parse(fs.readFileSync(formDataFilePath, 'utf-8'));
    if (!formData[formName]) {
        formData[formName] = [];
    }
    formData[formName].push(data);
    fs.writeFileSync(formDataFilePath, JSON.stringify(formData, null, 2));
    res.redirect('/');
});

// Ver datos recogidos por un formulario
router.get('/view-data/:name', (req, res) => {
    const formName = req.params.name;
    let formData = JSON.parse(fs.readFileSync(formDataFilePath, 'utf-8'));
    const data = formData[formName] || [];
    res.render('view-data', { formName, data });
});



module.exports = router;
