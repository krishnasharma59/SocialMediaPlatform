const jwt = require('jsonwebtoken;
const SECRET_KEY = 'your-secret-key-here';

let otpStore = {}; 

const authenticateMFA = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        const userOtp = req.headers['x-otp']; 

        if (!userOtp) {
            return res.status(401).json({ error: 'OTP required' });
        }

        const validOtp = otpStore[user.id];

        if (!validOtp || userOtp !== validOtp) {
            return res.status(403).json({ error: 'Invalid OTP' });
        }

        delete otpStore[user.id]; 

        req.user = user;
        next();
    });
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password123') {
        const user = { id: 1, username: 'admin', role: 'admin' };

        const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/generate-otp', authenticateToken, (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[req.user.id] = otp;

    res.json({ message: 'OTP generated', otp }); 
});

app.get('/sensitive', authenticateMFA, (req, res) => {
    res.json({
        message: 'Sensitive data accessed with MFA',
        user: req.user
    });
});