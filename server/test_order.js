const axios = require('axios');
const mongoose = require('mongoose');

async function test() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjlhZjlhZWRiNWNmN2ViOWZkMDdiZSIsImlhdCI6MTc3ODEzNjYyMCwiZXhwIjoxNzgwNzI4NjIwfQ.QajTmPEsyPKF7ytbanTftCeL1OnFDiuRfsnAQILt2E8';
    
    const orderData = {
        orderItems: [{ product: new mongoose.Types.ObjectId().toString(), quantity: 1, price: 100 }],
        shippingAddress: { fullName: 'Test', address: 'Test', city: 'Test', pincode: '12345' },
        paymentMethod: 'cod',
        totalAmount: 100
    };

    try {
        const response = await axios.post('http://localhost:5000/api/orders', orderData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Success:', response.data);
    } catch (e) {
        console.error('Error Status:', e.response?.status);
        console.error('Error Data:', e.response?.data);
        console.error('Message:', e.message);
    }
}
test();
