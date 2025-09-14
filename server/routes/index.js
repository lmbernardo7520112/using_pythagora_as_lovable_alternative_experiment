const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { requireUser } = require('./middlewares/auth'); // Importa apenas requireUser
const { ALL_ROLES } = require('../../shared/config/roles'); // Caminho corrigido

// Root path response
router.get("/", (req, res) => {
  res.status(200).send("Welcome to Your Website!");
});

router.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// GET /api/properties - Lista todas as propriedades publicadas (sem auth para browse)
router.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find({ status: 'published' }).populate('ownerId', 'fullName email');
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET /api/properties/my-properties - Lista propriedades do usuário logado (requer autenticação)
router.get('/api/properties/my-properties', requireUser(ALL_ROLES), async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user._id }).populate('ownerId');
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your properties' });
  }
});

// GET /api/properties/:id - Pega uma propriedade por ID (sem auth para browse)
router.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('ownerId');
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json({ property });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// POST /api/properties - Cria uma nova propriedade (requer autenticação)
router.post('/api/properties', requireUser(ALL_ROLES), async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      ownerId: req.user._id,
    });
    await property.save();
    res.status(201).json({ property });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create property' });
  }
});

// PUT /api/properties/:id - Atualiza uma propriedade (requer autenticação)
router.put('/api/properties/:id', requireUser(ALL_ROLES), async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      req.body,
      { new: true }
    );
    if (!property) return res.status(404).json({ error: 'Property not found or not authorized' });
    res.json({ property });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update property' });
  }
});

// (Opcional) DELETE /api/properties/:id - Deleta uma propriedade (requer autenticação)
router.delete('/api/properties/:id', requireUser(ALL_ROLES), async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
    if (!property) return res.status(404).json({ error: 'Property not found or not authorized' });
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

module.exports = router;