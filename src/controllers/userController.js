const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Inscription d'un utilisateur
exports.registerUser = async (req, res) => {
    const { name, email, password, role, phone, address, date_of_birth } = req.body;

    // Vérification des champs requis
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Validation des données
    if (phone && !/^\d{10,15}$/.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format. Must be between 10 and 15 digits.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (!['investor', 'agent'].includes(role)) {
        return res.status(400).json({ message: 'Role must be either "investor" or "agent"' });
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("🔒 Hashed Password:", hashedPassword);

        // Création de l'utilisateur
        const user = await User.create({
            name,
            email: email.toLowerCase(), // Normalisation de l'e-mail
            password: hashedPassword,
            role,
            phone: phone || null,
            address: address || null,
            date_of_birth: date_of_birth || null,
        });

        // Supprimer le mot de passe de la réponse
        const { password: _, ...userWithoutPassword } = user.toJSON();

        res.status(201).json({ message: 'User created successfully', user: userWithoutPassword });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Connexion d'un utilisateur
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(password)

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
