import { NextApiRequest, NextApiResponse } from "next";
const fs = require('fs');
const path = require('path');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.resolve('./data/user_data/all.json');
  try {
    const response = await fetch('http://localhost:3001/api/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    if (data) {
      fs.writeFileSync(filePath, JSON.stringify(data));
      res.status(200).json({ message: 'Data written successfully' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
