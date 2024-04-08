const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'user_data/all.json');
apiPath = `http://localhost:3001`;
export async function AllPost() {
    try {
        const response = await fetch(`http://localhost:3001/api/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        if (data) {
            fs.writeFileSync(filePath, JSON.stringify(data));
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function clearHistory (){
    try {
        const response = await fetch(`${apiPath}/api/clearHistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            console.log('History cleared successfully');
        } else {
            console.error('Failed to clear history');
        }
    } catch (error) {
        console.error('Error clearing history:', error);
    }
};

