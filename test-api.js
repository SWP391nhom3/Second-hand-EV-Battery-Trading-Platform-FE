// Test API connection
import postService from './src/services/postService.js';

async function testAPI() {
  try {
    console.log('Testing API connection...');
    const response = await postService.getPosts({ pageNumber: 1, pageSize: 5 });
    console.log('✅ API Response:', response);
    console.log('Response type:', typeof response);
    console.log('Is Array:', Array.isArray(response));
    if (response && typeof response === 'object') {
      console.log('Response keys:', Object.keys(response));
    }
  } catch (error) {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAPI();
