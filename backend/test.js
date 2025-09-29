const save = async (user) => {
  // Insert explicitly specifying columns
  const INSERT = `
    INSERT INTO users (name, familyname, email, password, role, gender)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await connection.query(INSERT, [
      user.name,          // corresponds to 'name'
      user.familyname || null, // nullable
      user.email,         // primary key
      user.password,
      user.role,
      user.gender || null // nullable
    ]);

    user.customerId = result.insertId; // auto-increment ID
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
