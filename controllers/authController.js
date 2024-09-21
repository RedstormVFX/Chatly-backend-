const User = require('../models/User');

exports.login = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    console.log('Username not provided');
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Checking if a user already exists
    let user = await User.findOne({ username });

    if (!user) {
      console.log('User not found, creating a new one...');

      // If the user is not found, create a new one
      user = new User({ username });

      const savedUser = await user.save(); // Verifying successful save

      if (savedUser) {
        console.log(`User ${username} created and saved to database.`);
      } else {
        console.error(`Failed to save user ${username}.`);
      }

      // Saving a session in Redis
      req.session.userID = savedUser._id;
      return res
        .status(201)
        .json({ message: 'User registered successfully', username });
    }

    // Logging a successful login
    console.log(`User ${username} logged in successfully`);

    // Saving the session upon successful login
    req.session.userID = user._id;
    return res.status(200).json({ message: 'Welcome back!', username });
  } catch (error) {
    console.error('Error during login process:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to log out:', err);
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'User logged out successfully' });
  });
};
